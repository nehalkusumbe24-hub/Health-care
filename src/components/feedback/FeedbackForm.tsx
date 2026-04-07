import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Leaf, Send, MessageSquare, Check, X } from 'lucide-react';
import { api } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FeedbackForm({ onSuccess, onCancel }: FeedbackFormProps) {
  const { profile } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setSubmitting(true);
    try {
      await api.feedback.create({
        user_id: profile.id,
        user_name: profile.full_name || 'Seeker',
        rating,
        comment,
        helpful_count: 0,
        created_at: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success('Thank you for sharing your healing journey! 🌿');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto animate-lotus">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-serif italic text-primary">Namaste!</h3>
          <p className="text-muted-foreground font-medium">Your wisdom has been received by the sanctuary.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-[2.5rem] vedic-card border-white/5 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Leaf className="h-24 w-24 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Share Your Experience</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Community Healing</p>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-muted-foreground/80">How refined is your balance today?</p>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className="group relative"
              >
                <Leaf 
                  className={cn(
                    "h-10 w-10 transition-all duration-300 transform group-hover:scale-125",
                    val <= rating ? "text-primary fill-primary/20" : "text-white/10"
                  )}
                />
                {val <= rating && (
                  <motion.div 
                    layoutId="leaf-glow"
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground/80 block">Share your testimonial</label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How have these remedies helped you? Your words inspire others..."
            className="w-full min-h-[120px] p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 focus:border-primary/50 focus:bg-white/[0.05] transition-all outline-none text-sm font-medium leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-vedic py-5 rounded-full flex items-center justify-center gap-3 text-lg font-bold lush-glow disabled:opacity-50"
        >
          {submitting ? 'Transmitting Wisdom...' : (
            <>
              Send Feedback <Send className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
