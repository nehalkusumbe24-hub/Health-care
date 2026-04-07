import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, Activity, BookOpen, Dumbbell, MessageSquare,
  UserCheck, ArrowRight, Sparkles, Wind, Flame, Mountain,
  CheckCircle, Zap,
} from 'lucide-react';

const FEATURES = [
  { icon: Activity,      title: 'Dosha Assessment',     color: 'var(--sage)', desc: 'Identify your unique Vata–Pitta–Kapha constitution and imbalances through deep analysis.' },
  { icon: BookOpen,      title: 'Personalized Diet',    color: 'var(--saffron)', desc: 'Custom seasonal meal plans, food lists, and recipes tailored to your dosha.' },
  { icon: Dumbbell,      title: 'Daily Dinacharya',     color: 'var(--sage)', desc: 'Structured daily routines with yoga, pranayama, and Ayurvedic self-care.' },
  { icon: MessageSquare, title: 'Health Assistant',  color: 'var(--saffron)', desc: 'Ask about herbs, remedies, symptoms — get Ayurvedic wisdom instantly, 24/7.' },
  { icon: UserCheck,     title: 'Expert Consultation',  color: 'var(--sage)', desc: 'Connect with verified Ayurvedic doctors for professional guidance.' },
  { icon: Zap,           title: 'Smart Recommendations',   color: 'var(--saffron)', desc: 'Intelligent health scoring, progress tracking, and adaptive wellness.' },
];

