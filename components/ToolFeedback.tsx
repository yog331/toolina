import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, MessageSquare, Mail, X, CheckCircle2, Loader2 } from 'lucide-react';
import { TOOLS } from '../constants';

const ToolFeedback: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Find if we are on a registered tool page
  const currentTool = TOOLS.find(t => t.path === pathname);

  // States
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasVotedToday, setHasVotedToday] = useState(false);

  // Check if user has already voted on this tool
  useEffect(() => {
    if (!currentTool) return;
    
    // Reset state for new tool page
    setVote(null);
    setIsSubmitted(false);
    setComments('');
    setEmail('');
    
    try {
      const saved = localStorage.getItem(`tool_feedback_voted_${currentTool.id}`);
      if (saved) {
        setHasVotedToday(true);
        // Load prior vote choice if stored
        setVote(saved as 'up' | 'down');
      } else {
        setHasVotedToday(false);
      }
    } catch (e) {
      setHasVotedToday(false);
    }
  }, [currentTool, pathname]);

  // If not on a tool page, render nothing
  if (!currentTool) return null;

  const submitFeedbackPayload = async (payload: {
    user: string;
    email: string;
    subject: string;
    message: string;
    type: 'bug' | 'feature' | 'general';
    status: string;
    date: string;
  }) => {
    try {
      const id = Date.now().toString();
      const newFeedback = {
        id,
        ...payload
      };

      // Fetch existing feedback first to prepend ours (per the existing API batch-insert requirement)
      const getResponse = await fetch('/api/feedback');
      let existingFeedback = [];
      if (getResponse.ok) {
        existingFeedback = await getResponse.json();
      }
      
      const updatedFeedback = [newFeedback, ...(Array.isArray(existingFeedback) ? existingFeedback : [])];

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeedback)
      });
      return true;
    } catch (err) {
      console.error('Failed to submit feedback to API:', err);
      return false;
    }
  };

  const handleVoteClick = async (type: 'up' | 'down') => {
    if (hasVotedToday) {
      // If already voted, just open the modal to let them update comments if they want
      setVote(type);
      setIsModalOpen(true);
      return;
    }

    setVote(type);
    setIsModalOpen(true);
    setHasVotedToday(true);

    try {
      localStorage.setItem(`tool_feedback_voted_${currentTool.id}`, type);
    } catch (e) {
      // ignore
    }

    // Submit initial vote immediately in the background
    const voteSubject = `Tool Rating: ${currentTool.name} - ${type === 'up' ? '👍 Useful' : '👎 Not Useful'}`;
    const voteMessage = `User rated the tool "${currentTool.name}" as ${type === 'up' ? 'USEFUL (👍)' : 'NOT USEFUL (👎)'} on path ${currentTool.path}.`;
    
    await submitFeedbackPayload({
      user: 'Anonymous Tool User',
      email: '',
      subject: voteSubject,
      message: voteMessage,
      type: type === 'down' ? 'bug' : 'general',
      status: 'new',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDetailedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const detailedSubject = `Tool Feedback Details: ${currentTool.name} (${vote === 'up' ? '👍 Useful' : '👎 Not Useful'})`;
    const detailedMessage = `Rating: ${vote === 'up' ? 'Useful (👍)' : 'Not Useful (👎)'}\n\nUser Message:\n${comments}\n\nTool URL: ${window.location.origin}${currentTool.path}`;

    const success = await submitFeedbackPayload({
      user: 'Anonymous Tool User',
      email: email.trim(),
      subject: detailedSubject,
      message: detailedMessage,
      type: vote === 'down' ? 'bug' : 'general',
      status: 'new',
      date: new Date().toISOString().split('T')[0]
    });

    setIsSubmitting(false);
    if (success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setComments('');
      }, 2500);
    } else {
      // Fallback on failure (e.g. offline)
      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-1 md:px-0 mt-8 mb-4" id="tool-feedback-container">
      {/* Horizontal Bar Widget */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-slate-300">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-slate-900 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            Was this tool useful?
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Your anonymous response helps us decide which tools to upgrade next.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasVotedToday ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
                {vote === 'up' ? (
                  <ThumbsUp className="w-3.5 h-3.5 text-teal-600 fill-teal-50" />
                ) : (
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-600 fill-rose-50" />
                )}
                Feedback recorded
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline px-3 py-2 cursor-pointer transition-colors"
              >
                Add details
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleVoteClick('up')}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-700 hover:text-teal-700 px-5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                title="Yes, this tool is useful"
                aria-label="Thumbs Up"
              >
                <ThumbsUp className="w-4 h-4 text-teal-600" />
                <span>Yes, highly useful</span>
              </button>

              <button
                onClick={() => handleVoteClick('down')}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700 hover:text-rose-700 px-5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                title="No, it could be better"
                aria-label="Thumbs Down"
              >
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span>Could be better</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Detailed Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            {/* Modal Overlay Close Trigger */}
            <div className="absolute inset-0 cursor-default" onClick={() => setIsModalOpen(false)} />

            {/* Modal Card Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-lg p-6 md:p-8 relative overflow-hidden z-[210] flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Close dialog"
                aria-label="Close feedback dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Submitted success state */}
              {isSubmitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-teal-600 animate-bounce" />
                  </div>
                  <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                    Thank you so much!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Your detailed feedback has been saved. We use comments to prioritize updates and fix any outstanding bugs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDetailedSubmit} className="space-y-5">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100/60 px-2.5 py-1 rounded-lg">
                      {vote === 'up' ? 'Thumbs Up' : 'Suggestions'}
                    </span>
                    <h3 className="font-display font-black text-xl text-slate-900 tracking-tight mt-2">
                      {vote === 'up' 
                        ? "What did you like about this tool?" 
                        : "How can we make this tool better?"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {vote === 'up'
                        ? "Tell us what features were most helpful or what we should add next."
                        : "Found a bug, wrong calculations, or need additional fields? Let us know!"}
                    </p>
                  </div>

                  {/* Feedback Message TextArea */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="feedback-comment" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Your Comments
                    </label>
                    <textarea
                      id="feedback-comment"
                      required
                      rows={4}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder={vote === 'up' 
                        ? "E.g. Love the fast interface, would be cool to support exporting as CSV..."
                        : "E.g. The calculations for HRA are off by 2% under the old scheme..."}
                      className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-[13px] font-medium placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-400 transition-all shadow-inner resize-none leading-relaxed"
                    />
                  </div>

                  {/* Optional Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="feedback-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-[10px] text-slate-400 font-normal lowercase italic">Optional</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        id="feedback-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com (so we can reply when fixed)"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[13px] font-medium placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-400 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-500 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-teal-600/10 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Submit Feedback</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="sm:px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolFeedback;
