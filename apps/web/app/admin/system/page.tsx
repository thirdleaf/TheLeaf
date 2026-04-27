"use client";

import React from "react";
import { 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Globe,
  HardDrive
} from "lucide-react";

export default function AdminSystemPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Infrastructure</h1>
          <p className="text-zinc-500 font-medium">Real-time health monitoring of queues, databases, and API services.</p>
        </div>
        <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black uppercase text-white tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2">
           <RefreshCw size={14} /> Force Refresh
        </button>
      </div>

      {/* Core Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <ServiceCard 
           name="Primary DB (Neon)" 
           status="HEALTHY" 
           latency="42ms" 
           load="12%" 
           icon={<Database size={24} className="text-emerald-500" />} 
           statusColor="text-emerald-500"
         />
         <ServiceCard 
           name="Cache (Upstash)" 
           status="HEALTHY" 
           latency="8ms" 
           load="5%" 
           icon={<Zap size={24} className="text-emerald-500" />} 
           statusColor="text-emerald-500"
         />
         <ServiceCard 
           name="API (Railway)" 
           status="DEGRADED" 
           latency="210ms" 
           load="88%" 
           icon={<Globe size={24} className="text-amber-500" />} 
           statusColor="text-amber-500"
         />
         <ServiceCard 
           name="Worker (BullMQ)" 
           status="HEALTHY" 
           latency="-" 
           load="24 active" 
           icon={<Cpu size={24} className="text-emerald-500" />} 
           statusColor="text-emerald-500"
         />
      </div>

      {/* Queue Management */}
      <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center">
                  <Activity className="text-zinc-500" size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white">Active Job Queues</h3>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Background Worker Distribution</p>
               </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-xl hover:bg-brand-primary/10 transition-all">
               Retry All Failed
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <QueueItem name="broker-sync" waiting={0} active={0} completed={142} failed={2} />
            <QueueItem name="ai-analytics-weekly" waiting={12} active={1} completed={2400} failed={12} />
            <QueueItem name="email-notifications" waiting={0} active={0} completed={856} failed={0} />
            <QueueItem name="rule-engine-check" waiting={0} active={5} completed={10240} failed={45} />
            <QueueItem name="image-processing" waiting={0} active={0} completed={312} failed={0} />
            <QueueItem name="backup-rotation" waiting={1} active={0} completed={14} failed={0} />
         </div>
      </div>

      {/* API Metrics Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
            <h3 className="text-lg font-bold text-white mb-8">API Request Load (Last 60m)</h3>
            <div className="h-[200px] flex items-end gap-1 px-4">
               {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-brand-primary/20 rounded-t-sm hover:bg-brand-primary/50 transition-colors cursor-help"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
               ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-700">
               <span>60 mins ago</span>
               <span>Now (1.2k req/min)</span>
            </div>
         </div>
         <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-10">
            <h3 className="text-lg font-bold text-white mb-6">Database Storage</h3>
            <div className="space-y-8">
               <StorageItem label="Row Count" current="4.2M" limit="10M" percent={42} />
               <StorageItem label="Storage Size" current="4.2 GB" limit="10 GB" percent={42} />
               <StorageItem label="Active Connections" current="12" limit="100" percent={12} />
            </div>
         </div>
      </div>

    </div>
  );
}

const ServiceCard = ({ name, status, latency, load, icon, statusColor }: any) => (
  <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900 transition-all">
     <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 bg-[#09090b] border border-white/5 rounded-2xl flex items-center justify-center">
           {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${statusColor}`}>
           <div className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'HEALTHY' ? '' : 'animate-pulse'}`} />
           {status}
        </div>
     </div>
     <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">{name}</h4>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Latency</p>
              <p className="text-xs font-bold text-zinc-300 font-mono">{latency}</p>
           </div>
           <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Load/Active</p>
              <p className="text-xs font-bold text-zinc-300 font-mono">{load}</p>
           </div>
        </div>
     </div>
  </div>
);

const QueueItem = ({ name, waiting, active, completed, failed }: any) => (
  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-brand-primary/20 transition-all">
     <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-3">{name}</h4>
     <div className="grid grid-cols-2 gap-y-4">
        <div className="text-center border-r border-white/5">
           <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Waiting</p>
           <p className={`text-sm font-black font-mono ${waiting > 0 ? 'text-amber-500' : 'text-zinc-500'}`}>{waiting}</p>
        </div>
        <div className="text-center">
           <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Active</p>
           <p className={`text-sm font-black font-mono ${active > 0 ? 'text-brand-primary' : 'text-zinc-500'}`}>{active}</p>
        </div>
        <div className="text-center border-r border-white/5">
           <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Comp Today</p>
           <p className="text-sm font-black font-mono text-emerald-500">{completed}</p>
        </div>
        <div className="text-center">
           <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Fail Today</p>
           <p className={`text-sm font-black font-mono ${failed > 0 ? 'text-red-500' : 'text-zinc-500'}`}>{failed}</p>
        </div>
     </div>
  </div>
);

const StorageItem = ({ label, current, limit, percent }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[11px] font-bold">
        <span className="text-zinc-500">{label}</span>
        <span className="text-white">{current} <span className="text-zinc-700">/ {limit}</span></span>
     </div>
     <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${percent}%` }} />
     </div>
  </div>
);
