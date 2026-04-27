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
          className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-disabled hover:text-text-primary hover:bg-surface-3 transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Manage Profile</h1>
          <p className="text-sm text-text-muted">Update your account information and preferences.</p>
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
              card: "bg-surface-2/50 border border-border shadow-none w-full",
              navbar: "hidden md:flex border-r border-border",
              pageScrollBox: "bg-transparent",
              headerTitle: "text-text-primary font-black",
              headerSubtitle: "text-text-muted",
              profileSectionTitleText: "text-accent font-bold",
              userPreviewMainIdentifier: "text-text-primary font-bold",
              userPreviewSecondaryIdentifier: "text-text-muted",
              formFieldLabel: "text-text-secondary font-semibold",
              formFieldInput: "bg-surface-3 border-border text-text-primary focus:border-accent/50",
              breadcrumbsItem: "text-text-muted",
              breadcrumbsSeparator: "text-text-disabled",
              badge: "bg-accent/10 text-accent border-accent/20",
              accordionTriggerButton: "text-text-primary hover:bg-surface-3",
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
