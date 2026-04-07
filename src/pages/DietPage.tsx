import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf, Apple, Coffee, Utensils, ArrowRight, Flame, Droplets, Wind, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DietPlan } from '@/types';
import RemAide from '@/components/common/RemAide';

const AYURVEDIC_FOODS = [
  { name: "Turmeric (Haldi)", benefit: "Anti-inflammatory, boosts immunity, supports digestion", dosha: "All", emoji: "✨" },
  { name: "Ginger (Adrak)", benefit: "Stimulates Agni (digestive fire), reduces nausea", dosha: "Vata & Kapha", emoji: "🫚" },
  { name: "Ghee (Clarified Butter)", benefit: "Lubricates joints, nourishes tissues, enhances flavor", dosha: "All", emoji: "🧈" },
  { name: "Ashwagandha", benefit: "Reduces stress, boosts energy and immunity", dosha: "Vata & Kapha", emoji: "🌿" },
  { name: "Cumin (Jeera)", benefit: "Aids digestion, detoxifies, cools Pitta", dosha: "All", emoji: "🌱" },
  { name: "Holy Basil (Tulsi)", benefit: "Respiratory support, natural immunity booster", dosha: "Vata & Kapha", emoji: "🍃" },
];

const FOODS_BY_DOSHA = [
  { dosha: "Vata", icon: Wind, color: "#6ab4d4", favor: ["Warm soups & stews", "Cooked grains (rice, oats)", "Sweet fruits", "Root vegetables"], avoid: ["Raw salads", "Cold drinks", "Dry crackers", "Caffeine"] },
  { dosha: "Pitta", icon: Flame, color: "#fb923c", favor: ["Cooling foods (cucumber, melon)", "Sweet fruits (grapes, pears)", "Green vegetables", "Coconut & mint"], avoid: ["Spicy food", "Sour fruits", "Fried food", "Red meat"] },
  { dosha: "Kapha", icon: Droplets, color: "#34d399", favor: ["Light, warm foods", "Spicy dishes", "Leafy greens", "Legumes & beans"], avoid: ["Heavy dairy", "Fried foods", "Sweets", "Cold desserts"] },
];

