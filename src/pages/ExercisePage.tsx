import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, Wind, Sun, ArrowRight, Clock, Heart, Brain, Flame, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { ExercisePlan, HabitTracking } from '@/types';
import RemAide from '@/components/common/RemAide';
import { cn } from '@/lib/utils';

const STARTER_YOGA_POSES = [
  { name: "Tadasana (Mountain Pose)", duration: "1 min", benefit: "Improves posture and body awareness", difficulty: "Beginner" },
  { name: "Vrksasana (Tree Pose)", duration: "30 sec each side", benefit: "Balance, focus, and grounding for Vata", difficulty: "Beginner" },
  { name: "Adho Mukha Svanasana (Downward Dog)", duration: "1 min", benefit: "Full body stretch, energizes and calms the mind", difficulty: "Beginner" },
  { name: "Bhujangasana (Cobra Pose)", duration: "30 sec", benefit: "Opens chest, strengthens back, stimulates digestion", difficulty: "Beginner" },
  { name: "Balasana (Child's Pose)", duration: "1-2 min", benefit: "Deep relaxation, calms the nervous system", difficulty: "Beginner" },
  { name: "Surya Namaskar (Sun Salutation)", duration: "5-10 min", benefit: "Complete body workout, energizes all doshas", difficulty: "Intermediate" },
];

const PRANAYAMA_GUIDE = [
  { name: "Nadi Shodhana", aka: "Alternate Nostril Breathing", time: "5 min", benefit: "Balances both brain hemispheres, reduces stress and anxiety", suitable: "All Doshas", icon: Wind },
  { name: "Bhramari", aka: "Bee Breath", time: "3 min", benefit: "Calms the mind, relieves tension, improves concentration", suitable: "Vata & Pitta", icon: Heart },
  { name: "Kapalabhati", aka: "Skull Shining Breath", time: "3 min", benefit: "Energizes the body, cleanses lungs, boosts metabolism", suitable: "Kapha", icon: Flame },
  { name: "Ujjayi", aka: "Ocean Breath", time: "5 min", benefit: "Builds internal heat, calms the mind, improves focus", suitable: "All Doshas", icon: Brain },
];

const DINACHARYA_ROUTINE = [
  { time: "5:30 AM", activity: "Wake up before sunrise", icon: "🌅" },
  { time: "5:45 AM", activity: "Oil pulling (sesame/coconut oil)", icon: "🪥" },
  { time: "6:00 AM", activity: "Tongue scraping + warm water", icon: "💧" },
  { time: "6:15 AM", activity: "Abhyanga (oil self-massage)", icon: "💆" },
  { time: "6:30 AM", activity: "Yoga asanas (20 min)", icon: "🧘" },
  { time: "7:00 AM", activity: "Pranayama + Meditation", icon: "🌬️" },
  { time: "10:00 PM", activity: "Restful sleep (Kapha time)", icon: "😴" },
];

