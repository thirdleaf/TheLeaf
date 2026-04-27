"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Bell, BellRing, BellOff, ShieldAlert, PieChart, Info } from "lucide-react";

export default function NotificationsSettingsPage() {
  const { getToken } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<any>({
    tradeSync: true,
    dailyJournalReminder: true,
    drawdownAlerts: true,
    weeklyReview: false,
    brokerTokenExpiry: true,
  });

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    fetchSettings();
    checkSubscription();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = await getToken();
      const res = await fetch("/api/users/me/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data?.notifications) {
        setPreferences(json.data.notifications);
      }
    } catch (e) {
      console.error("Failed to fetch settings", e);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    } catch (e) {
      console.error("Subscription check failed", e);
    }
  };

  const handleSubscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported by your browser.");
      return;
    }

    try {
      const token = await getToken();
      const reg = await navigator.serviceWorker.ready;
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      
      if (permissionResult !== "granted") return;

      // Fetch actual VAPID public key from backend
      const keyRes = await fetch("/api/notifications/public-key", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const keyJson = await keyRes.json();
      if (!keyJson.success) throw new Error("Failed to get public key");
      
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyJson.data,
      });

      // Send to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sub)
      });
      
      setIsSubscribed(true);
    } catch (e) {
      console.error("Failed to subscribe", e);
      alert("Push registration failed. Please try again.");
    }
  };

  const togglePreference = async (key: string) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    
    try {
      const token = await getToken();
      await fetch("/api/users/me/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ notifications: newPrefs })
      });
    } catch (e) {
      console.error("Failed to update preferences", e);
    }
  };

  const testPush = async () => {
    try {
      const token = await getToken();
      await fetch("/api/notifications/test-push", { 
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error("Test push failed", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage what alerts you receive and how.</p>
        </div>
      </div>

      {/* Push State Banner */}
      <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isSubscribed ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800 text-zinc-500"}`}>
            {isSubscribed ? <BellRing size={24} /> : <BellOff size={24} />}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Push Notifications</h3>
            <p className="text-zinc-500 text-sm">
              {permission === "denied" 
                ? "You have blocked notifications in your browser settings."
                : isSubscribed 
                  ? "This device is registered to receive push alerts." 
                  : "Receive instant alerts even when the app is closed."}
            </p>
          </div>
        </div>
        
        {permission !== "denied" && (
          <button 
            onClick={isSubscribed ? undefined : handleSubscribe}
            disabled={isSubscribed}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              isSubscribed ? "bg-white/5 text-zinc-400 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Enable Push"}
          </button>
        )}
      </div>

      <button onClick={testPush} disabled={!isSubscribed} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 underline">
        Send Test Notification
      </button>

      {/* Preferences Matrix */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-black/20 flex gap-2 items-center text-sm font-bold text-zinc-400">
          <Info size={16} /> Notification Types
        </div>
        
        <div className="divide-y divide-white/5">
          <ToggleRow 
            title="Trade Sync Complete" desc="Notify me when broker sync imports new trades."
            icon={<Bell size={20} />} state={preferences.tradeSync} onToggle={() => togglePreference("tradeSync")} 
          />
          <ToggleRow 
            title="Daily Journal Reminder" desc="Sent at 3:45 PM IST if you haven't journaled."
            state={preferences.dailyJournalReminder} onToggle={() => togglePreference("dailyJournalReminder")} 
          />
          <ToggleRow 
            title="Drawdown Alerts" desc="Instant alert when you hit your daily loss limit (Elite)."
            icon={<ShieldAlert size={20} className="text-rose-400" />}
            state={preferences.drawdownAlerts} onToggle={() => togglePreference("drawdownAlerts")} 
          />
          <ToggleRow 
            title="Weekly Review" desc="Saturday morning reminder to review your week."
            icon={<PieChart size={20} />} state={preferences.weeklyReview} onToggle={() => togglePreference("weeklyReview")} 
          />
          <ToggleRow 
            title="Broker Connections" desc="Token expiries and re-authentication notices."
            state={preferences.brokerTokenExpiry} onToggle={() => togglePreference("brokerTokenExpiry")} 
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, icon, state, onToggle }: any) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-4">
        {icon && <div className="text-zinc-400">{icon}</div>}
        <div>
          <h4 className="text-white font-medium">{title}</h4>
          <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${state ? "bg-indigo-500" : "bg-zinc-700"}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state ? "translate-x-6" : "translate-x-0"}`} />
      </div>
    </div>
  );
}
