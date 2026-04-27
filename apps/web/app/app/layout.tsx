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
  CreditCard,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useAlerts } from "../../hooks/useRealTime";
import { AnnouncementBanner, ImpersonationBanner } from "../../components/common/PlatformAlerts";
import { AchievementCelebration } from "../../components/community/AchievementCelebration";
import { OfflineBanner } from "../../components/common/OfflineBanner";
import Image from "next/image";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)" }}>
      <AchievementCelebration />
      <ImpersonationBanner />
      <OfflineBanner />
      <div className="flex flex-1 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Persistent Left */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `} style={{ backgroundColor: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
        <div className="h-16 flex items-center justify-between px-6 border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-3)" }}>
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 relative grayscale brightness-150 contrast-125 dark:brightness-100 dark:contrast-100">
               <Image src="/logo.svg" alt="ThirdLeaf" fill className="object-contain" />
            </div>
            <span className="font-heading font-black text-xl tracking-tight" style={{ color: "var(--color-text-primary)" }}>ThirdLeaf</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg">
            <X size={20} style={{ color: "var(--color-text-muted)" }} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? "text-accent border shadow-sm" 
                    : "text-zinc-400 hover:text-white"
                }`}
                style={{ 
                  backgroundColor: isActive ? "var(--color-accent-light)" : "transparent",
                  borderColor: isActive ? "var(--color-border-accent)" : "transparent"
                }}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {item.label}
              </Link>
            )
          })}
          
          <div className="pt-8 pb-2">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>Admin Only</p>
            <Link 
                href="/app/prop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  pathname.startsWith("/app/prop") 
                    ? "text-purple-400 border border-purple-500/20 shadow-sm" 
                    : "text-zinc-400 hover:text-white"
                }`}
                style={{ 
                  backgroundColor: pathname.startsWith("/app/prop") ? "rgba(168, 85, 247, 0.12)" : "transparent",
                }}
              >
                 <ShieldAlert className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                 Prop Trading
              </Link>
           </div>
        </nav>

        {/* Rules Ritual Widget */}
        <div className="p-4 mt-auto border-t" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-3)" }}>
           <RulesRitualWidget />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Bar */}
        <header className="h-16 backdrop-blur-xl border-b sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0" style={{ backgroundColor: "var(--color-surface-alpha)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu size={20} style={{ color: "var(--color-text-primary)" }} />
            </button>

            <div className="hidden md:flex items-center gap-4">
              <select className="bg-transparent border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none" style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                <option>Zerodha Primary [6Z24]</option>
                <option>AngelOne Swing [Q1A]</option>
              </select>
              <div className="h-6 w-px" style={{ backgroundColor: "var(--color-border)" }} />
              <select className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer" style={{ color: "var(--color-text-muted)" }}>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This FY</option>
              </select>
            </div>
            <div className="md:hidden flex items-center">
               <span className="text-xs font-bold px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20">6Z24</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
               <Bell className="w-5 h-5 text-zinc-400" />
               {alerts.length > 0 && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />}
             </div>
             <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Vikas Trader</p>
                 <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Pro Plan</p>
               </div>
               <UserCircle className="w-8 h-8 text-zinc-300" />
             </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8" style={{ backgroundColor: "var(--color-bg)" }}>
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
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Daily Ritual</p>
          <span className="text-[10px] font-bold" style={{ color: "var(--color-accent)" }}>
            {rules.filter(r => r.checked).length}/{rules.length}
          </span>
       </div>
       <div className="space-y-2">
          {rules.map(rule => (
             <button 
               key={rule.id}
               onClick={() => toggleRule(rule.id)}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all border ${
                 rule.checked ? "shadow-inner opacity-60" : "hover:border-zinc-500"
               }`}
               style={{ 
                 backgroundColor: rule.checked ? "var(--color-success-light)" : "var(--color-surface)",
                 borderColor: rule.checked ? "var(--color-success)" : "var(--color-border)"
               }}
             >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                  rule.checked ? "border-transparent" : "border-zinc-700"
                }`} style={{ backgroundColor: rule.checked ? "var(--color-success)" : "transparent" }}>
                   {rule.checked && <CheckCircle2 size={10} className="text-black" />}
                </div>
                <span className={`text-[11px] font-medium leading-tight transition-all ${rule.checked ? "line-through" : ""}`} style={{ color: rule.checked ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>
                  {rule.text}
                </span>
             </button>
          ))}
       </div>
    </div>
  );
};
