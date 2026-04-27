"use client";

import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
        <p className="text-zinc-400 mb-8">
          A critical error occurred. We've logged the issue and notified our engineering team. 
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <RefreshCcw size={18} />
            Try again
          </button>
          <button
            onClick={() => Sentry.showReportDialog({ eventId: Sentry.lastEventId() })}
            className="text-zinc-500 hover:text-white text-sm font-medium underline transition-colors"
          >
            Report this issue
          </button>
        </div>
      </div>
    </div>
  );
}
