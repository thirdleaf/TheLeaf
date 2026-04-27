"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sun, CalendarDays, BarChart3, TrendingUp, Lightbulb,
  ChevronLeft, Save, Lock, Check, AlertCircle, Loader2
} from "lucide-react";
import { TipTapEditor } from "../../../../components/journal/TipTapEditor";
import {
  SliderField, SelectField, TagInput, NumberInput, SectionDivider, ReadOnlyStat
} from "../../../../components/journal/JournalFormFields";

const JOURNAL_TYPES = [
  { value: "DAILY", label: "Daily Journal", icon: Sun, color: "amber", desc: "Pre & post market reflection" },
  { value: "WEEKLY", label: "Weekly Review", icon: CalendarDays, color: "blue", desc: "Reflect on your week" },
  { value: "MONTHLY", label: "Monthly Review", icon: BarChart3, color: "purple", desc: "Big picture review" },
  { value: "TRADE_NOTE", label: "Trade Note", icon: TrendingUp, color: "emerald", desc: "Deep dive on a specific trade" },
  { value: "IDEA", label: "Idea / Observation", icon: Lightbulb, color: "pink", desc: "Market observations & hypotheses" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  amber:   { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", ring: "ring-amber-500" },
  blue:    { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", ring: "ring-blue-500" },
  purple:  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", ring: "ring-purple-500" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", ring: "ring-emerald-500" },
  pink:    { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", ring: "ring-pink-500" },
};

function NewJournalPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [formData, setFormData] = useState<Record<string, any>>({
    date: new Date().toISOString().split('T')[0],
    moodScore: 7,
    sleepScore: 7,
    stressScore: 4,
    marketBias: "NEUTRAL",
    dayScore: 7,
    planCompliance: 80,
    weekScore: 7,
    processScore: 7,
    relatedSymbols: [],
    linkedTradeIds: [],
    topTradeIds: [],
    worstTradeIds: [],
    deviationsFromPlan: [],
    tradingRuleIds: [],
    brokenRuleIds: [],
    toTest: false,
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const saveEntry = useCallback(async (asDraft = true) => {
    if (!selectedType) return;
    setSaving(true);
    setError(null);
    try {
      const body = { ...formData, type: selectedType, isDraft: asDraft };
      let res;
      if (entryId) {
        res = await fetch(`/api/journal/${entryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      const json = await res.json();
      if (json.success) {
        if (!entryId) setEntryId(json.data.id);
        setLastSaved(new Date());
        if (!asDraft) {
          router.push(`/app/journal/${json.data.id}`);
        }
      } else {
        setError(json.message || 'Failed to save');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [formData, selectedType, entryId, router]);

  // Auto-save every 30s
  useEffect(() => {
    if (!selectedType) return;
    const interval = setInterval(() => saveEntry(true), 30000);
    return () => clearInterval(interval);
  }, [saveEntry, selectedType]);

  if (!selectedType) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">New Journal Entry</h1>
          <p className="text-zinc-500 mt-1">Choose the type of entry you want to create</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {JOURNAL_TYPES.map((t) => {
            const Icon = t.icon;
            const colors = COLOR_MAP[t.color];
            return (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all text-left group`}
              >
                <div className={`w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={22} className={colors.text} />
                </div>
                <div>
                  <p className={`font-bold text-white`}>{t.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const typeConfig = JOURNAL_TYPES.find((t) => t.value === selectedType)!;
  const colors = COLOR_MAP[typeConfig.color];
  const Icon = typeConfig.icon;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <Icon size={18} className={colors.text} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{typeConfig.label}</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {saving ? (
                <span className="flex items-center gap-1 text-indigo-400"><Loader2 size={10} className="animate-spin" /> Saving...</span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1 text-emerald-500"><Check size={10} /> Autosaved {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span>Draft — not yet saved</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => saveEntry(true)} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
            <Save size={14} /> Save Draft
          </button>
          <button onClick={() => saveEntry(false)} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            Finalize
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Date Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => set('date', e.target.value)}
          className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* DAILY FORM */}
      {selectedType === "DAILY" && (
        <>
          <SectionDivider title="Pre-Market" subtitle="Mindset check-in before you trade" icon={<Sun size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-zinc-900/30 border border-white/5 rounded-2xl">
            <SliderField label="Mood Score" value={formData.moodScore} onChange={(v) => set('moodScore', v)} emoji leftLabel="😤" rightLabel="🤩" />
            <SliderField label="Sleep Quality" value={formData.sleepScore} onChange={(v) => set('sleepScore', v)} leftLabel="Poor" rightLabel="Great" />
            <SliderField label="Stress Level" value={formData.stressScore} onChange={(v) => set('stressScore', v)} leftLabel="Calm" rightLabel="Max" color="red" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Market Bias"
              value={formData.marketBias}
              onChange={(v) => set('marketBias', v)}
              options={[
                { value: "BULLISH", label: "📈 Bullish" },
                { value: "BEARISH", label: "📉 Bearish" },
                { value: "NEUTRAL", label: "➡️ Neutral" },
                { value: "NO_VIEW", label: "🤷 No View" },
              ]}
            />
            <NumberInput label="Risk Budget for Today" value={formData.riskBudgetForDay} onChange={(v) => set('riskBudgetForDay', v)} prefix="₹" placeholder="e.g. 5000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Pre-Market Notes & Plan</label>
            <TipTapEditor
              content={formData.preMarketNotes || ""}
              onChange={(html) => set('preMarketNotes', html)}
              onAutoSave={(html) => { set('preMarketNotes', html); saveEntry(true); }}
              placeholder="Macro view, key levels, instruments to watch, today's rules..."
              minHeight={200}
            />
          </div>
          <SectionDivider title="Post-Market" subtitle="End-of-day review" icon={<BarChart3 size={14} />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-zinc-900/30 border border-white/5 rounded-2xl">
            <SliderField label="Day Score" value={formData.dayScore} onChange={(v) => set('dayScore', v)} leftLabel="Worst" rightLabel="Perfect" />
            <SliderField label="Plan Compliance" value={formData.planCompliance} onChange={(v) => set('planCompliance', v)} min={0} max={100} leftLabel="0%" rightLabel="100%" color="emerald" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Post-Market Notes</label>
            <TipTapEditor
              content={formData.postMarketNotes || ""}
              onChange={(html) => set('postMarketNotes', html)}
              onAutoSave={(html) => { set('postMarketNotes', html); saveEntry(true); }}
              placeholder="What happened today, key lessons, trades taken..."
              minHeight={200}
            />
          </div>
        </>
      )}

      {/* WEEKLY FORM */}
      {selectedType === "WEEKLY" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Week Start</label>
              <input type="date" value={formData.weekStart || ''} onChange={(e) => set('weekStart', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Week End</label>
              <input type="date" value={formData.weekEnd || ''} onChange={(e) => set('weekEnd', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-zinc-900/30 border border-white/5 rounded-2xl">
            <SliderField label="Week Score" value={formData.weekScore} onChange={(v) => set('weekScore', v)} leftLabel="Terrible" rightLabel="Best Week" />
            <SliderField label="Process Score" value={formData.processScore} onChange={(v) => set('processScore', v)} leftLabel="Undisciplined" rightLabel="Pristine" color="emerald" />
          </div>
          {[
            { key: 'whatWorked', label: 'What Worked', placeholder: 'Setups, mindset, execution wins...' },
            { key: 'whatDidntWork', label: "What Didn't Work", placeholder: 'Mistakes, deviations, bad habits...' },
            { key: 'focusForNextWeek', label: 'Focus for Next Week', placeholder: 'One thing to improve, key intention...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">{label}</label>
              <TipTapEditor
                content={formData[key] || ""}
                onChange={(html) => set(key, html)}
                onAutoSave={(html) => { set(key, html); saveEntry(true); }}
                placeholder={placeholder}
                minHeight={150}
              />
            </div>
          ))}
        </>
      )}

      {/* MONTHLY FORM */}
      {selectedType === "MONTHLY" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Month" value={String(formData.month || new Date().getMonth() + 1)} onChange={(v) => set('month', parseInt(v))} options={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({ value: String(i + 1), label: m }))} />
            <SelectField label="Year" value={String(formData.year || new Date().getFullYear())} onChange={(v) => set('year', parseInt(v))} options={[2024, 2025, 2026].map(y => ({ value: String(y), label: String(y) }))} />
          </div>
          {[
            { key: 'goalReview', label: 'Goals Review', placeholder: 'How did you perform vs. last month\'s goals?' },
            { key: 'goalsForNextMonth', label: 'Goals for Next Month', placeholder: 'Specific, measurable goals for the coming month...' },
            { key: 'overallStrategyAssessment', label: 'Strategy Assessment', placeholder: 'How well did your edge work? What needs updating?' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">{label}</label>
              <TipTapEditor
                content={formData[key] || ""}
                onChange={(html) => set(key, html)}
                onAutoSave={(html) => { set(key, html); saveEntry(true); }}
                placeholder={placeholder}
                minHeight={160}
              />
            </div>
          ))}
        </>
      )}

      {/* TRADE NOTE FORM */}
      {selectedType === "TRADE_NOTE" && (
        <>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Trade ID <span className="text-red-400">*</span></label>
            <input value={formData.linkedTradeId || ''} onChange={(e) => set('linkedTradeId', e.target.value)} placeholder="Paste trade ID..." className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600" />
          </div>
          {[
            { key: 'whatIPlanned', label: 'What I Planned', placeholder: 'Entry criteria, target, stop loss...' },
            { key: 'whatActuallyHappened', label: 'What Actually Happened', placeholder: 'Real execution vs. plan...' },
            { key: 'tradeAnalysis', label: 'Trade Analysis', placeholder: 'Setup quality, execution grade...' },
            { key: 'lessonLearned', label: 'Lesson Learned', placeholder: 'What did this trade teach?' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">{label}</label>
              <TipTapEditor
                content={formData[key] || ""}
                onChange={(html) => set(key, html)}
                onAutoSave={(html) => { set(key, html); saveEntry(true); }}
                placeholder={placeholder}
                minHeight={160}
              />
            </div>
          ))}
        </>
      )}

      {/* IDEA FORM */}
      {selectedType === "IDEA" && (
        <>
          <SelectField
            label="Category"
            value={formData.category || "MARKET_OBSERVATION"}
            onChange={(v) => set('category', v)}
            options={[
              { value: "MARKET_OBSERVATION", label: "📊 Market Observation" },
              { value: "STRATEGY_IDEA", label: "⚡ Strategy Idea" },
              { value: "PSYCHOLOGY", label: "🧠 Psychology" },
            ]}
          />
          <TagInput label="Related Symbols" tags={formData.relatedSymbols || []} onChange={(tags) => set('relatedSymbols', tags)} placeholder="RELIANCE, NIFTY..." />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Idea / Observation</label>
            <TipTapEditor
              content={formData.content || ""}
              onChange={(html) => set('content', html)}
              onAutoSave={(html) => { set('content', html); saveEntry(true); }}
              placeholder="Describe your observation..."
              minHeight={300}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function NewJournalPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="text-indigo-500 animate-spin" size={28} />
      </div>
    }>
      <NewJournalPageContent />
    </Suspense>
  );
}
