import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, X } from "lucide-react";
import { useAchievements } from "../../hooks/useAchievements";

export const AchievementCelebration = () => {
  const { lastAchievement, clearAchievement } = useAchievements();

  useEffect(() => {
    if (lastAchievement) {
      triggerCelebration();
    }
  }, [lastAchievement]);

  const triggerCelebration = () => {
    // Launch Confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Auto-dismiss after 5 seconds
    setTimeout(() => clearAchievement(), 5000);
  };

  if (!lastAchievement) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative bg-zinc-900 border border-brand-primary/30 rounded-[3rem] p-12 max-w-lg w-full text-center shadow-[0_0_100px_rgba(192,132,252,0.2)] animate-in zoom-in-95 duration-500">
        
        <button 
          onClick={() => clearAchievement()}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-32 h-32 bg-brand-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-black shadow-2xl animate-bounce">
           <Award size={64} />
        </div>

        <p className="text-xs font-black uppercase text-brand-primary tracking-[0.3em] mb-4">Achievement Unlocked</p>
        <h2 className="text-4xl font-black text-white mb-6 tracking-tight">{lastAchievement.title}</h2>
        <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-10">
          {lastAchievement.description}
        </p>

        <button 
          onClick={() => clearAchievement()}
          className="w-full py-5 bg-white text-black text-sm font-black rounded-2xl hover:scale-[1.02] transition-transform"
        >
          Claim Badge
        </button>
      </div>
    </div>
  );
};
