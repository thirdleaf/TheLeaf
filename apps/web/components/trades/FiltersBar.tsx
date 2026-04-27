"use client";

import React from "react";
import { Filter, Search, Calendar, ChevronDown, DownloadCloud } from "lucide-react";
import Link from "next/link";

export const FiltersBar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/10 rounded-xl bg-black/50 backdrop-blur-md mb-6">
      
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search symbols..."
            className="pl-9 pr-4 py-2 text-sm bg-zinc-900 border border-white/5 rounded-lg focus:outline-none focus:border-brand-primary/50 text-white w-[200px]"
          />
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-900 border border-white/5 rounded-lg hover:bg-zinc-800 text-zinc-300">
          <Calendar className="w-4 h-4" />
          <span>Date Range</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-900 border border-white/5 rounded-lg hover:bg-zinc-800 text-zinc-300">
          <Filter className="w-4 h-4" />
          <span>Setup Tags</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>

        {/* Applied filters mock */}
        <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
          <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md border border-brand-primary/20 flex items-center gap-1 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all">
            LONG &times;
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          href="/app/trades/import"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 border border-white/5 transition-all"
        >
          <DownloadCloud className="w-4 h-4" />
          CSV Import
        </Link>
      </div>

    </div>
  );
};
