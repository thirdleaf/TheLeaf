// ─────────────────────────────────────────────────────────────
// Theme management — LocalStorage based persistence
// ─────────────────────────────────────────────────────────────

type Theme = "dark" | "light";

const THEME_KEY = "thirdleaf-theme";

/**
 * Get the currently active theme.
 */
export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  
  // Default to light
  return "light";
}

/**
 * Set the theme programmatically.
 * Applies the .light class to :root for CSS var overrides.
 */
export function setTheme(theme: Theme): void {
  if (typeof document !== "undefined") {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem(THEME_KEY, theme);
  }
}

/**
 * Toggle between dark and light mode.
 * Returns the new theme.
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Initialize theme from system preference or storage.
 */
export function initTheme(): void {
  if (typeof window === "undefined") return;
  const theme = getTheme();
  setTheme(theme);
}
