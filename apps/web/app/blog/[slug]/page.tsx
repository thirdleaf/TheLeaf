"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowLeft, Calendar, User, Clock, Share2, Tag } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -mt-60" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Back button */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Post Meta */}
          <div className="space-y-6 mb-12 border-b border-white/5 pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              {post.category}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-500 text-xs">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-invert prose-zinc max-w-none">
            {/* Simple Markdown-ish render for now */}
            <div className="text-zinc-400 leading-relaxed space-y-8 text-lg">
               {post.content.split('\n').map((line, i) => {
                 if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-white mt-12 mb-6">{line.replace('## ', '')}</h2>;
                 if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-4">{line.replace('### ', '')}</h3>;
                 if (line.trim() === '') return <br key={i} />;
                 return <p key={i}>{line.trim()}</p>;
               })}
            </div>
          </article>

          {/* Post Footer */}
          <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Share Edge:</span>
                <div className="flex gap-2">
                  <button className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                    <Share2 size={16} />
                  </button>
                  <button className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                    <Tag size={16} />
                  </button>
                </div>
             </div>
             <Link 
               href="/register"
               className="btn btn-primary btn-sm px-6"
             >
               Start Journaling Free
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
