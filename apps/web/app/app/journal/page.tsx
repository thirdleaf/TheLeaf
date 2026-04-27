"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays, Search, Sun, BookOpen,
  BarChart3, Lightbulb, TrendingUp, ChevronLeft, ChevronRight,
  Flame, List, Calendar, ExternalLink, Loader2, FileText, Plus
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, subMonths, addMonths } from "date-fns";

// ── Type Config ─────────────────────────────────────────────────────────────

const JOURNAL_TYPES = [
  { value: "DAILY", label: "Daily Journal", icon: Sun, color: "text-amber-400", bg: "bg-amber-400/10", badge: "bg-amber-400/15 text-amber-300 border-amber-400/20" },
  { value: "WEEKLY", label: "Weekly Review", icon: CalendarDays, color: "text-blue-400", bg: "bg-blue-400/10", badge: "bg-blue-400/15 text-blue-300 border-blue-400/20" },
  { value: "MONTHLY", label: "Monthly Review", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10", badge: "bg-purple-400/15 text-purple-300 border-purple-400/20" },
  { value: "TRADE_NOTE", label: "Trade Note", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20" },
  { value: "IDEA", label: "Idea / Observation", icon: Lightbulb, color: "text-pink-400", bg: "bg-pink-400/10", badge: "bg-pink-400/15 text-pink-300 border-pink-400/20" },
];

const typeMap = new Map(JOURNAL_TYPES.map(t => [t.value, t]));

// ── Calendar Heatmap ────────────────────────────────────────────────────────

const CalendarHeatmap = ({ currentMonth, onDayClick, heatmapData }: {
  currentMonth: Date;
  onDayClick: (date: Date) => void;
  heatmapData: Record<string, any>;
}) => {
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfWeek = (getDay(days[0]) + 6) % 7; // Mon=0
  const dayPad = Array(firstDayOfWeek).fill(null);
  const allCells = [...dayPad, ...days];
  const today = new Date();

  const getColor = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const data = heatmapData[key];
    if (!data) return "bg-surface-2 hover:bg-surface-3";
    const score = data.dayScore || data.moodScore;
    if (!score) return "bg-surface-3 hover:bg-border";
    if (score >= 8) return "bg-emerald-500/60 hover:bg-emerald-500/80";
    if (score >= 6) return "bg-emerald-500/30 hover:bg-emerald-500/50";
    if (score >= 4) return "bg-amber-500/30 hover:bg-amber-500/50";
    return "bg-red-500/40 hover:bg-red-500/60";
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-text-disabled">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {allCells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = format(day, 'yyyy-MM-dd');
          const data = heatmapData[key];
          const isToday = isSameDay(day, today);
          return (
            <button
              key={key}
              onClick={() => onDayClick(day)}
              title={`${format(day, 'MMM d')}${data ? ` · Score: ${data.dayScore || data.moodScore || '?'}` : ''}`}
              className={`relative aspect-square rounded-lg flex items-center justify-center transition-all text-[11px] font-medium ${getColor(day)} ${isToday ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg' : ''} ${data ? 'text-white' : 'text-text-disabled'}`}
            >
              {format(day, 'd')}
              {data && (
                <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                  {data.types?.map((t: string, ti: number) => {
                    const type = typeMap.get(t);
                    return type ? (
                      <div key={ti} className={`w-1 h-1 rounded-full ${type.color.replace('text-', 'bg-')}`} />
                    ) : null;
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Type Badge ──────────────────────────────────────────────────────────────

const TypeBadge = ({ type }: { type: string }) => {
  const t = typeMap.get(type);
  if (!t) return null;
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${t.badge}`}>
      <Icon size={10} />
      {t.label}
    </span>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
        ...(typeFilter && { type: typeFilter }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/journal?${params}`);
      const json = await res.json();
      if (json.success) {
        setEntries(json.data.entries);
        setTotalPages(json.data.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async () => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1;
    const res = await fetch(`/api/journal/calendar?year=${y}&month=${m}`);
    const json = await res.json();
    if (json.success) {
      const map: Record<string, any> = {};
      json.data.forEach((d: any) => { map[d.date] = d; });
      setHeatmapData(map);
    }
  };

  const fetchStreak = async () => {
    const res = await fetch('/api/journal/streak');
    const json = await res.json();
    if (json.success) setStreak(json.data);
  };

  useEffect(() => {
    fetchEntries();
  }, [page, typeFilter, search]);

  useEffect(() => {
    fetchCalendar();
  }, [currentMonth]);

  useEffect(() => {
    fetchStreak();
  }, []);

  const handleDayClick = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const d = heatmapData[key];
    if (d) {
      setSearch("");
      setTypeFilter("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-200px)]">

      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">

        {/* Streak Widget */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center">
              <Flame className="text-amber-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Journal Streak</p>
              <p className="text-2xl font-black text-text-primary">
                {streak.currentStreak}
                <span className="text-base font-bold text-text-disabled ml-1">days</span>
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-muted">Longest: <b className="text-text-primary">{streak.longestStreak}d</b></span>
            <span className="text-emerald-400 font-semibold">🔥 Keep going!</span>
          </div>
        </div>

        {/* Quick Create */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-disabled px-1">New Entry</p>
          {JOURNAL_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.value}
                href={`/app/journal/new?type=${t.value}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border hover:border-accent/30 transition-all group bg-surface-2/20`}
              >
                <div className={`w-8 h-8 ${t.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={t.color} />
                </div>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{t.label}</span>
                <Plus size={13} className="ml-auto text-text-disabled group-hover:text-accent" />
              </Link>
            );
          })}
        </div>

        {/* Calendar Heatmap */}
        <div className="bg-surface-2/40 border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-3 text-text-disabled">
                <ChevronLeft size={13} />
              </button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-3 text-text-disabled">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
          <CalendarHeatmap currentMonth={currentMonth} onDayClick={handleDayClick} heatmapData={heatmapData} />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" /><span className="text-[10px] text-text-disabled">Good (8+)</span></div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500/30" /><span className="text-[10px] text-text-disabled">Avg (5-7)</span></div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-red-500/40" /><span className="text-[10px] text-text-disabled">Tough (&lt;5)</span></div>
          </div>
        </div>

        {/* Analytics Link */}
        <Link href="/app/journal/analytics" className="flex items-center justify-between p-4 bg-accent/5 border border-accent/15 rounded-2xl hover:bg-accent/10 transition-all group">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-accent" size={18} />
            <div>
              <p className="text-sm font-semibold text-text-primary">Journal Analytics</p>
              <p className="text-xs text-text-muted">Mood, sleep & compliance trends</p>
            </div>
          </div>
          <ExternalLink size={14} className="text-text-disabled group-hover:text-accent transition-colors" />
        </Link>

        {/* Rules Link */}
        <Link href="/app/journal/rules" className="flex items-center justify-between p-4 bg-surface-2/40 border border-border rounded-2xl hover:border-accent/30 transition-all group">
          <div className="flex items-center gap-3">
            <FileText className="text-text-disabled" size={18} />
            <div>
              <p className="text-sm font-semibold text-text-primary">Trading Rules</p>
              <p className="text-xs text-text-muted">Manage & track rule breaks</p>
            </div>
          </div>
          <ChevronLeft size={14} className="text-text-disabled rotate-180 group-hover:text-text-primary transition-colors" />
        </Link>
      </div>

      {/* ── Right: List View ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-text-primary">Trading Journal</h1>
            <p className="text-sm text-text-muted">{entries.length > 0 ? `${entries.length} entries` : "No entries yet"}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setView("calendar")} className={`p-2 rounded-lg transition-colors ${view === "calendar" ? "bg-surface-3 text-text-primary" : "text-text-disabled hover:text-text-primary"}`}>
              <Calendar size={16} />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-surface-3 text-text-primary" : "text-text-disabled hover:text-text-primary"}`}>
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search entries..."
              className="w-full bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">All Types</option>
            {JOURNAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Entries */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="text-accent animate-spin mx-auto" size={28} />
              <p className="text-sm text-text-muted">Loading entries...</p>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-surface-2 border border-border rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="text-text-disabled" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">No journal entries yet</h3>
                <p className="text-text-muted text-sm">Start by creating your first daily journal entry to track your trading journey.</p>
              </div>
              <Link href="/app/journal/new?type=DAILY" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-semibold transition-colors">
                <Plus size={15} /> Write Today's Journal
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {entries.map((entry) => {
              const type = typeMap.get(entry.type);
              const Icon = type?.icon || BookOpen;
              return (
                <Link
                  key={entry.id}
                  href={`/app/journal/${entry.id}`}
                  className="block bg-surface-2/20 border border-border hover:border-accent/30 rounded-2xl p-4 transition-all group hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${type?.bg || 'bg-surface-3'} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={16} className={type?.color || 'text-text-disabled'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <TypeBadge type={entry.type} />
                        {entry.isDraft && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-surface-3 text-text-muted rounded border border-border">DRAFT</span>
                        )}
                        {entry.isLocked && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">LOCKED</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors truncate">{entry.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-disabled flex-wrap">
                        <span>{new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        {entry.moodScore && (
                          <span className="flex items-center gap-1">
                            Mood <b className="text-text-secondary">{entry.moodScore}/10</b>
                          </span>
                        )}
                        {entry.dayScore && (
                          <span className="flex items-center gap-1">
                            Day <b className="text-text-secondary">{entry.dayScore}/10</b>
                          </span>
                        )}
                        {entry.planCompliance != null && (
                          <span className="flex items-center gap-1">
                            Compliance <b className={entry.planCompliance >= 70 ? "text-emerald-400" : "text-amber-400"}>{entry.planCompliance}%</b>
                          </span>
                        )}
                        {entry.linkedTradeIds?.length > 0 && (
                          <span>{entry.linkedTradeIds.length} trades</span>
                        )}
                      </div>
                    </div>
                    <ChevronLeft size={14} className="text-text-disabled rotate-180 group-hover:text-text-primary transition-colors mt-1 shrink-0" />
                  </div>
                </Link>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-surface-2 border border-border rounded-lg text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-text-disabled">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-surface-2 border border-border rounded-lg text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
