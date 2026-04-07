import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Activity, FileText, MessageSquare, ArrowUpRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Assessment } from '@/types';
import RemAide from '@/components/common/RemAide';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DoctorDashboardPage() {
  const { profile } = useAuth();
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const assessments = await api.assessments.listAll(10);
        setRecentAssessments(assessments);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    { 
      label: 'Total Patients', 
      value: recentAssessments.length, 
      icon: Users, 
      color: '#6ab4d4', 
      video: 'https://player.vimeo.com/progressive_redirect/playback/705912411/rendition/1080p/file.mp4?loc=external&signature=5f29910d9f4d1e2b6d5f7f9e8d4c3b2a1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6' // Cloud/Mist
    },
    { 
      label: 'Pending Reviews', 
      value: recentAssessments.filter(a => a.status === 'pending' || a.status === 'completed').length, 
      icon: Activity, 
      color: '#fb923c', 
      video: 'https://player.vimeo.com/progressive_redirect/playback/868352615/rendition/1080p/file.mp4?loc=external&signature=49673550257ad6bc1119565f49ce1ee644a86f03d5089e5fc87241f7e025f187' // Waterfall/Flow
    },
    { 
      label: 'Prescriptions', 
      value: 0, 
      icon: FileText, 
      color: '#34d399', 
      video: 'https://player.vimeo.com/progressive_redirect/playback/705928173/rendition/1080p/file.mp4?loc=external&signature=d90a908f9d86928817a80808080808080808080808080808080808080808080' // Nature/Growth
    },
    { 
      label: 'Health Messages', 
      value: 0, 
      icon: MessageSquare, 
      color: '#a855f7', 
      video: 'https://player.vimeo.com/progressive_redirect/playback/868352615/rendition/1080p/file.mp4?loc=external&signature=49673550257ad6bc1119565f49ce1ee644a86f03d5089e5fc87241f7e025f187' // Flow
    },
  ];

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-44 rounded-3xl bg-white/5 border border-white/10" />)}
        </div>
        <Skeleton className="h-[500px] rounded-[3rem] bg-white/5 border border-white/10" />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -ml-96 -mb-96" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: 'circOut' }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.4em] text-primary/60">Practitioner Sanctuary</span>
        </div>
        <h1 className="text-6xl font-black font-serif italic mb-2 tracking-tighter">
          Dashboard <span className="text-primary opacity-50 font-sans not-italic">Mirror</span>
        </h1>
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#34d399]" />
           <p className="text-xl text-muted-foreground font-medium italic">Namaste, Dr. {profile?.full_name} — Your patients await your wisdom.</p>
        </div>
      </motion.div>

      {/* Cinematic Stat Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: 'backOut' }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative h-48 rounded-[2.5rem] overflow-hidden border border-white/10"
          >
            {/* Elemental Video Portal inside Card */}
            <div className="absolute inset-0 z-0">
               <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-40" src={stat.video} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020804] via-[#020804]/60 to-transparent" />
               <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10" style={{ boxShadow: `0 0 20px ${stat.color}15` }}>
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <motion.div whileHover={{ scale: 1.2, rotate: 45 }}>
                   <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </motion.div>
              </div>
              
              <div>
                <motion.div 
                   className="text-4xl font-black tracking-tighter mb-1"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
            
            {/* Interactive Bottom Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-700" style={{ background: stat.color, boxShadow: `0 0 15px ${stat.color}` }} />
          </motion.div>
        ))}
      </div>

      {/* Main Assessment Console */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="relative z-10 group"
      >
        <div className="rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
          
          <div className="p-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold font-serif mb-2 flex items-center gap-4">
                   Recent Assessments
                   <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </h2>
                <p className="text-muted-foreground font-medium italic">Latest patient transformations in progress</p>
              </div>
              <Link to="/doctor/assessments">
                 <button className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-background hover:border-primary transition-all duration-500">
                    View Archive
                 </button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentAssessments.length === 0 ? (
                <div className="py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <p className="text-xl font-medium italic text-muted-foreground">The sanctuary is quiet. No recent assessments found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {recentAssessments.slice(0, 6).map((assessment, i) => (
                      <motion.div 
                        key={assessment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 10, scale: 1.005 }}
                        className={cn(
                          "group/row relative flex items-center justify-between p-6 px-10 rounded-3xl border border-white/5 transition-all duration-500",
                          "bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30"
                        )}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover/row:opacity-10 transition-opacity bg-gradient-to-r from-primary to-transparent pointer-events-none" />
                        
                        <div className="flex items-center gap-10 flex-1">
                          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/row:border-primary/40 group-hover/row:rotate-6 transition-all duration-500">
                             <span className="text-2xl opacity-80">🧘</span>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-xl font-bold font-serif tracking-tight">{assessment.user?.full_name || assessment.user?.email || 'Sacred Patient'}</p>
                            <div className="flex items-center gap-4 mt-1">
                               {assessment.primary_dosha && (
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                    {assessment.primary_dosha}
                                 </span>
                               )}
                               <span className="text-xs text-muted-foreground/60 italic">
                                  {new Date(assessment.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                               </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                           <div className="text-right hidden md:block">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Severity</p>
                              <p className={cn(
                                "text-sm font-bold uppercase italic",
                                assessment.imbalance_severity === 'high' ? 'text-red-400' : 'text-primary'
                              )}>
                                {assessment.imbalance_severity || 'Normal'}
                              </p>
                           </div>
                           
                           <Link to={`/doctor/assessments/${assessment.id}`}>
                             <button className="h-14 px-10 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-background transition-all duration-500 shadow-lg shadow-primary/5 active:scale-95">
                                Review Journey
                             </button>
                           </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 text-center italic text-muted-foreground opacity-40 hover:opacity-100 transition-opacity duration-1000">
         <p>"True medicine starts with understanding the sacred balance within."</p>
      </div>

      <RemAide context="doctor" />
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}
