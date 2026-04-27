"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// ThirdLeaf SVG Logo
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

// ─────────────────────────────────────────────────────────────
// Google Icon SVG
// ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.8 2.72v2.26h2.92A8.78 8.78 0 0 0 17.64 9.2z"
        fill="#4285F4"
      />
      <path
        d="M9 18a8.59 8.59 0 0 0 5.96-2.18l-2.92-2.26a5.43 5.43 0 0 1-8.07-2.85H.96v2.34A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M2.97 10.71A5.43 5.43 0 0 1 2.97 7.3V4.96H.96A9 9 0 0 0 0 9a9 9 0 0 0 .96 4.04l2.01-2.33z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.63 8.63 0 0 0 9 0 9 9 0 0 0 .96 4.96L2.97 7.3A5.43 5.43 0 0 1 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Login Page
// ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email + Password sign in
  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/app/dashboard");
      } else {
        setError("Sign in requires additional verification. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: Array<{ message: string; longMessage?: string }>;
      };
      const message =
        clerkError.errors?.[0]?.longMessage ??
        clerkError.errors?.[0]?.message ??
        "Sign in failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Google OAuth sign in
  async function handleGoogleSignIn() {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/app/dashboard",
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(
        clerkError.errors?.[0]?.message ?? "Google sign in failed."
      );
      setIsGoogleLoading(false);
    }
  }

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
      {/* Logo + Brand */}
      <div style={{ marginBottom: "var(--spacing-6)", textAlign: "center" }}>
        <ThirdLeafLogo />
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--spacing-1)",
          }}
        >
          India&apos;s quant trading workspace
        </p>
      </div>

      {/* Card */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h1
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: 600,
            marginBottom: "var(--spacing-1-5)",
            color: "var(--color-text-primary)",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          Sign in to your ThirdLeaf account
        </p>

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

        {/* Google OAuth Button */}
        <button
          id="btn-google-signin"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || !isLoaded}
          className="btn btn-secondary"
          style={{ width: "100%", marginBottom: "var(--spacing-4)" }}
          aria-label="Continue with Google"
        >
          {isGoogleLoading ? (
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-3)",
            marginBottom: "var(--spacing-4)",
          }}
        >
          <div className="divider" style={{ flex: 1 }} />
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            or sign in with email
          </span>
          <div className="divider" style={{ flex: 1 }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn} noValidate>
          <div style={{ marginBottom: "var(--spacing-4)" }}>
            <label
              htmlFor="login-email"
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
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-2)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-1-5)",
              }}
            >
              <label
                htmlFor="login-password"
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                id="link-forgot-password"
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--color-accent)",
                }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input"
                style={{ paddingRight: "var(--spacing-10)" }}
              />
              <button
                type="button"
                id="btn-toggle-password"
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

          <button
            id="btn-signin"
            type="submit"
            disabled={isLoading || !isLoaded || !email || !password}
            className="btn btn-primary pulse-glow"
            style={{ width: "100%", marginTop: "var(--spacing-5)" }}
          >
            {isLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : null}
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Register Link */}
        <p
          style={{
            marginTop: "var(--spacing-5)",
            textAlign: "center",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            id="link-to-register"
            style={{ color: "var(--color-accent)", fontWeight: 500 }}
          >
            Create account
          </Link>
        </p>
      </div>

      {/* SEBI Disclaimer */}
      <p
        style={{
          marginTop: "var(--spacing-6)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-disabled)",
          textAlign: "center",
          maxWidth: "380px",
          lineHeight: "var(--line-height-relaxed)",
        }}
      >
        ThirdLeaf is a technology platform. We do not provide investment advice or
        trading signals.
      </p>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
