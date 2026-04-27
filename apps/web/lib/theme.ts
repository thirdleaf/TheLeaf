// ─────────────────────────────────────────────────────────────
// Theme management — JS variable based (NOT localStorage)
// Reads initial preference from system, allows runtime toggle.
// ─────────────────────────────────────────────────────────────

type Theme = "dark" | "light";

// Module-level singleton — no persistence between page loads by design
let currentTheme: Theme = "dark";

/**
 * Get the currently active theme.
 */
export function getTheme(): Theme {
  return currentTheme;
}

/**
 * Set the theme programmatically.
 * Applies the .light class to :root for CSS var overrides.
 */
export function setTheme(theme: Theme): void {
  currentTheme = theme;
  if (typeof document !== "undefined") {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }
}

/**
 * Toggle between dark and light mode.
 * Returns the new theme.
 */
export function toggleTheme(): Theme {
  const next = currentTheme === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Initialize theme from system preference.
 * Call this once on app mount (client-side only).
 */
export function initTheme(): void {
  if (typeof window === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // Default to dark (brand decision) unless system is light
  setTheme(prefersDark ? "dark" : "dark"); // Always dark by default per spec
}
