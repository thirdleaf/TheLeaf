"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  History, 
  Terminal, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from "lucide-react";

const UPDATES = [
  {
    version: "v1.2.0",
    date: "April 18, 2026",
    tag: "Hardening",
    title: "Analytics Engine v2 & Vertical Alignment",
    changes: [
      "Completed full vertical sync between trade logic and frontend dashboards.",
      "New MAE/MFE Scatter matrix with D3.js integration.",
      "Implemented Sharpe Ratio, Win Rate, and Profit Factor aggregators.",
      "Integrated Psychology module correlations into the Journaling hub."
    ],
    icon: Cpu
  },
  {
    version: "v1.1.5",
    date: "April 10, 2026",
    tag: "Integration",
    title: "DhanHQ Multi-Broker Support",
    changes: [
      "Added official support for DhanHQ API v2.",
      "Reduced broker sync latency to <500ms.",
      "Auto-lot normalization for Nifty Option strikes.",
      "Fixed custom brokerage decimal precision bug."
    ],
    icon: Zap
  },
  {
    version: "v1.0.0",
    date: "March 15, 2026",
    tag: "Release",
    title: "ThirdLeaf Genesis Release",
    changes: [
      "Initial launch of India's professional trading journal.",
      "Core journaling for NSE Equity and Derivatives.",
      "Basic PnL tracking and setups tagging.",
      "Secure Clerk-managed authentication."
    ],
    icon: History
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="mb-20 text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Terminal size={14} />
              Build History
           </div>
           <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
             Moving fast. <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Engineering first.</span>
           </h1>
           <p className="text-zinc-500 text-lg">
             A record of every major update pushed to the ThirdLeaf platform.
           </p>
        </div>

        <div className="space-y-12">
           {UPDATES.map((update) => (
             <section key={update.version} className="relative group p-1">
                <div className="flex gap-8 lg:gap-16">
                   <div className="hidden lg:block w-32 pt-2">
                      <div className="sticky top-40">
                         <p className="text-lg font-black text-white">{update.version}</p>
                         <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{update.date}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[40px] p-8 lg:p-12 group-hover:bg-zinc-900 transition-all group-hover:border-indigo-500/20">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
                               <update.icon size={22} />
                            </div>
                            <div className="lg:hidden">
                               <p className="text-xs font-black text-white">{update.version}</p>
                               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{update.date}</p>
                            </div>
                         </div>
                         <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-white/5">
                            {update.tag}
                         </span>
                      </div>
                      
                      <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white group-hover:text-indigo-400 transition-colors">
                        {update.title}
                      </h2>
                      
                      <ul className="space-y-4">
                         {update.changes.map((change, i) => (
                           <li key={i} className="flex gap-3 text-zinc-500 text-sm lg:text-base leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                              {change}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
             </section>
           ))}
        </div>

        {/* Suggestion CTA */}
        <div className="mt-32 p-12 bg-emerald-500/5 border border-emerald-500/10 rounded-[48px] text-center space-y-6">
           <Zap className="mx-auto text-emerald-500" size={32} />
           <h3 className="text-2xl font-black">Want to see the live status?</h3>
           <p className="text-zinc-500">Our system health dashboard tracks every broker connector in real-time.</p>
           <button className="btn btn-primary px-8">System Status Hub</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
