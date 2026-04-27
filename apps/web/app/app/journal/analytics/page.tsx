"use client";

import React, { useState, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ReferenceLine, Label
} from "recharts";
import { Brain, Moon, Target, BarChart3, TrendingUp, Flame, Loader2 } from "lucide-react";

// ── Skeleton ─────────────────────────────────────────────────────────────────

const ChartSkeleton = () => (
  <div className="h-[260px] bg-zinc-900/50 rounded-xl animate-pulse flex items-center justify-center">
    <Loader2 className="text-zinc-700 animate-spin" size={24} />
  </div>
);

// ── Insight Card ─────────────────────────────────────────────────────────────

const InsightCard = ({ icon, color, title, insight }: any) => (
  <div className={`flex items-start gap-3 p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/15`}>
    <div className={`w-8 h-8 bg-${color}-500/15 rounded-lg flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className={`text-xs font-bold text-${color}-400 uppercase tracking-wider mb-1`}>{title}</p>
      <p className="text-xs text-zinc-300 leading-relaxed">{insight}</p>
    </div>
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-400">{p.name}:</span>
          <b className="text-white">{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JournalAnalyticsPage() {
  const [moodPnl, setMoodPnl] = useState<any[]>([]);
  const [sleepPerf, setSleepPerf] = useState<any[]>([]);
  const [compliancePnl, setCompliancePnl] = useState<any[]>([]);
  const [emotionPatterns, setEmotionPatterns] = useState<any[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState({ mood: true, sleep: true, compliance: true, emotions: true });

  useEffect(() => {
    const load = async (path: string, setter: Function, key: string) => {
      const res = await fetch(path);
      const json = await res.json();
      if (json.success) setter(json.data);
      setLoading(prev => ({ ...prev, [key]: false }));
    };

    load('/api/journal/analytics/mood-pnl', setMoodPnl, 'mood');
    load('/api/journal/analytics/sleep-performance', setSleepPerf, 'sleep');
    load('/api/journal/analytics/compliance-pnl', setCompliancePnl, 'compliance');
    load('/api/journal/analytics/emotion-patterns', setEmotionPatterns, 'emotions');

    fetch('/api/journal/streak').then(r => r.json()).then(d => {
      if (d.success) setStreak(d.data);
    });
  }, []);

  // Compute best mood range for insight
  const bestMoodRange = React.useMemo(() => {
    if (!moodPnl.length) return "7-9";
    const grouped: Record<number, number[]> = {};
    for (const d of moodPnl) {
      if (!grouped[d.moodScore]) grouped[d.moodScore] = [];
      grouped[d.moodScore].push(d.netPnl);
    }
    const avgByMood = Object.entries(grouped).map(([score, pnls]) => ({
      score: parseInt(score),
      avg: pnls.reduce((a, b) => a + b, 0) / pnls.length,
    })).sort((a, b) => b.avg - a.avg);
    const best = avgByMood.slice(0, 3).map(d => d.score).sort((a, b) => a - b);
    return best.length >= 2 ? `${best[0]}-${best[best.length - 1]}` : `${best[0]}`;
  }, [moodPnl]);

  const bestSleepRange = React.useMemo(() => {
    if (!sleepPerf.length) return "7-8";
    const best = sleepPerf.sort((a, b) => b.avgPnl - a.avgPnl)[0];
    return best?.range || "7-8";
  }, [sleepPerf]);

  const complianceThreshold = React.useMemo(() => {
    if (!compliancePnl.length) return 75;
    const withPnl = compliancePnl.filter(d => d.netPnl > 0);
    const avg = withPnl.reduce((a, b) => a + (b.planCompliance || 0), 0) / (withPnl.length || 1);
    return Math.round(avg);
  }, [compliancePnl]);

  const formatPnL = (v: number) => {
    const sign = v >= 0 ? "+" : "";
    return `${sign}₹${(v / 100).toLocaleString('en-IN')}`;
  };

  const pnlColor = (v: number) => (v >= 0 ? "#10b981" : "#ef4444");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white">Journal Analytics</h1>
        <p className="text-zinc-500 mt-1">Discover patterns between your psychology and trading performance</p>
      </div>

      {/* ── Streak Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-amber-400" size={20} />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Current Streak</span>
          </div>
          <p className="text-4xl font-black text-white">{streak.currentStreak}<span className="text-xl text-zinc-400 ml-1">days</span></p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-indigo-400" size={20} />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Longest Streak</span>
          </div>
          <p className="text-4xl font-black text-white">{streak.longestStreak}<span className="text-xl text-zinc-400 ml-1">days</span></p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-emerald-400" size={20} />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Entries</span>
          </div>
          <p className="text-4xl font-black text-white">{moodPnl.length + compliancePnl.length}</p>
        </div>
      </div>

      {/* ── Mood vs P&L ──────────────────────────────────────────────── */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain size={18} className="text-indigo-400" /> Mood vs P&L Correlation
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">How your emotional state correlates with daily performance</p>
          </div>
        </div>
        {loading.mood ? <ChartSkeleton /> : moodPnl.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">No data yet — start logging daily journals</div>
        ) : (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="moodScore" name="Mood" domain={[1, 10]} type="number" stroke="#ffffff30" fontSize={11}>
                    <Label value="Mood Score (1-10)" position="insideBottom" offset={-5} fill="#888" fontSize={11} />
                  </XAxis>
                  <YAxis dataKey="netPnl" name="P&L" stroke="#ffffff30" fontSize={11} tickFormatter={(v) => `₹${(v / 100 / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <ReferenceLine y={0} stroke="#ffffff20" strokeDasharray="4 2" />
                  <Scatter
                    data={moodPnl}
                    fill="#6366f1"
                    opacity={0.8}
                    name="P&L"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      return <circle cx={cx} cy={cy} r={5} fill={pnlColor(payload.netPnl)} opacity={0.7} />;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <InsightCard
              icon={<Brain size={14} className="text-indigo-400" />}
              color="indigo"
              title="Insight"
              insight={`Your best trading days happen when your mood score is between ${bestMoodRange}. Consider postponing high-risk trades when mood drops below 5.`}
            />
          </>
        )}
      </div>

      {/* ── Sleep vs Performance ──────────────────────────────────────── */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Moon size={18} className="text-blue-400" /> Sleep Quality vs. Performance
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">Average P&L bucketed by sleep quality scores</p>
        </div>
        {loading.sleep ? <ChartSkeleton /> : sleepPerf.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">No data yet</div>
        ) : (
          <>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepPerf} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                  <XAxis dataKey="range" stroke="#ffffff30" fontSize={12} />
                  <YAxis stroke="#ffffff30" fontSize={11} tickFormatter={(v) => `₹${(v / 100 / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                  <Bar dataKey="avgPnl" name="Avg P&L" radius={[6, 6, 0, 0]}>
                    {sleepPerf.map((entry, index) => (
                      <Cell key={index} fill={entry.avgPnl >= 0 ? "#10b981" : "#ef4444"} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightCard
              icon={<Moon size={14} className="text-blue-400" />}
              color="blue"
              title="Sleep Insight"
              insight={`Sleep quality of ${bestSleepRange} correlates with your best average daily P&L. Consider enforcing a sleep cutoff time on trading days.`}
            />
          </>
        )}
      </div>

      {/* ── Plan Compliance vs P&L ───────────────────────────────────── */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-emerald-400" /> Plan Compliance vs. P&L
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">Does following your plan actually improve results?</p>
        </div>
        {loading.compliance ? <ChartSkeleton /> : compliancePnl.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">No data yet</div>
        ) : (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="planCompliance" name="Compliance %" domain={[0, 100]} type="number" stroke="#ffffff30" fontSize={11}>
                    <Label value="Plan Compliance (%)" position="insideBottom" offset={-5} fill="#888" fontSize={11} />
                  </XAxis>
                  <YAxis dataKey="netPnl" name="P&L" stroke="#ffffff30" fontSize={11} tickFormatter={(v) => `₹${(v / 100 / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <ReferenceLine y={0} stroke="#ffffff20" strokeDasharray="4 2" />
                  <Scatter
                    data={compliancePnl}
                    fill="#10b981"
                    name="P&L"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      return <circle cx={cx} cy={cy} r={5} fill={pnlColor(payload.netPnl)} opacity={0.7} />;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <InsightCard
              icon={<Target size={14} className="text-emerald-400" />}
              color="emerald"
              title="Compliance Insight"
              insight={`Your profitable days average ${complianceThreshold}%+ plan compliance. Days below this threshold tend to have negative P&L outcomes.`}
            />
          </>
        )}
      </div>

      {/* ── Day-of-Week Emotion Patterns ─────────────────────────────── */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" /> Weekly Mood & Performance Radar
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">Average mood and day score by day of week</p>
        </div>
        {loading.emotions ? <ChartSkeleton /> : emotionPatterns.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">No data yet</div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={emotionPatterns} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="day" tick={{ fill: '#888', fontSize: 12 }} />
                <Radar name="Avg Mood" dataKey="avgMood" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Avg Day Score" dataKey="avgDayScore" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        {emotionPatterns.length > 0 && (() => {
          const worst = [...emotionPatterns].sort((a, b) => a.avgMood - b.avgMood)[0];
          const best = [...emotionPatterns].sort((a, b) => b.avgMood - a.avgMood)[0];
          return (
            <InsightCard
              icon={<BarChart3 size={14} className="text-amber-400" />}
              color="amber"
              title="Pattern Detected"
              insight={`${best?.day} tends to be your best trading day (avg mood: ${best?.avgMood}/10). ${worst?.day} sees the lowest mood (${worst?.avgMood}/10) — consider lighter position sizing.`}
            />
          );
        })()}
      </div>
    </div>
  );
}
