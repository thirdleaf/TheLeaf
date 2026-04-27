"use client";

import React, { useState } from "react";
import { X, ShieldAlert, Tag, Send, Info } from "lucide-react";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewPostModal = ({ isOpen, onClose, onSuccess }: NewPostModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("INSIGHT");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          isAnonymous,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
           <div>
              <h2 className="text-xl font-bold text-white">Share Insight</h2>
              <p className="text-xs text-zinc-500 font-medium">Contribute to the collective wisdom.</p>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
           {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500 text-xs font-bold items-start">
                <ShieldAlert size={16} className="shrink-0" />
                {error}
             </div>
           )}

           <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                 {['INSIGHT', 'REVIEW', 'QUESTION', 'MILESTONE'].map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        type === t ? 'bg-brand-primary text-black' : 'bg-black text-zinc-500 border border-white/5'
                      }`}
                    >
                       {t}
                    </button>
                 ))}
              </div>

              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Hooky title for your post..."
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-brand-primary/50 transition-all"
              />

              <textarea 
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What happened? What did you learn? (Advisory language is strictly blocked)"
                className="w-full h-48 px-6 py-5 bg-black border border-white/5 rounded-2xl text-sm font-medium text-zinc-300 focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
              />

              <div className="flex items-center gap-4">
                 <div className="flex-1 relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="Tags (comma separated)"
                      className="w-full pl-11 pr-6 py-3.5 bg-black border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
                    />
                 </div>
                 <button 
                   type="button"
                   onClick={() => setIsAnonymous(!isAnonymous)}
                   className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                     isAnonymous ? 'bg-zinc-800 text-white border-white/10' : 'bg-black text-zinc-600 border-white/5'
                   }`}
                 >
                    {isAnonymous ? 'Anonymous: On' : 'Anonymous: Off'}
                 </button>
              </div>
           </div>

           <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 flex gap-3">
              <Info className="text-brand-primary shrink-0" size={16} />
              <p className="text-[10px] text-brand-primary/80 font-bold uppercase tracking-widest leading-relaxed">
                 SEBI COMPLIANCE: Posts containing buy/sell signals or guaranteed profit claims will be rejected by our automated filters.
              </p>
           </div>

           <button 
             disabled={isSubmitting}
             className="w-full py-5 bg-white text-black text-sm font-black rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
              {isSubmitting ? 'Validating...' : <><Send size={18} /> Publish Insight</>}
           </button>
        </form>
      </div>
    </div>
  );
};
