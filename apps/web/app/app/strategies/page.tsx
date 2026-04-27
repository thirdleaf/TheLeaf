"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, List, TrendingUp, TrendingDown, Target, Activity, ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";
import { formatPnL, formatIndianCurrency } from "@thirdleaf/utils";

// Mock Data targeting visual checklist
const MOCK_STRATEGIES = [
  {
    id: "s1",
    name: "H4 Liquidity Sweep",
    status: "ACTIVE",
    version: "v1.2",
    tradesCount: 45,
    winRate: 64.5,
    profitFactor: 2.1,
    netPnl: 45000 * 100,
    health: "green", // green | yellow | red
  },
  {
    id: "s2",
    name: "Mean Reversion OB",
    status: "ACTIVE",
    version: "v1.0",
    tradesCount: 22,
    winRate: 48.0,
    profitFactor: 1.4,
    netPnl: -5000 * 100,
    health: "yellow",
  },
  {
    id: "s3",
    name: "Trend Exhaustion V2",
    status: "PAUSED",
    version: "v2.1",
    tradesCount: 89,
    winRate: 42.1,
    profitFactor: 0.8,
    netPnl: -12000 * 100,
    health: "red",
  }
];

export default function StrategiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Strategies</h1>
          <p className="text-zinc-500 mt-1">Manage, version, and monitor your edge performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-lg">
            <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-all ${view === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-400"}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-md transition-all ${view === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-400"}`}>
              <List size={18} />
            </button>
          </div>
          <button className="bg-brand-primary text-black font-bold h-10 px-6 rounded-lg hover:bg-brand-primary/90 flex items-center gap-2 transition-all">
            <Plus size={18} /> New Strategy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STRATEGIES.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}

const StrategyCard = ({ strategy }: { strategy: any }) => {
  const pnl = formatPnL(strategy.netPnl);
  
  const healthColors: any = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    yellow: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <Link 
      href={`/app/strategies/${strategy.id}`}
      className="bg-[#09090b] border border-white/5 rounded-2xl p-6 hover:border-brand-primary/30 transition-all group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">{strategy.name}</h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono uppercase">{strategy.version}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${strategy.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"}`}>
              {strategy.status}
            </span>
          </div>
        </div>
        <div className={`p-2 rounded-lg border ${healthColors[strategy.health]}`}>
          {strategy.health === "green" ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 px-1">Win Rate</p>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
            <span className="text-lg font-bold text-white font-mono">{strategy.winRate}%</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 px-1">Profit Factor</p>
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5">
            <span className="text-lg font-bold text-white font-mono">{strategy.profitFactor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total Trades</span>
          <span className="text-sm font-bold text-white font-mono">{strategy.tradesCount}</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Net P&L</span>
          <span className={`text-sm font-bold font-mono ${pnl.colorClass === "success" ? "text-emerald-400" : "text-red-400"}`}>
            {pnl.formatted}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <ChevronRight size={18} className="text-brand-primary" />
      </div>
    </Link>
  );
};
