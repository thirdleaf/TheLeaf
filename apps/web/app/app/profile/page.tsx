"use client";

import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/app/settings" 
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Manage Profile</h1>
          <p className="text-sm text-zinc-500">Update your account information and preferences.</p>
        </div>
      </div>

      {/* Clerk UserProfile Wrapper */}
      <div className="clerk-profile-wrapper">
        <UserProfile 
          routing="path" 
          path="/app/profile" 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-zinc-900/50 border border-white/5 shadow-none w-full",
              navbar: "hidden md:flex border-r border-white/5",
              pageScrollBox: "bg-transparent",
              headerTitle: "text-white font-black",
              headerSubtitle: "text-zinc-500",
              profileSectionTitleText: "text-indigo-400 font-bold",
              userPreviewMainIdentifier: "text-white font-bold",
              userPreviewSecondaryIdentifier: "text-zinc-500",
              formFieldLabel: "text-zinc-400 font-semibold",
              formFieldInput: "bg-zinc-800 border-white/5 text-white focus:border-indigo-500/50",
              breadcrumbsItem: "text-zinc-500",
              breadcrumbsSeparator: "text-zinc-700",
              badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
              accordionTriggerButton: "text-white hover:bg-white/5",
              footer: "hidden",
            }
          }}
        />
      </div>

      <style jsx global>{`
        .clerk-profile-wrapper .cl-internal-phv37z {
          display: none !important;
        }
        .clerk-profile-wrapper .cl-card {
           width: 100% !important;
           max-width: 100% !important;
        }
      `}</style>
    </div>
  );
}
