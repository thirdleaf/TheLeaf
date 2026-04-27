import {
  BookOpen,
  FlaskConical,
  Calculator,
  BarChart3,
  Brain,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Feature card data
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "journal",
    icon: BookOpen,
    title: "Advanced Journal",
    description:
      "Log trades with entry/exit screenshots, mood tags, and trade notes. Import directly from Zerodha, Upstox, Angel One, Fyers, and Dhan.",
    badge: "Core",
  },
  {
    id: "backtesting",
    icon: FlaskConical,
    title: "Strategy Backtesting",
    description:
      "Test your setups on years of NSE/BSE tick data. Analyze expectancy, max drawdown, Sharpe ratio, and CAGR — no code required.",
    badge: "Quant",
  },
  {
    id: "tax",
    icon: Calculator,
    title: "India Tax Engine",
    description:
      "Auto-calculate STCG, LTCG, F&O business income, STT, brokerage, and stamp duty. Export CA-ready P&L statements in one click.",
    badge: "India-first",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Live P&L dashboard updated via Socket.IO. Equity curve, drawdown chart, time-of-day heatmap, symbol-wise breakdown, and more.",
    badge: "Live",
  },
  {
    id: "psychology",
    icon: Brain,
    title: "Psychology Lab",
    description:
      "Track pre-trade mood, FOMO score, and rule adherence. Identify your emotional patterns with weekly psych reports.",
    badge: "Unique",
  },
  {
    id: "automation",
    icon: Zap,
    title: "Automation Builder",
    description:
      "Build no-code webhooks and alert automations. Connect with Telegram, Discord, or your broker API to execute signals automatically.",
    badge: "Pro",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// Features Grid Section
// ─────────────────────────────────────────────────────────────
export function Features() {
  return (
    <section
      id="features"
      className="section"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="container-xl">
        {/* Header */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "var(--spacing-12)",
          }}
        >
          <span
            className="badge badge-accent"
            style={{ marginBottom: "var(--spacing-4)", display: "inline-block", backgroundColor: "var(--color-surface-2)", color: "var(--color-accent)", border: "1px solid var(--color-border)" }}
          >
            Platform Features
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            Everything serious traders need
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-muted)",
              maxWidth: 560,
            }}
          >
            From journaling your first trade to running systematic backtests —
            ThirdLeaf covers the full trading lifecycle.
          </p>
        </div>

        {/* 2-col card grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={`feature-card-${feature.id}`}
                className="card card-hover"
                style={{ backgroundColor: "var(--color-surface-2)" }}
              >
                {/* Icon */}
                <div
                  style={{
                    marginBottom: "var(--spacing-4)",
                    display: "flex",
                  }}
                >
                  <Icon size={24} color="var(--color-text-primary)" strokeWidth={1.5} />
                </div>

                {/* Title + Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-2)",
                    marginBottom: "var(--spacing-2)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "var(--font-size-base)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "var(--color-surface-2)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-muted)",
                    lineHeight: "var(--line-height-relaxed)",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
