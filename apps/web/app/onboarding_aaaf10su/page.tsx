"use client";

import { useState } from "react";
import { submitOfferLetter } from "./actions";

export default function SubmitOfferLetterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("offerLetter") as File;
      if (file && file.type !== "application/pdf") {
        throw new Error("Please upload a PDF file.");
      }

      await submitOfferLetter(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-xl border border-border text-center shadow-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Submitted Successfully</h1>
          <p className="text-text-secondary">Your signed offer letter has been securely uploaded to our database. Welcome aboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl border border-border shadow-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Submit Signed Offer Letter</h1>
        <p className="text-text-secondary mb-6 text-sm">Please provide your reference ID and upload your signed offer letter in PDF format.</p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="referenceId" className="block text-sm font-medium text-text-primary mb-1">
              Reference ID
            </label>
            <input
              type="text"
              id="referenceId"
              name="referenceId"
              required
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
              placeholder="e.g. TL-2026-04"
            />
          </div>

          <div>
            <label htmlFor="offerLetter" className="block text-sm font-medium text-text-primary mb-1">
              Signed Offer Letter (PDF)
            </label>
            <input
              type="file"
              id="offerLetter"
              name="offerLetter"
              accept=".pdf,application/pdf"
              required
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mt-2 disabled:opacity-50 flex justify-center py-2.5 rounded-lg font-medium"
          >
            {loading ? "Uploading securely..." : "Submit Offer Letter"}
          </button>
        </form>
      </div>
    </div>
  );
}
