"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Eye, 
  LayoutGrid, 
  List,
  Plus,
  ShieldCheck,
  Tag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { NewPlaybookModal } from "../../../../components/community/NewPlaybookModal";

const MOCK_PLAYBOOKS = [
  {
    id: "pb1",
    title: "The VWAP mean reversion framework for Nifty Intraday",
    author: "Vikas Mohata",
    type: "STRATEGY_FRAMEWORK",
    instruments: ["NIFTY", "BANKNIFTY"],
    timeframes: ["5m", "15m"],
    views: 1420,
    bookmarks: 450,
    tags: ["Intraday", "VWAP"]
  },
  {
    id: "pb2",
    title: "Managing emotional fatigue during drawdown cycles",
    author: "Stealth Phoenix",
    type: "PSYCHOLOGY",
    instruments: ["ALL"],
    timeframes: ["DAILY"],
    views: 840,
    bookmarks: 215,
    tags: ["Psychology", "Drawdown"]
  },
  {
    id: "pb3",
    title: "End-of-day journal automation workflow",
    author: "Patient Falcon",
    type: "WORKFLOW",
    instruments: ["EQ", "FNO"],
    timeframes: ["EOD"],
    views: 2100,
    bookmarks: 890,
    tags: ["Automation", "Process"]
  }
];

export default function PlaybookLibraryPage() {
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto pb-20">
      <NewPlaybookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
           console.log("Playbook published!");
        }}
      />
      
      {/* SEBI Compliance Disclaimer */}
      <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-2xl p-6 mb-12 relative overflow-hidden">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-black shadow-2xl">
                  <BookOpen size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Playbook Library</h1>
                  <p className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Open-Source Educational Trading Frameworks</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all">
                  My Bookmarks
               </button>
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="h-11 px-6 bg-white text-black text-xs font-black rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2"
               >
                  <Plus size={18} /> New Playbook
               </button>
            </div>
         </div>
         
         <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex items-center gap-4">
            <ShieldCheck size={16} className="text-brand-primary shrink-0" />
            <p className="text-[10px] font-black uppercase text-brand-primary/80 tracking-widest leading-relaxed">
               Playbooks describe trading frameworks for educational purposes only. Not investment advice. 
               TradeForge is NOT SEBI registered. Always consult a financial advisor.
            </p>
         </div>

         {/* Backdrop Glow */}
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              placeholder="Search by strategy, author, or tags..." 
              className="w-full pl-12 pr-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-brand-primary/50 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="h-14 px-6 bg-zinc-900 border border-white/5 rounded-2xl text-xs font-bold text-zinc-500 flex items-center gap-2 hover:text-white transition-colors">
               <Filter size={16} /> Type: Any
            </button>
            <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
               <button 
                 onClick={() => setViewMode("GRID")}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-zinc-800 text-brand-primary' : 'text-zinc-600 hover:text-white'}`}
               >
                  <LayoutGrid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode("LIST")}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-zinc-800 text-brand-primary' : 'text-zinc-600 hover:text-white'}`}
               >
                  <List size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Playbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {MOCK_PLAYBOOKS.map((pb) => (
           <Link key={pb.id} href={`/app/community/playbooks/${pb.id}`} className="group">
              <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col hover:border-brand-primary/30 transition-all hover:-translate-y-2 duration-500">
                 <div className="flex items-center justify-between mb-8">
                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                       {pb.type.replace('_', ' ')}
                    </span>
                    <button className="p-2 text-zinc-700 group-hover:text-brand-primary transition-colors">
                       <Bookmark size={16} />
                    </button>
                 </div>

                 <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                    {pb.title}
                 </h3>

                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500">
                       {pb.author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-zinc-400">{pb.author}</span>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-8">
                    {pb.tags.map(tag => (
                       <span key={tag} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                          #{tag}
                       </span>
                    ))}
                 </div>

                 <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
                          <Eye size={12} /> {pb.views}
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
                          <Bookmark size={12} /> {pb.bookmarks}
                       </div>
                    </div>
                    <ArrowRight size={16} className="text-zinc-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                 </div>
              </div>
           </Link>
         ))}
      </div>

    </div>
  );
}
