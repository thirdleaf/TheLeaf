"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Layers,
  Zap,
  Shield
} from "lucide-react";

const ROADMAP_ITEMS = [
  {
    status: "Completed",
    title: "Multi-Broker Sync Engine",
    date: "Q1 2026",
    description: "Support for Zerodha, Dhan, Fyers, and Upstox via official APIs.",
    features: ["OAuth Flow", "Historical Sync", "Auto-Token Refresh"],
    icon: Zap,
    color: "emerald"
  },
  {
    status: "In Progress",
    title: "AI Trade Coach",
    date: "Q2 2026",
    description: "Personalized insights based on your behavioral streaks and MAE/MFE data.",
    features: ["Risk Alert System", "Motive Analysis", "Equity Forecasting"],
    icon: Rocket,
    color: "indigo"
  },
  {
    status: "Planned",
    title: "Options backtesting 2.0",
    date: "Q3 2026",
    description: "Simulate multi-leg option strategies on historical tick data for NSE instruments.",
    features: ["Greeks Simulation", "Portfolio Margin Check", "Exit Rule Testing"],
    icon: Layers,
    color: "amber"
  },
  {
    status: "Planned",
    title: "Institutional Prop Support",
    date: "Q4 2026",
    description: "Dedicated dashboards for proprietary trading firms to monitor multiple sub-accounts.",
    features: ["Team Risk Limits", "Auto-Payout Tracking", "Compliance Auditing"],
    icon: Shield,
    color: "zinc"
  }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <main className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto mb-20 space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Rocket size={14} />
              Product Velocity
           </div>
           <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-[0.9]">
             The path to <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Institutional Tech.</span>
           </h1>
           <p className="text-text-muted text-lg max-w-xl mx-auto">
             Transparency is our core value. Here is where we&apos;ve been and where we&apos;re heading.
           </p>
        </div>

        <div className="max-w-5xl mx-auto relative px-4">
           {/* Vertical Line */}
           <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

           <div className="space-y-16">
              {ROADMAP_ITEMS.map((item, i) => {
                const isEven = i % 2 === 0;
                const Icon = item.icon;
                
                return (
                  <div key={item.title} className="relative group">
                     {/* Dot */}
                     <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 bg-bg border-2 border-accent rounded-full z-20 hidden md:block" />
                     
                     <div className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                           <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
                             item.status === 'Completed' ? 'text-emerald-400' : 
                             item.status === 'In Progress' ? 'text-accent' : 'text-text-disabled'
                           }`}>
                              {item.status === 'Completed' ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                              <span>{item.status}</span>
                              <span className="mx-2 text-border">•</span>
                              <span>{item.date}</span>
                           </div>
                           <h2 className="text-2xl lg:text-3xl font-black text-text-primary group-hover:text-accent transition-colors">
                             {item.title}
                           </h2>
                           <p className="text-text-muted leading-relaxed text-sm lg:text-base">
                             {item.description}
                           </p>
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                              {item.features.map(f => (
                                <span key={f} className="text-[10px] font-bold text-text-disabled border border-border px-2 py-1 rounded-md bg-surface-2/40">
                                  {f}
                                </span>
                              ))}
                           </div>
                        </div>

                        <div className="w-full md:w-1/2 flex items-center justify-center">
                           <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-[40px] bg-surface-2/40 border border-border flex items-center justify-center group-hover:bg-surface-2 transition-all relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <Icon size={48} className="text-text-disabled group-hover:text-accent transition-all group-hover:scale-110" />
                           </div>
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Suggestion CTA */}
        <div className="mt-32 max-w-2xl mx-auto p-12 bg-surface-2/40 border border-border rounded-[48px] space-y-6">
           <h3 className="text-2xl font-black text-text-primary">Missing a feature?</h3>
           <p className="text-text-muted">Most of our roadmap is driven by user feedback. Tell us what you need for your trading journal.</p>
           <button className="btn btn-secondary px-8">Submit Feedback</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
