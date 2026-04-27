import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ThirdLeaf — India's Quant Trading Journal & Analytics Platform",
    template: "%s | ThirdLeaf",
  },
  description:
    "ThirdLeaf is India's first professional trading journal, backtesting suite, and quant workspace for serious traders. Track trades, analyze performance, build strategies.",
  keywords: [
    "trading journal",
    "trade tracker",
    "backtesting",
    "quant trading",
    "India stock market",
    "NSE BSE trading",
    "options journal",
    "F&O journal",
    "trading analytics",
  ],
  openGraph: {
    title: "ThirdLeaf — India's Quant Trading Journal",
    description:
      "Journal, analyze, and automate your trading edge. Built for Indian markets.",
    type: "website",
    locale: "en_IN",
    siteName: "ThirdLeaf",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThirdLeaf — India's Quant Trading Journal",
    description: "Journal, analyze, and automate your trading edge.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "dmUJ1wflZHTSPuYslNRwcAwMSCJGDT-ej6CTr9tgh3Q",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('thirdleaf-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
          appearance={{
            variables: {
              colorPrimary: "#00C9A7",
              colorBackground: "var(--color-bg)",
              colorInputBackground: "var(--color-surface-2)",
              colorInputText: "var(--color-text-primary)",
              colorText: "var(--color-text-primary)",
              colorTextSecondary: "var(--color-text-secondary)",
              borderRadius: "0.5rem",
              fontFamily: "Inter, sans-serif",
            },
            elements: {
              card: "shadow-none border border-[var(--color-border)] bg-[var(--color-surface)]",
              formButtonPrimary:
                "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors text-white",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
