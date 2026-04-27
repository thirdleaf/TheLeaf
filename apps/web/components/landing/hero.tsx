"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Animated Equity Curve SVG
// Draws itself on mount using SVG stroke-dashoffset animation.
// Uses an upward-trending path to convey growth.
// ─────────────────────────────────────────────────────────────
function EquityCurve() {
  const pathRef = useRef<SVGPathElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Points for an equity curve with realistic ups and downs, trending upward
  const points = [
    [0, 140],
    [40, 130],
    [80, 145],
    [120, 118],
    [160, 125],
    [200, 100],
    [240, 115],
    [280, 88],
    [320, 78],
    [360, 95],
    [400, 70],
    [440, 58],
    [480, 72],
    [520, 45],
    [560, 35],
    [600, 20],
  ] as const;

  // Smooth curve using cubic bezier approximation
  function pointsToPath(pts: readonly (readonly [number, number])[]): string {
    if (pts.length < 2) return "";
    let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const curr = pts[i]!;
      const cpx = (prev[0] + curr[0]) / 2;
      d += ` C ${cpx} ${prev[1]}, ${cpx} ${curr[1]}, ${curr[0]} ${curr[1]}`;
    }
    return d;
  }

  const pathD = pointsToPath(points);

  // Area fill path
  const areaD =
    pathD + ` L ${points[points.length - 1]![0]} 160 L ${points[0]![0]} 160 Z`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
      }}
    >
      {/* Chart card */}
      <div
        className="card"
        style={{
          padding: "var(--spacing-5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chart header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-4)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--spacing-0-5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Portfolio P&L
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: 700,
                color: "var(--color-success)",
              }}
            >
              +₹2,34,891
            </p>
          </div>
          <div
            className="badge badge-success"
            style={{ fontSize: "var(--font-size-sm)" }}
          >
            <TrendingUp size={12} />
            +18.4%
          </div>
        </div>

        {/* SVG Chart */}
        <svg
          width="100%"
          viewBox="0 0 600 160"
          preserveAspectRatio="none"
          role="img"
          aria-label="Portfolio equity curve showing upward trend"
          style={{ display: "block", height: 120 }}
        >


          {/* Area fill (static, appears after path draws) */}
          {mounted && (
            <path
              d={areaD}
              fill="url(#equity-gradient)"
              opacity="0"
              style={{
                animation: "fade-area 0.8s ease-out 2.5s forwards",
              }}
            />
          )}

          {/* Main equity curve */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={mounted ? "equity-path" : ""}
          />

          {/* End dot pulse */}
          {mounted && (
            <>
              <circle
                cx="600"
                cy="20"
                r="5"
                fill="#22c55e"
                opacity="0"
                style={{ animation: "fade-area 0.3s ease-out 2.8s forwards" }}
              />
              <circle
                cx="600"
                cy="20"
                r="10"
                fill="rgba(34,197,94,0.2)"
                opacity="0"
                style={{
                  animation: "fade-area 0.3s ease-out 2.8s forwards, pulse-ring 2s ease-in-out 3s infinite",
                }}
              />
            </>
          )}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="equity-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "var(--spacing-2)",
          }}
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span
              key={m}
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-disabled)",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Floating metric badges - Hidden on small mobile to prevent overflow */}
      <div
        className="card hidden sm:flex"
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          padding: "var(--spacing-2) var(--spacing-3)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-secondary)",
          animation: "fade-in 0.5s ease-out 3s both",
        }}
      >
        <span style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
          Win Rate
        </span>
        <span className="font-mono" style={{ color: "var(--color-success)", fontWeight: 600 }}>
          67.4%
        </span>
      </div>

      <div
        className="card hidden sm:flex"
        style={{
          position: "absolute",
          bottom: 20,
          left: -16,
          padding: "var(--spacing-2) var(--spacing-3)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-secondary)",
          animation: "fade-in 0.5s ease-out 3.2s both",
        }}
      >
        <span style={{ color: "var(--color-text-muted)", marginRight: 6 }}>
          R:R
        </span>
        <span className="font-mono" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
          2.4:1
        </span>
      </div>

      <style jsx>{`
        @keyframes fade-area {
          to { opacity: 1; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "var(--spacing-32)",
        paddingBottom: "var(--spacing-20)",
      }}
    >
      {/* Pure black/dark structured background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--color-bg)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
          {/* Left: copy */}
          <div className="mx-auto lg:mx-0" style={{ maxWidth: 680 }}>
            {/* Pill badge */}
            <div
              style={{ marginBottom: "var(--spacing-5)" }}
              className="animate-fade-in"
            >
              <span className="badge badge-accent" style={{ fontSize: "var(--font-size-xs)" }}>
                🇮🇳 India-first quant workspace
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-delay-1"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-5)",
              }}
            >
              Trade Smarter.{" "}
              <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Journal Deeper.</span>
              <br />
              Trade your edge.
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-in-delay-2"
              style={{
                fontSize: "var(--font-size-lg)",
                color: "var(--color-text-muted)",
                lineHeight: "var(--line-height-relaxed)",
                marginBottom: "var(--spacing-8)",
                maxWidth: 560,
              }}
            >
              The professional trading journal, backtesting suite, and
              automation workspace built for Indian markets — NSE, BSE, MCX
              and F&O. Know your edge. Scale it systematically.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-in-delay-3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "var(--spacing-3)",
                marginBottom: "var(--spacing-8)",
              }}
            >
              <style jsx>{`
                @media (min-width: 1024px) {
                  div { justify-content: flex-start !important; }
                }
              `}</style>
              <Link
                href="/register"
                id="cta-hero-start-free"
                className="btn btn-primary"
                style={{ fontSize: "var(--font-size-base)", padding: "12px 28px" }}
              >
                Start Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                id="cta-hero-see-demo"
                className="btn btn-secondary"
                style={{ fontSize: "var(--font-size-base)", padding: "12px 28px" }}
              >
                <Play size={16} />
                See Demo
              </a>
            </div>

            {/* Social proof numbers */}
            <div
              className="animate-fade-in-delay-3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "var(--spacing-6)",
              }}
            >
              <style jsx>{`
                @media (min-width: 1024px) {
                  div { justify-content: flex-start !important; }
                }
              `}</style>
              {[
                { value: "2,400+", label: "Active traders" },
                { value: "₹847Cr+", label: "Trades logged" },
                { value: "4.9/5", label: "Average rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: "var(--font-size-xl)",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: equity curve demo */}
          <div style={{ padding: "var(--spacing-4)" }}>
            <EquityCurve />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
