"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  BarChart3, 
  Server, 
  FileSearch, 
  Megaphone, 
  Settings, 
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  AppWindow
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "User Control", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Revenue & Billing", href: "/admin/revenue", icon: <BarChart3 size={18} /> },
    { label: "System Health", href: "/admin/system", icon: <Server size={18} /> },
    { label: "Audit Logs", href: "/admin/logs", icon: <FileSearch size={18} /> },
    { label: "Announcements", href: "/admin/announcements", icon: <Megaphone size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-72 bg-[#09090b] border-r border-white/5 flex flex-col pt-10">
        <div className="px-8 mb-12 flex items-center gap-3">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-black" size={24} />
           </div>
           <div>
              <h1 className="text-lg font-black text-white tracking-tight">Admin OS</h1>
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] -mt-1">ThirdLeaf Control</p>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
           {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                 <Link 
                   key={item.href}
                   href={item.href} 
                   className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                     isActive ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                   }`}
                 >
                    {item.icon}
                    {item.label}
                 </Link>
              );
           })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
           <Link href="/app/dashboard" className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors">
              <AppWindow size={14} /> Back to Application
           </Link>
           <div className="flex items-center gap-3 px-4 py-4 mt-2">
              <UserButton />
              <div className="overflow-hidden">
                 <p className="text-xs font-bold text-white truncate">Founder Admin</p>
                 <p className="text-[10px] text-zinc-500 font-medium">Session ID: 45A-2X</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 bg-[#09090b]/50 backdrop-blur-3xl sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Global Status: Optimal</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Build v2.4.0-admin</div>
              <button className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                 <Settings size={16} />
              </button>
           </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[radial-gradient(circle_at_top_right,_#ffffff05_0%,_transparent_40%)]">
           {children}
        </section>
      </main>

    </div>
  );
}
