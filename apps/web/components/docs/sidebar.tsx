"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, 
  Book, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layers 
} from "lucide-react";

export const DOCS_SECTIONS = [
  {
    title: "Introduction",
    items: [
      { id: "overview", title: "Platform Overview", href: "/docs", icon: Book },
      { id: "getting-started", title: "Getting Started", href: "/docs#getting-started", icon: Zap }
    ]
  },
  {
    title: "Reference",
    items: [
      { id: "api-ref", title: "API Reference", href: "/docs/api", icon: Terminal },
      { id: "zerodha", title: "Zerodha Kite", href: "/docs#zerodha", icon: Cpu },
      { id: "dhan", title: "DhanHQ", href: "/docs#dhan", icon: Cpu },
      { id: "fyers", title: "Fyers API", href: "/docs#fyers", icon: Cpu }
    ]
  },
  {
    title: "Analytics",
    items: [
      { id: "pnl-logic", title: "PnL Calculation", href: "/docs#pnl", icon: ShieldCheck },
      { id: "risk-metrics", title: "Risk Ratios", href: "/docs#risk", icon: ShieldCheck },
      { id: "mae-mfe", title: "MAE/MFE Analysis", href: "/docs#mae", icon: ShieldCheck }
    ]
  }
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 lg:sticky lg:top-20 h-auto lg:h-[calc(100vh-80px)] p-8 border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto bg-[#050508] z-20">
       <nav className="space-y-10">
          {DOCS_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-3">
                 {section.title}
               </h4>
               <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <li key={item.id}>
                         <Link 
                          href={item.href}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                            isActive 
                            ? 'bg-indigo-500/10 text-indigo-400' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                          }`}
                         >
                           <div className="flex items-center gap-3">
                              <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-zinc-700 group-hover:text-zinc-400'} />
                              {item.title}
                           </div>
                           {isActive ? (
                             <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                           ) : (
                             <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                           )}
                         </Link>
                      </li>
                    );
                  })}
               </ul>
            </div>
          ))}
       </nav>
    </aside>
  );
}
