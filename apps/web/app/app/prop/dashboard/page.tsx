"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Coins, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from "lucide-react";
import { formatIndianCurrency } from "@thirdleaf/utils";

// Mock Prop Data
const MOCK_PROP_EQUITY = Array.from({ length: 30 }).map((_, i) => ({
  date: `2026-04-${(i + 1).toString().padStart(2, '0')}`,
  equity: 5000000 + (Math.sin(i / 5) * 200000) + (i * 50000),
}));

export default function PropDashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      
      {/* Admin Notice Bar */}
      <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-4 flex items-center gap-4">
         <ShieldCheck className="text-brand-primary shrink-0" size={20} />
         <p className="text-xs font-bold text-white/80">
            <span className="text-brand-primary uppercase mr-2 font-black">Admin Mode:</span>
            This dashboard is scoped strictly to your personal prop trading capital. This data is isolated and never visible to clients.
         </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Prop Capital Engine</h1>
          <p className="text-zinc-500 mt-1">Founders personal trading overhead and performance benchmarks.</p>
        </div>
        <div className="flex items-center gap-3">
           <select className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-brand-primary/50 transition-all">
              <option>Main Prop Account (Equity)</option>
              <option>F&O Speculative Account</option>
           </select>
           <button className="h-10 px-6 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-200 transition-all">
              Add Capital
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <PropKPI 
           title="Total Capital" 
           value={formatIndianCurrency(5000000)} 
           subtext="Original: ₹45L" 
           trend="+11.1%" 
           trendUp={true}
           icon={<Coins className="text-brand-primary" />}
         />
         <PropKPI 
           title="Today's P&L" 
           value={formatIndianCurrency(124500)} 
           subtext="Realized: ₹98k" 
           trend="+2.4%" 
           trendUp={true}
           icon={<Activity className="text-emerald-500" />}
         />
         <PropKPI 
           title="MTD Returns" 
           value={formatIndianCurrency(458000)} 
           subtext="Target: ₹5L" 
           trend="+9.2%" 
           trendUp={true}
           icon={<TrendingUp className="text-brand-primary" />}
         />
         <PropKPI 
           title="All-Time ROI" 
           value="124.5%" 
           subtext="Since Jan 2025" 
           trend="+14% YoY" 
           trendUp={true}
           icon={<Activity className="text-zinc-500" />}
         />
      </div>

      {/* Main Equity View */}
      <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
         <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
               <h2 className="text-2xl font-bold text-white mb-2">Personal Equity Growth</h2>
               <p className="text-sm text-zinc-500">Compounded return including capital additions/withdrawals.</p>
            </div>
            <div className="flex bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl p-1">
              {['30D', '90D', 'YTD', 'ALL'].map((opt, i) => (
                 <button key={opt} className={`px-5 py-2 rounded-lg ${i===2 ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>{opt}</button>
              ))}
            </div>
         </div>

         <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={MOCK_PROP_EQUITY}>
                  <defs>
                     <linearGradient id="propEquityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickFormatter={(val) => `${val/100000}L`} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff1a', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(val: any) => formatIndianCurrency(val)}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#c084fc" strokeWidth={4} fill="url(#propEquityGradient)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         {/* Backdrop Glow */}
         <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-white">Benchmark vs NIFTY 50</h3>
               <Info size={16} className="text-zinc-600" />
            </div>
            <div className="space-y-6">
               <BenchmarkRow label="TradeForge Prop" value="+4.2%" color="bg-brand-primary" width="100%" />
               <BenchmarkRow label="NIFTY 50" value="+1.8%" color="bg-zinc-700" width="42%" />
               <BenchmarkRow label="BANK NIFTY" value="-0.4%" color="bg-red-500/50" width="10%" />
            </div>
            <p className="text-[10px] text-zinc-600 mt-10 font-bold uppercase tracking-widest leading-relaxed">
               Prop performance is currently outperforming primary benchmarks by 234 basis points this month.
            </p>
         </div>

         <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 mb-6">
               <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk Efficiency</h3>
            <p className="text-sm text-zinc-500 max-w-xs mb-8">Your current Sharpe Ratio is 1.84 with an Average Win/Loss of 2.15.</p>
            <Link href="/app/prop/analytics" className="text-xs font-black uppercase text-brand-primary tracking-widest hover:underline">
               Detailed Stats Export →
            </Link>
         </div>
      </div>

    </div>
  );
}

const PropKPI = ({ title, value, subtext, trend, trendUp, icon }: any) => (
  <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all group">
     <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform">
           {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
           {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
        </div>
     </div>
     <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">{title}</h3>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        <p className="text-xs font-bold text-zinc-500">{subtext}</p>
     </div>
  </div>
);

const BenchmarkRow = ({ label, value, color, width }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between text-xs font-bold">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white">{value}</span>
     </div>
     <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700 ease-out`} style={{ width }} />
     </div>
  </div>
);

import Link from "next/link";
