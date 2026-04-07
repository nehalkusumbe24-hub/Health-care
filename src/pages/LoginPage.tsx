import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Leaf, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email'); return; }
    if (!password)     { toast.error('Please enter your password'); return; }
    setLoading(true);
    const { error } = await signInWithEmail(email.trim().toLowerCase(), password);
    if (error) {
      toast.error(error.message || 'Login failed. Check your credentials.');
    } else {
      toast.success('Welcome back! 🙏');
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'hsl(145 20% 6% / 0.8)',
    border: '1px solid hsl(145 15% 18%)',
    color: 'hsl(120 15% 95%)',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'hsl(142 65% 55%)';
    e.currentTarget.style.boxShadow = '0 0 0 2px hsl(142 65% 55% / 0.1)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'hsl(145 15% 18%)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <div className="content-layer w-full max-w-md z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4 glass-effect animate-lotus"
                 style={{ border: '1.5px solid hsl(142 65% 55% / 0.3)' }}>
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Vedic<span className="text-primary">Life</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-medium mt-1 text-muted-foreground">Digital Sanctuary</p>
          </div>

          {/* Simple Login Card */}
          <div className="rounded-3xl p-8 glass-effect relative border border-white/5">
            <div className="relative z-20">
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Welcome Back</h2>
              <p className="text-sm mb-8 text-muted-foreground">Continue your journey to mindful wellness</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="email">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input id="email" type="email" placeholder="email@temple.com"
                           value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                           className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all duration-300"
                           style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="password">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                           value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                           className="w-full pl-11 pr-11 py-3 rounded-2xl text-sm outline-none transition-all duration-300"
                           style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                        className="btn-vedic w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold shadow-xl disabled:opacity-50 mt-4 overflow-hidden relative group">
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Awakening...</> : <><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> Enter Sanctuary</>}
                  </span>
                </button>
              </form>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Divine Path</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>

              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  New seeker?{' '}
                  <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Begin Journey</Link>
                </p>
                <p className="text-xs text-muted-foreground/60 italic">
                  "Healing is a matter of time, but it is sometimes also a matter of opportunity."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
