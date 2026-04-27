"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ClientAuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  client: any | null;
  setClient: (client: any | null) => void;
}

const ClientAuthContext = createContext<ClientAuthContextType>({
  token: null,
  setToken: () => {},
  client: null,
  setClient: () => {},
});

export const useClientAuth = () => useContext(ClientAuthContext);

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if no token and not on login page
  useEffect(() => {
    if (!token && pathname !== "/portal/login") {
      router.push("/portal/login");
    }
  }, [token, pathname, router]);

  return (
    <ClientAuthContext.Provider value={{ token, setToken, client, setClient }}>
      <div className="min-h-screen bg-black text-white selection:bg-brand-primary selection:text-black">
        <header className="h-20 border-b border-white/5 flex items-center px-8 justify-between backdrop-blur-3xl bg-black/50 sticky top-0 z-50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-black">TF</div>
              <div>
                 <p className="text-sm font-bold tracking-tighter">TradeForge</p>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Client Portal</p>
              </div>
           </div>
           {token && (
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white">{client?.name}</p>
                    <p className="text-[10px] text-zinc-500">{client?.email}</p>
                 </div>
                 <button 
                   onClick={() => { setToken(null); router.push("/portal/login"); }}
                   className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
                 >
                   Logout
                 </button>
              </div>
           )}
        </header>
        <main className="min-h-[calc(100vh-80px)]">
           {children}
        </main>
      </div>
    </ClientAuthContext.Provider>
  );
}