export default function DietPage() {
  const { profile } = useAuth();
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDietPlan = async () => {
      if (!profile?.id) return;
      try {
        const plan = await api.dietPlans.getActiveByUser(profile.id);
        setDietPlan(plan);
      } catch (error) {
        console.error('Failed to load diet plan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDietPlan();
  }, [profile?.id]);

  if (loading) return <div className="p-10 space-y-6"><Skeleton className="h-40 w-full bg-white/5" /><Skeleton className="h-80 w-full bg-white/5" /></div>;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="vedic-card p-10 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-lotus">
              <Utensils className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-serif italic text-primary">Anna Vigyan</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">The Science of Nutrition</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl italic leading-relaxed">
            "Your food is your medicine." Discover the perfect nutritional balance for your unique constitution.
          </p>
        </div>
      </motion.div>

      {!dietPlan ? (
        <>
          <motion.div variants={itemVariants} className="vedic-card p-12 text-center border-accent/20">
             <Sparkles className="h-12 w-12 text-accent mx-auto mb-6" />
             <h2 className="text-3xl font-bold mb-4 font-serif">Awaiting Your Analysis</h2>
             <p className="text-muted-foreground mb-10 max-w-lg mx-auto italic">Complete your Nadi Pariksha assessment to receive a personalized Ayurvedic diet plan tailored to your dosha.</p>
             <Link to="/assessment">
                <button className="btn-vedic px-10 py-4 rounded-full flex items-center gap-3 mx-auto text-lg">
                  Begin Assessment <ArrowRight className="h-6 w-6" />
                </button>
             </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Ayurvedic Superfoods</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AYURVEDIC_FOODS.map((food, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="vedic-card p-6 border-white/5 bg-white/[0.02]">
                  <div className="text-4xl mb-4">{food.emoji}</div>
                  <h3 className="font-bold text-lg mb-2 text-primary">{food.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{food.benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
             <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Constitution Specifics</h2>
             <div className="grid md:grid-cols-3 gap-6">
               {FOODS_BY_DOSHA.map((item, i) => (
                 <div key={i} className="vedic-card p-8 border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                       <item.icon className="h-6 w-6" style={{ color: item.color }} />
                       <h3 className="text-xl font-bold font-serif" style={{ color: item.color }}>{item.dosha}</h3>
                    </div>
                    <div className="space-y-6">
                       <div>
                          <p className="text-[10px] uppercase tracking-widest font-black text-primary/60 mb-2">Favor</p>
                          <ul className="text-xs space-y-1.5 text-muted-foreground">
                             {item.favor.map((f, j) => <li key={j} className="flex gap-2"><span>•</span> {f}</li>)}
                          </ul>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase tracking-widest font-black text-rose-500/60 mb-2">Avoid</p>
                          <ul className="text-xs space-y-1.5 text-muted-foreground">
                             {item.avoid.map((a, j) => <li key={j} className="flex gap-2"><span>•</span> {a}</li>)}
                          </ul>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Daily Menu</h2>
                <div className="space-y-4">
                   {[
                     { label: 'Pratah (Breakfast)', key: 'breakfast', icon: Coffee },
                     { label: 'Madhyanha (Lunch)', key: 'lunch', icon: Utensils },
                     { label: 'Snacks', key: 'snacks', icon: Apple },
                     { label: 'Sayam (Dinner)', key: 'dinner', icon: Utensils },
                   ].map((meal, i) => {
                     const data = dietPlan.daily_menu?.[meal.key as keyof typeof dietPlan.daily_menu];
                     if (!data) return null;
                     return (
                        <div key={i} className="vedic-card p-6 flex gap-6 items-start hover:border-primary/40 transition-colors">
                           <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <meal.icon className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-2">{meal.label}</h4>
                              <p className="text-muted-foreground leading-relaxed">{String(data)}</p>
                           </div>
                        </div>
                     );
                   })}
                </div>
             </div>

             <div className="space-y-8">
                <h2 className="text-2xl font-bold font-serif italic border-l-4 border-primary pl-4">Insights</h2>
                <div className="vedic-card p-8 border-primary/20 bg-primary/5">
                   <h3 className="font-bold mb-4 text-primary">Seasonal Guidance</h3>
                   <div className="space-y-4">
                      {Object.entries(dietPlan.seasonal_recommendations || {}).map(([s, r]) => (
                         <div key={s} className="space-y-1">
                            <p className="text-xs uppercase tracking-widest font-black text-primary/40">{s}</p>
                            <p className="text-sm italic">{String(r)}</p>
                         </div>
                      ))}
                   </div>
                </div>

                {dietPlan.food_restrictions && (
                   <div className="vedic-card p-8 border-rose-500/20 bg-rose-500/5">
                      <h3 className="font-bold mb-4 text-rose-500">Pratishedha (Restrictions)</h3>
                      <div className="flex flex-wrap gap-2">
                         {dietPlan.food_restrictions.map((r, i) => (
                           <span key={i} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-500 uppercase">{r}</span>
                         ))}
                      </div>
                   </div>
                )}
             </div>
          </motion.div>
        </>
      )}

      {/* Rules Section */}
      <motion.div variants={itemVariants} className="vedic-card p-10 md:p-14 border-primary/10">
        <h2 className="text-3xl font-bold mb-10 font-serif text-center">Golden Rules of Ayurvedic Eating</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Solar Digestion", desc: "Eat your largest meal at noon when Agni is strongest." },
            { title: "Six Tastes", desc: "Include sweet, sour, salty, bitter, pungent, and astringent daily." },
            { title: "Warmth Over Cold", desc: "Always prefer warm or room-temperature water and food." },
            { title: "Mindful Silence", desc: "Eat without screens — nourish your mind as much as your body." },
            { title: "The Three Hour Gap", desc: "Allow your prev meal to digest fully before eating again." },
            { title: "Seasonal Harmony", desc: "Eat what nature provides in your current climate." },
          ].map((rule, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-bold text-primary font-serif italic text-lg">{rule.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <RemAide context="diet" />
    </motion.div>
  );
}
