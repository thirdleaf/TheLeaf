"use client";

import React from "react";
import { 
  Briefcase, 
  Clock, 
  FileCheck, 
  ChevronRight, 
  Mail, 
  Bell,
  CheckCircle2,
  Circle
} from "lucide-react";
import Link from "next/link";
import { useClientAuth } from "./layout";

// Mock Data for Client
const MOCK_CLIENT_PROJECTS = [
  {
    id: "p1",
    title: "Zerodha ORB Bot",
    status: "BUILDING", // Mapping projectStatusEnum to client-friendly terms
    lastUpdate: "2 hours ago",
    unreadMessages: 2,
    progress: 50,
    dueDate: "2026-04-20"
  }
];

export default function PortalDashboard() {
  const { client } = useClientAuth();

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome back, {client?.name?.split(' ')[0]}</h1>
            <p className="text-zinc-500 font-medium">You have {MOCK_CLIENT_PROJECTS.length} active project in development.</p>
         </div>
         <button className="relative p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all group">
            <Bell size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-black" />
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
               <FileCheck className="text-emerald-500" size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Delivered Tools</p>
               <h3 className="text-3xl font-black text-white">04</h3>
            </div>
         </div>
         <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 shadow-sm">
            <div className="p-3 bg-brand-primary/10 rounded-2xl w-fit">
               <Clock className="text-brand-primary" size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">In Development</p>
               <h3 className="text-3xl font-black text-white">01</h3>
            </div>
         </div>
         <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2rem] space-y-4 shadow-sm">
            <div className="p-3 bg-amber-500/10 rounded-2xl w-fit">
               <Mail className="text-amber-500" size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Unread Updates</p>
               <h3 className="text-3xl font-black text-white">02</h3>
            </div>
         </div>
      </div>

      <div className="space-y-6">
         <h2 className="text-xl font-black text-white">Active Deliverables</h2>
         <div className="space-y-4">
            {MOCK_CLIENT_PROJECTS.map(project => (
               <Link 
                 key={project.id} 
                 href={`/portal/${project.id}`}
                 className="block group"
               >
                  <div className="bg-[#09090b] border border-white/5 hover:border-brand-primary/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-300 shadow-xl group-hover:scale-[1.01]">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-3xl flex items-center justify-center text-brand-primary shadow-inner">
                           <Briefcase size={28} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{project.title}</h3>
                              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-emerald-500/10">Active</span>
                           </div>
                           <p className="text-sm text-zinc-500 font-medium">Last update: {project.lastUpdate}</p>
                        </div>
                     </div>

                     <div className="flex-1 max-w-xs space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                           <span>Build Progress</span>
                           <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-brand-primary shadow-[0_0_10px_rgba(192,132,252,0.3)] transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                        </div>
                     </div>

                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Current State</p>
                           <p className="text-sm font-bold text-white uppercase tracking-tight">{project.status}</p>
                        </div>
                        <div className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>

      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">Need a custom feature?</h3>
            <p className="text-zinc-600 font-medium max-w-md">Request new script components or modification to existing templates directly within the project thread.</p>
         </div>
         <button className="h-14 px-10 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-xl whitespace-nowrap">
            Message Founder
         </button>
      </div>

    </div>
  );
}
