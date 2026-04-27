"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";
import { ArrowRight, Clock, User, Calendar, BookOpen, Zap } from "lucide-react";

export default function BlogIndexPage() {
  const categories = ["All", "Quant Research", "Psychology", "Product Updates"];

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <BookOpen size={12} />
            Stay Ahead of the Curve
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
            The Quant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-indigo-400">Journal.</span>
          </h1>
          <p className="text-zinc-500 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Technical analysis, behavioral frameworks, and product updates for the modern Indian trader.
          </p>
        </div>

        {/* Category Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-12 border-b border-white/5">
           {categories.map((cat, i) => (
             <button 
              key={cat}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                i === 0 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Featured Post (Ultra Compact) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 aspect-[16/9] bg-zinc-900 border border-white/5 rounded-[40px] overflow-hidden group">
            <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="block h-full relative">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-emerald-600/10 opacity-60 group-hover:opacity-100 transition-all duration-700" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[12rem] font-black text-white/5 tracking-tighter group-hover:scale-110 transition-transform duration-700">EDGE</span>
               </div>
               <div className="absolute bottom-10 left-10 right-10 z-10">
                   <div className="px-3 py-1 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full inline-block text-[10px] font-black uppercase tracking-widest text-white mb-4">
                      {BLOG_POSTS[0].category}
                   </div>
                   <h2 className="text-3xl lg:text-5xl font-black text-white group-hover:text-indigo-300 transition-colors">
                      {BLOG_POSTS[0].title}
                   </h2>
               </div>
            </Link>
          </div>
          
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[32px] hover:border-white/10 transition-all">
               <p className="text-zinc-400 leading-relaxed mb-6 font-medium italic">
                 &quot;{BLOG_POSTS[0].excerpt}&quot;
               </p>
               <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">{BLOG_POSTS[0].date}</span>
                  <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="flex items-center gap-2 text-indigo-400 font-bold text-sm group">
                    Read Post <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            
            <div className="p-8 border border-indigo-500/10 bg-indigo-500/[0.02] rounded-[32px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -mr-12 -mt-12" />
               <h4 className="text-sm font-black text-white mb-2">Editor&apos;s Pick</h4>
               <p className="text-xs text-zinc-500 mb-4">Why we believe automated journaling is the only way to scale your strategy in 2026.</p>
               <Link href="/register" className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b border-indigo-500/30 pb-1">Become an Insider</Link>
            </div>
          </div>
        </div>

        {/* Regular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-zinc-900/30 border border-white/5 rounded-[40px] overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all h-full"
            >
              <div className="aspect-square bg-zinc-800/50 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent" />
                 <BookOpen size={48} className="text-zinc-700 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all" />
              </div>
              <div className="p-10 flex flex-col justify-between flex-1">
                <div>
                   <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">{post.category}</div>
                   <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                   <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-8 mt-4 border-t border-white/5">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-700">
                      <Calendar size={12} /> {post.date}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-700">
                      <Clock size={12} /> {post.readingTime}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Compact */}
        <div className="py-24 px-6 bg-zinc-900/40 border border-white/5 rounded-[64px] text-center max-w-4xl mx-auto space-y-8">
           <Zap className="mx-auto text-indigo-500" size={32} />
           <h2 className="text-3xl lg:text-5xl font-black text-white">Sharpen your edge.</h2>
           <p className="text-zinc-500 max-w-md mx-auto">Weekly quant insights and product updates delivered to your inbox.</p>
           <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 p-2 bg-black/40 border border-white/5 rounded-3xl">
              <input 
                type="email" 
                placeholder="you@email.com"
                className="flex-1 bg-transparent border-none px-6 py-4 focus:outline-none text-white font-medium" 
              />
              <button className="btn btn-primary px-8 py-4 whitespace-nowrap">Subscribe</button>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
