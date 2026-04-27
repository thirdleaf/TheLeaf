"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  Lock, 
  Copy, 
  Check, 
  Zap,
  ArrowRight,
  Code2
} from "lucide-react";
import Link from "next/link";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/analytics/overview",
    title: "Performance Overview",
    description: "Retrieve high-level statistics like Win Rate, Profit Factor, and Sharpe Ratio.",
    params: ["timeframe (string - optional)"]
  },
  {
    method: "POST",
    path: "/api/journal/sync",
    title: "Manual Trade Sync",
    description: "Trigger a manual synchronization for a specific broker connection.",
    params: ["connectionId (string)"]
  },
  {
    method: "GET",
    path: "/api/trades",
    title: "List Recent Trades",
    description: "Paginated list of historical trade logs with MAE/MFE details.",
    params: ["page (number)", "limit (number)"]
  }
];

export default function ApiDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pt-10 lg:pt-0">
      {/* Header */}
      <div className="space-y-6">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
          <Terminal size={24} />
        </div>
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
          API <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Reference.</span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Build institution-grade extensions on top of ThirdLeaf&apos;s high-bandwidth journaling engine. Our REST API provides programmatic access to your analytics and trade logs.
        </p>
      </div>

      {/* Auth Section */}
      <section className="space-y-10 pt-10 border-t border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl flex items-center justify-center">
               <Lock size={20} />
            </div>
            <h2 className="text-3xl font-black leading-none">Authentication</h2>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
               <p className="text-zinc-500 leading-relaxed text-sm">
                 ThirdLeaf uses JWT-based authentication via Clerk. All requests must include a Bearer token in the header.
               </p>
               <div className="flex flex-col gap-4">
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
                     <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap size={14} />
                     </div>
                     <p className="text-[11px] text-zinc-500">Rotate your production API keys in your dashboard settings.</p>
                  </div>
               </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
               <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Header Definition</span>
                  <Code2 size={16} className="text-zinc-600" />
               </div>
               <div className="p-8 group relative">
                  <pre className="font-mono text-xs text-indigo-300 leading-relaxed">
                    {`Authorization: Bearer <clerk_token_here>\nContent-Type: application/json`}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard("Authorization: Bearer <clerk_token_here>", "auth")}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                  >
                    {copiedId === 'auth' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-zinc-500" />}
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Endpoints List */}
      <section className="space-y-10">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl flex items-center justify-center">
               <Terminal size={20} />
            </div>
            <h2 className="text-3xl font-black leading-none">Main Hub</h2>
         </div>

         <div className="space-y-6">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="group p-10 bg-zinc-900/10 border border-white/5 rounded-[48px] hover:border-emerald-500/20 transition-all">
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${ep.method === 'GET' ? 'bg-emerald-500' : 'bg-indigo-500'} text-white`}>
                            {ep.method}
                          </span>
                          <code className="text-zinc-400 text-sm font-bold tracking-tight">{ep.path}</code>
                       </div>
                       <h3 className="text-2xl font-black text-white">{ep.title}</h3>
                       <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{ep.description}</p>
                    </div>

                    <div className="w-full lg:w-auto">
                       <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">Parameters</p>
                       <div className="flex flex-wrap gap-2">
                          {ep.params.map(p => (
                            <span key={p} className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-xs text-zinc-500 font-mono">
                              {p}
                            </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
