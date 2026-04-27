"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { toggleTheme, getTheme } from "../../lib/theme";

// ─────────────────────────────────────────────────────────────
// Theme Toggle Button
// Switches between dark/light mode using JS module variable.
// ─────────────────────────────────────────────────────────────
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getTheme() === "dark");

  function handleToggle() {
    const next = toggleTheme();
    setIsDark(next === "dark");
  }

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-muted)",
        transition: "border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-strong)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
