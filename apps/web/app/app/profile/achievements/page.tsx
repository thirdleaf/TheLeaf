'use client';

import React from 'react';
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Target, 
  BookOpen, 
  Activity,
  Award
} from 'lucide-react';

const ACHIEVEMENT_TYPES = [
  {
    type: 'FIRST_TRADE',
    title: 'First Step',
    desc: 'Logged your first trade on the platform.',
    icon: <Target size={32} />,
    earned: true,
    earnedAt: 'Oct 12, 2025'
  },
  {
    type: 'JOURNAL_HABIT',
    title: 'Journal Habit',
    desc: 'Maintained a 7-day journaling streak.',
    icon: <BookOpen size={32} />,
    earned: true,
    earnedAt: 'Oct 19, 2025'
  },
  {
    type: 'DISCIPLINED_WEEK',
    title: 'Absolute Discipline',
    desc: '100% rule compliance for a full trading week.',
    icon: <Flame size={32} />,
    earned: true,
    earnedAt: 'Jan 12, 2026'
  },
  {
    type: 'ACTIVE_TRADER',
    title: 'Active Trader',
    desc: 'Reached the milestone of 50 trades logged.',
    icon: <Activity size={32} />,
    earned: false,
    progress: 74,
    target: 100
  },
  {
    type: 'KNOWLEDGE_SHARER',
    title: 'Knowledge Sharer',
    desc: 'Published your first playbook to the community.',
    icon: <Award size={32} />,
    earned: false
  },
  {
    type: 'SYSTEMATIC',
    title: 'Systematic Mind',
    desc: 'Linked a strategy to 10+ trades.',
    icon: <Zap size={32} />,
    earned: false,
    progress: 4,
    target: 10
  }
];

export default function AchievementsPage() {
  const earnedCount = ACHIEVEMENT_TYPES.filter(a => a.earned).length;

  return (
    <div className='max-w-6xl mx-auto pb-20'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16'>
        <div>
           <div className='flex items-center gap-3 mb-2'>
              <Trophy size={20} className='text-brand-primary' />
              <p className='text-xs font-black uppercase text-brand-primary tracking-widest'>Growth Milestones</p>
           </div>
           <h1 className='text-4xl font-black text-white tracking-tight'>Achievements</h1>
        </div>
        <div className='px-8 py-4 bg-zinc-900 border border-white/5 rounded-[2rem] flex items-center gap-6'>
           <div className='text-center'>
              <p className='text-2xl font-black text-white'>{earnedCount}</p>
              <p className='text-[10px] font-black text-zinc-500 uppercase tracking-widest'>Earned</p>
           </div>
           <div className='w-px h-10 bg-white/10' />
           <div className='text-center'>
              <p className='text-2xl font-black text-white'>{ACHIEVEMENT_TYPES.length}</p>
              <p className='text-[10px] font-black text-zinc-500 uppercase tracking-widest'>Total</p>
           </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
         {ACHIEVEMENT_TYPES.map((badge) => (
           <div 
             key={badge.type} 
             className={`relative bg-[#09090b] border rounded-[2.5rem] p-10 flex flex-col items-center text-center transition-all duration-500 ${
               badge.earned 
               ? 'border-brand-primary/20 hover:border-brand-primary/40' 
               : 'border-white/5 grayscale opacity-60'
             }`}
           >
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 relative ${
                badge.earned ? 'bg-brand-primary text-black shadow-2xl' : 'bg-zinc-900 text-zinc-700'
              }`}>
                 {badge.icon}
                 {badge.earned && (
                   <div className='absolute -top-2 -right-2 bg-white rounded-full p-1 text-black shadow-xl'>
                      <CheckCircle2 size={16} />
                   </div>
                 )}
              </div>

              <h3 className='text-xl font-bold text-white mb-3'>{badge.title}</h3>
              <p className='text-sm text-zinc-500 leading-relaxed mb-8'>{badge.desc}</p>

              {badge.earned ? (
                <div className='mt-auto text-[10px] font-black uppercase text-brand-primary tracking-widest bg-brand-primary/10 px-4 py-2 rounded-full'>
                   Earned on {badge.earnedAt}
                </div>
              ) : (
                <div className='mt-auto w-full flex flex-col items-center gap-4'>
                   <div className='flex items-center gap-2 text-[10px] font-black uppercase text-zinc-700 tracking-widest'>
                      <Lock size={12} /> Locked
                   </div>
                   {badge.progress !== undefined && (
                     <div className='w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden'>
                        <div 
                          className='h-full bg-zinc-700 transition-all duration-1000' 
                          style={{ width: `${(badge.progress / badge.target!) * 100}%` }}
                        />
                     </div>
                   )}
                </div>
              )}

              {badge.earned && (
                <div className='absolute inset-x-0 bottom-0 h-32 bg-brand-primary/5 blur-[60px] rounded-full -z-10' />
              )}
           </div>
         ))}
      </div>
    </div>
  );
}
