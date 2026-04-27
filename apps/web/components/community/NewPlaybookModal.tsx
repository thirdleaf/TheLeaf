"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Tag, Send, AlertTriangle, BookOpen } from "lucide-react";

interface NewPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewPlaybookModal = ({ isOpen, onClose, onSuccess }: NewPlaybookModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "STRATEGY_FRAMEWORK",
    content: "",
    instruments: "",
    timeframes: "",
    tags: "",
    isAnonymous: false,
    disclaimer: "EDUCATIONAL PURPOSES ONLY: This trading framework is for educational discussion and does not constitute financial advice. No guarantees of profit are made. TradeForge is NOT SEBI registered."
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/community/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          instruments: formData.instruments.split(",").map(t => t.trim()).filter(Boolean),
          timeframes: formData.timeframes.split(",").map(t => t.trim()).filter(Boolean),
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to publish playbook");
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
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                 <BookOpen size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white">Share Playbook</h2>
                 <p className="text-xs text-zinc-500 font-medium">Step {step} of 2</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
           {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500 text-xs font-bold items-start leading-relaxed uppercase tracking-widest">
                <AlertTriangle size={16} className="shrink-0" />
                {error}
             </div>
           )}

           {step === 1 ? (
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Framework Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full px-6 py-3.5 bg-black border border-white/5 rounded-2xl text-xs font-bold text-white"
                    >
                      <option value="STRATEGY_FRAMEWORK">Strategy Framework</option>
                      <option value="RISK_APPROACH">Risk Approach</option>
                      <option value="PSYCHOLOGY">Psychology Guide</option>
                      <option value="WORKFLOW">Process Workflow</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Instruments</label>
                    <input 
                      value={formData.instruments}
                      onChange={e => setFormData({...formData, instruments: e.target.value})}
                      placeholder="Nifty, F&O, Equity..."
                      className="w-full px-6 py-3.5 bg-black border border-white/5 rounded-2xl text-xs font-bold text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Playbook Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Clear, descriptive title..."
                    className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl text-sm font-bold text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Short Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="How does this playbook help other traders?"
                    className="w-full h-24 px-6 py-4 bg-black border border-white/5 rounded-2xl text-sm font-medium text-zinc-400 resize-none"
                  />
                </div>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Content (Markdown/Text)</label>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Step-by-step framework details..."
                    className="w-full h-64 px-6 py-5 bg-black border border-white/5 rounded-2xl text-sm font-medium text-zinc-200 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Mandatory Disclaimer</label>
                  <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-[10px] font-bold text-orange-200/60 leading-relaxed italic">
                    {formData.disclaimer}
                  </div>
                </div>
             </div>
           )}

           <div className="flex gap-4">
              {step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-14 px-8 bg-zinc-800 text-white text-xs font-black rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Back
                </button>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-5 bg-white text-black text-sm font-black rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2"
              >
                 {isSubmitting ? 'Publishing...' : step === 1 ? 'Next Step' : <><Send size={18} /> Publish Playbook</>}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};
