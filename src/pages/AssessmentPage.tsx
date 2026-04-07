import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { toast } from 'sonner';
import { ArrowRight, Wind, Flame, Mountain, Check, Loader2, Sparkles, Leaf } from 'lucide-react';
import type { DoshaType } from '@/types';
import RemAide from '@/components/common/RemAide';
import { cn } from '@/lib/utils';

/* ============================================================
   Types & Question Data
   ============================================================ */

type OptionCard = { value: string; label: string; hint?: string; icon?: string };

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: OptionCard[];
}

const STEPS: { title: string; subtitle: string; video: string; questions: Question[] }[] = [
  {
    title: 'Common Symptoms',
    subtitle: 'Select all symptoms that apply to you',
    video: 'https://player.vimeo.com/progressive_redirect/playback/705912411/rendition/1080p/file.mp4?loc=external&signature=5f29910d9f4d1e2b6d5f7f9e8d4c3b2a1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6', // Misty Forest
    questions: [
      {
        id: 'symptoms',
        question: 'Which of these do you experience?',
        type: 'multi',
        options: [
          { value: 'Dry skin',        label: 'Dry Skin',        icon: '💧', hint: 'Vata' },
          { value: 'Anxiety',         label: 'Anxiety',         icon: '😰', hint: 'Vata' },
          { value: 'Constipation',    label: 'Constipation',    icon: '🔒', hint: 'Vata' },
          { value: 'Joint pain',      label: 'Joint Pain',      icon: '🦴', hint: 'Vata' },
          { value: 'Insomnia',        label: 'Insomnia',        icon: '🌙', hint: 'Vata' },
          { value: 'Heartburn',       label: 'Heartburn',       icon: '🔥', hint: 'Pitta' },
          { value: 'Inflammation',    label: 'Inflammation',    icon: '🌡️', hint: 'Pitta' },
          { value: 'Excessive heat',  label: 'Excessive Heat',  icon: '☀️', hint: 'Pitta' },
          { value: 'Skin rashes',     label: 'Skin Rashes',     icon: '🔴', hint: 'Pitta' },
          { value: 'Irritability',    label: 'Irritability',    icon: '😤', hint: 'Pitta' },
          { value: 'Congestion',      label: 'Congestion',      icon: '💨', hint: 'Kapha' },
          { value: 'Weight gain',     label: 'Weight Gain',     icon: '⚖️', hint: 'Kapha' },
          { value: 'Lethargy',        label: 'Lethargy',        icon: '😴', hint: 'Kapha' },
          { value: 'Slow digestion',  label: 'Slow Digestion',  icon: '🐢', hint: 'Kapha' },
          { value: 'Water retention', label: 'Water Retention', icon: '💧', hint: 'Kapha' },
        ],
      },
    ],
  },
  {
    title: 'Daily Habits',
    subtitle: 'Tell us about your daily patterns',
    video: 'https://player.vimeo.com/progressive_redirect/playback/868352615/rendition/1080p/file.mp4?loc=external&signature=49673550257ad6bc1119565f49ce1ee644a86f03d5089e5fc87241f7e025f187', // Waterfall
    questions: [
      {
        id: 'digestion',
        question: 'How is your digestion?',
        subtitle: 'Pick the description that fits you best',
        type: 'single',
        options: [
          { value: 'irregular', label: 'Irregular / Variable',  icon: '🌪️', hint: 'Changes day to day' },
          { value: 'strong',    label: 'Strong & Fast',         icon: '⚡', hint: 'Digest quickly, feel hungry often' },
          { value: 'slow',      label: 'Slow & Steady',         icon: '🐢', hint: 'Takes time, feel full for long' },
        ],
      },
      {
        id: 'sleep',
        question: 'How do you sleep?',
        subtitle: `Your typical night's sleep pattern`,
        type: 'single',
        options: [
          { value: 'light',    label: 'Light & Easily Disturbed', icon: '🌫️', hint: 'Wake up at slightest noise' },
          { value: 'moderate', label: 'Moderate',                 icon: '🌙', hint: 'Occasional waking up' },
          { value: 'heavy',    label: 'Deep & Heavy',             icon: '😪', hint: 'Hard to wake up' },
        ],
      },
      {
        id: 'energy',
        question: 'How is your energy?',
        subtitle: 'Your typical energy levels throughout the day',
        type: 'single',
        options: [
          { value: 'variable', label: 'Variable — Comes in Bursts', icon: '🌊', hint: 'High then suddenly low' },
          { value: 'intense',  label: 'Intense & Focused',          icon: '🔥', hint: 'Driven, sometimes too much' },
          { value: 'steady',   label: 'Steady & Enduring',          icon: '🏔️', hint: 'Consistent throughout the day' },
        ],
      },
    ],
  },
  {
    title: 'Physical Traits',
    subtitle: 'Help us understand your constitution',
    video: 'https://player.vimeo.com/progressive_redirect/playback/705928173/rendition/1080p/file.mp4?loc=external&signature=d90a908f9d86928817a80808080808080808080808080808080808080808080', // Mountain Mist (Placeholder replace if needed)
    questions: [
      {
        id: 'bodyType',
        question: 'What is your body type?',
        subtitle: 'Your natural build, not current weight',
        type: 'single',
        options: [
          { value: 'thin',   label: 'Thin — Hard to Gain',    icon: '🧍', hint: 'Light frame, fast metabolism' },
          { value: 'medium', label: 'Medium — Athletic Build', icon: '🏃', hint: 'Muscular, moderate build' },
          { value: 'heavy',  label: 'Heavy — Easy to Gain',   icon: '🏋️', hint: 'Larger frame, gains weight easily' },
        ],
      },
      {
        id: 'appetite',
        question: 'Describe your appetite:',
        subtitle: 'How do you typically feel about food and hunger',
        type: 'single',
        options: [
          { value: 'variable', label: 'Variable — Sometimes Hungry', icon: '🎲', hint: 'Unpredictable, can forget to eat' },
          { value: 'strong',   label: 'Strong — Irritable if Hungry', icon: '😡', hint: 'Gets angry or dizzy when hungry' },
          { value: 'steady',   label: 'Steady — Can Skip Meals',      icon: '🧘', hint: 'Not affected much by missing meals' },
        ],
      },
      {
        id: 'stress',
        question: 'Your stress level:',
        subtitle: 'How you generally experience and handle stress',
        type: 'single',
        options: [
          { value: 'low',      label: 'Low — Generally Calm',         icon: '🌿', hint: 'Rarely feel overwhelmed' },
          { value: 'moderate', label: 'Moderate — Manageable',        icon: '⚖️', hint: 'Handle stress with effort' },
          { value: 'high',     label: 'High — Often Overwhelmed',     icon: '🌩️', hint: 'Frequently stressed or anxious' },
        ],
      },
    ],
  },
];