export default function ExercisePage() {
  const { profile } = useAuth();
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);
  const [todayHabits, setTodayHabits] = useState<HabitTracking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;
      try {
        const [plan, habits] = await Promise.all([
          api.exercisePlans.getActiveByUser(profile.id),
          api.habitTracking.getRecentByType(profile.id, 'exercise'),
        ]);
        setExercisePlan(plan);
        setTodayHabits(habits);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [profile?.id]);

  const markComplete = async (habitName: string) => {
    if (!profile?.id) return;
    try {
      await api.habitTracking.create({ user_id: profile.id, habit_type: 'exercise', habit_name: habitName });
      toast.success(`${habitName} completed 🙏`);
      const habits = await api.habitTracking.getRecentByType(profile.id, 'exercise');
      setTodayHabits(habits);
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark habit');
    }
  };

  const isCompleted = (habitName: string) => todayHabits.some(h => h.habit_name === habitName);

  if (loading) return <div className="p-10 space-y-6"><Skeleton className="h-40 w-full bg-white/5" /><Skeleton className="h-80 w-full bg-white/5" /></div>;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="vedic-card p-10 md:p-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-40 -mb-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-lotus">
              <Dumbbell className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-serif italic text-primary">Vivyama & Dinacharya</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Movement & Sacred Routine</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl italic leading-relaxed">
            Align your physical energy with the natural rhythms of the day for ultimate vitality and mental clarity.
          </p>
        </div>
      </motion.div>

      {!exercisePlan ? (
        <>
          <motion.div variants={itemVariants} className="vedic-card p-12 text-center border-accent/20">
             <Sparkles className="h-12 w-12 text-accent mx-auto mb-6" />
             <h2 className="text-3xl font-bold mb-4 font-serif text-accent">Personalized Flow</h2>
             <p className="text-muted-foreground mb-10 max-w-lg mx-auto italic">Complete your Nadi Pariksha to unlock a movement plan synced with your dosha's energy profile.</p>
             <Link to="/assessment">
                <button className="btn-vedic px-10 py-4 rounded-full flex items-center gap-3 mx-auto text-lg">
                  Reveal My Path <ArrowRight className="h-6 w-6" />
                </button>
             </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
             <motion.div variants={itemVariants} className="space-y-8">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Dinacharya (Daily Routine)</h2>
                <div className="vedic-card p-8 space-y-4">
                   {DINACHARYA_ROUTINE.map((item, i) => (
                     <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                        <span className="text-3xl shrink-0">{item.icon}</span>
                        <div className="flex-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{item.time}</p>
                           <p className="text-sm font-bold">{item.activity}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>

             <motion.div variants={itemVariants} className="space-y-8">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Pranayama Wisdom</h2>
                <div className="grid gap-4">
                   {PRANAYAMA_GUIDE.map((ex, i) => (
                     <div key={i} className="vedic-card p-6 flex gap-6 items-center">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                           <ex.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg">{ex.name}</h4>
                           <p className="text-xs text-muted-foreground italic mb-2">{ex.benefit}</p>
                           <div className="flex gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-muted-foreground">{ex.time}</span>
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase font-bold text-primary">{ex.suitable}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>
        </>
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-12">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Daily Asanas & Routine</h2>
                <div className="space-y-4">
                   {Object.entries(exercisePlan.daily_routine || {}).map(([time, activity], i) => {
                     const habitKey = `${time}-routine`;
                     const done = isCompleted(habitKey);
                     return (
                        <div key={i} className={cn("vedic-card p-6 flex items-center justify-between gap-6 transition-all", done && "opacity-50 grayscale")}>
                           <div className="flex gap-6 items-center">
                              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                 <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                 <p className="text-[10px] uppercase tracking-widest font-black text-primary/40">{time}</p>
                                 <h4 className="font-bold text-lg">{String(activity)}</h4>
                              </div>
                           </div>
                           <button 
                             onClick={() => markComplete(habitKey)}
                             disabled={done}
                             className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all", 
                               done ? "bg-primary text-background" : "border border-primary/30 text-primary hover:bg-primary/10")}
                           >
                             <Check className={cn("h-6 w-6", !done && "opacity-0 group-hover:opacity-100")} />
                           </button>
                        </div>
                     );
                   })}
                </div>

                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Recommended Yoga Poses</h2>
                <div className="grid md:grid-cols-2 gap-4">
                   {exercisePlan.yoga_poses?.map((pose: any, i: number) => {
                     const name = pose.name || pose;
                     const habitKey = `yoga-${name}`;
                     const done = isCompleted(habitKey);
                     return (
                        <div key={i} className={cn("vedic-card p-6 flex flex-col justify-between transition-all", done && "opacity-50")}>
                           <div>
                              <div className="flex justify-between items-start mb-4">
                                 <h4 className="font-bold text-lg text-primary">{name}</h4>
                                 {done && <Check className="h-5 w-5 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{pose.benefits || "Traditional healing posture."}</p>
                           </div>
                           <button 
                             onClick={() => markComplete(habitKey)}
                             disabled={done}
                             className={cn("w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                               done ? "bg-primary text-background" : "border border-primary/20 text-primary hover:bg-primary/10")}
                           >
                             {done ? "Completed" : "Mark as Done"}
                           </button>
                        </div>
                     );
                   })}
                </div>
             </div>

             <div className="space-y-12">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Breath Control</h2>
                {exercisePlan.pranayama_exercises?.map((ex: any, i: number) => (
                  <div key={i} className="vedic-card p-8 border-accent/20 bg-accent/5">
                     <Wind className="h-8 w-8 text-accent mb-4" />
                     <h4 className="text-xl font-bold mb-2">{ex.name || ex}</h4>
                     <p className="text-sm text-muted-foreground italic mb-6 leading-relaxed">{ex.instructions || ex.benefits || "Deep breathing to balance vital energies."}</p>
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent/60" />
                        <span className="text-xs font-bold text-accent/60 uppercase">{ex.duration || "5-10 mins"}</span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </>
      )}

      <RemAide context="exercise" />
    </motion.div>
  );
}
