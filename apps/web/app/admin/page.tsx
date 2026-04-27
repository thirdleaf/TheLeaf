"use client";

import React from "react";
import { 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

const MOCK_REVENUE = [
  { month: 'Jan', mrr: 12000, churn: 400 },
  { month: 'Feb', mrr: 15000, churn: 200 },
  { month: 'Mar', mrr: 19000, churn: 500 },
  { month: 'Apr', mrr: 24000, churn: 300 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Main Command</h1>
          <p className="text-zinc-500 font-medium">Real-time platform metrics and financial oversight.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black uppercase text-zinc-500 tracking-widest">
           <Clock size={12} /> Last Data Update: 14s ago
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <AdminKPI title="Estimated MRR" value="₹2.45L" trend="+18%" trendUp={true} icon={<CreditCard className="text-emerald-500" />} />
         <AdminKPI title="Active Traders" value="1,420" trend="+12%" trendUp={true} icon={<Users className="text-brand-primary" />} />
         <AdminKPI title="Avg Order/User" value="14.2" trend="-2%" trendUp={false} icon={<Activity className="text-amber-500" />} />
         <AdminKPI title="System Uptime" value="99.98%" trend="Stable" trendUp={true} icon={<ShieldCheck className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* MRR Growth Chart */}
         <div className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold text-white">Revenue Velocity</h3>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Monthly Recurring Revenue (INR)</p>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">View Report →</button>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_REVENUE}>
                     <defs>
                        <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="month" stroke="#ffffff20" fontSize={11} axisLine={false} tickLine={false} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff1a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="mrr" stroke="#c084fc" strokeWidth={3} fill="url(#mrrGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Critical Alerts */}
         <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
            <h3 className="text-xl font-bold text-white mb-8">System Alerts</h3>
            <div className="space-y-6">
               <AlertItem 
                 type="WARNING" 
                 title="Broker API Latency" 
                 desc="Zerodha API responding slower than 500ms for 12% of users."
               />
               <AlertItem 
                 type="ERROR" 
                 title="Redis Memory Peak" 
                 desc="Eviction happening on Upstash. Consider plan upgrade."
               />
               <AlertItem 
                 type="INFO" 
                 title="New Feature Adoption" 
                 desc="65% of Quant users have set up live broker connections."
               />
            </div>
         </div>

      </div>

      {/* Recent Audit View */}
      <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
         <h3 className="text-xl font-bold text-white mb-8">Live Audit Stream</h3>
         <div className="space-y-4">
            {[
               { a: "IMPERSONATE", u: "Vikas Mohata", t: "2 mins ago", b: "Founder Admin" },
               { a: "PLAN_UPGRADE", u: "Aarav S.", t: "14 mins ago", b: "System" },
               { a: "SUSPEND", u: "Ishaan Singh", t: "1 hour ago", b: "Founder Admin" },
               { a: "CAPITAL_ADDITION", u: "Prop Account", t: "3 hours ago", b: "System" },
            ].map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="text-[10px] font-black uppercase px-2 py-1 bg-zinc-800 rounded-md text-zinc-400 tracking-wider">
                        {log.a}
                     </div>
                     <p className="text-sm font-bold text-white">{log.u}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-zinc-500">{log.t}</p>
                     <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{log.b}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}

const AdminKPI = ({ title, value, trend, trendUp, icon }: any) => (
  <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
     <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{title}</h3>
        {icon}
     </div>
     <div className="text-3xl font-black text-white tracking-tighter mb-2">{value}</div>
     <div className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
     </div>
  </div>
);

const AlertItem = ({ type, title, desc }: any) => (
  <div className="flex gap-4">
     <div className={`w-1 h-12 rounded-full shrink-0 ${
       type === 'ERROR' ? 'bg-red-500' : type === 'WARNING' ? 'bg-amber-500' : 'bg-brand-primary'
     }`} />
     <div>
        <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
     </div>
  </div>
);
