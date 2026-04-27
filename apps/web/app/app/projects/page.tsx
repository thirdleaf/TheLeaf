"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Calendar, 
  CreditCard,
  User,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

// Mock Data targeting visual excellence
const KANBAN_COLUMNS = [
  { id: "ENQUIRY", title: "Enquiry", color: "border-zinc-800" },
  { id: "SCOPING", title: "Scoping", color: "border-blue-500/30" },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-amber-500/30" },
  { id: "REVIEW", title: "Review", color: "border-purple-500/30" },
  { id: "DELIVERED", title: "Delivered", color: "border-emerald-500/30" },
];

const MOCK_PROJECTS = [
  {
    id: "p1",
    title: "Zerodha ORB Bot",
    client: "Ravi Kumar",
    type: "ALGO_STRATEGY",
    status: "IN_PROGRESS",
    quoted: 25000,
    paid: 12500,
    dueDate: "2026-04-20",
    milestones: { total: 4, completed: 2 },
  },
  {
    id: "p2",
    title: "Amibroker Scanner",
    client: "Priya Singh",
    type: "INDICATOR",
    status: "ENQUIRY",
    quoted: 15000,
    paid: 0,
    dueDate: "2026-04-25",
    milestones: { total: 2, completed: 0 },
  },
  {
    id: "p3",
    title: "PineScript V2 Migration",
    client: "Suresh Gupta",
    type: "CUSTOM",
    status: "REVIEW",
    quoted: 10000,
    paid: 10000,
    dueDate: "2026-04-18",
    milestones: { total: 3, completed: 3 },
  }
];

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Project Pipeline</h1>
          <p className="text-zinc-500 mt-1">Manage and deliver high-value tech automations to clients.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-xl">
             <button 
               onClick={() => setView("kanban")}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === "kanban" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
             >
               Kanban
             </button>
             <button 
               onClick={() => setView("table")}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === "table" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
             >
               List View
             </button>
          </div>
          <button className="h-10 px-6 bg-brand-primary text-black font-bold rounded-xl flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(192,132,252,0.3)]">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
           {KANBAN_COLUMNS.map(col => (
             <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${col.color.replace('border-', 'text-')}`} />
                      {col.title}
                   </h3>
                   <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">
                     {MOCK_PROJECTS.filter(p => p.status === col.id).length}
                   </span>
                </div>
                <div className={`min-h-[500px] bg-zinc-950/50 border-t-2 ${col.color} rounded-t-lg space-y-4 pt-4 pb-20`}>
                   {MOCK_PROJECTS.filter(p => p.status === col.id).map(project => (
                      <ProjectCard key={project.id} project={project} />
                   ))}
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
                <tr>
                   <th className="px-6 py-4">Client / Project</th>
                   <th className="px-6 py-4">Type</th>
                   <th className="px-6 py-4">Payment</th>
                   <th className="px-6 py-4">Timeline</th>
                   <th className="px-6 py-4">Progress</th>
                   <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {MOCK_PROJECTS.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-6 py-4">
                          <p className="font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{p.title}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1"><User size={12} /> {p.client}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded">{p.type}</span>
                       </td>
                       <td className="px-6 py-4">
                          <p className="font-mono text-xs font-bold text-white tracking-tight">₹{p.quoted.toLocaleString()}</p>
                          <p className={`text-[10px] font-bold ${p.paid === p.quoted ? 'text-emerald-500' : p.paid > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                             {p.paid === p.quoted ? 'Paid' : p.paid > 0 ? 'Partial' : 'Unpaid'}
                          </p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-medium text-zinc-300 flex items-center gap-1"><Calendar size={12}/> {p.dueDate}</p>
                       </td>
                       <td className="px-6 py-4 w-40">
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full bg-brand-primary" style={{ width: `${(p.milestones.completed / p.milestones.total) * 100}%` }} />
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Link href={`/app/projects/${p.id}`} className="p-2 text-zinc-500 hover:text-white transition-colors inline-block">
                             <ChevronRight size={20} />
                          </Link>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
}

const ProjectCard = ({ project }: { project: any }) => {
  const progress = (project.milestones.completed / project.milestones.total) * 100;
  return (
    <Link 
      href={`/app/projects/${project.id}`}
      className="block group mx-2"
    >
      <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 hover:border-brand-primary/30 hover:scale-[1.02] transition-all duration-300 shadow-lg">
        <div className="flex items-start justify-between mb-4">
           <div className="flex-1 min-w-0">
             <h4 className="text-sm font-bold text-white truncate mb-1 group-hover:text-brand-primary transition-colors">{project.title}</h4>
             <p className="text-xs text-zinc-500">{project.client}</p>
           </div>
           <button className="text-zinc-600 hover:text-white transition-colors">
              <MoreVertical size={16} />
           </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
           <span className="text-[9px] font-bold bg-zinc-900 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest">{project.type}</span>
           <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
             project.paid === project.quoted ? 'bg-emerald-500/10 text-emerald-500' : project.paid > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
           }`}>
             ₹{project.paid === project.quoted ? 'Paid' : 'Due'}
           </span>
        </div>

        <div className="space-y-3 pt-3 border-t border-white/5">
           <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-zinc-500 uppercase tracking-tighter">Progress</span>
              <span className="text-zinc-300">{project.milestones.completed}/{project.milestones.total} Milestones</span>
           </div>
           <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary" style={{ width: `${progress}%` }} />
           </div>
           <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-zinc-500 font-bold">
                 <Calendar size={12} />
                 <span>{project.dueDate}</span>
              </div>
              <div className="flex items-center -space-x-1">
                 <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-[8px] font-black text-black">V</div>
              </div>
           </div>
        </div>
      </div>
    </Link>
  );
};