const DOSHAS = [
  { 
    name: 'Vata',  icon: Wind,     color: '#6ab4d4', 
    desc: 'Air & Space · Creativity · Movement',
    video: 'https://player.vimeo.com/external/517090025.sd.mp4?s=6a988d5e05c87a912bb07fef7b194fb84777d1ca&profile_id=164&oauth2_token_id=57447761'
  },
  { 
    name: 'Pitta', icon: Flame,    color: '#d47a3a', 
    desc: 'Fire & Water · Intelligence · Transform',
    video: 'https://player.vimeo.com/external/494440465.sd.mp4?s=340f1a9461148f3b6d27464a0f44358899887556&profile_id=164&oauth2_token_id=57447761'
  },
  { 
    name: 'Kapha', icon: Mountain, color: '#6b8f6e', 
    desc: 'Earth & Water · Stability · Structure',
    video: 'https://player.vimeo.com/external/517090025.sd.mp4?s=6a988d5e05c87a912bb07fef7b194fb84777d1ca&profile_id=164&oauth2_token_id=57447761'
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* ── Nav ── */}
      <nav className="fixed top-0 z-[100] w-full glass-effect border-b border-primary/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              <Leaf className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              Vedic<span className="text-primary italic">Life</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-primary transition-all">
              Sanctuary Entry
            </Link>
            <Link to="/signup">
              <button className="btn-vedic px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest">
                Begin Journey
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Video Upgrade ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">
        {/* Full-Bleed Cinematic Background */}
        <div className="absolute inset-0 z-0">
           <video 
             autoPlay muted loop playsInline 
             className="w-full h-full object-cover scale-105 brightness-[0.4] contrast-[1.1]"
             poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
           >
             <source src="https://player.vimeo.com/external/517090025.sd.mp4?s=6a988d5e05c87a912bb07fef7b194fb84777d1ca&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
           <div className="absolute inset-0 cinematic-vignette opacity-80" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto relative z-10 pt-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-effect border border-primary/30 text-[10px] font-black text-primary mb-12 tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            The Future of Ancient Wisdom
          </div>

          <h1 className="text-7xl md:text-[9.5rem] font-bold mb-10 leading-[0.9] tracking-tighter">
            Mindful{' '}
            <span className="relative inline-block align-middle pb-4">
              <span className="sr-only">Essence</span>
              <svg className="w-[400px] md:w-[600px] h-[100px] md:h-[200px]" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <clipPath id="textClip">
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="160" fontWeight="950" fontStyle="italic" fontFamily="serif" className="tracking-tighter">Essence</text>
                  </clipPath>
                </defs>
                <foreignObject x="0" y="0" width="600" height="200" clipPath="url(#textClip)">
                   <video autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[1.8] contrast-150 saturate-150 scale-110">
                      <source src="https://player.vimeo.com/external/494440465.sd.mp4?s=340f1a9461148f3b6d27464a0f44358899887556&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                   </video>
                </foreignObject>
                {/* Fallback stroke for premium feel */}
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="160" fontWeight="950" fontStyle="italic" fontFamily="serif" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" className="tracking-tighter">Essence</text>
              </svg>
            </span>
            <br />
            <span className="text-foreground/90 font-light">In Every Breath</span>
          </h1>

          <p className="text-xl md:text-3xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight">
            An intelligent sanctuary for your soul. Connect with nature's rhythm 
            through advanced Ayurvedic diagnostics and cinematic daily routines.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/signup" className="group">
              <button className="btn-vedic flex items-center gap-4 px-12 py-6 text-xl rounded-full shadow-2xl group-hover:scale-105 transition-transform">
                Awaken Your Spirit <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-2" />
              </button>
            </Link>
            <Link to="/doctor-register">
              <button className="px-12 py-6 text-xl font-bold rounded-full glass-effect border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all">
                Healer's Portal
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating holographic scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Descend</span>
        </motion.div>
      </section>

      {/* ── Doshas with Video Previews ── */}
      <section className="py-40 px-6 relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
             >
               <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Primordial <span className="text-primary italic">Forces</span></h2>
               <div className="h-1.5 w-24 bg-primary/30 mx-auto rounded-full mb-8" />
               <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                 The universe is written in five elements, expressed through your unique Dosha.
               </p>
             </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {DOSHAS.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div 
                  key={d.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="video-hover-container perspective-1000 group cursor-pointer"
                >
                  <div className="vedic-card h-[500px] p-12 text-center flex flex-col items-center justify-center relative z-20 overflow-hidden group-hover:border-primary/50 transition-colors border-white/5 bg-white/[0.03]">
                    {/* Background Video Preview */}
                    <video 
                      autoPlay muted loop playsInline 
                      className="absolute inset-0 w-full h-full object-cover -z-10 group-hover:scale-125 transition-transform duration-1000 brightness-110 contrast-125 saturate-150"
                    >
                      <source src={d.video} type="video/mp4" />
                    </video>
                    
                    {/* Dark gradient to ensure readability (Refined Opacity) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/95 z-0 group-hover:from-background/40 group-hover:via-background/10 group-hover:to-background/40 transition-colors duration-700" />

                    {/* Elemental Hover Aura */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-[80px]"
                      style={{ background: d.color }}
                    />

                    <div className="relative z-10 space-y-8 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-[2rem] flex items-center justify-center bg-background/50 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-500 animate-lotus">
                        <Icon className="h-12 w-12 text-primary group-hover:scale-120 transition-transform" />
                      </div>
                      <h3 className="text-4xl font-bold tracking-tight font-serif italic text-primary">{d.name}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium">{d.desc}</p>
                      
                      <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-8 py-3 rounded-full border border-primary/40 bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest">
                        Explore Energy
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-40 px-6 bg-white/[0.01] border-y border-border/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter">
                Holistic Systems <br/>For The <span className="text-primary italic">Modern Soul</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-12">
                {FEATURES.map((f, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-4 group"
                  >
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-2xl tracking-tight">{f.title}</h4>
                    <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative group perspective-1000">
              <motion.div
                whileHover={{ rotateY: 15, rotateX: -5 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="relative rounded-[4rem] border border-white/10 overflow-hidden bg-white/5 aspect-[4/5] flex items-center justify-center preserve-3d shadow-2xl"
              >
                  {/* Internal Video Snippet */}
                  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 opacity-40">
                     <source src="https://assets.mixkit.co/videos/preview/mixkit-sunlight-streaming-through-the-leaves-of-a-tree-534-large.mp4" type="video/mp4" />
                  </video>
                  
                  <Leaf className="w-56 h-56 text-primary/30 animate-spin-slow lush-glow relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                  <div className="absolute bottom-16 left-12 right-12 text-center z-30">
                      <p className="font-serif italic text-3xl text-accent/80 drop-shadow-2xl">
                        "Your body is a temple, <br/>keep it pure and clean."
                      </p>
                      <p className="text-xs uppercase tracking-[0.4em] font-bold text-primary/40 mt-6">Ancient Proverb</p>
                  </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-48 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto vedic-card p-24 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20"
        >
          <div className="absolute inset-0 z-0 opacity-10">
             <video autoPlay muted loop playsInline className="w-full h-full object-cover">
               <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" type="video/mp4" />
             </video>
          </div>

          <div className="relative z-10">
            <h2 className="text-6xl font-bold mb-10 tracking-tighter">Enter The <span className="text-primary italic">Sanctuary</span></h2>
            <p className="text-muted-foreground text-xl mb-16 max-w-2xl mx-auto font-medium">
              Join 10,000+ conscious beings already finding their absolute balance. 
              The journey to your best self begins with a single, mindful choice.
            </p>
            
            <Link to="/signup" className="group">
              <button className="btn-vedic px-16 py-7 text-2xl rounded-full shadow-[0_0_50px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-all">
                Reveal My Assessment
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-28 px-6 border-t border-border/20 text-center relative overflow-hidden bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-12">
             <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-primary/15 border border-primary/30">
                <Leaf className="h-8 w-8 text-primary" />
             </div>
             <span className="text-3xl font-black tracking-tighter">Vedic<span className="text-primary italic">Life</span></span>
          </div>
          <div className="flex gap-12 justify-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-16">
             <a href="#" className="hover:text-primary transition-colors">Sanctuary</a>
             <a href="#" className="hover:text-primary transition-colors">Elements</a>
             <a href="#" className="hover:text-primary transition-colors">Healers</a>
          </div>
          <p className="text-xs text-muted-foreground/40 italic font-serif opacity-70 mb-4 max-w-md mx-auto">
            "Absolute wellness is not the absence of disease, but the presence of vibrant life in body, mind, and spirit."
          </p>
          <div className="text-[10px] uppercase tracking-[0.5em] text-primary/30 font-bold">© 2026 Crafted with Soul</div>
        </div>
      </footer>
    </div>
  );
}
