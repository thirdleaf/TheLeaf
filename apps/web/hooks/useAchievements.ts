import { useEffect, useState } from "react";
// This would hook into a real websocket implementation
// For now, we simulate achievement detection

export const useAchievements = () => {
    const [lastAchievement, setLastAchievement] = useState<any>(null);

    useEffect(() => {
        // In a real app, listen for 'achievement:earned' event
        const handleAchievement = (e: any) => {
            setLastAchievement(e.detail);
        };

        window.addEventListener('achievement:earned', handleAchievement);
        return () => window.removeEventListener('achievement:earned', handleAchievement);
    }, []);

    const clearAchievement = () => setLastAchievement(null);

    return { lastAchievement, clearAchievement };
}
