// ─────────────────────────────────────────────────────────────
// @thirdleaf/utils — Shared utility functions
// ─────────────────────────────────────────────────────────────

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merge helper ───────────────────────────────

/**
 * Merge Tailwind CSS class names, resolving conflicts correctly.
 * Usage: cn("px-4 py-2", isActive && "bg-accent", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Indian Currency Formatter ──────────────────────────────────

/**
 * Format a number in Indian number system with ₹ symbol.
 * Examples:
 *   formatIndianCurrency(123456)    → "₹1,23,456"
 *   formatIndianCurrency(1234567)   → "₹12,34,567"
 *   formatIndianCurrency(-9876.50)  → "-₹9,876.50"
 *   formatIndianCurrency(1234567.89, { decimals: 2 }) → "₹12,34,567.89"
 */
export function formatIndianCurrency(
  value: number,
  options: { decimals?: number; showSign?: boolean } = {}
): string {
  const { decimals = 0, showSign = false } = options;
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const [intPart, decPart] = absValue.toFixed(decimals).split(".");

  // Indian grouping: last 3 digits, then groups of 2
  let formatted = "";
  const intStr = intPart ?? "";
  if (intStr.length <= 3) {
    formatted = intStr;
  } else {
    const lastThree = intStr.slice(-3);
    const rest = intStr.slice(0, -3);
    const groups: string[] = [];
    for (let i = rest.length; i > 0; i -= 2) {
      groups.unshift(rest.slice(Math.max(0, i - 2), i));
    }
    formatted = groups.join(",") + "," + lastThree;
  }

  const sign = isNegative ? "-" : showSign && value > 0 ? "+" : "";
  const decimal = decPart !== undefined ? "." + decPart : "";
  return `${sign}₹${formatted}${decimal}`;
}

/**
 * Format a large number in short Indian notation.
 * Examples:
 *   formatIndianShort(1000000)    → "₹10L"
 *   formatIndianShort(10000000)   → "₹1Cr"
 *   formatIndianShort(500000)     → "₹5L"
 */
export function formatIndianShort(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 10_000_000) {
    return `${sign}₹${(absValue / 10_000_000).toFixed(2)}Cr`;
  }
  if (absValue >= 100_000) {
    return `${sign}₹${(absValue / 100_000).toFixed(2)}L`;
  }
  if (absValue >= 1_000) {
    return `${sign}₹${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${sign}₹${absValue}`;
}

// ── Date & Time Formatting ────────────────────────────────────

const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Format a date/timestamp in IST by default.
 * Returns format: "14 Apr 2026, 10:30 AM"
 */
export function formatDateTime(
  date: Date | string | number,
  timezone: string = IST_TIMEZONE
): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date only (no time).
 * Returns: "14 Apr 2026"
 */
export function formatDate(
  date: Date | string | number,
  timezone: string = IST_TIMEZONE
): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time only.
 * Returns: "10:30 AM"
 */
export function formatTime(
  date: Date | string | number,
  timezone: string = IST_TIMEZONE
): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-IN", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get relative time string.
 * Returns: "2 hours ago", "just now", "3 days ago"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(d);
}

// ── P&L and Percentage Formatters ────────────────────────────

/**
 * Format a P&L number with sign and color class hint.
 * Returns object with formatted string and semantic color key.
 */
export function formatPnL(value: number): {
  formatted: string;
  colorClass: "success" | "danger" | "muted";
} {
  if (value === 0) {
    return { formatted: "₹0", colorClass: "muted" };
  }
  const formatted = formatIndianCurrency(Math.abs(value));
  const sign = value > 0 ? "+" : "-";
  return {
    formatted: `${sign}${formatted}`,
    colorClass: value > 0 ? "success" : "danger",
  };
}

/**
 * Format a percentage with sign.
 * Examples: formatPercentage(12.5) → "+12.50%"
 *           formatPercentage(-3.2) → "-3.20%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(decimals)}%`;
}

// ── Number Utilities ─────────────────────────────────────────

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to a given number of decimal places.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate percentage change between two values.
 */
export function percentageChange(from: number, to: number): number {
  if (from === 0) return 0;
  return roundTo(((to - from) / Math.abs(from)) * 100, 2);
}

// ── String Utilities ──────────────────────────────────────────

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Convert a string to title case.
 */
export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate a slug from a string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Validation Helpers ────────────────────────────────────────

/**
 * Check if a string is a valid email address.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Check if a string is a valid Indian mobile number.
 */
export function isValidIndianMobile(phone: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// ── Trade Calc Utilities ───────────────────────────────────────

/**
 * Calculate risk-reward ratio.
 */
export function calcRiskReward(
  entry: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  if (risk === 0) return 0;
  return roundTo(reward / risk, 2);
}

/**
 * Calculate position size based on capital, risk %, and stop distance.
 */
export function calcPositionSize(
  capital: number,
  riskPercent: number,
  entry: number,
  stopLoss: number
): number {
  const riskAmount = (capital * riskPercent) / 100;
  const stopDistance = Math.abs(entry - stopLoss);
  if (stopDistance === 0) return 0;
  return Math.floor(riskAmount / stopDistance);
}

// ── Strict Numeric & Accounting Conversions ─────────────────────

/**
 * Parses a string amount (e.g. "1250.50") into a pure integer in paise/cents.
 */
export function parseToCents(amount: string | number): number {
  if (!amount) return 0;
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return Math.round(num * 100);
}

/**
 * Converts a pure integer in paise/cents back to a standard string.
 */
export function centsToAmountString(cents: number): string {
  return (cents / 100).toFixed(2);
}

// ── Active Trade Computations ─────────────────────────────────

/**
 * Returns holding duration in seconds
 */
export function calcHoldDuration(entryTime: Date | string, exitTime: Date | string): number {
  const e1 = new Date(entryTime).getTime();
  const e2 = new Date(exitTime).getTime();
  return Math.max(0, Math.floor((e2 - e1) / 1000));
}

/**
 * Calculates raw Gross PnL in Cents based on direction.
 * Note: Assumes prices are passed as underlying base numbers (not cents) or respects scalar math.
 * Standard usage would be: exit/entry as cents, quantity as multiplier.
 * Formula:
 * Long: (Exit - Entry) * Qty
 * Short: (Entry - Exit) * Qty
 */
export function calcGrossPnl(direction: "LONG" | "SHORT", entryCents: number, exitCents: number, qty: number): number {
  if (direction === "LONG") {
    return (exitCents - entryCents) * qty;
  }
  return (entryCents - exitCents) * qty;
}

/**
 * Calculates R-Multiple given an exit point in base price. Returns base scalar R ratio.
 */
export function calcRMultiple(direction: "LONG" | "SHORT", entryPrice: number, slPrice: number, exitPrice: number): number {
  const risk = Math.abs(entryPrice - slPrice);
  if (risk === 0) return 0; // Avoid Div0
  
  const reward = direction === "LONG" 
    ? exitPrice - entryPrice 
    : entryPrice - exitPrice;
    
  return roundTo(reward / risk, 2);
}
