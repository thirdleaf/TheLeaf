export enum Plan {
  Solo = "solo",
  QuantBuilder = "quant_builder",
  PropMentor = "prop_mentor",
}

export enum UserRole {
  Trader = "trader",
  Admin = "admin",
}

export enum Broker {
  Zerodha = "zerodha",
  Upstox = "upstox",
  AngelOne = "angel_one",
  Fyers = "fyers",
  Dhan = "dhan",
  Other = "other",
}

export enum Exchange {
  NSE = "NSE",
  BSE = "BSE",
  MCX = "MCX",
  NFO = "NFO",
  BFO = "BFO",
  CDS = "CDS",
  CRYPTO = "CRYPTO",
}

export enum InstrumentType {
  EQ = "EQ",
  FUT = "FUT",
  CE = "CE",
  PE = "PE",
  COMMODITY = "COMMODITY",
  CURRENCY = "CURRENCY",
}

export enum TradeDirection {
  Long = "LONG",
  Short = "SHORT",
}

export enum TradeLegType {
  Entry = "ENTRY",
  Exit = "EXIT",
  ScaleIn = "SCALE_IN",
  ScaleOut = "SCALE_OUT",
}

export enum JournalType {
  PreSession = "PRE_SESSION",
  PostSession = "POST_SESSION",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  TradeNote = "TRADE_NOTE",
}

export enum MarketBias {
  Bullish = "BULLISH",
  Bearish = "BEARISH",
  Neutral = "NEUTRAL",
}

export enum Status {
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Paused = "PAUSED",
  Archived = "ARCHIVED",
}

export enum TagType {
  Positive = "POSITIVE",
  Negative = "NEGATIVE",
  Neutral = "NEUTRAL",
}

export enum TaxCategory {
  IntradaySpeculative = "INTRADAY_SPECULATIVE",
  FoNonSpeculative = "FO_NON_SPECULATIVE",
  Stcg = "STCG",
  Ltcg = "LTCG",
  Btst = "BTST",
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  plan: Plan;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  defaultBroker: Broker | null;
  defaultCurrency: string;
  riskPerTrade: number;
  dailyLossLimit: number; // paise
  timezone: string;
  notifications: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  broker: Broker;
  initialCapital: number;
  currency: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Trade {
  id: string;
  userId: string;
  accountId: string | null;
  symbol: string;
  exchange: Exchange;
  instrumentType: InstrumentType;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  entryTime: Date;
  exitTime: Date | null;
  grossPnl: number | null;
  brokerage: number;
  taxes: number;
  netPnl: number | null;
  holdDurationSeconds: number | null;
  isOpen: boolean;
  setupTagIds: string[];
  emotionAtEntry: string | null;
  emotionAtExit: string | null;
  mistakeTagIds: string[];
  strategyId: string | null;
  notes: string | null;
  screenshotUrls: string[];
  rMultipleTarget: number | null;
  rMultipleActual: number | null;
  maeAmount: number | null;
  mfeAmount: number | null;
  maePercent: number | null;
  mfePercent: number | null;
  isForwardTest: boolean;
  deviationsFromPlan: unknown | null;
  importSource: string | null;
  importedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeLeg {
  id: string;
  tradeId: string;
  type: TradeLegType;
  price: number;
  quantity: number;
  executedAt: Date;
  orderId: string | null;
  fees: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  type: JournalType;
  date: string;
  title: string;
  content: string | null;
  moodScore: number | null;
  sleepScore: number | null;
  stressScore: number | null;
  marketBias: MarketBias | null;
  dayScore: number | null;
  riskBudgetForDay: number | null;
  linkedTradeIds: string[];
  planCompliance: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experiment {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  hypothesis: string | null;
  startDate: string;
  endDate: string | null;
  rules: string[];
  status: Status;
  results: unknown | null;
  createdAt: Date;
}

export interface ExperimentCheckin {
  id: string;
  experimentId: string;
  userId: string;
  date: string;
  rulesComplied: unknown | null;
  notes: string | null;
  linkedPnl: number | null;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  version: string;
  rules: unknown | null;
  entryConditions: string | null;
  exitConditions: string | null;
  stopLossType: string | null;
  takeProfitType: string | null;
  timeframes: string[];
  instruments: string[];
  status: Status;
  tags: string[];
  backtestSummary: unknown | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SetupTag {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  description: string | null;
  createdAt: Date;
}

export interface EmotionTag {
  id: string;
  userId: string | null;
  name: string;
  type: TagType;
  isDefault: boolean;
}

export interface MistakeTag {
  id: string;
  userId: string;
  name: string;
  category: string | null;
  estimatedCostTotal: number;
  occurrenceCount: number;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PricingTier {
  id: Plan;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

export const PRICING_TIERS: PricingTier[] = [
  // Keeping PRICING_TIERS the same as before
  {
    id: Plan.Solo,
    name: "Solo",
    price: 499,
    yearlyPrice: 4990,
    description: "Perfect for independent traders journaling their edge.",
    features: ["Unlimited trade journal entries", "Basic P&L analytics"],
    highlighted: false,
    ctaLabel: "Start Free Trial",
  },
  {
    id: Plan.QuantBuilder,
    name: "Quant Builder",
    price: 999,
    yearlyPrice: 9990,
    description: "For traders who build and test systematic strategies.",
    features: ["Everything in Solo", "Full backtesting suite"],
    highlighted: true,
    ctaLabel: "Start Free Trial",
  },
  {
    id: Plan.PropMentor,
    name: "Prop / Mentor",
    price: 1999,
    yearlyPrice: 19990,
    description: "For prop desks, fund managers, and trading mentors.",
    features: ["Everything in Quant Builder", "Multi-account management"],
    highlighted: false,
    ctaLabel: "Contact Sales",
  },
];
