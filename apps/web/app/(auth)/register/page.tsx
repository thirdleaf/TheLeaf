"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Logo (same as login)
// ─────────────────────────────────────────────────────────────
function ThirdLeafLogo() {
  return (
    <img
      src="/logo.svg"
      alt="ThirdLeaf Logo"
      width={240}
      height={120}
      style={{ objectFit: "contain", margin: "-20px 0" }}
    />
  );
}

type Step = "email" | "otp" | "password" | "onboarding";

const TRADER_TYPES = [
  { id: "intraday", label: "Intraday Trader", emoji: "⚡" },
  { id: "swing", label: "Swing Trader", emoji: "📈" },
  { id: "positional", label: "Positional Trader", emoji: "🏦" },
  { id: "options", label: "Options Seller", emoji: "🎯" },
  { id: "algo", label: "Algo / Quant Trader", emoji: "🤖" },
  { id: "investor", label: "Long-term Investor", emoji: "🧘" },
];

// ─────────────────────────────────────────────────────────────
// Register Page — multi-step flow
// ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [traderType, setTraderType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Step 1: Send OTP to email ────────────────────────────────
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: email,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("otp");
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message: string; longMessage?: string }>;
      };
      setError(
        clerkError.errors?.[0]?.longMessage ??
          clerkError.errors?.[0]?.message ??
          "Failed to send verification code."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────
  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/app/dashboard?sync=true");
        return;
      }

      // More steps needed (password)
      setStep("password");
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message: string; longMessage?: string }>;
      };
      setError(
        clerkError.errors?.[0]?.longMessage ??
          clerkError.errors?.[0]?.message ??
          "Invalid verification code."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 3: Set password ─────────────────────────────────────
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.update({ password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStep("onboarding");
        return;
      }
      setStep("onboarding");
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message: string; longMessage?: string }>;
      };
      setError(
        clerkError.errors?.[0]?.longMessage ??
          clerkError.errors?.[0]?.message ??
          "Failed to set password."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 4: Onboarding ───────────────────────────────────────
  async function handleOnboardingComplete(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    // HANDOFF: Instead of syncing here (where session might be stale),
    // we redirect to dashboard with the data. Dashboard will handle it.
    console.log(`[DEBUG-SYNC] Handoff to dashboard: type=${traderType}`);
    router.push(`/app/dashboard?sync=true&type=${traderType}`);
  }

  const steps: Record<Step, number> = {
    email: 1,
    otp: 2,
    password: 3,
    onboarding: 4,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "var(--spacing-8) var(--spacing-4)",
        width: "100%",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "var(--spacing-5)", textAlign: "center" }}>
        <ThirdLeafLogo />
      </div>

      {/* Card */}
      <div className="card" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-2)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          {(["email", "otp", "password", "onboarding"] as Step[]).map(
            (s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: "3px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor:
                    steps[step] > i
                      ? "var(--color-accent)"
                      : steps[step] === i + 1
                        ? "var(--color-accent)"
                        : "var(--color-border-strong)",
                  transition: "background-color var(--transition-normal)",
                }}
              />
            )
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--spacing-2)",
              padding: "var(--spacing-3)",
              backgroundColor: "var(--color-danger-light)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "var(--radius-lg)",
              marginBottom: "var(--spacing-4)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-danger)",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <h1
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: 600,
                marginBottom: "var(--spacing-1)",
                color: "var(--color-text-primary)",
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--spacing-6)",
              }}
            >
              Start your 14-day free trial. No credit card required.
            </p>

            <div style={{ marginBottom: "var(--spacing-4)" }}>
              <label
                htmlFor="register-name"
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--spacing-1-5)",
                }}
              >
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arjun Sharma"
                className="input"
              />
            </div>

            <div style={{ marginBottom: "var(--spacing-5)" }}>
              <label
                htmlFor="register-email"
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--spacing-1-5)",
                }}
              >
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            {/* Clerk Captcha Widget Container */}
            <div id="clerk-captcha" style={{ marginBottom: "var(--spacing-4)" }} />

            <button
              id="btn-send-otp"
              type="submit"
              disabled={isLoading || !isLoaded || !email || !name}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <ArrowRight size={16} />
              )}
              {isLoading ? "Sending code…" : "Continue"}
            </button>

            <p
              style={{
                marginTop: "var(--spacing-4)",
                textAlign: "center",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                id="link-to-login"
                style={{ color: "var(--color-accent)" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <form onSubmit={handleOTPSubmit} noValidate>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-2)",
                marginBottom: "var(--spacing-1)",
              }}
            >
              <button
                type="button"
                id="btn-back-to-email"
                onClick={() => { setStep("email"); setError(null); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  padding: 0,
                  display: "flex",
                }}
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                Verify your email
              </h2>
            </div>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--spacing-6)",
              }}
            >
              We sent a 6-digit code to{" "}
              <strong style={{ color: "var(--color-text-secondary)" }}>
                {email}
              </strong>
            </p>

            <div style={{ marginBottom: "var(--spacing-5)" }}>
              <label
                htmlFor="register-otp"
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--spacing-1-5)",
                }}
              >
                Verification code
              </label>
              <input
                id="register-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="input font-mono"
                style={{
                  letterSpacing: "0.3em",
                  fontSize: "var(--font-size-xl)",
                  textAlign: "center",
                }}
              />
            </div>

            <button
              id="btn-verify-otp"
              type="submit"
              disabled={isLoading || !isLoaded || otp.length !== 6}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {isLoading ? "Verifying…" : "Verify code"}
            </button>
          </form>
        )}

        {/* ── Step 3: Password ── */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: 600,
                marginBottom: "var(--spacing-1)",
                color: "var(--color-text-primary)",
              }}
            >
              Set your password
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--spacing-6)",
              }}
            >
              Use at least 8 characters with a mix of letters and numbers.
            </p>

            <div style={{ marginBottom: "var(--spacing-4)" }}>
              <label
                htmlFor="register-password"
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--spacing-1-5)",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input"
                  style={{ paddingRight: "var(--spacing-10)" }}
                />
                <button
                  type="button"
                  id="btn-toggle-reg-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "var(--spacing-3)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "var(--spacing-5)" }}>
              <label
                htmlFor="register-confirm-password"
                style={{
                  display: "block",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--spacing-1-5)",
                }}
              >
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="input"
              />
            </div>

            <button
              id="btn-set-password"
              type="submit"
              disabled={isLoading || !isLoaded || !password || !confirmPassword}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <ArrowRight size={16} />
              )}
              {isLoading ? "Setting password…" : "Continue"}
            </button>
          </form>
        )}

        {/* ── Step 4: Onboarding ── */}
        {step === "onboarding" && (
          <form onSubmit={handleOnboardingComplete} noValidate>
            <div style={{ textAlign: "center", marginBottom: "var(--spacing-5)" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "var(--color-success-light)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--spacing-3)",
                }}
              >
                <CheckCircle2 size={24} color="var(--color-success)" />
              </div>
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--spacing-1)",
                }}
              >
                Account created! 🎉
              </h2>
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-muted)",
                }}
              >
                Tell us a bit about how you trade.
              </p>
            </div>

            <p
              style={{
                fontSize: "var(--font-size-sm)",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                marginBottom: "var(--spacing-3)",
              }}
            >
              I am primarily a…
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--spacing-2)",
                marginBottom: "var(--spacing-6)",
              }}
            >
              {TRADER_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  id={`trader-type-${t.id}`}
                  onClick={() => setTraderType(t.id)}
                  style={{
                    padding: "var(--spacing-3)",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${traderType === t.id ? "var(--color-accent)" : "var(--color-border)"}`,
                    background: traderType === t.id
                      ? "var(--color-accent-light)"
                      : "var(--color-surface-2)",
                    color: traderType === t.id
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-fast)",
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ fontSize: "1.2em", display: "block", marginBottom: 4 }}>
                    {t.emoji}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>

            <button
              id="btn-go-to-dashboard"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
