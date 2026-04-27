"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar, CartesianGrid } from 'recharts';
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLivePnl } from "../../../hooks/useRealTime";
import { formatIndianCurrency, formatPnL } from "@thirdleaf/utils";
import { ActivityCalendar } from "react-activity-calendar";
import { Flame, Target, Activity, PieChart, Coins, Trophy, ShieldCheck, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock data evaluating responsive charts
const MOCK_EQUITY = Array.from({ length: 30 }).map((_, i) => ({
  date: `2026-04-${(i + 1).toString().padStart(2, '0')}`,
  equity: 100000 + (Math.sin(i / 3) * 5000) + (i * 800),
  drawdown: Math.random() > 0.7 ? -(Math.random() * 2000) : 0
}));

const MOCK_SETUPS = [
  { name: 'Breakout', profitFactor: 2.1, fill: '#10b981' },
  { name: 'Pullback', profitFactor: 1.6, fill: '#10b981' },
  { name: 'Reversal', profitFactor: 0.8, fill: '#ef4444' },
  { name: 'News Play', profitFactor: 0.4, fill: '#ef4444' }
];

const MOCK_HEATMAP = Array.from({ length: 90 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (90 - i));
  const val = Math.floor(Math.random() * 5); 
  return { date: d.toISOString().split('T')[0], count: val, level: val as 0|1|2|3|4 };
});

interface StatisticCardProps {
  title: string;
  value: React.ReactNode;
  subtext: React.ReactNode;
  icon: React.ReactNode;
  highlightColor?: string;
}

