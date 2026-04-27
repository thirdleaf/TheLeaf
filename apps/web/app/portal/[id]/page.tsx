"use client";

import React, { useState } from "react";
import { 
  Download, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Circle, 
  Send,
  Paperclip,
  ArrowLeft,
  Calendar,
  Layers,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useClientAuth } from "../layout";

// Mock Data
const MOCK_PROJECT = {
  id: "p1",
  title: "Zerodha ORB Bot",
  description: "Automated Opening Range Breakout bot with SL/TP management and Slack alerts.",
  status: "IN_PROGRESS",
  progress: 50,
  dueDate: "2026-04-20",
  milestones: [
    { title: "Requirement Gathering", completedAt: "2026-04-10" },
    { title: "Kite Connect Integration", completedAt: "2026-04-12" },
    { title: "Order Execution Logic", completedAt: null },
    { title: "Final UAT & Handover", completedAt: null },
  ],
  messages: [
    { sender: "Founder", content: "Hi! I've completed the API integration. Working on the order logic now.", time: "10:30 AM" },
    { sender: "Client", content: "Great! Can we add a feature to trail SL by 2%?", time: "11:15 AM" },
    { sender: "Founder", content: "Standard trailing SL is included in the base package. I'll configure it for you.", time: "11:45 AM" },
  ],
  files: [
    { name: "Requirements_Doc.pdf", size: "1.2 MB", date: "2026-04-10" },
    { name: "Integration_Log_v1.txt", size: "45 KB", date: "2026-04-12" },
  ],
  invoices: [
    { id: "INV-001", amount: 12500, status: "PAID", date: "2026-04-10" }
  ]
};

export default function ClientProjectDetailPage() {
  const [message, setMessage] = useState("");
  const { client } = useClientAuth();

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 pb-24">
      <div className="flex items-center gap-4">
         <Link href="/portal" className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
            <ArrowLeft size={20} />
         </Link>
         <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{MOCK_PROJECT.title}</h1>
            <p className="text-zinc-500 font-medium">Tracking development and deliverables for your automation.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* Main Track - 2 Cols */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Horizontal Stepper */}
            <div className="bg-[#09090b] border border-white/5 p-10 rounded-[2.5rem] shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-8">Build Timeline</h3>
               <div className="flex items-center justify-between relative px-4">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-zinc-900 -z-10" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1/2 h-0.5 bg-brand-primary -z-10" />
                  
                  <StepperStep label="Scoping" status="completed" />
                  <StepperStep label="Building" status="active" />
                  <StepperStep label="Review" status="pending" />
                  <StepperStep label="Delivered" status="pending" />
               </div>
            </div>

            {/* Messages Thread */}
            <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] flex flex-col h-[600px] shadow-xl overflow-hidden">
               <div className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-zinc-950">
                  <div className="flex items-center gap-3">
                     <MessageSquare size={18} className="text-brand-primary" />
                     <span className="text-sm font-bold text-white tracking-tight">Project Communication</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full">Secure Thread</span>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {MOCK_PROJECT.messages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.sender === 'Client' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] space-y-1 ${msg.sender === 'Client' ? 'text-right' : 'text-left'}`}>
                           <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                             msg.sender === 'Client' 
                             ? 'bg-brand-primary text-black font-medium' 
                             : 'bg-zinc-900 border border-white/5 text-zinc-200'
                           }`}>
                              {msg.content}
                           </div>
                           <p className="text-[10px] text-zinc-600 font-bold">{msg.time} • {msg.sender === 'Client' ? 'You' : 'Founder'}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-6 bg-zinc-950 border-t border-white/5">
                  <form className="relative" onSubmit={(e) => { e.preventDefault(); setMessage(""); }}>
                     <input 
                       className="w-full bg-[#09090b] border border-white/5 rounded-2xl pl-6 pr-24 py-5 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-zinc-700"
                       placeholder="Send a message or request a revision..."
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                     />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button type="button" className="p-2 text-zinc-500 hover:text-white transition-colors">
                           <Paperclip size={20} />
                        </button>
                        <button className="p-3 bg-brand-primary text-black rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                           <Send size={18} />
                        </button>
                     </div>
                  </form>
               </div>
            </div>

         </div>

         {/* Sidebar - 1 Col */}
         <div className="space-y-12">
            
            {/* Milestones Checkbox */}
            <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                  <Layers size={16} /> Development Log
               </h3>
               <div className="space-y-6">
                  {MOCK_PROJECT.milestones.map((m, i) => (
                     <div key={i} className="flex items-start gap-4">
                        {m.completedAt ? (
                           <CheckCircle2 size={20} className="text-brand-primary mt-1 shrink-0" />
                        ) : (
                           <Circle size={20} className="text-zinc-800 mt-1 shrink-0" />
                        )}
                        <div>
                           <p className={`text-sm font-bold ${m.completedAt ? 'text-white' : 'text-zinc-600'}`}>{m.title}</p>
                           {m.completedAt && <p className="text-[10px] text-zinc-500 font-medium">Completed on {m.completedAt}</p>}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Deliverable Files */}
            <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Deliverables</h3>
               <div className="space-y-4">
                  {MOCK_PROJECT.files.map((file, i) => (
                     <button key={i} className="w-full group">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl hover:border-brand-primary/30 transition-all">
                           <div className="flex items-center gap-3">
                              <FileText size={18} className="text-zinc-500 group-hover:text-brand-primary transition-colors" />
                              <div className="text-left">
                                 <p className="text-xs font-bold text-white truncate max-w-[120px]">{file.name}</p>
                                 <p className="text-[10px] text-zinc-600 font-medium">{file.size}</p>
                              </div>
                           </div>
                           <Download size={18} className="text-zinc-700 group-hover:text-white transition-colors" />
                        </div>
                     </button>
                  ))}
                  {MOCK_PROJECT.files.length === 0 && <p className="text-xs text-zinc-600 italic">No files available yet.</p>}
               </div>
            </div>

            {/* Invoices */}
            <div className="bg-[#09090b] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Financial Records</h3>
               <div className="space-y-3">
                  {MOCK_PROJECT.invoices.map(inv => (
                     <div key={inv.id} className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-between">
                        <div>
                           <p className="text-xs font-bold text-white">{inv.id}</p>
                           <p className="text-[10px] text-zinc-600">{inv.date}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black text-brand-primary mb-1">₹{inv.amount.toLocaleString()}</p>
                           <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{inv.status}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}

const StepperStep = ({ label, status }: { label: string, status: 'completed' | 'active' | 'pending' }) => (
  <div className="flex flex-col items-center gap-3">
     <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
       status === 'completed' ? 'bg-brand-primary border-brand-primary/20 text-black shadow-[0_0_15px_rgba(192,132,252,0.4)]' :
       status === 'active' ? 'bg-zinc-950 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(192,132,252,0.2)]' :
       'bg-zinc-950 border-zinc-900 text-zinc-800'
     }`}>
        {status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={20} />}
     </div>
     <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
       status === 'pending' ? 'text-zinc-800' : 'text-white'
     }`}>{label}</p>
  </div>
);
