import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/db/api';
import { toast } from 'sonner';
import { Send, Sparkles, Leaf, Heart, Dumbbell, Apple, Brain, Activity, ArrowRight } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { REMEDIES } from '@/data/RemedyData';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_QUESTIONS = [
  { text: "I have a common cold", icon: Leaf },
  { text: "Ayurvedic diet for Pitta", icon: Apple },
  { text: "Yoga for stress relief", icon: Dumbbell },
  { text: "How to fix acidity?", icon: Flame }, // Note: Flame import needed, added below
  { text: "Herbs for memory", icon: Brain },
  { text: "Routine for better sleep", icon: Heart },
];

import { Flame } from 'lucide-react';

function renderMarkdown(text: string) {
  if (!text) return '';
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
  html = html.replace(/^• /gm, '<span class="inline-block w-4 text-primary">•</span>');
  html = html.replace(/^\d+\. /gm, (match) => `<span class="inline-block w-6 font-bold text-primary">${match}</span>`);
  return html;
}

export default function ChatPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vaidyaInsight, setVaidyaInsight] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.id) loadMessages();
  }, [profile?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, vaidyaInsight]);

  const loadMessages = async () => {
    if (!profile?.id) return;
    try {
      const data = await api.chatMessages.listByUser(profile.id);
      setMessages(data.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const detectRemedy = (text: string) => {
    const lowText = text.toLowerCase();
    return REMEDIES.find(r => 
      lowText.includes(r.problem.toLowerCase()) || 
      r.problem.split(' ')[0].toLowerCase().includes(lowText) ||
      (lowText.includes('cold') && r.id === 'rem-cold') ||
      (lowText.includes('stress') && r.id === 'rem-stress') ||
      (lowText.includes('acidity') && r.id === 'rem-acidity') ||
      (lowText.includes('anxiety') && r.id === 'rem-anxiety') ||
      (lowText.includes('acne') && r.id === 'rem-acne')
    );
  };

  const handleSend = async (messageOverride?: string) => {
    const userMessage = (messageOverride || input).trim();
    if (!userMessage || !profile?.id) return;

    setInput('');
    setLoading(true);
    setVaidyaInsight(null); // Reset insight

    // Check for local remedy match
    const matchedRemedy = detectRemedy(userMessage);

    try {
      const savedMessage = await api.chatMessages.create({ user_id: profile.id, message: userMessage });
      setMessages(prev => [...prev, savedMessage]);

      // Mocking AI response for local demo/server if function fails, 
      // but let's try the real function first.
      const baseUrl = import.meta.env.VITE_API_URL || '';
      let aiResponse = '';
      
      try {
        const response = await fetch(`${baseUrl}/functions/v1/ayurvedic-chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: userMessage })
        });
        
        if (response.ok) {
           const data = await response.json();
           aiResponse = data?.response || data?.message;
        }
      } catch (e) {
        // Fallback for local dev if function not deployed
        aiResponse = "I am processing your query through the lens of ancient wisdom. Please wait a moment...";
      }

      if (!aiResponse) {
        aiResponse = matchedRemedy 
          ? `I see you are inquiring about ${matchedRemedy.problem}. Based on Ayurvedic principles, this is often a ${matchedRemedy.dosha_effect} concern. Let me provide you with a structured remedy.`
          : "The ancient scrolls suggest a focus on balance. Could you tell me more about your current state (Dosha or symptoms)?";
      }

      await api.chatMessages.updateResponse(savedMessage.id, aiResponse);
      setMessages(prev =>
        prev.map(msg => msg.id === savedMessage.id ? { ...msg, response: aiResponse } : msg)
      );

      if (matchedRemedy) {
        setVaidyaInsight(matchedRemedy);
        toast.success(`Ancient Remedy Found: ${matchedRemedy.problem} 🌿`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to transmit message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] py-6 px-4 md:px-0">
      <div className="h-full flex flex-col vedic-card border-white/5 overflow-hidden shadow-2xl relative">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-lotus">
                 <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                 <h1 className="text-2xl font-bold font-serif italic text-primary">The Digital Vaidya</h1>
                 <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Keeper of Ancient Wisdom</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth" ref={scrollRef}>
           <AnimatePresence initial={false}>
              {messages.length === 0 && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="max-w-md mx-auto text-center space-y-8 py-12"
                 >
                    <div className="space-y-3">
                       <h2 className="text-3xl font-bold font-serif italic text-foreground/90">Namaste, {profile?.full_name?.split(' ')[0] || 'Seeker'}</h2>
                       <p className="text-muted-foreground text-sm italic">Seek clarity on your health, nutrition, or spiritual path through the prism of Ayurveda.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       {SUGGESTED_QUESTIONS.map((q, i) => (
                          <button
                             key={i}
                             onClick={() => handleSend(q.text)}
                             className="p-4 rounded-2xl border border-white/5 bg-white/[0.03] text-left hover:border-primary/50 transition-all group"
                          >
                             <q.icon className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                             <p className="text-xs font-bold leading-tight text-muted-foreground group-hover:text-foreground">{q.text}</p>
                          </button>
                       ))}
                    </div>
                 </motion.div>
              )}

              {messages.map((msg) => (
                 <div key={msg.id} className="space-y-6">
                    {/* User Message */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-end pr-2"
                    >
                       <div className="max-w-[80%] p-4 rounded-3xl rounded-tr-none bg-primary/[0.08] border border-primary/20 text-foreground shadow-sm">
                          <p className="text-sm font-medium">{msg.message}</p>
                       </div>
                    </motion.div>

                    {/* AI Message */}
                    {msg.response && (
                       <motion.div 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="flex gap-4 max-w-[90%]"
                       >
                          <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                             <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div className="p-6 rounded-[2.5rem] rounded-tl-none bg-white/[0.03] border border-white/5 shadow-inner">
                             <div 
                               className="text-sm leading-relaxed text-muted-foreground font-serif italic"
                               dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.response) }}
                             />
                          </div>
                       </motion.div>
                    )}
                 </div>
              ))}

              {/* Vaidya Insight Card */}
              {vaidyaInsight && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }}
                   className="p-8 rounded-[2.5rem] border border-primary/30 bg-primary/5 relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Leaf className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                       <Activity className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Vaidya Insight Detected</span>
                    </div>
                    <h3 className="text-2xl font-bold font-serif mb-2">{vaidyaInsight.problem}</h3>
                    <p className="text-sm text-muted-foreground italic mb-6">{vaidyaInsight.description}</p>
                    <button 
                      onClick={() => navigate('/remedies')}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all"
                    >
                       View Complete Remedy <ArrowRight className="h-4 w-4" />
                    </button>
                 </motion.div>
              )}

              {loading && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="flex gap-4"
                 >
                    <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                       <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div className="flex gap-1.5 items-center p-4 bg-white/[0.02] rounded-full">
                       <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                       <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                       <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             className="relative"
           >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Consult the Vaidya on herbs, cold, stress, or acidity..."
                className="w-full h-16 pl-6 pr-16 rounded-full bg-white/[0.04] border border-white/10 focus:border-primary/50 focus:bg-white/[0.06] transition-all outline-none text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 h-12 w-12 rounded-full bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                 <Send className="h-5 w-5" />
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
