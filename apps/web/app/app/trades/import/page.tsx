"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle2, ChevronRight } from "lucide-react";

type ImportStep = "BROKER" | "INSTRUCTIONS" | "UPLOAD" | "PREVIEW" | "CONFIRM";

export default function ImportTradesPage() {
  const [step, setStep] = useState<ImportStep>("BROKER");
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const brokers = [
    { id: "ZERODHA", name: "Zerodha", color: "text-blue-400", border: "hover:border-blue-500/50" },
    { id: "ANGELONE", name: "AngelOne", color: "text-orange-400", border: "hover:border-orange-500/50" },
    { id: "UPSTOX", name: "Upstox", color: "text-purple-400", border: "hover:border-purple-500/50" },
    { id: "FYERS", name: "Fyers", color: "text-cyan-400", border: "hover:border-cyan-500/50" },
    { id: "DHAN", name: "Dhan", color: "text-green-400", border: "hover:border-green-500/50" },
    { id: "GROWW", name: "Groww", color: "text-emerald-400", border: "hover:border-emerald-500/50" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Header */}
      <div className="mb-8">
        <Link href="/app/trades" className="text-zinc-400 hover:text-white flex items-center gap-2 mb-4 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Trades
        </Link>
        <h1 className="text-3xl font-bold font-heading text-white">Import Trades</h1>
        <p className="text-zinc-500 mt-2">Bulk upload your historical executions through CSV mapping.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
        {["Broker", "Instructions", "Upload", "Preview", "Confirm"].map((label, idx, arr) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              idx === ["BROKER", "INSTRUCTIONS", "UPLOAD", "PREVIEW", "CONFIRM"].indexOf(step) 
                ? "bg-brand-primary text-black" 
                : idx < ["BROKER", "INSTRUCTIONS", "UPLOAD", "PREVIEW", "CONFIRM"].indexOf(step) 
                  ? "bg-zinc-800 text-white" 
                  : "bg-zinc-900/50 text-zinc-600 border border-white/5"
            }`}>
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs">{idx + 1}</span>
              {label}
            </div>
            {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: BROKER SELECTION */}
      {step === "BROKER" && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-xl font-semibold text-white mb-6">Select your Broker</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {brokers.map((broker) => (
              <button
                key={broker.id}
                onClick={() => {
                  setSelectedBroker(broker.id);
                  setStep("INSTRUCTIONS");
                }}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-zinc-900/50 border border-white/5 transition-all ${broker.border} group`}
              >
                <div className={`w-12 h-12 rounded-full bg-black flex items-center justify-center font-bold text-xl ${broker.color} group-hover:scale-110 transition-transform`}>
                  {broker.name.charAt(0)}
                </div>
                <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">{broker.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: INSTRUCTIONS */}
      {step === "INSTRUCTIONS" && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileSpreadsheet className="text-brand-primary" /> How to export from {brokers.find(b => b.id === selectedBroker)?.name}
            </h2>
            <ol className="space-y-4 text-zinc-400 list-decimal pl-5 marker:text-zinc-600">
              <li className="pl-2">Log in to your backoffice console.</li>
              <li className="pl-2">Navigate to the <strong>Reports</strong> &gt; <strong>Tradebook</strong> section.</li>
              <li className="pl-2">Select the date range for your underlying imports.</li>
              <li className="pl-2">Ensure the format is explicitly set to <strong>CSV</strong> or Excel Workbook.</li>
              <li className="pl-2">Click Download Report.</li>
            </ol>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
              <button 
                onClick={() => setStep("BROKER")}
                className="px-6 py-2 rounded-lg font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => setStep("UPLOAD")}
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                I have my CSV <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD */}
      {step === "UPLOAD" && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl">
          <div 
            className="border-2 border-dashed border-white/10 hover:border-brand-primary/50 bg-zinc-900/30 rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
            onClick={() => {
              // Mock transitioning to preview directly since browser file systems shouldn't buffer natively inside prompts without logic handling boundaries
              setStep("PREVIEW");
            }}
          >
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Click or drag CSV here</h3>
            <p className="text-zinc-500 text-sm max-w-[250px]">Accepts raw {brokers.find(b => b.id === selectedBroker)?.name} tradebook files up to 10MB.</p>
          </div>
          <div className="mt-6 flex justify-start">
            <button 
              onClick={() => setStep("INSTRUCTIONS")}
              className="px-6 py-2 rounded-lg font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 & 5 Mock Views... */}
      {step === "PREVIEW" && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">14 Trades mapped successfully</h2>
              <p className="text-zinc-400 mb-6">We grouped 28 order execution legs into 14 distinct complete trades.</p>
              
              <div className="flex justify-center gap-4">
                <button onClick={() => setStep("UPLOAD")} className="px-6 py-2 rounded-lg font-medium hover:bg-white/5 text-zinc-300 transition-colors">Cancel</button>
                <button onClick={() => setStep("CONFIRM")} className="px-6 py-2 rounded-lg font-semibold bg-emerald-500 text-emerald-950 hover:bg-emerald-400 transition-colors">Confirm Import</button>
              </div>
           </div>
        </div>
      )}

      {step === "CONFIRM" && (
        <div className="animate-in zoom-in-95 duration-500">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto">
             <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10 text-brand-primary" />
             </div>
             <h2 className="text-2xl font-bold font-heading text-white mb-2">Import Complete!</h2>
             <p className="text-zinc-400 mb-8">All your trades have been logged and your analytics snapshots are queuing to update.</p>
             <Link href="/app/trades" className="px-8 py-3 rounded-xl font-semibold bg-white text-black hover:bg-zinc-200 transition-colors inline-block">
               Go to Dashboard
             </Link>
          </div>
        </div>
      )}

    </div>
  );
}
