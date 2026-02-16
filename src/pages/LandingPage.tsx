import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Activity, BookOpen, Dumbbell, MessageSquare, UserCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Activity,
      title: 'Health Assessment',
      description: 'Complete personalized Ayurvedic health assessments to identify your dosha imbalances',
      image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_ecef6223-15f7-4450-955f-09c65098bfed.jpg',
    },
    {
      icon: BookOpen,
      title: 'Personalized Diet Plans',
      description: 'Get customized diet recommendations based on your unique constitution and health needs',
      image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f94e1e2a-8f2e-46b0-b883-921eab8da942.jpg',
    },
    {
      icon: Dumbbell,
      title: 'Exercise & Dinacharya',
      description: 'Follow daily Ayurvedic routines, yoga, and pranayama practices for holistic wellness',
      image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e6824dca-d834-4c19-9933-db8782dc5e00.jpg',
    },
    {
      icon: MessageSquare,
      title: 'AI Health Assistant',
      description: 'Get instant answers to your Ayurvedic health questions from our intelligent chatbot',
      image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4afd9839-55f1-4acf-ba00-95131bf4cf1d.jpg',
    },
    {
      icon: UserCheck,
      title: 'Expert Doctors',
      description: 'Consult with verified Ayurvedic doctors for personalized prescriptions and guidance',
      image: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_fc8d33d6-b5bc-4244-a980-17547cd75fac.jpg',
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Ayurvedic Health Advisor</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 bg-gradient-to-br from-background via-accent/20 to-background">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Leaf className="h-4 w-4" />
            Ancient Wisdom, Modern Technology
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Your Personal Ayurvedic Health Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover balance and wellness through personalized Ayurvedic guidance, expert consultations, and AI-powered health insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/doctor-register">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Join as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Ayurvedic Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for holistic health and wellness in one intelligent platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-accent/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Complete Assessment</h3>
              <p className="text-muted-foreground">
                Answer questions about your health, habits, and lifestyle to identify your dosha type
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Personalized Plan</h3>
              <p className="text-muted-foreground">
                Receive customized diet, exercise, and lifestyle recommendations tailored to you
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Consult Experts</h3>
              <p className="text-muted-foreground">
                Connect with verified Ayurvedic doctors for professional guidance and prescriptions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Health?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users discovering the power of Ayurvedic wellness
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2026 Ayurvedic Health Advisor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
