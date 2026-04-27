"use client";

import React from "react";
import { 
  CreditCard, 
  Check, 
  ChevronLeft, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Solo",
    price: "₹0",
    desc: "Perfect for beginners starting their journal journey.",
    features: [
      "100 Trade Logs / Mo",
      "Basic Analytics",
      "Manual Journaling",
      "Community Access"
    ],
    active: false,
  },
  {
    name: "Elite",
    price: "₹1,499",
    subprice: "/mo",
    desc: "For serious quants and full-time professional traders.",
    features: [
      "Unlimited Broker Syncs",
      "Advanced Risk Engine",
      "AI Trade Psychology Coach",
      "Custom Signal Webhooks",
      "Priority API Access"
    ],
    active: true,
    highlight: true,
  }
];

export default function BillingPage() {
  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/app/settings" 
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Billing & Plans</h1>
          <p className="text-sm text-zinc-500">Manage your subscription and invoicing details.</p>
        </div>
      </div>

      {/* Active Plan Card */}
      <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Active Subscription
              </div>
              <div className="flex items-center gap-1 text-indigo-200 text-xs font-bold">
                <Clock size={12} /> Renews in 12 days
              </div>
            </div>
            <h2 className="text-5xl font-black tracking-tighter">Elite Plan</h2>
            <p className="text-indigo-100 max-w-sm font-medium">
              You are currently on our top-tier plan with all advanced trading features unlocked.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:bg-zinc-100 transition-all shadow-xl flex items-center gap-2 justify-center">
                Manage Billing <CreditCard size={18} />
             </button>
             <button className="px-8 py-4 bg-white/10 text-white border border-white/10 backdrop-blur-md font-black rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 justify-center">
                Switch Plan
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Comparison Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white px-2">Compare Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLANS.map((plan, i) => (
              <div key={i} className={`p-8 rounded-[32px] border ${plan.active ? "bg-zinc-900 border-indigo-500/30" : "bg-zinc-900/40 border-white/5"} relative overflow-hidden group transition-all hover:border-white/20`}>
                {plan.active && (
                  <div className="absolute top-5 right-5 text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                    Current
                  </div>
                )}
                <div className="text-zinc-500 mb-6 font-black uppercase tracking-widest text-[10px]">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 font-bold text-sm">{plan.subprice}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium">{plan.desc}</p>
                
                <ul className="space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-zinc-400">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.active ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800 text-zinc-600"}`}>
                        <Check size={12} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] space-y-6">
             <h3 className="text-white font-bold">Why Elite?</h3>
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
                      <Zap size={20} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white">Auto Sync</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Direct integration with Zerodha, Dhan & more.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white">Advanced Risk</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">Real-time drawdown and margin alerts.</p>
                   </div>
                </div>
             </div>
             <button className="w-full py-4 border border-zinc-800 text-zinc-400 font-bold text-sm rounded-2xl hover:bg-zinc-800/50 hover:text-white transition-all flex items-center justify-center gap-2">
                Invoicing History <ArrowUpRight size={14} />
             </button>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/5 border border-amber-500/10 p-8 rounded-[32px] relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
                <Trophy size={32} className="text-amber-500 mb-4" />
                <h4 className="text-white font-bold">Trading Challenges</h4>
                <p className="text-zinc-500 text-xs mt-1">Get 1 Month Free by passing our verification test.</p>
                <div className="mt-4 text-[10px] font-black text-amber-500 flex items-center gap-2">
                   LEARN MORE <ExternalLink size={10} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
