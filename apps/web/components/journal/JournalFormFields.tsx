"use client";

import React from "react";

const MOOD_EMOJIS: Record<number, string> = {
  1: "😤", 2: "😞", 3: "😐", 4: "🙂", 5: "😊", 6: "😄", 7: "🤩", 8: "🤩", 9: "🤩", 10: "🤩"
};

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  emoji?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  color?: string;
}

export function SliderField({
  label, value, onChange, min = 1, max = 10, emoji = false, leftLabel, rightLabel, color = "indigo"
}: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const colorMap: Record<string, string> = {
    indigo: "accent-indigo-500",
    emerald: "accent-emerald-500",
    red: "accent-red-500",
    amber: "accent-amber-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <div className="flex items-center gap-2">
          {emoji && <span className="text-xl">{MOOD_EMOJIS[value] || "😐"}</span>}
          <span className="text-sm font-bold font-mono text-indigo-400 min-w-[2rem] text-right">{value}/{max}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-2 rounded-full cursor-pointer ${colorMap[color] || colorMap.indigo}`}
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #27272a ${pct}%, #27272a 100%)`
          }}
        />
        {(leftLabel || rightLabel) && (
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-zinc-600">{leftLabel}</span>
            <span className="text-[10px] text-zinc-600">{rightLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, tags, onChange, placeholder = "Add tag, press Enter" }: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = () => {
    const t = input.trim().toUpperCase();
    if (t && !tags.includes(t)) {
      onChange([...tags, t]);
    }
    setInput("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 bg-zinc-900 border border-white/10 rounded-lg min-h-[42px]">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-indigo-100">×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white focus:outline-none placeholder-zinc-600"
        />
      </div>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function NumberInput({ label, value, onChange, prefix, suffix, placeholder }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <div className="flex items-center gap-0 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
        {prefix && <span className="px-3 py-2.5 text-sm text-zinc-500 border-r border-white/10">{prefix}</span>}
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white focus:outline-none"
        />
        {suffix && <span className="px-3 py-2.5 text-sm text-zinc-500 border-l border-white/10">{suffix}</span>}
      </div>
    </div>
  );
}

interface SectionDividerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function SectionDivider({ title, subtitle, icon }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      {icon && <div className="shrink-0 text-indigo-400">{icon}</div>}
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-white/5 ml-3" />
    </div>
  );
}

interface ReadOnlyStatProps {
  label: string;
  value: string | number | undefined;
  colorClass?: string;
}

export function ReadOnlyStat({ label, value, colorClass = "text-white" }: ReadOnlyStatProps) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
      <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold font-mono ${colorClass}`}>{value ?? "—"}</div>
    </div>
  );
}
