"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Settings, 
  History, 
  BarChart2, 
  AlertTriangle, 
  FileText, 
  Info, 
  Activity,
  CheckCircle2,
  Bed,
  Zap,
  Clock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatPnL, formatIndianCurrency } from "@thirdleaf/utils";

// Mock Data
const MOCK_STRATEGY = {
  id: "s1",
  name: "H4 Liquidity Sweep",
  version: "v1.2",
  status: "ACTIVE",
  description: "Advanced ICT/SMC setup targeting premium/discount liquidity sweeps on H4 timeframe with M1 execution.",
  instruments: ["BANKNIFTY", "NIFTY", "RELIANCE"],
  timeframes: ["H4", "M15", "M1"],
  backtestSummary: {
    metrics: {
      totalReturn: 280,
      winRate: 58.2,
      profitFactor: 2.4,
      maxDD: -12.5,
      sharpe: 1.8
    }
  },
  liveMetrics: {
    totalReturn: 145,
    winRate: 64.5,
    profitFactor: 2.1,
    maxDD: -8.2,
    sharpe: 2.1
  },
  entryConditions: "1. H4 Liquidity Sweep\n2. M15 MSS\n3. M1 FVG Entry",
  exitConditions: "1. Opposing liquidity reach\n2. 5-min structure break"
};

const MOCK_EQUITY_COMPARISON = Array.from({ length: 20 }).map((_, i) => ({
  index: i,
  backtest: 1000 + (i * 150) + (Math.random() * 200),
  live: 1000 + (i * 120) + (Math.random() * 300),
}));

export default function StrategyDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "RULES" | "PERFORMANCE" | "VERSIONS" | "DEVIATIONS">("OVERVIEW");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/app/strategies" className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{MOCK_STRATEGY.name}</h1>
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold border border-brand-primary/20">
                {MOCK_STRATEGY.version}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium font-mono">
              <span className="flex items-center gap-1"><Clock size={12} /> Last updated: 2 days ago</span>
              <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> Live Tracking Enabled</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-white/5 text-sm font-bold text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Settings size={18} /> Edit parameters
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-8 border-b border-white/5 overflow-x-auto custom-scrollbar">
        {[
          { id: "OVERVIEW", label: "Overview", icon: Info },
          { id: "RULES", label: "Logic & Rules", icon: FileText },
          { id: "PERFORMANCE", label: "Performance", icon: BarChart2 },
          { id: "VERSIONS", label: "Version History", icon: History },
          { id: "DEVIATIONS", label: "Reality Check", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? "text-brand-primary border-brand-primary" 
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="min-h-[600px] animate-in fade-in duration-500">
        {activeTab === "OVERVIEW" && <OverviewTab />}
        {activeTab === "RULES" && <RulesTab />}
        {activeTab === "DEVIATIONS" && <DeviationsTab />}
      </div>
    </div>
  );
}

const OverviewTab = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Comparison Cards */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={120} />
          </div>
          <h3 className="text-xl font-bold text-white mb-8">Performance Benchmark</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatComparison label="Win Rate" bt={MOCK_STRATEGY.backtestSummary.metrics.winRate} live={MOCK_STRATEGY.liveMetrics.winRate} suffix="%" />
            <StatComparison label="Profit Factor" bt={MOCK_STRATEGY.backtestSummary.metrics.profitFactor} live={MOCK_STRATEGY.liveMetrics.profitFactor} />
            <StatComparison label="Max DD" bt={MOCK_STRATEGY.backtestSummary.metrics.maxDD} live={MOCK_STRATEGY.liveMetrics.maxDD} suffix="%" inverse />
            <StatComparison label="Sharpe" bt={MOCK_STRATEGY.backtestSummary.metrics.sharpe} live={MOCK_STRATEGY.liveMetrics.sharpe} />
          </div>
        </div>

        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Equity Tracking: Backtest vs Live</h3>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_EQUITY_COMPARISON}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis hide />
                <YAxis stroke="#ffffff40" fontSize={11} tickFormatter={(v) => `₹${(v/100).toFixed(1)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="backtest" stroke="#3f3f46" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Expected (BT)" />
                <Line type="monotone" dataKey="live" stroke="#5f2dec" strokeWidth={4} dot={false} name="Actual (Live)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Metadata</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-600 mb-1">Description</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{MOCK_STRATEGY.description}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-600 mb-1">Timeframes</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_STRATEGY.timeframes.map(tf => <span key={tf} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold">{tf}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatComparison = ({ label, bt, live, suffix = "", inverse = false }: any) => {
  const delta = live - bt;
  const isGood = inverse ? delta <= 0 : delta >= 0;
  return (
    <div>
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-mono">{live}{suffix}</span>
          <span className={`text-xs font-bold font-mono ${isGood ? "text-emerald-500" : "text-red-500"}`}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}{suffix}
          </span>
        </div>
        <span className="text-[10px] text-zinc-600 font-medium">Expected: {bt}{suffix}</span>
      </div>
    </div>
  );
};

const RulesTab = () => (
  <div className="max-w-4xl space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RuleCard title="Entry Conditions" content={MOCK_STRATEGY.entryConditions || "1. H4 Liquidity Sweep\n2. M15 MSS\n3. M1 FVG Entry"} />
      <RuleCard title="Exit Conditions" content={MOCK_STRATEGY.exitConditions || "1. Opposing liquidity reach\n2. 5-min structure break"} />
    </div>
  </div>
);

const RuleCard = ({ title, content }: any) => (
  <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
      {title}
    </h3>
    <pre className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
  </div>
);

const DeviationsTab = () => (
  <div className="space-y-6">
    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-4">
      <AlertTriangle className="text-orange-500 shrink-0" size={24} />
      <div>
        <h4 className="text-base font-bold text-orange-400">High Variance Detected</h4>
        <p className="text-sm text-orange-300/80">Your live win rate is 8% higher than backtest metrics, but your Profit Factor is 15% lower. This usually indicates leaving profits on the table too early.</p>
      </div>
    </div>

    <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
          <tr>
            <th className="px-6 py-4">Deviation Type</th>
            <th className="px-6 py-4 text-right">Occurrence</th>
            <th className="px-6 py-4 text-right">Avg. Cost</th>
            <th className="px-6 py-4 text-right">Total Impact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-bold text-white">Early Entry (FOMO)</td>
            <td className="px-6 py-4 text-right font-mono">12</td>
            <td className="px-6 py-4 text-right font-mono text-red-400">-₹1,250</td>
            <td className="px-6 py-4 text-right font-mono text-red-500">-₹15,000</td>
          </tr>
          <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-bold text-white">Moved Stoploss</td>
            <td className="px-6 py-4 text-right font-mono">5</td>
            <td className="px-6 py-4 text-right font-mono text-red-400">-₹2,800</td>
            <td className="px-6 py-4 text-right font-mono text-red-500">-₹14,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
