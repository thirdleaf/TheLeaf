"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit3, Check, X, TrendingDown, AlertCircle, Shield,
  Brain, Zap, Target, Loader2, ChevronRight, Activity
} from "lucide-react";

const CATEGORIES = [
  { value: "RISK", label: "Risk", icon: Shield, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  { value: "ENTRY", label: "Entry", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { value: "EXIT", label: "Exit", icon: TrendingDown, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { value: "MINDSET", label: "Mindset", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { value: "SIZING", label: "Sizing", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const categoryMap = new Map(CATEGORIES.map(c => [c.value, c]));

const RULE_STARTERS = [
  "Never trade in first 15 minutes",
  "Max 3 trades per day",
  "Stop trading after 2% daily loss",
  "Always define stop loss before entry",
  "No revenge trading — wait 30 minutes after a loss",
  "Only trade A+ setups above H4 liquidity",
];

// ── Rule Card ──────────────────────────────────────────────────────────────

const RuleCard = ({ rule, onToggle, onDelete, onEdit }: any) => {
  const cat = categoryMap.get(rule.category);
  const Icon = cat?.icon || Zap;
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${rule.isActive ? 'bg-zinc-900/50 border-white/5 hover:border-white/10' : 'bg-zinc-950 border-white/3 opacity-60'}`}>
      <div className={`w-9 h-9 ${cat?.bg || 'bg-zinc-800'} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={15} className={cat?.color || 'text-zinc-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cat?.color || 'text-zinc-400'}`}>{cat?.label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cat?.border} ${cat?.color} ${cat?.bg}`}>{rule.category}</span>
          {rule.breakCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-400 font-medium">
              Broken {rule.breakCount}x
            </span>
          )}
        </div>
        <p className={`text-sm font-semibold leading-snug ${rule.isActive ? 'text-white' : 'text-zinc-500 line-through'}`}>{rule.title}</p>
        {rule.description && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{rule.description}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onToggle(rule)} title={rule.isActive ? 'Disable' : 'Enable'} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${rule.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-zinc-600 hover:bg-white/5'}`}>
          <Check size={14} />
        </button>
        <button onClick={() => onEdit(rule)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
          <Edit3 size={13} />
        </button>
        <button onClick={() => onDelete(rule.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Rule Form ──────────────────────────────────────────────────────────────

const RuleForm = ({ initial, onSave, onCancel }: any) => {
  const [form, setForm] = useState(initial || { title: '', description: '', category: 'RISK', isActive: true });

  return (
    <div className="bg-zinc-900 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-bold text-white">{initial ? 'Edit Rule' : 'New Trading Rule'}</h3>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Rule Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Never trade in the first 15 minutes..."
          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600"
        />
        <div className="flex flex-wrap gap-1.5">
          {RULE_STARTERS.map((s) => (
            <button key={s} type="button" onClick={() => setForm({ ...form, title: s })} className="px-2 py-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg border border-white/5 transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Description (optional)</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          placeholder="Why this rule matters, when it applies..."
          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Category</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = form.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm({ ...form, category: cat.value })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSelected ? `${cat.bg} ${cat.border} ${cat.color}` : 'border-white/10 text-zinc-400 hover:border-white/20'}`}
              >
                <CatIcon size={11} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white transition-colors">
          Cancel
        </button>
        <button onClick={() => onSave(form)} disabled={!form.title} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
          {initial ? 'Update Rule' : 'Add Rule'}
        </button>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────

export default function TradingRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"rules" | "analytics">("rules");

  const fetchRules = async () => {
    const res = await fetch('/api/journal/rules/list');
    const json = await res.json();
    if (json.success) setRules(json.data);
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    const res = await fetch('/api/journal/rules/analytics');
    const json = await res.json();
    if (json.success) setAnalytics(json.data);
  };

  useEffect(() => {
    fetchRules();
    fetchAnalytics();
  }, []);

  const handleSave = async (form: any) => {
    const isEdit = !!form.id;
    const url = isEdit ? `/api/journal/rules/${form.id}` : '/api/journal/rules';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.success) {
      await fetchRules();
      setShowForm(false);
      setEditingRule(null);
    }
  };

  const handleToggle = async (rule: any) => {
    await fetch(`/api/journal/rules/${rule.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !rule.isActive }),
    });
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/journal/rules/${id}`, { method: 'DELETE' });
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const activeRules = rules.filter(r => r.isActive);
  const inactiveRules = rules.filter(r => !r.isActive);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Trading Rules</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Define your trading constitution. Track which rules you break.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingRule(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Plus size={14} /> Add Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-950 border border-white/5 rounded-xl p-1">
        {([
          { key: 'rules', label: 'My Rules' },
          { key: 'analytics', label: 'Break Analytics' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.key ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {(showForm && !editingRule) && (
            <RuleForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          )}
          {editingRule && (
            <RuleForm initial={editingRule} onSave={handleSave} onCancel={() => setEditingRule(null)} />
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl mx-auto flex items-center justify-center">
                <Shield className="text-zinc-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">No rules yet</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Define your trading rules. They'll appear as a checklist in your daily journal.</p>
              </div>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
                <Plus size={15} /> Create First Rule
              </button>
            </div>
          ) : (
            <>
              {activeRules.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 px-1">Active Rules ({activeRules.length})</p>
                  {activeRules.map((rule) => (
                    <RuleCard key={rule.id} rule={rule} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingRule} />
                  ))}
                </div>
              )}
              {inactiveRules.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 px-1">Inactive ({inactiveRules.length})</p>
                  {inactiveRules.map((rule) => (
                    <RuleCard key={rule.id} rule={rule} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditingRule} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {analytics.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 space-y-2">
              <AlertCircle size={28} className="mx-auto" />
              <p className="text-sm">No rule break data yet. Start logging daily journals with rule tracking.</p>
            </div>
          ) : (
            <>
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle size={12} /> Most Frequently Broken Rules
                </p>
                {analytics.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs font-black text-red-400">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.rule?.title || 'Unknown Rule'}</p>
                      <p className="text-xs text-zinc-500">{item.rule?.category} · Broken {item.breakCount}x</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-red-400">-₹{((item.totalCost || 0) / 100).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-zinc-600">cost impact</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-600 shrink-0" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 font-medium mb-1">Total Breaks</p>
                  <p className="text-2xl font-black text-white">{analytics.reduce((a, b) => a + b.breakCount, 0)}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 font-medium mb-1">Total Cost</p>
                  <p className="text-2xl font-black text-red-400">
                    -₹{(analytics.reduce((a, b) => a + (b.totalCost || 0), 0) / 100).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
