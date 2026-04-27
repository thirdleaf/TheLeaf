"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, X, Info, AlertTriangle, Hammer } from "lucide-react";

export type AnnouncementType = "INFO" | "WARNING" | "MAINTENANCE";

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
}

export const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Simulation of periodic fetch or socket update
  useEffect(() => {
    // Mocking an active maintenance alert
    setAnnouncement({
      id: "ann-1",
      title: "Scheduled Maintenance",
      body: "TradeForge will be offline for 30 minutes tonight at 11:30 PM IST for engine optimizations.",
      type: "MAINTENANCE",
    });
  }, []);

  if (!announcement || !isVisible) return null;

  const styles = {
    INFO: "bg-brand-primary text-black",
    WARNING: "bg-amber-500 text-black",
    MAINTENANCE: "bg-red-600 text-white",
  };

  const icons = {
    INFO: <Info size={16} />,
    WARNING: <AlertTriangle size={16} />,
    MAINTENANCE: <Hammer size={16} />,
  };

  return (
    <div className={`w-full px-6 py-2.5 flex items-center justify-between gap-4 transition-all animate-in slide-in-from-top duration-500 ${styles[announcement.type]}`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">{icons[announcement.type]}</div>
        <p className="text-[11px] font-black uppercase tracking-wider">
          <span className="mr-2 opacity-70">[{announcement.title}]</span>
          {announcement.body}
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="shrink-0 p-1 hover:bg-black/10 rounded-md transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ImpersonationBanner = () => {
  // In a real app, this would check a state/context/cookie for an impersonation token
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Mock toggle for demonstration if needed, usually driven by Auth context
  if (!isImpersonating) return null;

  return (
    <div className="w-full bg-red-600 h-1 text-white flex items-center justify-center overflow-visible z-[100] relative">
       <div className="absolute top-0 px-6 py-2 bg-red-600 rounded-b-xl flex items-center gap-4 shadow-xl">
          <ShieldAlert size={16} className="animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Impersonation Active: Viewing as <span className="underline">Vikas Mohata</span>
          </p>
          <button 
            onClick={() => setIsImpersonating(false)}
            className="bg-white text-red-600 px-3 py-1 rounded-lg text-[10px] font-black hover:bg-zinc-100 transition-all ml-4"
          >
            End Session
          </button>
       </div>
    </div>
  );
};

import { ShieldAlert } from "lucide-react";