const DC: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  Vata:  { color: '#6ab4d4', bg: '#6ab4d420', border: '#6ab4d440', Icon: Wind    },
  Pitta: { color: '#fb923c', bg: '#fb923c20', border: '#fb923c40', Icon: Flame   },
  Kapha: { color: '#34d399', bg: '#34d39920', border: '#34d39940', Icon: Mountain},
};

const HINT_COLOR: Record<string, string> = { Vata: '#6ab4d4', Pitta: '#fb923c', Kapha: '#34d399' };

/* ============================================================
   Components
   ============================================================ */

function MultiCard({
  option, selected, onToggle,
}: { option: OptionCard; selected: boolean; onToggle: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4, rotateX: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={cn(
        'relative group overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all duration-500',
        'bg-white/5 border border-white/10 backdrop-blur-xl',
        selected ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]' : 'hover:bg-white/10 hover:border-white/20'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-3xl relative z-10">{option.icon}</span>
      <div className="relative z-10">
        <p className={cn('text-sm font-bold', selected ? 'text-primary' : 'text-foreground')}>{option.label}</p>
        {option.hint && (
          <p className="text-[10px] uppercase tracking-widest font-black mt-1" style={{ color: HINT_COLOR[option.hint] }}>{option.hint}</p>
        )}
      </div>
      {selected && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center bg-primary text-background"
        >
          <Check className="h-3 w-3" strokeWidth={5} />
        </motion.div>
      )}
    </motion.button>
  );
}

function SingleCard({
  option, selected, onSelect,
}: { option: OptionCard; selected: boolean; onSelect: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-3xl p-6 flex items-center gap-6 w-full text-left transition-all duration-500',
        'bg-white/5 border border-white/10 backdrop-blur-2xl',
        selected ? 'bg-primary/15 border-primary shadow-[0_0_40px_rgba(var(--primary),0.15)]' : 'hover:bg-white/10'
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
        {option.icon}
      </div>
      <div className="flex-1">
        <p className={cn('text-xl font-bold font-serif mb-1', selected ? 'text-primary' : 'text-foreground')}>{option.label}</p>
        <p className="text-sm text-muted-foreground/80 font-medium italic">{option.hint}</p>
      </div>
      {selected && (
        <motion.div 
          initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-background shadow-lg shadow-primary/20"
        >
          <Check className="h-6 w-6" strokeWidth={4} />
        </motion.div>
      )}
    </motion.button>
  );
}

