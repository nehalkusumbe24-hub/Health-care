import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { HabitTracking, Feedback } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Activity, BookOpen, Dumbbell, MessageSquare,
  Wind, Flame, Mountain, Sun, Leaf, Droplets, Star,
  TrendingUp, Heart, Check, Smile, Download, ExternalLink, Sparkles, Plus, ThumbsUp
} from 'lucide-react';
import FeedbackForm from '@/components/feedback/FeedbackForm';

const SAGE = 'var(--sage)';
const SAFFRON = 'var(--saffron)';

const DOSHA_INFO = {
  vata:  { icon: Wind,     color: '#6ab4d4', label: 'Vata',  trait: 'Creative & Airy',  element: 'Air + Space', recHerb: 'Ashwagandha', recTip: 'Focus on warm, grounding foods.' },
  pitta: { icon: Flame,    color: '#d47a3a', label: 'Pitta', trait: 'Sharp & Dynamic',  element: 'Fire + Water', recHerb: 'Shatavari', recTip: 'Avoid spicy food and stay cool.' },
  kapha: { icon: Mountain, color: '#6b8f6e', label: 'Kapha', trait: 'Calm & Stable',    element: 'Earth + Water', recHerb: 'Ginger', recTip: 'Prioritize movement and light meals.' },
};

const QUICK_ACTIONS = [
  { icon: Activity,      title: 'Remedies', desc: 'Find healing',    url: '/remedies',  color: SAGE },
  { icon: Leaf,          title: 'Herb Library',   desc: 'Plant wisdom',    url: '/herbs',     color: SAFFRON },
  { icon: BookOpen,      title: 'Diet Plan',      desc: 'Nutrition guide', url: '/diet',        color: SAGE },
  { icon: MessageSquare, title: 'AI Assistant',   desc: 'Talk to Vaidya',  url: '/chat',        color: SAFFRON },
];

