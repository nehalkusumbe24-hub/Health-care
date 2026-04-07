import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useRef } from 'react';

export default function VedicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate3d = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const leaves = Array.from({ length: 15 });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background perspective-1000">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover opacity-30 scale-110 blur-[2px]"
          poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90" />
        <div className="absolute inset-0 cinematic-vignette opacity-60" />
        <div className="absolute inset-0 scanlines opacity-[0.03]" />
      </div>

      {/* Organic Aura Orbs - Greenery Focused */}
      <div className="absolute inset-0 opacity-40 z-10">
        <motion.div 
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 80, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-primary/25 rounded-full blur-[140px]" 
        />
        
        {/* Floating Video Portals (Premium Upgrade) */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full overflow-hidden border border-primary/20 bg-primary/5 blur-[40px] opacity-40"
        >
           <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-150">
             <source src="https://player.vimeo.com/external/517090025.sd.mp4?s=6a988d5e05c87a912bb07fef7b194fb84777d1ca&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
           </video>
        </motion.div>

        <motion.div 
          style={{ y: y2 }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -60, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-accent/15 rounded-full blur-[120px]" 
        />
      </div>

      {/* 3D Parallax Floating Elements */}
      <motion.div 
        style={{ rotateX: rotate3d }}
        className="absolute inset-0 preserve-3d pointer-events-none"
      >
        {/* Floating Leaves */}
        <div className="absolute inset-0 overflow-hidden">
          {leaves.map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                x: Math.random() * 100 + '%', 
                y: '110%',
                z: Math.random() * 200 - 100,
                rotate: Math.random() * 360 
              }}
              animate={{ 
                opacity: [0, 0.4, 0.4, 0],
                y: '-10%',
                x: (Math.random() * 100 - 10) + '%',
                rotate: Math.random() * 360 + 180,
                z: [null, Math.random() * 300 - 150]
              }}
              transition={{ 
                duration: 15 + Math.random() * 20, 
                repeat: Infinity, 
                delay: Math.random() * 20,
                ease: "linear"
              }}
              className="absolute text-primary/30"
              style={{ width: 10 + Math.random() * 20 }}
            >
              <Leaf size={16 + Math.random() * 24} strokeWidth={1} />
            </motion.div>
          ))}
        </div>

        {/* Rotating 3D Sacred Geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.06] preserve-3d">
          <motion.div
            animate={{ rotateZ: 360, rotateY: [0, 10, 0] }}
            transition={{ 
              rotateZ: { duration: 120, repeat: Infinity, ease: "linear" },
              rotateY: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 border-[1.5px] border-primary/40 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.1)]"
          />
          <motion.div
            animate={{ rotateZ: -360, rotateX: [0, 15, 0] }}
            transition={{ 
              rotateZ: { duration: 180, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 20, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-[10%] border-[1px] border-primary/20 rounded-full border-dashed"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[20%] bg-primary/5 rounded-full blur-3xl"
          />
        </div>
      </motion.div>

      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay z-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
}
