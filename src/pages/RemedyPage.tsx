import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Leaf, Heart, Wind, Flame, Mountain, Activity, ArrowRight, Check, Droplets, Smile, ArrowLeft } from 'lucide-react';
import { REMEDIES, Remedy } from '@/data/RemedyData';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RemedyPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredRemedies = useMemo(() => {
    if (!search) return [];
    return REMEDIES.filter(r => 
      r.problem.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Remedies to suggest when no search or as "More for you"
  const suggestedRemedies = useMemo(() => {
    return REMEDIES.filter(r => r.id !== selectedRemedy?.id).slice(0, 6);
  }, [selectedRemedy]);

  const handleGenAssignment = async () => {
    if (!selectedRemedy || !profile?.id) {
      toast.error('Please log in to generate assignments');
      return;
    }

    setIsAssigning(true);
    try {
      const promises = selectedRemedy.assignments.map(task => 
        api.habitTracking.create({
          user_id: profile.id,
          habit_type: 'assignment',
          habit_name: task,
          notes: `From Remedy: ${selectedRemedy.problem}`,
          completed_at: '' 
        })
      );

      await Promise.all(promises);
      toast.success(`Assignments generated! Check your Dashboard. 🙏`);
    } catch (error) {
      toast.error('Failed to generate assignments.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
          <Sparkles className="h-4 w-4" /> The Intelligent Healer
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-serif italic mb-6">
          Find Your <span className="text-primary italic">Ayurvedic Remedy</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto italic font-medium leading-relaxed">
          Ancient wisdom tailored to your symptoms. Search any concern and let the Vaidya guide you to balance.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-20 relative">
        <div className="relative group">
          <div className="absolute inset-x-0 -bottom-2 h-4 bg-primary/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.value || e.target.value)}
            onFocus={() => setSelectedRemedy(null)}
            placeholder="Search symptoms like 'Stress', 'Anxiety', 'Acidity'..."
            className="w-full h-20 pl-16 pr-8 rounded-3xl bg-white/[0.03] border border-white/10 focus:border-primary/50 focus:bg-white/[0.06] transition-all outline-none text-xl font-medium placeholder:text-muted-foreground/50 shadow-2xl"
          />
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {search && filteredRemedies.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl bg-[#0a150c] border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              {filteredRemedies.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedRemedy(r); setSearch(''); }}
                  className="w-full p-6 text-left hover:bg-primary/5 rounded-2xl transition-all group flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{r.problem}</h4>
                    <p className="text-sm text-muted-foreground italic line-clamp-1">{r.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Remedy / Suggested Grid */}
      <AnimatePresence mode="wait">
        {selectedRemedy ? (
          <motion.div
            key={selectedRemedy.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-20"
          >
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Left Column: Essential Info */}
              <div className="lg:col-span-8 space-y-10">
                <div className="vedic-card p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <button 
                        onClick={() => setSelectedRemedy(null)}
                        className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                      >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      </button>
                      <div className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase font-black tracking-widest border border-primary/30">
                        {selectedRemedy.dosha_effect}
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold font-serif mb-6">{selectedRemedy.problem}</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed italic mb-10">{selectedRemedy.description}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Herb Info */}
                      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                          <Leaf className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h4 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-1">Medicinal Herb</h4>
                        <h3 className="text-2xl font-bold text-primary mb-2 italic font-serif">{selectedRemedy.herb.name}</h3>
                        <p className="text-sm font-medium text-foreground/90 mb-4">{selectedRemedy.herb.dosage}</p>
                        <p className="text-sm italic text-muted-foreground">{selectedRemedy.herb.benefit}</p>
                      </div>

                      {/* Lifestyle Info */}
                      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                          <Heart className="h-6 w-6 text-amber-500" />
                        </div>
                        <h4 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-1">Lifestyle Tip</h4>
                        <h3 className="text-2xl font-bold text-amber-500 mb-4 italic font-serif">Daily Ritual</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">"{selectedRemedy.lifestyle}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diet & Yoga Row */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="vedic-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Wind className="h-5 w-5 text-orange-500" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif italic text-orange-500">Dietary Flow</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-3">Favor</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRemedy.diet.favor.map(f => (
                            <span key={f} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-3">Avoid</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRemedy.diet.avoid.map(f => (
                            <span key={f} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-500">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="vedic-card p-8">
                     <div className="flex items-center gap-4 mb-8">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif italic text-blue-500">Sacred Yoga</h3>
                    </div>
                    <ul className="space-y-4">
                      {selectedRemedy.yoga.map(y => (
                        <li key={y} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all">
                          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                          <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">{y}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Assignments */}
              <div className="lg:col-span-4 h-fit sticky top-24">
                <div className="vedic-card p-8 border-primary/30 lush-glow shadow-2xl shadow-primary/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Health Plan</h3>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black uppercase text-primary border border-primary/20">{selectedRemedy.assignments.length} Assignments</div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-8 italic">Convert this remedy into daily tasks to manifest your healing journey.</p>
                  
                  <div className="space-y-4 mb-10">
                    {selectedRemedy.assignments.map((task, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                         <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                         <p className="text-sm font-bold leading-relaxed">{task}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleGenAssignment}
                    disabled={isAssigning}
                    className="w-full py-5 rounded-[2rem] btn-vedic flex items-center justify-center gap-4 text-xl font-bold shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isAssigning ? 'Manifesting...' : <><Sparkles className="h-6 w-6" /> Gen Assignments</>}
                  </button>

                  <p className="text-[10px] text-center mt-6 uppercase tracking-widest text-muted-foreground/60 font-black">Digital Sanctuary Vault</p>
                </div>
              </div>
            </div>

            {/* "Keep Suggesting" Section */}
            <div className="pt-20 border-t border-white/5">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-3xl font-bold font-serif italic text-primary">Discover More Healing</h3>
                   <span className="text-xs uppercase tracking-widest font-black text-muted-foreground/60">Persistent Wisdom</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {suggestedRemedies.map((r, i) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => { setSelectedRemedy(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="vedic-card p-8 text-left group organic-mesh overflow-hidden"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-all">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">{r.problem}</h3>
                      <p className="text-sm text-muted-foreground italic line-clamp-2">{r.description}</p>
                      <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                        Explore <ArrowRight className="h-4 w-4" />
                      </div>
                    </motion.button>
                  ))}
                </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold font-serif italic opacity-60">Handpicked Suggestions</h3>
                <div className="h-px flex-1 mx-10 bg-white/5" />
                <Sparkles className="h-5 w-5 text-primary/40" />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {REMEDIES.map((r, i) => (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedRemedy(r)}
                  className="vedic-card p-8 text-left group organic-mesh overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Leaf className="h-12 w-12 text-primary" />
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-all">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">{r.problem}</h3>
                  <p className="text-sm text-muted-foreground italic line-clamp-2">{r.description}</p>
                  <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                    Explore Remedy <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
