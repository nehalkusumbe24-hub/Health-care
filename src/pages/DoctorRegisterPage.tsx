import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Leaf, Upload } from 'lucide-react';

export default function DoctorRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [credentialsFile, setCredentialsFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCredentialsFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signUpError } = await signUpWithEmail(email, password);
      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Failed to get user information');
        setLoading(false);
        return;
      }

      await api.profiles.update(user.id, {
        full_name: fullName,
        role: 'doctor',
      });

      let credentialsUrl = '';
      if (credentialsFile) {
        setUploading(true);
        const fileName = `${user.id}/${Date.now()}_${credentialsFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mdpzmmvsonjershziahr_doctor_credentials')
          .upload(fileName, credentialsFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('mdpzmmvsonjershziahr_doctor_credentials')
            .getPublicUrl(fileName);
          credentialsUrl = urlData.publicUrl;
        }
        setUploading(false);
      }

      await api.doctorProfiles.create({
        id: user.id,
        registration_number: registrationNumber,
        credentials_url: credentialsUrl,
        specialization,
        experience_years: Number.parseInt(experienceYears),
      });

      toast.success('Registration submitted! Please wait for admin approval.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Doctor Registration</CardTitle>
          <CardDescription>Join our network of verified Ayurvedic practitioners</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Dr. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="REG123456"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Panchakarma, Herbal Medicine"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  placeholder="5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentials">Upload Credentials (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="credentials"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {credentialsFile && (
                  <span className="text-sm text-muted-foreground">{credentialsFile.name}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload your medical license or certification (Max 1MB)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || uploading}>
              {loading || uploading ? 'Registering...' : 'Register as Doctor'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
