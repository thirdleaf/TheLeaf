import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "1",
    name: "Karthik Subramanian",
    handle: "@karthik_trades",
    traderType: "Intraday Index Options Trader",
    location: "Chennai",
    avatar: "KS",
    avatarColor: "#6366f1",
    rating: 5,
    quote:
      "I've tried 4 trading journals before ThirdLeaf. None of them understood Indian taxes. Now I get my STCG/LTCG report in one click. My CA is thrilled.",
  },
  {
    id: "2",
    name: "Priya Mehta",
    handle: "@priya_quant",
    traderType: "Systematic Options Seller",
    location: "Mumbai",
    avatar: "PM",
    avatarColor: "#22c55e",
    rating: 5,
    quote:
      "The Psychology Lab is what separates ThirdLeaf from everything else. I discovered I was entering 80% of losing trades on Mondays before 10 AM. Game changer.",
  },
  {
    id: "3",
    name: "Rahul Gupta",
    handle: "@rahul_nifty50",
    traderType: "Positional Equity Swing Trader",
    location: "Delhi NCR",
    avatar: "RG",
    avatarColor: "#f59e0b",
    rating: 5,
    quote:
      "The Zerodha import is seamless. I uploaded 3 years of trades in minutes. The analytics showed my win rate on breakouts was 71% — I now focus only on that setup.",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// Testimonials Section
// ─────────────────────────────────────────────────────────────
export function Testimonials() {
  return (
    <section id="testimonials" className="section" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container-xl">
        {/* Header */}
        <div
          style={{ textAlign: "left", marginBottom: "var(--spacing-12)" }}
        >
          <span
            className="badge badge-accent"
            style={{ marginBottom: "var(--spacing-4)", display: "inline-block", backgroundColor: "var(--color-surface-2)", color: "var(--color-accent)", border: "1px solid var(--color-border)" }}
          >
            Trader Stories
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
            Trusted by India&apos;s serious traders
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-muted)",
              maxWidth: 500,
            }}
          >
            From intraday scalpers to systematic options sellers — hear from
            traders who found their edge with ThirdLeaf.
          </p>
        </div>

        {/* Testimonials grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--spacing-5)",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              id={`testimonial-${t.id}`}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-4)",
              }}
            >
              {/* Star rating */}
              <div style={{ display: "flex", gap: "var(--spacing-0-5)" }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="var(--color-warning)"
                    color="var(--color-warning)"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: "var(--line-height-relaxed)",
                  flex: 1,
                  margin: 0,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-3)",
                  paddingTop: "var(--spacing-3)",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {/* Avatar */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-full)",
                    backgroundColor: `${t.avatarColor}20`,
                    border: `2px solid ${t.avatarColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "var(--font-size-xs)",
                    color: t.avatarColor,
                    flexShrink: 0,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {t.traderType} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
