"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getOfflineQueue, processOfflineQueue } from "../../lib/indexeddb";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    checkQueue();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodically check queue if offline
    const interval = setInterval(checkQueue, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkQueue = async () => {
    const queue = await getOfflineQueue();
    setQueueCount(queue.length);
  };

  const syncOfflineData = async () => {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    await processOfflineQueue();
    await checkQueue();
    setIsSyncing(false);
  };

  if (isOnline && queueCount === 0 && !isSyncing) return null;

  return (
    <div className={`w-full py-2 px-4 shadow-md z-50 flex items-center justify-center gap-3 text-sm font-bold transition-all duration-300 ${
      !isOnline ? "bg-red-500/90 text-white" : 
      isSyncing ? "bg-amber-500/90 text-white" : 
      "bg-emerald-500/90 text-white"
    }`}>
      {!isOnline && (
        <>
          <WifiOff size={16} />
          You are offline. Working in offline mode. {queueCount > 0 ? `(${queueCount} unsynced items)` : ''}
        </>
      )}
      {isOnline && isSyncing && (
        <>
          <RefreshCw size={16} className="animate-spin" />
          Syncing {queueCount} offline entries...
        </>
      )}
      {isOnline && !isSyncing && queueCount === 0 && (
        <>
          <CheckCircle2 size={16} />
          Back online. All data synced.
        </>
      )}
    </div>
  );
}
