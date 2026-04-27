"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart2, 
  LineChart, 
  BookOpen, 
  PieChart, 
  Activity, 
  FileText, 
  Settings, 
  ShieldAlert,
  Bell,
  UserCircle,
  Brain,
  CheckCircle2,
  CreditCard
} from "lucide-react";
import { useAlerts } from "../../hooks/useRealTime";
import { AnnouncementBanner, ImpersonationBanner } from "../../components/common/PlatformAlerts";
import { AchievementCelebration } from "../../components/community/AchievementCelebration";
import { OfflineBanner } from "../../components/common/OfflineBanner";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/app/trades", label: "Trades Log", icon: LineChart },
  { href: "/app/journal", label: "Journal", icon: BookOpen },
  { href: "/app/analytics", label: "Analytics", icon: PieChart },
  { href: "/app/psychology", label: "Psychology Lab", icon: Brain },
  { href: "/app/strategies", label: "Strategies", icon: Activity },
  { href: "/app/tax", label: "Tax Report", icon: FileText },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { alerts } = useAlerts();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <AchievementCelebration />
      <ImpersonationBanner />
      <OfflineBanner />
      <div className="flex flex-1 overflow-hidden">
      
      {/* Sidebar - Persistent Left */}
      <aside className="w-64 shrink-0 bg-[#09090b] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-zinc-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-orange-400" />
            <span className="font-heading font-black text-xl tracking-tight text-white">ThirdLeaf</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
          
          <div className="pt-8 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Admin Only</p>
            <Link 
                href="/app/prop"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname.startsWith("/app/prop") ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                 <ShieldAlert className="w-5 h-5 shrink-0" />
                 Prop Trading
              </Link>
           </div>
        </nav>

        {/* Rules Ritual Widget */}
        <div className="p-4 mt-auto border-t border-white/5 bg-zinc-950/50">
           <RulesRitualWidget />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Bar */}
        <header className="h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <select className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-medium focus:outline-none">
              <option>Zerodha Primary [6Z24]</option>
              <option>AngelOne Swing [Q1A]</option>
            </select>
            <div className="h-6 w-px bg-white/10" />
            <select className="bg-transparent border-none text-zinc-400 text-sm font-medium focus:outline-none hover:text-white cursor-pointer">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This FY</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
               <Bell className="w-5 h-5 text-zinc-400" />
               {alerts.length > 0 && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />}
             </div>
             <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium text-white">Vikas Trader</p>
                 <p className="text-xs text-zinc-500">Pro Plan</p>
               </div>
               <UserCircle className="w-8 h-8 text-zinc-300" />
             </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-8">
            <AnnouncementBanner />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

const RulesRitualWidget = () => {
  const [rules, setRules] = useState([
    { id: 1, text: "Risk < 1% per trade", checked: false },
    { id: 2, text: "Max 2 trades/day", checked: false },
    { id: 3, text: "15m wait after loss", checked: false },
  ]);

  const toggleRule = (id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Daily Ritual</p>
          <span className="text-[10px] font-bold text-brand-primary">
            {rules.filter(r => r.checked).length}/{rules.length}
          </span>
       </div>
       <div className="space-y-2">
          {rules.map(rule => (
             <button 
               key={rule.id}
               onClick={() => toggleRule(rule.id)}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                 rule.checked ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-black/20 border border-white/5 hover:border-white/10"
               }`}
             >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                  rule.checked ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"
                }`}>
                   {rule.checked && <CheckCircle2 size={10} className="text-black" />}
                </div>
                <span className={`text-[11px] font-medium leading-tight ${rule.checked ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
                  {rule.text}
                </span>
             </button>
          ))}
       </div>
    </div>
  );
};
