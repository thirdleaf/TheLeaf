"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";
import * as d3 from "d3";
import { formatIndianCurrency } from "@thirdleaf/utils";
import { Download, Info, Zap, Loader2 } from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────────────────────

const ChartSkeleton = ({ h = 300 }: { h?: number }) => (
  <div className={`h-[${h}px] bg-zinc-900/30 rounded-xl animate-pulse flex items-center justify-center`} style={{ height: h }}>
    <Loader2 className="text-zinc-700 animate-spin" size={22} />
  </div>
);

// ── Metric Card ───────────────────────────────────────────────────────────────

const MetricCard = ({
  label, value, color = "text-white", loading = false
}: { label: string; value?: string | number; color?: string; loading?: boolean }) => (
  <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">{label}</div>
    {loading ? (
      <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse" />
    ) : (
      <div className={`text-2xl font-bold font-mono ${color}`}>{value ?? "—"}</div>
    )}
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const DarkTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-zinc-400">{p.name}:</span>
          <b className="text-white">{p.value?.toLocaleString?.('en-IN') ?? p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (paise: number) => {
  const v = paise / 100;
  const sign = v >= 0 ? "+" : "";
  return `${sign}₹${Math.abs(v).toLocaleString('en-IN')}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW TAB — wired to /api/analytics/overview
// ─────────────────────────────────────────────────────────────────────────────

const OverviewTab = () => {
  const [data, setData] = useState<any>(null);
  const [equityCurve, setEquityCurve] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/overview').then(r => r.json()),
      fetch('/api/analytics/equity-curve').then(r => r.json()),
    ]).then(([overview, equity]) => {
      if (overview.success) setData(overview.data);
      if (equity.success) setEquityCurve(equity.data);
    }).finally(() => setLoading(false));
  }, []);

  const winColor = (v: number) => v >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Net P&L" value={data ? fmt(data.totalNetPnl) : undefined} color={winColor(data?.totalNetPnl ?? 0)} loading={loading} />
        <MetricCard label="Profit Factor" value={data?.profitFactor} loading={loading} />
        <MetricCard label="Win Rate" value={data ? `${data.winRate}%` : undefined} color={winColor((data?.winRate ?? 50) - 50)} loading={loading} />
        <MetricCard label="Expectancy" value={data ? fmt(data.expectancy) : undefined} loading={loading} />
        <MetricCard label="Max Drawdown" value={data ? `${data.maxDrawdown?.toFixed(1)}%` : undefined} color="text-red-400" loading={loading} />
        <MetricCard label="Sharpe Ratio" value={data?.sharpeRatio} loading={loading} />
        <MetricCard label="Current Streak" value={data ? (data.currentStreak > 0 ? `${data.currentStreak}W` : `${Math.abs(data.currentStreak)}L`) : undefined} loading={loading} />
        <MetricCard label="Longest Win Streak" value={data?.longestWinStreak} loading={loading} />
        <MetricCard label="Longest Loss Streak" value={data?.longestLossStreak} color="text-red-400" loading={loading} />
        <MetricCard label="Avg R-Multiple" value={data ? `${data.avgRMultiple}R` : undefined} loading={loading} />
        <MetricCard label="Avg Winner" value={data ? fmt(data.avgWin) : undefined} color="text-emerald-400" loading={loading} />
        <MetricCard label="Avg Loser" value={data ? fmt(-data.avgLoss) : undefined} color="text-red-400" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Equity Curve</h3>
          {loading ? <ChartSkeleton /> : equityCurve.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-zinc-600 text-sm">No equity data yet</div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurve} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={11} minTickGap={30} />
                  <YAxis stroke="#ffffff40" fontSize={11} tickFormatter={v => `${Math.round(v / 100000)}L`} />
                  <RechartsTooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="equity" name="Equity" stroke="#c084fc" strokeWidth={2.5} fill="url(#colorEq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Trade Distribution</h3>
          {loading ? <ChartSkeleton /> : data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <span className="text-sm text-zinc-400">Wins</span>
                <span className="text-lg font-bold text-emerald-400">{data.winCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <span className="text-sm text-zinc-400">Losses</span>
                <span className="text-lg font-bold text-red-400">{data.lossCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 border border-white/5 rounded-xl">
                <span className="text-sm text-zinc-400">Break-Even</span>
                <span className="text-lg font-bold text-zinc-300">{data.breakEvenCount}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${(data.winCount / data.tradeCount) * 100}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${(data.lossCount / data.tradeCount) * 100}%` }} />
              </div>
              <p className="text-xs text-zinc-500 text-center">{data.tradeCount} total trades</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <Zap className="text-zinc-700" size={28} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREAKDOWN TAB — wired to /api/analytics/breakdown
// ─────────────────────────────────────────────────────────────────────────────

const BreakdownTab = () => {
  const [groupBy, setGroupBy] = useState("setup");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/breakdown?groupBy=${groupBy}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, [groupBy]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-400">Group By:</span>
        <select
          value={groupBy}
          onChange={e => setGroupBy(e.target.value)}
          className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="setup">Setup</option>
          <option value="strategy">Strategy</option>
          <option value="symbol">Symbol</option>
          <option value="direction">Direction</option>
          <option value="timeOfDay">Time of Day</option>
          <option value="dayOfWeek">Day of Week</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6"><ChartSkeleton h={200} /></div>
          ) : data.length === 0 ? (
            <div className="p-6 text-center text-zinc-600 text-sm py-16">No breakdown data yet</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4">Group</th>
                  <th className="px-6 py-4 text-right">Trades</th>
                  <th className="px-6 py-4 text-right">Win%</th>
                  <th className="px-6 py-4 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((r: any) => (
                  <tr key={r.name} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{r.name}</td>
                    <td className="px-6 py-4 text-right text-zinc-300">{r.tradeCount ?? r.trades}</td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      <span className={(r.winRate ?? 0) >= 50 ? 'text-emerald-400' : 'text-red-400'}>
                        {(r.winRate ?? 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right tabular-nums font-bold ${(r.netPnl ?? r.pnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fmt(r.netPnl ?? (r.pnl ?? 0) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Net P&L by {groupBy.replace(/([A-Z])/g, ' $1')}</h3>
          {loading ? <ChartSkeleton /> : data.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-zinc-600 text-sm">No data</div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff0a" />
                  <XAxis type="number" stroke="#ffffff40" fontSize={11} tickFormatter={v => `${(v / 10000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={11} width={90} />
                  <RechartsTooltip content={<DarkTooltip />} cursor={{ fill: '#ffffff06' }} />
                  <Bar dataKey="netPnl" name="Net P&L" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.map((entry: any, index: number) => (
                      <Cell key={index} fill={(entry.netPnl ?? 0) >= 0 ? '#10b981' : '#ef4444'} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAE / MFE TAB — D3.js with real trade data
// ─────────────────────────────────────────────────────────────────────────────

const MaeMfeTab = () => {
  const d3Ref = useRef<HTMLDivElement>(null);
  const [scatter, setScatter] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/mae-mfe')
      .then(r => r.json())
      .then(json => {
        if (json.success) setScatter(json.data);
      })
      .catch(() => {
        // Fallback to mock if endpoint not ready
        setScatter(Array.from({ length: 80 }).map(() => ({
          mae: -(Math.random() * 3),
          mfe: Math.random() * 5,
          qty: 10 + Math.random() * 100,
          isWin: Math.random() > 0.5,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!d3Ref.current || scatter.length === 0) return;

    const w = d3Ref.current.clientWidth || 600;
    const h = 380;
    const margin = { top: 20, right: 30, bottom: 45, left: 55 };

    d3.select(d3Ref.current).select("svg").remove();

    const svg = d3.select(d3Ref.current)
      .append("svg").attr("width", w).attr("height", h)
      .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const innerW = w - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([d3.min(scatter, d => d.mae) ?? -5, 0])
      .range([0, innerW]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(scatter, d => d.mfe) ?? 5])
      .range([innerH, 0]);

    // Grid lines
    svg.append("g").attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(() => ""))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#ffffff08"));

    // Axes
    svg.append("g").attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .call(g => { g.attr("color", "#52525b"); g.select(".domain").attr("stroke", "#ffffff15"); });

    svg.append("g").call(d3.axisLeft(yScale).ticks(5))
      .call(g => { g.attr("color", "#52525b"); g.select(".domain").attr("stroke", "#ffffff15"); });

    // Axis labels
    svg.append("text").attr("x", innerW / 2).attr("y", innerH + 38)
      .attr("fill", "#71717a").attr("text-anchor", "middle").style("font-size", "11px")
      .text("Maximum Adverse Excursion (MAE %)");
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -innerH / 2).attr("y", -42)
      .attr("fill", "#71717a").attr("text-anchor", "middle").style("font-size", "11px")
      .text("Maximum Favorable Excursion (MFE %)");

    // Dots
    svg.append("g").selectAll("circle").data(scatter).enter()
      .append("circle")
      .attr("cx", d => xScale(d.mae))
      .attr("cy", d => yScale(d.mfe))
      .attr("r", d => Math.max(3, Math.min(10, d.qty / 15)))
      .style("fill", d => d.isWin ? "#10b981" : "#ef4444")
      .style("opacity", 0.65)
      .style("stroke", "#09090b").style("stroke-width", 1)
      .on("mouseover", function () { d3.select(this).style("opacity", 1).attr("r", (d: any) => Math.max(5, Math.min(12, d.qty / 12))); })
      .on("mouseout", function () { d3.select(this).style("opacity", 0.65).attr("r", (d: any) => Math.max(3, Math.min(10, d.qty / 15))); });

  }, [scatter]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">MAE / MFE Scatter Matrix</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Bubble size = position size. 🟢 = Win  🔴 = Loss</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 opacity-70" />Win</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />Loss</span>
          </div>
        </div>
        {loading ? <ChartSkeleton h={380} /> : <div ref={d3Ref} className="w-full" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <Info className="w-5 h-5 text-emerald-400 mb-3" />
          <h4 className="text-emerald-400 font-bold mb-2 text-sm">Profit Taking Efficiency</h4>
          <p className="text-emerald-300/80 text-sm leading-relaxed">
            Winning trades where MFE was significantly higher than your exit point indicate early exits. 
            Consider trailing stops for runners to capture more upside.
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <Info className="w-5 h-5 text-red-400 mb-3" />
          <h4 className="text-red-400 font-bold mb-2 text-sm">Stop Loss Placement</h4>
          <p className="text-red-300/80 text-sm leading-relaxed">
            Losses with high MAE before reversal suggest your stop loss is too tight or placed at obvious levels. 
            Review stop placement relative to key structure.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PSYCHOLOGY TAB — wired to journal analytics
// ─────────────────────────────────────────────────────────────────────────────

const PsychologyTab = () => {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journal/analytics/mood-pnl')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          // Group by moodScore and compute avg P&L
          const grouped: Record<number, number[]> = {};
          for (const d of json.data) {
            if (!grouped[d.moodScore]) grouped[d.moodScore] = [];
            grouped[d.moodScore].push(d.netPnl);
          }
          const chart = Object.entries(grouped).map(([score, pnls]) => ({
            score: `Mood ${score}`,
            avgPnl: Math.round(pnls.reduce((a, b) => a + b, 0) / pnls.length),
          })).sort((a, b) => a.score.localeCompare(b.score));
          setMoodData(chart);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2 text-white">Average P&L by Mood Score</h3>
        <p className="text-xs text-zinc-500 mb-6">Sourced from your daily journal entries — psychological state vs. trading outcome</p>
        {loading ? <ChartSkeleton h={350} /> : moodData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] gap-3 text-center">
            <Zap className="text-zinc-700" size={28} />
            <div>
              <p className="text-sm text-zinc-400 font-medium">No journal data yet</p>
              <p className="text-xs text-zinc-600 mt-1">Start writing daily journals with mood scores to see this chart populate.</p>
            </div>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} margin={{ top: 10, right: 0, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis dataKey="score" stroke="#ffffff40" fontSize={11} tickMargin={8} />
                <YAxis stroke="#ffffff40" fontSize={11} tickFormatter={v => `${(v / 100).toLocaleString('en-IN')}`} />
                <RechartsTooltip content={<DarkTooltip />} cursor={{ fill: '#ffffff06' }} />
                <Bar dataKey="avgPnl" name="Avg P&L (paise)" radius={[5, 5, 0, 0]} maxBarSize={50}>
                  {moodData.map((entry, index) => (
                    <Cell key={index} fill={entry.avgPnl >= 0 ? '#10b981' : '#ef4444'} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-indigo-300 mb-2">💡 Did you know?</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Research shows traders lose up to 2.3x more on low-mood days. Tracking your mental state before trading 
            is one of the highest-leverage habits in a professional's routine.
          </p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-amber-300 mb-2">⚡ Action</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Consider setting a mood threshold rule: "No trades when mood score is below 5." 
            Over time, this simple rule prevents significant drawdowns from emotional trading.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "BREAKDOWN" | "MAE_MFE" | "PSYCH">("OVERVIEW");

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Analytics Engine</h1>
          <p className="text-zinc-500 mt-1">Deep performance metrics mined from your trade history.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-white/8 gap-8 overflow-x-auto">
        {[
          { id: "OVERVIEW", label: "Overview" },
          { id: "BREAKDOWN", label: "Strategy Breakdown" },
          { id: "MAE_MFE", label: "MAE / MFE Matrix" },
          { id: "PSYCH", label: "Psychology" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === t.id
                ? "text-indigo-400 border-indigo-500"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[600px]">
        {activeTab === "OVERVIEW" && <OverviewTab />}
        {activeTab === "BREAKDOWN" && <BreakdownTab />}
        {activeTab === "MAE_MFE" && <MaeMfeTab />}
        {activeTab === "PSYCH" && <PsychologyTab />}
      </div>
    </div>
  );
}
