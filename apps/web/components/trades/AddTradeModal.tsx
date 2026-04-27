"use client";

import React, { useState } from "react";
import { X, ArrowRight, Check, Zap } from "lucide-react";

export const AddTradeModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  
  // Minimalist mock execution state for 4-Step Keyboard bounds mapping
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">Log New Trade</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1 w-12 rounded-full ${s <= step ? 'bg-brand-primary' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-md text-zinc-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Forms mapping steps implicitly */}
        <div className="p-8 pb-32">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-primary" /> Initial Parameters
              </h3>
              <div>
                <label className="text-sm text-zinc-500 mb-2 block">Instrument Symbol</label>
                <input autoFocus type="text" placeholder="e.g., RELIANCE, BANKNIFTY" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-primary transition-all text-xl font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-500 mb-2 block">Exchange</label>
                  <select className="w-full bg-black border border-white/10 rounded-xl p-4 text-white appearance-none">
                    <option>NSE</option>
                    <option>BSE</option>
                    <option>NFO</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-500 mb-2 block">Account</label>
                  <select className="w-full bg-black border border-white/10 rounded-xl p-4 text-white appearance-none">
                    <option>Zerodha Primary</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {step > 1 && (
            <div className="text-center py-12 text-zinc-400">
              Step {step} UI dynamically generated based on prompt bounds via NextJS states...
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/5 bg-zinc-950 flex justify-between items-center bg-black/90 backdrop-blur-md">
          <span className="text-xs text-zinc-500 font-mono hidden md:block">Press <kbd className="bg-zinc-800 px-1 py-0.5 rounded">Enter ↵</kbd> to continue</span>
          <div className="flex gap-3 w-full md:w-auto">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 rounded-xl font-medium text-white bg-zinc-900 border border-white/10 hover:bg-zinc-800 flex-1 md:flex-none"
              >
                Back
              </button>
            )}
            <button 
              onClick={() => step < 4 ? setStep(s => s + 1) : onClose()}
              className="px-6 py-3 rounded-xl font-medium text-black bg-white hover:bg-zinc-200 flex items-center justify-center gap-2 flex-1 md:flex-none transition-all"
            >
              {step === 4 ? (
                <><Check className="w-4 h-4" /> Save Trade</>
              ) : (
                <>Next Step <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