function DoshaBar({
  scores, visible,
}: { scores: { vata: number; pitta: number; kapha: number }; visible: boolean }) {
  if (!visible) return null;
  const total = Math.max(scores.vata + scores.pitta + scores.kapha, 1);
  const bars = [
    { name: 'Vata',  score: scores.vata,  ...DC.Vata },
    { name: 'Pitta', score: scores.pitta, ...DC.Pitta },
    { name: 'Kapha', score: scores.kapha, ...DC.Kapha },
  ];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 space-y-5 bg-white/5 border border-white/10 backdrop-blur-3xl mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Primal Essence Mirror</h3>
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>
      {bars.map((b) => {
        const pct = Math.round((b.score / total) * 100);
        return (
          <div key={b.name} className="flex items-center gap-6">
            <div className="w-16 flex-shrink-0">
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60" style={{ color: b.color }}>{b.name}</span>
            </div>
            <div className="flex-1 h-3 rounded-full bg-white/5 relative overflow-hidden">
               <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                className="h-full rounded-full relative"
                style={{ background: b.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <span className="text-xs font-black text-foreground w-10 text-right">{pct}%</span>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ============================================================
   Main Page Component
   ============================================================ */

export default function AssessmentPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [symptoms,  setSymptoms]  = useState<string[]>([]);
  const [digestion, setDigestion] = useState('');
  const [sleep,     setSleep]     = useState('');
  const [energy,    setEnergy]    = useState('');
  const [bodyType,  setBodyType]  = useState('');
  const [appetite,  setAppetite]  = useState('');
  const [stress,    setStress]    = useState('');

  const scores = ((): { vata: number; pitta: number; kapha: number } => {
    const s = { vata: 0, pitta: 0, kapha: 0 };
    if (symptoms.includes('Dry skin') || symptoms.includes('Anxiety') || symptoms.includes('Constipation') || symptoms.includes('Insomnia')) s.vata += 2;
    if (symptoms.includes('Heartburn') || symptoms.includes('Inflammation') || symptoms.includes('Skin rashes') || symptoms.includes('Irritability')) s.pitta += 2;
    if (symptoms.includes('Congestion') || symptoms.includes('Weight gain') || symptoms.includes('Lethargy') || symptoms.includes('Slow digestion')) s.kapha += 2;
    if (digestion === 'irregular') s.vata += 1; else if (digestion === 'strong') s.pitta += 1; else if (digestion === 'slow') s.kapha += 1;
    if (sleep === 'light') s.vata += 1; else if (sleep === 'moderate') s.pitta += 1; else if (sleep === 'heavy') s.kapha += 1;
    if (energy === 'variable') s.vata += 1; else if (energy === 'intense') s.pitta += 1; else if (energy === 'steady') s.kapha += 1;
    if (bodyType === 'thin') s.vata += 1; else if (bodyType === 'medium') s.pitta += 1; else if (bodyType === 'heavy') s.kapha += 1;
    if (appetite === 'variable') s.vata += 1; else if (appetite === 'strong') s.pitta += 1; else if (appetite === 'steady') s.kapha += 1;
    return s;
  })();

  const currentStep = STEPS[step];

  const getValue = (id: string) => {
    const map: Record<string, string | string[]> = { symptoms, digestion, sleep, energy, bodyType, appetite, stress };
    return map[id];
  };

  const setValue = (id: string, val: string) => {
    const setters: Record<string, (v: string) => void> = {
      digestion: setDigestion, sleep: setSleep, energy: setEnergy,
      bodyType: setBodyType, appetite: setAppetite, stress: setStress,
    };
    setters[id]?.(val);
  };

  const toggleSymptom = (val: string) =>
    setSymptoms(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);

  const canProceed = () => {
    if (step === 0) return symptoms.length > 0;
    return currentStep.questions.every(q => q.type === 'multi' || !!getValue(q.id));
  };

  const calculateDosha = (): { primary: DoshaType; secondary: DoshaType; severity: string } => {
    const sorted = Object.entries(scores).sort((a, b) => (b[1] as number) - (a[1] as number));
    const primary = sorted[0][0] as DoshaType;
    const secondary = sorted[1][0] as DoshaType;
    const severity = (sorted[0][1] as number) >= 6 ? 'high' : (sorted[0][1] as number) >= 4 ? 'moderate' : 'mild';
    return { primary, secondary, severity };
  };

  const handleSubmit = async () => {
    if (!profile?.id) { toast.error('Please log in to submit'); return; }
    setLoading(true);
    try {
      const doshaResults = calculateDosha();
      const assessment = await api.assessments.create({
        user_id: profile.id,
        symptoms,
        daily_habits: { digestion, sleep, energy, stress },
        physical_attributes: { skin: '', body_type: bodyType, appetite },
        mental_patterns: { stress_level: stress },
        dosha_results: doshaResults,
        primary_dosha: doshaResults.primary,
        secondary_dosha: doshaResults.secondary,
        imbalance_severity: doshaResults.severity,
        status: 'completed',
      });
      toast.success('Your Ayurvedic DNA has been decrypted! 🙏');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete assessment');
    } finally {
      setLoading(false);
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020804] text-white">
      {/* Cinematic Background Video */}
      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep.video}
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.4 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.5 }}
           className="fixed inset-0 z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale-[0.5] contrast-[1.2]"
            src={currentStep.video}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020804]/80 via-transparent to-[#020804]" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto py-20 px-6">
        {/* Header Section */}
        <div className="relative mb-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-16 w-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-lotus">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="relative group">
                 {/* Video-Masked Heading */}
                 <svg className="h-12 w-80 font-serif italic font-black text-5xl">
                    <clipPath id="text-mask-nadi">
                      <text x="0" y="45">Nadi Pariksha</text>
                    </clipPath>
                    <foreignObject x="0" y="0" width="100%" height="100%" clipPath="url(#text-mask-nadi)">
                      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src="https://player.vimeo.com/progressive_redirect/playback/868352615/rendition/1080p/file.mp4?loc=external&signature=49673550257ad6bc1119565f49ce1ee644a86f03d5089e5fc87241f7e025f187" type="video/mp4" />
                      </video>
                    </foreignObject>
                 </svg>
                 <div className="absolute -bottom-2 left-0 h-1 w-20 bg-primary rounded-full blur-sm" />
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.4em] font-black mt-2">Primal Constitution Discovery</p>
            </div>
          </div>

          {/* Liquid Progress Bar */}
          <div className="relative h-1 w-full bg-white/5 rounded-full mb-6 overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progressPct}%` }}
               transition={{ duration: 1, ease: "circOut" }}
               className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] relative"
            >
               <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white/50 blur-sm" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className={cn(
                  'h-0.5 rounded-full transition-all duration-700',
                  i <= step ? 'bg-primary' : 'bg-white/10'
                )} />
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em]',
                  i === step ? 'text-primary' : 'text-muted-foreground/40'
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="grid lg:grid-cols-5 gap-12 items-start"
          >
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-16">
              <div>
                 <motion.h2 
                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                   className="text-5xl font-bold mb-4 font-serif leading-tight"
                 >
                   {currentStep.title}
                 </motion.h2>
                 <p className="text-xl text-muted-foreground/80 italic font-medium">{currentStep.subtitle}</p>
              </div>

              <div className="space-y-16">
                {currentStep.questions.map((q) => (
                  <div key={q.id}>
                    <p className="text-2xl font-bold mb-8 flex items-center gap-3">
                      <span className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_#34d399]" />
                      {q.question}
                    </p>
                    
                    {q.type === 'multi' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {q.options.map((opt) => (
                          <MultiCard
                            key={opt.value}
                            option={opt}
                            selected={(getValue(q.id) as string[] || []).includes(opt.value)}
                            onToggle={() => toggleSymptom(opt.value)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {q.options.map((opt) => (
                          <SingleCard
                            key={opt.value}
                            option={opt}
                            selected={getValue(q.id) === opt.value}
                            onSelect={() => setValue(q.id, opt.value)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Mirror */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 h-fit">
               <DoshaBar scores={scores} visible={true} />
               
               <div className="mt-12 flex flex-col gap-4">
                 <button
                   onClick={() => setStep(s => s - 1)}
                   disabled={step === 0}
                   className={cn(
                     'w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.3em] transition-all border border-white/10',
                     step === 0 ? 'opacity-0' : 'hover:bg-white/5 bg-white/[0.02]'
                   )}
                 >
                   Recall Previous Step
                 </button>

                 {step < STEPS.length - 1 ? (
                   <button
                     onClick={() => {
                       if (canProceed()) setStep(s => s + 1);
                       else toast.error('Please complete this step to move forward');
                     }}
                     className={cn(
                       'w-full py-6 rounded-3xl flex items-center justify-center gap-4 text-xl font-bold transition-all duration-500',
                       canProceed() ? 'btn-vedic shadow-[0_20px_40px_rgba(var(--primary),0.3)]' : 'bg-white/5 border border-white/10 opacity-50'
                     )}
                   >
                     Venture Deeper <ArrowRight className="h-6 w-6" />
                   </button>
                 ) : (
                   <button
                     onClick={handleSubmit}
                     disabled={loading || !canProceed()}
                     className="btn-vedic w-full py-6 rounded-3xl flex items-center justify-center gap-4 text-xl font-bold shadow-[0_20px_40px_rgba(var(--primary),0.4)]"
                   >
                     {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <><Sparkles className="h-7 w-7" /> Manifest Destiny</>}
                   </button>
                 )}
               </div>
               
               <div className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-xl">
                 <p className="text-xs text-primary font-black uppercase tracking-widest mb-4">Ayurvedic Wisdom</p>
                 <p className="text-muted-foreground text-sm italic leading-relaxed">
                   "The eye through which I see the Divine is the same eye through which the Divine sees me."
                 </p>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <RemAide context="assessment" />
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