const WELLNESS_TIPS = [
  { icon: Droplets, tip: 'Start with warm water + 1 tsp ghee on an empty stomach — Agni igniter for your day.',      time: 'Morning',    color: SAGE },
  { icon: Leaf,     tip: 'Sip CCF tea (Cumin, Coriander, Fennel) after meals to support Agni naturally.',             time: 'After meals', color: '#6b8f6e' },
  { icon: Heart,    tip: 'Practice Nadi Shodhana (alternate nostril breathing) for 10 min — resets your nervous system.', time: 'Dawn',   color: SAFFRON },
  { icon: Star,     tip: 'Walk 100 steps (Shatapavali) after lunch — ignites digestive fire and clears ama.',           time: 'Afternoon', color: SAGE },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [tipIdx, setTipIdx] = useState(0);
  const [greeting, setGreeting] = useState('Namaste');
  const [assignments, setAssignments] = useState<HabitTracking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Suprabhatam' : h < 17 ? 'Shubh Aparahna' : 'Shubh Sandhya');
    const t = setInterval(() => setTipIdx(i => (i + 1) % WELLNESS_TIPS.length), 8000);
    
    if (profile?.id) {
       loadAssignments();
       loadFeedback();
    }

    return () => clearInterval(t);
  }, [profile?.id]);

  const loadAssignments = async () => {
    try {
      const allHabits: HabitTracking[] = await api.habitTracking.listByUser(profile!.id);
      const today = new Date().toDateString();
      const relevant = allHabits.filter(h => 
        h.habit_type === 'assignment' && 
        (new Date(h.created_at).toDateString() === today || !h.completed_at)
      );
      setAssignments(relevant.reverse());
    } catch (error) {
       console.error('Failed to load assignments');
    } finally {
      setLoadingTasks(false);
    }
  };

  const loadFeedback = async () => {
    try {
      const data = await api.feedback.list(5);
      setFeedback(data);
    } catch (error) {
      console.error('Failed to load community feedback');
    }
  };

  const toggleTask = async (id: string, currentlyCompleted: boolean) => {
    const now = new Date().toISOString();
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, completed_at: currentlyCompleted ? '' : now } : a
    ));
    toast.success(currentlyCompleted ? 'Task reopened' : 'Great job on your assignment! 🌿');
    if (!currentlyCompleted) {
      setShowFeedbackForm(true); // Prompt for feedback on completion
    }
  };

  const handleHelpful = async (id: string, count: number) => {
    try {
      await api.feedback.markHelpful(id, count);
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, helpful_count: count + 1 } : f));
      toast.success('Wisdom marked as helpful! 🍃');
    } catch (e) {
      toast.error('Failed to update.');
    }
  };

  const downloadHealthPlan = () => {
    const content = `AYURVEDIC HEALTH PLAN\n\nUser: ${profile?.full_name || 'Seeker'}\nDate: ${new Date().toLocaleDateString()}\n\nDAILY ASSIGNMENTS:\n${assignments.map(a => `- [${a.completed_at ? 'X' : ' '}] ${a.habit_name}`).join('\n')}\n\nRECOLLECTED WISDOM:\nStay consistent with your Dinacharya (daily routine). Balance is not a destination, it is a journey.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AyurHealthPlan_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    toast.success('Health Plan downloaded successfully! 📄');
  };

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Seeker';
  const userDosha = (profile?.lifestyle_info?.dosha || profile?.lifestyle_info?.primary_dosha || 'vata').toLowerCase() as keyof typeof DOSHA_INFO;
  const doshaInfo = DOSHA_INFO[userDosha] || DOSHA_INFO.vata;
  const tip = WELLNESS_TIPS[tipIdx];
  const TipIcon = tip.icon;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-20"
    >
      {/* ── Feedback Modal ── */}
      <AnimatePresence>
        {showFeedbackForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
             <div className="w-full max-w-2xl transform">
               <FeedbackForm 
                 onSuccess={() => setShowFeedbackForm(false)} 
                 onCancel={() => setShowFeedbackForm(false)} 
               />
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="relative vedic-card p-8 md:p-12 overflow-hidden lush-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-4">
              <Leaf className="h-3 w-3" /> Digital Sanctuary
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {greeting}, <span className="text-primary italic font-serif grayscale-[0.2]">{firstName}</span>
            </h1>
            <p className="text-muted-foreground font-semibold">
              Today is {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-md shadow-2xl shadow-primary/5"
          >
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-primary/20 border border-primary/30 animate-lotus">
              <doshaInfo.icon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-primary/70 uppercase tracking-[0.2em] font-black">Your Dosha</p>
              <p className="text-2xl font-bold font-serif text-primary">{doshaInfo.label}</p>
              <p className="text-xs text-muted-foreground font-medium">{doshaInfo.element}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {QUICK_ACTIONS.map((a, i) => (
          <motion.button
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => navigate(a.url)}
            className="vedic-card p-6 text-left group organic-mesh"
          >
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/60 transition-all mb-5">
              <a.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-1 tracking-tight">{a.title}</h3>
            <p className="text-xs text-muted-foreground font-medium">{a.desc}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Daily Assignments Checklist */}
        <motion.div variants={itemVariants} className="lg:col-span-2 vedic-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Star className="h-5 w-5 text-primary" /> My Daily Assignments
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={downloadHealthPlan}
                disabled={assignments.length === 0}
                className="text-[10px] font-black text-primary px-3 py-1 rounded-full bg-primary/15 border border-primary/30 uppercase tracking-widest hover:bg-primary/25 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download className="h-3 w-3 inline mr-1" /> Export
              </button>
              <button 
                onClick={() => navigate('/remedies')}
                className="text-[10px] font-black text-primary px-3 py-1 rounded-full bg-primary/15 border border-primary/30 uppercase tracking-[0.2em] hover:bg-primary/25 transition-colors"
              >
                Get More
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <div 
                  key={a.id}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border transition-all duration-500",
                    a.completed_at 
                      ? "bg-emerald-500/5 border-emerald-500/20 opacity-60" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleTask(a.id, !!a.completed_at)}
                      className={cn(
                        "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        a.completed_at 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "border-primary/40 hover:border-primary"
                      )}
                    >
                      {a.completed_at && <Check className="h-4 w-4 text-background" strokeWidth={4} />}
                    </button>
                    <div>
                       <p className={cn("font-bold text-sm", a.completed_at && "line-through")}>{a.habit_name}</p>
                       <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-black mt-1">Due Today</p>
                    </div>
                  </div>
                  {a.completed_at && <Smile className="h-5 w-5 text-emerald-500 animate-pulse" />}
                </div>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                 <Leaf className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                 <p className="text-sm text-muted-foreground font-medium italic">No assignments active. Seek wisdom in the <span className="text-primary cursor-pointer underline" onClick={() => navigate('/remedies')}>Remedy Finder</span>.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily Tip */}
        <motion.div variants={itemVariants} className="lg:col-span-1 vedic-card p-8 flex flex-col justify-between min-h-[300px] border-accent/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/30 mb-6 lush-glow">
              <TipIcon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4 font-serif italic text-accent underline decoration-accent/30 underline-offset-4">Daily Wisdom</h3>
            <AnimatePresence mode="wait">
              <motion.p 
                key={tipIdx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg leading-relaxed text-foreground/95 font-serif italic"
              >
                "{tip.tip}"
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 mt-8 relative z-10">
            {WELLNESS_TIPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i === tipIdx ? 'w-10 bg-accent' : 'w-2 bg-accent/20'}`} />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Community Healing Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2 vedic-card p-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" /> Community Healing
            </h3>
            <button 
              onClick={() => setShowFeedbackForm(true)}
              className="text-[10px] font-black text-primary px-3 py-1 rounded-full bg-primary/15 border border-primary/30 uppercase tracking-[0.2em] hover:bg-primary/25 transition-colors"
            >
              Share Journey
            </button>
          </div>
          
          <div className="space-y-6">
            {feedback.length > 0 ? (
              feedback.map((f, i) => (
                <motion.div 
                  key={f.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 group hover:border-primary/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {f.user_name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{f.user_name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Leaf key={i} className={cn("h-2.5 w-2.5", i < f.rating ? "text-primary" : "text-white/10")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60">{new Date(f.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm italic font-serif text-muted-foreground leading-relaxed mb-4">"{f.comment}"</p>
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => handleHelpful(f.id, f.helpful_count)}
                       className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 hover:text-primary transition-colors group"
                     >
                       <ThumbsUp className="h-3 w-3 group-hover:scale-110 transition-transform" />
                       Helpful ({f.helpful_count})
                     </button>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="py-12 text-center opacity-40 italic font-mono text-xs">Awaiting community wisdom...</div>
            )}
          </div>
        </motion.div>

        {/* Seasonal / Personalized */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20 flex gap-6 items-center hover:bg-accent/10 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Sun className="h-12 w-12 text-accent" />
            </div>
            <div className="h-16 w-16 rounded-3xl flex items-center justify-center bg-accent/15 border border-accent/30 shrink-0 lush-glow relative z-10">
                <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-accent/70 uppercase tracking-[0.2em] mb-1">Vaidya's Tip</p>
                <h4 className="text-2xl font-bold mb-2 tracking-tight">{doshaInfo.label} Guide</h4>
                <p className="text-sm text-muted-foreground font-medium">{doshaInfo.recTip}</p>
            </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex gap-6 items-center hover:bg-emerald-500/10 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Leaf className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="h-16 w-16 rounded-3xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 shrink-0 lush-glow relative z-10">
                <Heart className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em] mb-1">Dosha-Specific Herb</p>
                <h4 className="text-2xl font-bold mb-2 text-emerald-500 italic font-serif tracking-tight">{doshaInfo.recHerb}</h4>
                <p className="text-sm text-muted-foreground font-medium">The ideal healer to balance your current elemental path.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
