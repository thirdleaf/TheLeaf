"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  ArrowBigUp, 
  ShieldAlert, 
  Tag, 
  MoreHorizontal, 
  Plus, 
  Trophy,
  Users,
  Search,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { NewPostModal } from "../../../components/community/NewPostModal";

const MOCK_POSTS = [
  {
    id: "p1",
    author: "Patient Falcon #4251",
    isAnonymous: true,
    title: "How I handled today's NIFTY volatility with zero rule breaks",
    content: "Maintained discipline even when my setup was tested early in the session...",
    type: "INSIGHT",
    tags: ["Nifty", "Discipline"],
    upvotes: 42,
    replies: 12,
    time: "2h ago"
  },
  {
    id: "p2",
    author: "Vikas Mohata",
    isAnonymous: false,
    title: "Question: Scaling position size after a winning streak?",
    content: "Is it better to stay static or use a graduated increase based on equity curves?",
    type: "QUESTION",
    tags: ["Sizing", "Psychology"],
    upvotes: 28,
    replies: 15,
    time: "5h ago"
  },
  {
    id: "p3",
    author: "Stealth Phoenix #9102",
    isAnonymous: true,
    title: "Milestone: 30 days of 100% rule compliance reached!",
    content: "This journey has completely changed my perspective on probability and risk management...",
    type: "MILESTONE",
    tags: ["Milestone", "Growth"],
    upvotes: 115,
    replies: 45,
    time: "1d ago"
  }
];

export default function CommunityPage() {
  const [activeType, setActiveType] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto pb-20">
      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
           // Would normally refetch feed
           console.log("Post published!");
        }}
      />
      
      {/* SEBI Compliance Disclaimer */}
      <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-2xl p-4 mb-10 flex items-center gap-4">
         <ShieldAlert className="text-brand-primary shrink-0" size={24} />
         <div className="text-[10px] font-black uppercase text-brand-primary tracking-widest leading-relaxed">
            TradeForge Community is for educational discussion only. Posts do not constitute investment advice. 
            Never trade based on community content. We DO NOT provide buy/sell signals or guaranteed returns.
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar - Navigation */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 px-2">Feed Filter</h3>
              <nav className="space-y-1">
                {['ALL', 'INSIGHTS', 'REVIEWS', 'QUESTIONS', 'MILESTONES'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeType === type ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </nav>
           </div>

           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 px-2">Knowledge Core</h3>
              <Link href="/app/community/playbooks" className="flex items-center justify-between p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl group hover:border-brand-primary/40 transition-all">
                 <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-brand-primary" />
                    <span className="text-xs font-black uppercase text-white">Playbook Library</span>
                 </div>
                 <ArrowBigUp className="rotate-90 text-brand-primary group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
           </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
           {/* New Post Trigger */}
           <div 
             onClick={() => setIsModalOpen(true)}
             className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:border-white/10 transition-all group cursor-pointer"
           >
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-brand-primary">V</div>
              <button className="flex-1 text-left px-5 py-3 bg-black border border-white/5 rounded-2xl text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                 Share a trading insight or milestone...
              </button>
              <button className="h-10 w-10 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
                 <Plus size={20} />
              </button>
           </div>

           {/* Post Cards */}
           {MOCK_POSTS.map(post => (
             <div key={post.id} className="bg-[#09090b] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all group">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-xs font-black ${post.isAnonymous ? 'bg-zinc-900 text-zinc-600' : 'bg-brand-primary text-black'}`}>
                         {post.author.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-xs font-black text-white leading-tight">{post.author}</h4>
                         <p className="text-[10px] font-bold text-zinc-500">{post.time} • <span className="text-brand-primary/80">{post.type}</span></p>
                      </div>
                   </div>
                   <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                   </button>
                </div>

                <Link href={`/app/community/posts/${post.id}`} className="block group/content">
                   <h2 className="text-lg font-bold text-white mb-3 group-hover/content:text-brand-primary transition-colors tracking-tight">{post.title}</h2>
                   <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{post.content}</p>
                </Link>

                <div className="flex flex-wrap gap-2 mt-6">
                   {post.tags.map(tag => (
                     <span key={tag} className="px-2.5 py-1 bg-zinc-950 border border-white/5 rounded-lg text-[10px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1.5">
                        <Tag size={10} /> {tag}
                     </span>
                   ))}
                </div>

                <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/5">
                   <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                      <ArrowBigUp size={18} className="hover:text-emerald-500 transition-colors" /> {post.upvotes}
                   </button>
                   <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                      <MessageSquare size={16} /> {post.replies}
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Right Sidebar - Gamification / Leaderboard */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Discipline Hall</h3>
                 <Trophy size={16} className="text-amber-500" />
              </div>
              
              <div className="space-y-6">
                 {[
                   { name: "Stealth Phoenix", score: 98, streak: 14, rank: 1 },
                   { name: "Patient Falcon", score: 95, streak: 30, rank: 2 },
                   { name: "Vikas Mohata", score: 92, streak: 8, rank: 3 },
                   { name: "Global Trader", score: 88, streak: 3, rank: 4 },
                 ].map((trader) => (
                    <div key={trader.name} className={`flex items-center justify-between p-3 rounded-2xl ${trader.rank === 1 ? 'bg-amber-500/5 border border-amber-500/10' : ''}`}>
                       <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black w-4 ${trader.rank === 1 ? 'text-amber-500' : 'text-zinc-700'}`}>{trader.rank}</span>
                          <div>
                             <p className="text-xs font-bold text-white truncate max-w-[100px]">{trader.name}</p>
                             <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-600 uppercase">
                                <span className="text-brand-primary">Score: {trader.score}</span>
                                <span>•</span>
                                <span>Streak: {trader.streak}d</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 <p className="text-[10px] font-black text-zinc-700 uppercase leading-relaxed uppercase tracking-widest">
                    Ranked by discipline score (journaling & consistency), not profits.
                 </p>
              </div>
           </div>

           <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-2xl">
                 <Users size={24} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Invite Colleagues</h4>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">Trading is a lonely pursuit. Bring your accountability partners.</p>
              <button className="w-full py-3.5 bg-white text-black text-xs font-black rounded-xl hover:scale-[1.02] transition-transform">
                 Generate Invite Link
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
