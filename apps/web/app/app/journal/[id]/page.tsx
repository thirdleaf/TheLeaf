"use client";

import React, { useState, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, Lock, Unlock, Sparkles, Brain, Loader2,
  AlertCircle, CheckCircle2, MessageSquare, Eye, Edit3, Trash2
} from "lucide-react";

const JOURNAl_PURIFY_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'img'],
  ALLOWED_ATTR: ['src', 'alt', 'width', 'height'],
};

const SanitizeHTML = ({ html, className, fallback = '' }: { html: string; className: string; fallback?: string }) => {
  const clean = DOMPurify.sanitize(html || fallback, JOURNAl_PURIFY_CONFIG);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
};
import { TipTapEditor } from "../../../../components/journal/TipTapEditor";
import { SliderField, ReadOnlyStat, SectionDivider } from "../../../../components/journal/JournalFormFields";

const JOURNAL_TYPE_LABELS: Record<string, string> = {
  DAILY: "Daily Journal",
  WEEKLY: "Weekly Review",
  MONTHLY: "Monthly Review",
  TRADE_NOTE: "Trade Note",
  IDEA: "Idea / Observation",
};

// ── AI Coach Panel ───────────────────────────────────────────────────────────

const AiCoachPanel = ({ entryId, existingReflection }: { entryId: string; existingReflection: any | null }) => {
  const [reflection, setReflection] = useState(existingReflection);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokensEst] = useState("~250 tokens");

  const getReflection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/journal/${entryId}/ai-reflect`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setReflection(json.data);
      } else {
        setError(json.message || 'AI service unavailable');
      }
    } catch (e: any) {
      setError('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-950/30 to-zinc-900/50 border border-indigo-500/15 rounded-2xl p-5 sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-indigo-500/15 rounded-xl flex items-center justify-center">
          <Brain className="text-indigo-400" size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Journal Coach</h3>
          <p className="text-[10px] text-zinc-500">Powered by GPT-4o</p>
        </div>
      </div>

      {!reflection ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Get personalized feedback on this entry. The AI will identify what you did well, spot blind spots, and ask a powerful reflection question.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Sparkles size={11} className="text-amber-400" />
            <span>Estimated: {tokensEst} · Limit: 5/day</span>
          </div>
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              <AlertCircle size={12} /> {error}
            </div>
          )}
          <button
            onClick={getReflection}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? "Analyzing..." : "Get AI Feedback"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle2 size={11} /> What You Did Well
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{reflection.whatYouDidWell}</p>
          </div>
          <div className="space-y-1 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Eye size={11} /> Blind Spot
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{reflection.blindSpots}</p>
          </div>
          <div className="space-y-1 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <MessageSquare size={11} /> Reflection Question
            </div>
            <p className="text-xs text-zinc-200 italic leading-relaxed">"{reflection.reflectionQuestion}"</p>
          </div>
          <div className="pt-2">
            <button onClick={() => setReflection(null)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Get new reflection →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Detail Page ─────────────────────────────────────────────────────────

export default function JournalEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const set = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      const res = await fetch(`/api/journal/${id}`);
      const json = await res.json();
      if (json.success) {
        setEntry(json.data);
        setFormData(json.data);
      }
      setLoading(false);
    };
    fetchEntry();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/journal/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.success) {
      setEntry(json.data);
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleLock = async () => {
    const res = await fetch(`/api/journal/${id}/lock`, { method: 'POST' });
    const json = await res.json();
    if (json.success) setEntry((prev: any) => ({ ...prev, isLocked: true, isDraft: false }));
  };

  const handleUnlock = async () => {
    const res = await fetch(`/api/journal/${id}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmed: true }),
    });
    const json = await res.json();
    if (json.success) {
      setEntry((prev: any) => ({ ...prev, isLocked: false }));
      setShowUnlock(false);
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) router.push('/app/journal');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="text-indigo-500 animate-spin" size={28} />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400">Entry not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-indigo-400 hover:underline">Go back</button>
      </div>
    );
  }

  const dateLabel = new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col xl:flex-row gap-6">

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400">{JOURNAL_TYPE_LABELS[entry.type]}</span>
                {entry.isDraft && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-zinc-700 text-zinc-300 rounded">DRAFT</span>}
                {entry.isLocked && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/15 text-amber-400 rounded">🔒 LOCKED</span>}
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">{entry.title}</h1>
              <p className="text-sm text-zinc-500 mt-0.5">{dateLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {entry.isLocked ? (
              <button onClick={() => setShowUnlock(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 text-amber-400 text-xs hover:bg-amber-500/10 transition-colors">
                <Unlock size={12} /> Unlock
              </button>
            ) : (
              <>
                <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${isEditing ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
                  <Edit3 size={12} /> {isEditing ? 'Preview' : 'Edit'}
                </button>
                <button onClick={handleLock} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors">
                  <Lock size={12} /> Finalize
                </button>
              </>
            )}
            <button onClick={() => setShowDelete(true)} className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Scores Row */}
        {(entry.moodScore || entry.dayScore || entry.planCompliance) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {entry.moodScore && (
              <ReadOnlyStat label="Mood" value={`${entry.moodScore}/10`} colorClass={entry.moodScore >= 7 ? "text-emerald-400" : entry.moodScore >= 5 ? "text-amber-400" : "text-red-400"} />
            )}
            {entry.sleepScore && <ReadOnlyStat label="Sleep" value={`${entry.sleepScore}/10`} />}
            {entry.dayScore && (
              <ReadOnlyStat label="Day Score" value={`${entry.dayScore}/10`} colorClass={entry.dayScore >= 7 ? "text-emerald-400" : "text-amber-400"} />
            )}
            {entry.planCompliance != null && (
              <ReadOnlyStat label="Compliance" value={`${entry.planCompliance}%`} colorClass={entry.planCompliance >= 70 ? "text-emerald-400" : "text-amber-400"} />
            )}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Daily Type */}
          {entry.type === "DAILY" && (
            <>
              {(entry.preMarketNotes || isEditing) && (
                <div>
                  <SectionDivider title="Pre-Market Notes" />
                  {isEditing ? (
                    <TipTapEditor content={formData.preMarketNotes || ''} onChange={(html) => set('preMarketNotes', html)} minHeight={200} />
                  ) : (
                    <SanitizeHTML 
                      html={entry.preMarketNotes} 
                      className="prose prose-invert prose-sm max-w-none p-4 bg-zinc-900/30 border border-white/5 rounded-xl"
                      fallback='<p class="text-zinc-600 italic">No pre-market notes</p>' 
                    />
                  )}
                </div>
              )}
              {(entry.postMarketNotes || isEditing) && (
                <div>
                  <SectionDivider title="Post-Market Review" />
                  {isEditing ? (
                    <TipTapEditor content={formData.postMarketNotes || ''} onChange={(html) => set('postMarketNotes', html)} minHeight={200} />
                  ) : (
                    <SanitizeHTML 
                      html={entry.postMarketNotes} 
                      className="prose prose-invert prose-sm max-w-none p-4 bg-zinc-900/30 border border-white/5 rounded-xl"
                      fallback='<p class="text-zinc-600 italic">No post-market notes yet</p>' 
                    />
                  )}
                </div>
              )}
            </>
          )}

          {/* Weekly/Monthly text sections */}
          {(entry.type === "WEEKLY" || entry.type === "MONTHLY") && (
            <>
              {[
                { key: 'whatWorked', title: 'What Worked' },
                { key: 'whatDidntWork', title: "What Didn't Work" },
                { key: 'focusForNextWeek', title: 'Focus for Next Week' },
                { key: 'goalReview', title: 'Goals Review' },
                { key: 'goalsForNextMonth', title: 'Goals for Next Month' },
                { key: 'overallStrategyAssessment', title: 'Strategy Assessment' },
              ].filter(({ key }) => entry[key] || isEditing).map(({ key, title }) => (
                <div key={key}>
                  <SectionDivider title={title} />
                  {isEditing ? (
                    <TipTapEditor content={formData[key] || ''} onChange={(html) => set(key, html)} minHeight={150} />
                  ) : (
                    <SanitizeHTML 
                       html={entry[key]} 
                       className="prose prose-invert prose-sm max-w-none p-4 bg-zinc-900/30 border border-white/5 rounded-xl"
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Trade Note sections */}
          {entry.type === "TRADE_NOTE" && (
            <>
              {[
                { key: 'whatIPlanned', title: 'What I Planned' },
                { key: 'whatActuallyHappened', title: 'What Actually Happened' },
                { key: 'tradeAnalysis', title: 'Trade Analysis' },
                { key: 'lessonLearned', title: 'Lesson Learned' },
              ].filter(({ key }) => entry[key] || isEditing).map(({ key, title }) => (
                <div key={key}>
                  <SectionDivider title={title} />
                  {isEditing ? (
                    <TipTapEditor content={formData[key] || ''} onChange={(html) => set(key, html)} minHeight={130} />
                  ) : (
                    <SanitizeHTML 
                       html={entry[key]} 
                       className="prose prose-invert prose-sm max-w-none p-4 bg-zinc-900/30 border border-white/5 rounded-xl"
                    />
                  )}
                </div>
              ))}
              {entry.deviationsFromPlan?.length > 0 && (
                <div>
                  <SectionDivider title="Deviations from Plan" />
                  <div className="flex flex-wrap gap-2">
                    {entry.deviationsFromPlan.map((d: string) => (
                      <span key={d} className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/20">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {entry.nextTimeIWill && (
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Next Time I Will</p>
                  <p className="text-sm text-zinc-300">{entry.nextTimeIWill}</p>
                </div>
              )}
            </>
          )}

          {/* Idea content */}
          {entry.type === "IDEA" && (
            <>
              {entry.content && (
                <SanitizeHTML 
                  html={entry.content} 
                  className="prose prose-invert prose-sm max-w-none p-5 bg-zinc-900/30 border border-white/5 rounded-xl"
                />
              )}
              {entry.hypothesis && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Hypothesis</p>
                  <p className="text-sm text-zinc-300">{entry.hypothesis}</p>
                </div>
              )}
              {entry.relatedSymbols?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-zinc-500">Related:</span>
                  {entry.relatedSymbols.map((sym: string) => (
                    <span key={sym} className="px-2 py-0.5 text-xs font-mono font-bold bg-zinc-800 text-zinc-200 rounded">{sym}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Save button when editing */}
        {isEditing && (
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null} Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ── AI Coach Sidebar ───────────────────────────────────────────── */}
      <div className="w-full xl:w-72 2xl:w-80 shrink-0">
        <AiCoachPanel entryId={id} existingReflection={null} />
      </div>

      {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Trash2 className="text-red-400" size={18} />
              </div>
              <h3 className="font-bold text-white">Delete Entry?</h3>
            </div>
            <p className="text-sm text-zinc-400">This entry will be soft-deleted and hidden from the journal. You can recover it later if needed.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unlock Confirmation Modal ──────────────────────────────────── */}
      {showUnlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Unlock className="text-amber-400" size={18} />
              </div>
              <h3 className="font-bold text-white">Unlock Entry?</h3>
            </div>
            <p className="text-sm text-zinc-400">Unlocking will allow editing of this finalized entry. This action is intentional and tracked.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowUnlock(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleUnlock} className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors">Unlock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
