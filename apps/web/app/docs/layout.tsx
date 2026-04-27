"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
        {/* Persistent Sidebar */}
        <DocsSidebar />

        {/* Dynamic Content */}
        <main className="flex-1 lg:ml-72 p-8 lg:p-16 pb-32">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
