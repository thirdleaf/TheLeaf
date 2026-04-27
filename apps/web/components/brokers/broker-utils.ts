/**
 * broker-utils.ts
 * Frontend utilities for broker management.
 */

export const BROKERS = [
  { id: "ZERODHA",  name: "Zerodha",  color: "#387ED1", authType: "oauth",  fields: ["apiKey","apiSecret"] },
  { id: "ANGELONE", name: "AngelOne", color: "#E74C3C", authType: "totp",   fields: ["clientId","password","totpSecret"] },
  { id: "UPSTOX",   name: "Upstox",   color: "#5B2D8E", authType: "oauth",  fields: ["apiKey","apiSecret"] },
  { id: "DHAN",     name: "Dhan",     color: "#00B386", authType: "token",  fields: ["accessToken","clientId"] },
  { id: "FYERS",    name: "Fyers",    color: "#E67E22", authType: "oauth",  fields: ["apiKey","apiSecret"] },
  { id: "IIFL",     name: "5Paisa",   color: "#C0392B", authType: "apikey", fields: ["apiKey","apiSecret","userKey"] },
  { id: "SAHI",     name: "Sahi",     color: "#FF4D4D", authType: "oauth",  fields: ["apiKey","apiSecret"] },
];

export const FIELD_LABELS: Record<string,string> = {
  apiKey: "API Key / Client ID",
  apiSecret: "API Secret",
  clientId: "Client Code",
  password: "Password",
  totpSecret: "TOTP Secret (from 2FA setup)",
  accessToken: "Access Token",
  userKey: "User Key / Email",
};

export const FIELD_MASKED: Record<string,boolean> = {
  apiSecret: true, password: true, totpSecret: true, accessToken: true,
};

export function timeAgo(date: string | null): string {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
