"use client";

import React, { useState } from "react";
import { 
  Brain, 
  CheckCircle2, 
  Target, 
  LineChart as LineChartIcon, 
  FlaskConical, 
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Activity,
  Bed,
  Zap,
  Clock,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { formatIndianCurrency } from "@thirdleaf/utils";

// Mock Data
const CORRELATION_DATA = [
  { sleep: 4, winRate: 35, pnl: -12500 },
  { sleep: 5, winRate: 42, pnl: -5000 },
  { sleep: 6, winRate: 58, pnl: 15400 },
  { sleep: 7, winRate: 65, pnl: 28000 },
  { sleep: 8, winRate: 68, pnl: 32000 },
];

const EMOTION_PNL = [
  { emotion: "CONFIDENT", avgPnl: 12500, color: "#10b981" },
  { emotion: "CALM", avgPnl: 8400, color: "#34d399" },
  { emotion: "FOMO", avgPnl: -15600, color: "#ef4444" },
  { emotion: "GREED", avgPnl: -12400, color: "#f87171" },
  { emotion: "REVENGE", avgPnl: -28400, color: "#b91c1c" },
];

export default function PsychologyLabPage() {
  const [activeTab, setActiveTab] = useState<"checkin" | "rules" | "correlations" | "experiments" | "coach">("checkin");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Psychology Lab</h1>
          <p className="text-zinc-500 mt-1">Behavioral indexing and cross-data correlation for psychological edge.</p>
        </div>
        <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-xl">
           {[
             { id: "checkin", icon: <Brain size={16} />, label: "Check-in" },
             { id: "rules", icon: <CheckCircle2 size={16} />, label: "Rules" },
             { id: "correlations", icon: <LineChartIcon size={16} />, label: "Correlations" },
             { id: "experiments", icon: <FlaskConical size={16} />, label: "Experiments" },
             { id: "coach", icon: <Sparkles size={16} />, label: "AI Coach" },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                 activeTab === tab.id ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
               }`}
             >
               {tab.icon}
               <span className="hidden sm:inline">{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      {activeTab === "checkin" && <CheckinTab />}
      {activeTab === "rules" && <RulesTab />}
      {activeTab === "correlations" && <CorrelationsTab />}
      {activeTab === "experiments" && <ExperimentsTab />}
      {activeTab === "coach" && <AiCoachTab />}
    </div>
  );
}

const CheckinTab = () => {
  const [scores, setScores] = useState({
    sleep: 7,
    sleepQuality: 3,
    stress: 2,
    physical: 4,
    mindset: 4,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
       <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#09090b] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <div>
                   <h2 className="text-2xl font-black text-white tracking-tight mb-2">Pre-Session Ritual</h2>
                   <p className="text-zinc-500 font-medium">Calibrate your mental state before engaging with the market.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                   <CheckinSlider label="Sleep Duration" value={scores.sleep} unit="hrs" icon={<Bed size={18} />} max={12} />
                   <CheckinSlider label="Sleep Quality" value={scores.sleepQuality} unit="/ 5" icon={<Zap size={18} />} />
                   <CheckinSlider label="Stress Level" value={scores.stress} unit="/ 5" icon={<AlertTriangle size={18} />} />
                   <CheckinSlider label="Mindset Score" value={scores.mindset} unit="/ 5" icon={<Smile size={18} />} />
                </div>

                <div className="pt-8 space-y-4">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block ml-1">Life Events / Context Today</label>
                   <textarea 
                     placeholder="Any friction at home? Market events keeping you on edge?"
                     className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all min-h-[120px] resize-none"
                   />
                </div>

                <button className="w-full py-5 bg-brand-primary text-black font-black rounded-[1.5rem] hover:scale-[0.99] transition-all shadow-xl shadow-brand-primary/20">
                   Check-in & Unlock Trading Dashboard
                </button>
             </div>
          </div>
       </div>

       <div className="space-y-8">
          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <Clock size={16} /> Ritual History
             </h3>
             <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                   <div 
                     key={i} 
                     className={`aspect-square rounded-sm border border-white/5 ${
                       i % 5 === 0 ? "bg-emerald-500/20" : i % 7 === 0 ? "bg-brand-primary/30" : "bg-zinc-950"
                     }`} 
                   />
                ))}
             </div>
             <p className="text-[10px] text-zinc-600 font-bold mt-4 uppercase text-center tracking-tighter">Consistency: 84% last 30 days</p>
          </div>
       </div>
    </div>
  );
};

const CheckinSlider = ({ label, value, unit, icon, max = 5 }: any) => (
  <div className="space-y-4">
     <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
           {icon} {label}
        </span>
        <span className="text-sm font-black text-white font-mono">{value} {unit}</span>
     </div>
     <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-brand-primary" style={{ width: `${(value/max)*100}%` }} />
        <input type="range" min="1" max={max} step="1" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
     </div>
  </div>
);

const RulesTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
     <div className="lg:col-span-2 space-y-6">
        <RuleCard title="Max 2 Losses Per Day" category="RISK" breaks={12} cost={24000} />
        <RuleCard title="No Trading Before 9:45 AM" category="ENTRY" breaks={4} cost={8500} />
        <RuleCard title="Stop Loss Must Be On System" category="RISK" breaks={2} cost={45000} />
        <RuleCard title="No Position Addition On Profit" category="SIZING" breaks={0} cost={0} />
     </div>
     <div className="space-y-6">
        <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] space-y-6">
           <h3 className="text-sm font-black text-white tracking-tight">Add New Process Rule</h3>
           <input placeholder="Rule Title" className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm" />
           <select className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500">
              <option>Risk Management</option>
              <option>Entry/Exit</option>
              <option>Position Sizing</option>
           </select>
           <button className="w-full py-3 bg-white text-black font-bold rounded-xl text-sm">Create Rule</button>
        </div>
     </div>
  </div>
);

const RuleCard = ({ title, category, breaks, cost }: any) => (
  <div className="bg-[#09090b] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all shadow-lg">
     <div className="flex items-center gap-6">
        <div className={`w-1 h-12 rounded-full ${category === 'RISK' ? 'bg-red-500' : 'bg-emerald-500'}`} />
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h4 className="text-base font-bold text-white group-hover:text-brand-primary transition-colors">{title}</h4>
              <span className="text-[9px] font-black bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{category}</span>
           </div>
           <p className="text-xs text-zinc-500">Estimated Total Cost of Breaks: <span className="text-red-400 font-bold font-mono">₹{cost.toLocaleString()}</span></p>
        </div>
     </div>
     <div className="text-right">
        <button className="px-5 py-2.5 bg-zinc-900 border border-white/5 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2">
           <AlertTriangle size={14} className="text-amber-500" />
           Log Break
        </button>
        <p className="text-[10px] text-zinc-600 font-bold mt-2 uppercase tracking-tighter">{breaks} Violations Total</p>
     </div>
  </div>
);

const CorrelationsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
     
     <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-black text-white tracking-tight">Sleep Quality vs Win Rate</h3>
           <TrendingUp className="text-emerald-500" size={20} />
        </div>
        <div className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CORRELATION_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                 <XAxis dataKey="sleep" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }}
                   itemStyle={{ color: "#c084fc", fontWeight: "bold" }}
                 />
                 <Line type="monotone" dataKey="winRate" stroke="#c084fc" strokeWidth={3} dot={{ r: 6, fill: "#c084fc" }} activeDot={{ r: 8 }} />
              </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
           <p className="text-xs text-emerald-400 font-medium leading-relaxed">
              <Sparkles size={14} className="inline mr-2 mb-1" />
              <strong>Insight:</strong> Your win rate improves by 30% when you sleep at least 7 hours. Discipline in bedtime is your biggest edge.
           </p>
        </div>
     </div>

     <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-black text-white tracking-tight">Emotion vs Avg P&L</h3>
           <Activity className="text-brand-primary" size={20} />
        </div>
        <div className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMOTION_PNL} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" stroke="#18181b" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="emotion" type="category" stroke="#52525b" fontSize={10} width={80} tickLine={false} axisLine={false} />
                 <Tooltip 
                   cursor={{ fill: "rgba(255,255,255,0.05)" }}
                   contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }}
                 />
                 <Bar dataKey="avgPnl" radius={[0, 4, 4, 0]}>
                    {EMOTION_PNL.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
           <p className="text-xs text-red-400 font-medium leading-relaxed">
              <Sparkles size={14} className="inline mr-2 mb-1" />
              <strong>Insight:</strong> Trades entered under "REVENGE" or "FOMO" have cost you ₹45,200 this month. Removing these entries would double your net P&L.
           </p>
        </div>
     </div>

  </div>
);

const ExperimentsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
     <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-brand-primary/30 transition-all transition-duration-500">
           <div className="flex items-start justify-between mb-6">
              <div>
                 <span className="text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm border border-brand-primary/10">Active Experiment</span>
                 <h3 className="text-2xl font-black text-white tracking-tight mt-3">Maximum 2 Trades Per Day</h3>
                 <p className="text-zinc-500 mt-2 text-sm leading-relaxed">Hypothesis: Limiting trade frequency will reduce overtrading and improve overall profitability by high-grading setups.</p>
              </div>
              <div className="text-right">
                 <p className="text-2xl font-black text-emerald-400">+₹15,400</p>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">P&L Delta</p>
              </div>
           </div>
           
           <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                 <span>Experiment Progress</span>
                 <span>12 / 30 Days</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-primary shadow-[0_0_10px_rgba(192,132,252,0.3)]" style={{ width: "40%" }} />
              </div>
              <div className="flex items-center justify-between gap-4">
                 <div className="flex -space-x-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                       <div key={i} className={`w-2.5 h-2.5 rounded-full border border-black ${i === 5 ? 'bg-red-500' : 'bg-emerald-500'}`} title={i === 5 ? 'Violation' : 'Complied'} />
                    ))}
                 </div>
                 <button className="h-10 px-6 bg-white text-black font-black rounded-xl text-xs hover:bg-zinc-200 transition-all">Today's Compliance Check</button>
              </div>
           </div>
        </div>
     </div>
     <div className="space-y-6">
        <div className="bg-zinc-900/40 border border-white/5 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
            <FlaskConical className="text-zinc-600 mb-4" size={32} />
            <h4 className="text-sm font-bold text-white mb-2">Ready to evolve?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-6">Design a structured experiment to test your hypotheses and break toxic trading loops.</p>
            <button className="h-12 px-8 bg-zinc-900 border border-white/5 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-2">
               <Plus size={18} /> Design Experiment
            </button>
        </div>
     </div>
  </div>
);

const AiCoachTab = () => (
   <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Latest Weekly Report */}
      <div className="bg-[#09090b] border border-brand-primary/20 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8">
            <Sparkles className="text-brand-primary/30" size={64} />
         </div>
         <div className="relative z-10 max-w-4xl space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sparkles size={28} className="text-brand-primary" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">AI Coaching Insight</h3>
                  <p className="text-sm text-zinc-500">Analysis for the week of April 7 - April 13, 2026</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(192,132,252,1)]" />
                     Key Observations
                  </h4>
                  <ul className="space-y-5">
                     {[
                       "Success in 'Nifty Expiry' setups remains correlated with high physical state scores.",
                       "Average rule break cost increased by 15% due to oversized positions on FOMO entries.",
                       "Late-night research sessions are consistently leading to poor morning mindset scores."
                     ].map((obs, i) => (
                        <li key={i} className="text-sm text-zinc-300 leading-relaxed flex gap-3">
                           <span className="text-brand-primary font-black">0{i+1}.</span>
                           {obs}
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="space-y-6">
                  <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                     <h4 className="text-xs font-black uppercase tracking-[0.1em] text-brand-primary">Single Most Impactful Improvement</h4>
                     <p className="text-sm text-zinc-300 leading-relaxed">Implement a hard 15-minute 'No Trade' window after the first loss of the day. This break is essential to reset your emotional baseline and avoid revenge trading patterns detected on Thursday and Friday.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                        <h4 className="text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest">Habit to Continue</h4>
                        <p className="text-[11px] text-zinc-400">Consistent tracking of 'MAE' and 'MFE' for every winning trade.</p>
                     </div>
                     <div className="flex-1 bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
                        <h4 className="text-[10px] font-black uppercase text-orange-500 mb-2 tracking-widest">Warning Pattern</h4>
                        <p className="text-[11px] text-zinc-400">Aggressive sizing increase on 3rd consecutive win of the day.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
               <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Powered by GPT-4o for TradeForge AI Coach v2.1</p>
               <button className="flex items-center gap-2 text-xs font-black text-brand-primary hover:text-white transition-colors group">
                  Archive History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3rem] text-center max-w-2xl mx-auto space-y-6">
         <Sparkles className="text-zinc-700 mx-auto" size={40} />
         <h3 className="text-xl font-bold text-white">Need a dynamic audit on a single trade?</h3>
         <p className="text-sm text-zinc-500">Gain deep clarity on whether you followed your process or simply got lucky. AI analysis combines your rules, notes, and biological state for a total process audit.</p>
         <button className="h-12 px-10 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-zinc-200 transition-all">
            Audit Recent Trade
         </button>
      </div>

   </div>
);