const DashboardStatisticCard = ({ title, value, subtext, icon, highlightColor }: StatisticCardProps) => (
  <div className="card card-hover relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" style={{ backgroundColor: `var(--color-${highlightColor || "accent"}-light, rgba(99, 102, 241, 0.1))` }} />
    <div className="flex items-center justify-between mb-4 relative z-10">
      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{title}</h3>
      {icon}
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-bold font-mono mb-1 tracking-tighter" style={{ color: "var(--color-text-primary)" }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{subtext}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { getToken, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  // Dynamic States
  const [stats, setStats] = useState({ totalTrades: 0, totalNetPnl: 0 });
  const [equityData, setEquityData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ── Data Fetching ──
  useEffect(() => {
    async function fetchData() {
      if (!isUserLoaded || !user) return;
      setIsLoadingData(true);
      try {
        const token = await getToken();
        if (!token) return;

        const [statsRes, equityRes] = await Promise.all([
          fetch("/api/analytics/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/analytics/equity-curve?days=30", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const statsJson = await statsRes.json();
        const equityJson = await equityRes.json();

        if (statsRes.ok) setStats(statsJson);
        if (equityRes.ok) setEquityData(equityJson);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, [isUserLoaded, user, getToken]);

  // ── Auto-Sync Logic (Handoff Handler) ──
  useEffect(() => {
    async function performSync() {
      if (!userId || !isUserLoaded || !user || isSyncing) return;
      
      // Check if we are in a handoff sync state
      const params = new URLSearchParams(window.location.search);
      const shouldSync = params.get("sync") === "true";
      const traderType = params.get("type");

      try {
        const token = await getToken();
        if (!token) return;

        // 1. Check if profile exists
        const response = await fetch("/api/users/me", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        
        // 2. If no profile, OR we were explicitly told to sync
        if (!response.ok || !result.id || shouldSync) {
          console.log("[Dashboard] Triggering profile sync with data...");
          setIsSyncing(true);
          
          const syncResponse = await fetch("/api/users/sync", {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress || "",
              name: user.fullName || "Trader",
              traderType: traderType || "intraday",
              onboardingCompleted: true
            })
          });

          if (syncResponse.ok) {
            console.log("[Dashboard] Sync successful!");
            // Clean URL
            router.replace("/app/dashboard");
          } else {
            const errData = await syncResponse.json().catch(() => ({}));
            console.error("[Dashboard] Sync rejected by server:", errData.message);
          }
        }
      } catch (err) {
        console.error("[Dashboard] Sync error:", err);
      } finally {
        setIsSyncing(false);
      }
    }

    performSync();
  }, [userId, isUserLoaded, user, isSyncing, getToken, router]);

  // Use real data or mock for visual polish if real data is empty but we want to show the UI
  const displayEquity = equityData.length > 0 ? equityData : MOCK_EQUITY.map(m => ({ ...m, equity: 0 }));
  const hasData = stats.totalTrades > 0;
  const displayPnL = formatPnL(stats.totalNetPnl);
  const pnlColor = stats.totalNetPnl >= 0 ? "text-emerald-400" : "text-rose-400";
  const currentStreak = 0; // To be implemented with real streak data

  if (isLoadingData) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
        <div className="h-[400px] skeleton rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Page Header - SEO & A11y Audit Fix */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
         <div>
            <div className="flex items-center gap-2 mb-1">
               <Activity size={14} className="text-accent" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-disabled">Live Command Center</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">Market Analytics Overview</h1>
         </div>
         <p className="text-xs font-medium text-text-disabled">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* ROW 1: KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatisticCard 
          title="Today's P&L" 
          value={<span className="text-profit">{displayPnL.formatted}</span>} 
          subtext={<span className="text-profit flex items-center gap-1"><TrendingUp size={14}/> +12% vs Yesterday</span>} 
          icon={<Activity style={{ color: "var(--color-text-muted)" }} />}
          highlightColor="success"
        />
        <DashboardStatisticCard 
          title="MTD P&L" 
          value={<span style={{ color: "var(--color-text-primary)" }}>{formatIndianCurrency(45000)}</span>} 
          subtext={
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1"><span>Target: ₹1L</span><span>45%</span></div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface-3)" }}>
                <div className="h-full w-[45%]" style={{ backgroundColor: "var(--color-accent)" }} />
              </div>
            </div>
          } 
          icon={<Target style={{ color: "var(--color-text-muted)" }} />}
        />
        <DashboardStatisticCard 
          title="Win Rate" 
          value="68.4%" 
          subtext="Last 30 Trades" 
          icon={<PieChart style={{ color: "var(--color-text-muted)" }} />}
          highlightColor="accent"
        />
        <DashboardStatisticCard 
          title="Current Streak" 
          value={
            <span className="flex items-center gap-2">
              {currentStreak || 4} 
              <Flame style={{ color: "var(--color-warning)" }} className="animate-pulse" />
            </span>
          } 
          subtext="Longest: 8" 
          icon={<Activity style={{ color: "var(--color-text-muted)" }} />}
          highlightColor="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-success-light)", color: "var(--color-success)" }}>
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Discipline Score</h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Ranked #14 this week</p>
               </div>
            </div>
            <div className="w-16 h-16 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={[{ name: 'Score', value: 92, fill: 'var(--color-success)' }]}>
                     <RadialBar background dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black" style={{ color: "var(--color-text-primary)" }}>92</span>
               </div>
            </div>
         </div>

         <div className="card card-hover flex items-center justify-between group cursor-pointer transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-warning-light)", color: "var(--color-warning)" }}>
                  <Flame size={24} className="animate-pulse" />
               </div>
               <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Journal Streak</h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>8 Days Running</p>
               </div>
            </div>
            <ArrowRight size={16} className="transition-colors group-hover:text-accent" style={{ color: "var(--color-text-muted)" }} />
         </div>

         <Link href="/app/profile/achievements" className="md:col-span-2 lg:col-span-1 card card-hover flex items-center justify-between group transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}>
                  <Award size={24} />
               </div>
               <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Latest Badge</h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Absolute Discipline</p>
               </div>
            </div>
            <Trophy size={16} className="transition-colors" style={{ color: "var(--color-text-muted)" }} />
         </Link>
      </div>

       <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
           <div>
             <h2 className="text-lg font-bold mb-1 text-text-primary">Equity Curve</h2>
             <p className="text-sm text-text-muted">Performance accounting for all trade deductions.</p>
           </div>
           <div className="flex text-xs font-semibold rounded-lg p-1 bg-surface-2 border border-border">
             {['All', 'FY', '6M', '3M', '1M'].map((opt, i) => (
                <button key={opt} className={`px-3 py-1.5 rounded-md ${i===2 ? 'bg-surface-3 text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>{opt}</button>
             ))}
           </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_EQUITY} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="date" stroke="var(--color-text-disabled)" fontSize={11} tickMargin={10} minTickGap={30} />
              <YAxis yAxisId="left" stroke="var(--color-text-disabled)" fontSize={11} tickFormatter={(val) => `${Math.round(val/1000)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
              />
               <Area yAxisId="left" type="monotone" dataKey="equity" stroke="var(--color-accent)" strokeWidth={3} fill="url(#colorEquity)" />
               <Area yAxisId="right" type="monotone" dataKey="drawdown" stroke="var(--color-danger)" strokeWidth={1} fill="url(#colorDd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Execution Consistency Map</h2>
          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <ActivityCalendar 
              data={MOCK_HEATMAP} 
              theme={{
                 light: ['var(--color-surface-2)', 'var(--color-success-light)', 'var(--color-success)', 'var(--color-success)', 'var(--color-success)'],
                 dark: ['var(--color-surface-2)', 'var(--color-success-light)', 'var(--color-success)', 'var(--color-success)', 'var(--color-success)'],
              }}
              blockSize={16}
              blockRadius={4}
              blockMargin={6}
              fontSize={14}
            />
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Profit Factor by Edge Setup</h2>
          <div className="h-[250px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_SETUPS} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />
                 <XAxis type="number" stroke="var(--color-text-disabled)" fontSize={12} />
                 <YAxis dataKey="name" type="category" stroke="var(--color-text-muted)" fontSize={12} width={80} />
                 <Tooltip cursor={{fill: 'var(--color-surface-2)'}} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}/>
                 <Bar dataKey="profitFactor" radius={[0, 4, 4, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Live Ticker Strip - Mobile Audit Fix */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 h-10 border-t backdrop-blur-3xl z-40 flex items-center overflow-hidden" style={{ backgroundColor: "var(--color-surface-2-alpha)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-8 px-8 animate-marquee whitespace-nowrap">
          {[
            { s: "NIFTY 50", p: "22,453.20", c: "+0.45%" },
            { s: "BANK NIFTY", p: "48,125.60", c: "-0.12%" },
            { s: "RELIANCE", p: "2,945.00", c: "+1.20%" },
            { s: "HDFCBANK", p: "1,450.25", c: "-0.54%" },
            { s: "INFY", p: "1,520.10", c: "+0.85%" },
          ].map((item, i) => (
             <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-text-disabled uppercase tracking-widest">{item.s}</span>
                <span className="text-[11px] font-bold font-mono text-text-primary">{item.p}</span>
                <span className={`text-[10px] font-black ${item.c.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{item.c}</span>
             </div>
          ))}
          {[
            { s: "NIFTY 50", p: "22,453.20", c: "+0.45%" },
            { s: "BANK NIFTY", p: "48,125.60", c: "-0.12%" },
            { s: "RELIANCE", p: "2,945.00", c: "+1.20%" },
            { s: "HDFCBANK", p: "1,450.25", c: "-0.54%" },
            { s: "INFY", p: "1,520.10", c: "+0.85%" },
          ].map((item, i) => (
             <div key={i+"-dup"} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-text-disabled uppercase tracking-widest">{item.s}</span>
                <span className="text-[11px] font-bold font-mono text-text-primary">{item.p}</span>
                <span className={`text-[10px] font-black ${item.c.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{item.c}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ArrowRight = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);
