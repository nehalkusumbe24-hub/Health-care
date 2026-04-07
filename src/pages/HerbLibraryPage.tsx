import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Leaf, Info, Filter, ArrowRight, Wind, Flame, Mountain } from 'lucide-react';
import { HERBS, Herb } from '@/data/HerbData';
import { cn } from '@/lib/utils';

export default function HerbLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredHerbs = useMemo(() => {
    return HERBS.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                           h.sanskrit.toLowerCase().includes(search.toLowerCase()) ||
                           h.benefit.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || h.dosha.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const FILTERS = ['All', 'Vata', 'Pitta', 'Kapha'];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/0 text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">
          <Leaf className="h-4 w-4" /> The Sacred Herbarium
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-serif italic mb-6">
          The <span className="text-primary italic">Herb Sanctuary</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl italic font-medium leading-relaxed">
          Explore the medicinal guardians of Ayurveda. Each herb is a direct manifestation of nature's intelligence.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for an herb..."
            className="w-full h-16 pl-14 pr-8 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-primary/50 outline-none text-sm font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/10">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                activeFilter === f ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-105' : 'text-muted-foreground hover:bg-white/5'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredHerbs.map((h, i) => (
            <motion.div
              layout
              key={h.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="vedic-card group organic-mesh overflow-hidden h-full flex flex-col p-8"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-30 transition-opacity">
                <Leaf className="h-16 w-16 text-primary rotate-45" />
              </div>

              <div className="flex items-center gap-2 mb-6">
                 {h.dosha.map(d => (
                   <div key={d} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase font-black tracking-tighter text-muted-foreground/60 group-hover:text-primary transition-colors">
                      {d}
                   </div>
                 ))}
              </div>

              <h3 className="text-3xl font-bold font-serif mb-1 group-hover:text-primary transition-colors">{h.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-6 font-black italic">{h.sanskrit}</p>
              
              <div className="flex-1">
                 <p className="text-sm font-bold text-foreground/90 leading-relaxed mb-4">{h.benefit}</p>
                 <p className="text-xs text-muted-foreground italic leading-relaxed">"{h.use}"</p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {h.dosha.includes('Vata') && <Wind className="h-4 w-4 text-sky-400 opacity-40 group-hover:opacity-100 transition-opacity" />}
                    {h.dosha.includes('Pitta') && <Flame className="h-4 w-4 text-orange-400 opacity-40 group-hover:opacity-100 transition-opacity" />}
                    {h.dosha.includes('Kapha') && <Mountain className="h-4 w-4 text-emerald-400 opacity-40 group-hover:opacity-100 transition-opacity" />}
                 </div>
                 <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <Info className="h-4 w-4 text-primary" />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHerbs.length === 0 && (
        <div className="py-40 text-center space-y-4">
           <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
           </div>
           <h3 className="text-2xl font-bold font-serif italic text-muted-foreground">No herbs discovered here...</h3>
           <p className="text-sm text-muted-foreground opacity-60">Try searching for another name or property.</p>
        </div>
      )}
    </div>
  );
}
