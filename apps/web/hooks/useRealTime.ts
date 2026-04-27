"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";

// Global socket instance mapping
let globalSocket: Socket | null = null;

/**
 * Core Socket Connection resolving Clerk payloads bounds natively
 */
export const useSocket = () => {
  const { user, isLoaded } = useUser();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    if (!globalSocket) {
      globalSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
        query: { userId: user.id },
        transports: ["websocket"],
      });
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    globalSocket.on("connect", onConnect);
    globalSocket.on("disconnect", onDisconnect);
    
    // Fallback assignment to ensure initial mount bounds
    if (globalSocket.connected) setIsConnected(true);

    return () => {
      globalSocket?.off("connect", onConnect);
      globalSocket?.off("disconnect", onDisconnect);
    };
  }, [user, isLoaded]);

  return { socket: globalSocket, isConnected };
};

/**
 * Tracks Analytics Pnl specifically hooked to Redis daily snapshots updates
 */
export const useLivePnl = (accountId: string) => {
  const { socket } = useSocket();
  const [data, setData] = useState({ todayPnl: 0, currentStreak: 0, lastRefresh: Date.now() });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;
    
    // Faking loading to avoid flash
    const t = setTimeout(() => setIsLoading(false), 500);

    const handleSnapshot = (snapshot: any) => {
      if (snapshot.accountId === accountId) {
        setData(prev => ({ 
          todayPnl: snapshot.todayNetPnl, 
          currentStreak: snapshot.currentStreak,
          lastRefresh: Date.now() 
        }));
      }
    };

    socket.on("snapshot:updated", handleSnapshot);
    return () => {
      socket.off("snapshot:updated", handleSnapshot);
      clearTimeout(t);
    };
  }, [socket, accountId]);

  return { ...data, isLoading };
};

/**
 * Real-time Broker execution price streaming map bridging proxy arrays.
 */
export const useBrokerTick = (symbols: string[]) => {
  const { socket } = useSocket();
  const [prices, setPrices] = useState<Map<string, {ltp: number, change: number, changePercent: number}>>(new Map());

  useEffect(() => {
    if (!socket || symbols.length === 0) return;

    // Send subscribe emission downstream to backend relay
    socket.emit("broker:subscribe", { symbols });

    const handleTick = (tick: { symbol: string, ltp: number, change: number, changePercent: number }) => {
      setPrices(prev => {
        const next = new Map(prev);
        next.set(tick.symbol, tick);
        return next;
      });
    };

    socket.on("broker:tick", handleTick);
    
    return () => {
      socket.emit("broker:unsubscribe", { symbols });
      socket.off("broker:tick", handleTick);
    };
  }, [socket, symbols.join(",")]); // array dependency bounds trick

  return { prices };
};

/**
 * Subscribes to global risk alert checks pushed by Node crons safely.
 */
export const useAlerts = () => {
  const { socket } = useSocket();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleAlert = (payload: any) => {
      setAlerts(prev => [payload, ...prev].slice(0, 5)); // Keep last 5 alerts
      // In a real app we would call toast.error(payload.message) natively here
    };

    socket.on("alert:triggered", handleAlert);
    
    return () => {
      socket.off("alert:triggered", handleAlert);
    };
  }, [socket]);

  return { alerts };
};
