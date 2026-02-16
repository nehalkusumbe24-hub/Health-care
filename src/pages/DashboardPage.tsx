import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, BookOpen, Dumbbell, MessageSquare, ArrowRight, Leaf } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Assessment, DietPlan, ExercisePlan } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [activeDietPlan, setActiveDietPlan] = useState<DietPlan | null>(null);
  const [activeExercisePlan, setActiveExercisePlan] = useState<ExercisePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;

      try {
        const [assessments, dietPlan, exercisePlan] = await Promise.all([
          api.assessments.listByUser(profile.id, 1),
          api.dietPlans.getActiveByUser(profile.id),
          api.exercisePlans.getActiveByUser(profile.id),
        ]);

        setLatestAssessment(assessments[0] || null);
        setActiveDietPlan(dietPlan);
        setActiveExercisePlan(exercisePlan);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-muted" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Health Assessment',
      description: latestAssessment ? 'View your latest assessment' : 'Start your first assessment',
      icon: Activity,
      link: latestAssessment ? `/assessment/${latestAssessment.id}` : '/assessment',
      color: 'text-primary',
    },
    {
      title: 'Diet Plan',
      description: activeDietPlan ? 'View your personalized diet' : 'Get your diet plan',
      icon: BookOpen,
      link: '/diet',
      color: 'text-secondary',
    },
    {
      title: 'Exercise & Dinacharya',
      description: activeExercisePlan ? 'Continue your routine' : 'Start your wellness routine',
      icon: Dumbbell,
      link: '/exercise',
      color: 'text-primary',
    },
    {
      title: 'AI Assistant',
      description: 'Ask health questions anytime',
      icon: MessageSquare,
      link: '/chat',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Continue your journey to holistic wellness with personalized Ayurvedic guidance
            </p>
          </div>
        </div>
      </div>

      {latestAssessment && (
        <Card>
          <CardHeader>
            <CardTitle>Your Dosha Profile</CardTitle>
            <CardDescription>Based on your latest assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {latestAssessment.primary_dosha && (
                <div className="flex-1 min-w-[200px] p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Primary Dosha</p>
                  <p className="text-2xl font-bold capitalize text-primary">
                    {latestAssessment.primary_dosha}
                  </p>
                </div>
              )}
              {latestAssessment.secondary_dosha && (
                <div className="flex-1 min-w-[200px] p-4 rounded-lg bg-secondary/10">
                  <p className="text-sm text-muted-foreground mb-1">Secondary Dosha</p>
                  <p className="text-2xl font-bold capitalize text-secondary">
                    {latestAssessment.secondary_dosha}
                  </p>
                </div>
              )}
              {latestAssessment.imbalance_severity && (
                <div className="flex-1 min-w-[200px] p-4 rounded-lg bg-accent">
                  <p className="text-sm text-muted-foreground mb-1">Imbalance Level</p>
                  <p className="text-2xl font-bold capitalize">
                    {latestAssessment.imbalance_severity}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-3 ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    Go
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {!latestAssessment && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Start Your Health Journey</CardTitle>
            <CardDescription>
              Complete your first health assessment to receive personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/assessment">
              <Button size="lg">
                Begin Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
