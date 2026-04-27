import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  bigint,
  boolean,
  jsonb,
  timestamp,
  pgEnum,
  index,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["solo", "quant_builder", "prop_mentor"]);
export const roleEnum = pgEnum("role", ["trader", "admin"]);
export const brokerEnum = pgEnum("broker", ["ZERODHA", "UPSTOX", "ANGELONE", "FYERS", "DHAN", "GROWW", "SAHI", "OTHER"]);
export const exchangeEnum = pgEnum("exchange", ["NSE", "BSE", "MCX", "NFO", "BFO", "CDS", "CRYPTO"]);
export const instrumentTypeEnum = pgEnum("instrument_type", ["EQ", "FUT", "CE", "PE", "COMMODITY", "CURRENCY"]);
export const tradeDirectionEnum = pgEnum("trade_direction", ["LONG", "SHORT"]);
export const tradeLegTypeEnum = pgEnum("trade_leg_type", ["ENTRY", "EXIT", "SCALE_IN", "SCALE_OUT"]);

export const journalTypeEnum = pgEnum("journal_type", ["DAILY", "WEEKLY", "MONTHLY", "TRADE_NOTE", "IDEA"]);
export const journalIdeaCategoryEnum = pgEnum("journal_idea_category", ["MARKET_OBSERVATION", "STRATEGY_IDEA", "RISK_MANAGEMENT", "PSYCHOLOGY", "OTHER"]);
export const marketBiasEnum = pgEnum("market_bias", ["BULLISH", "BEARISH", "NEUTRAL"]);
export const statusEnum = pgEnum("status", ["ACTIVE", "COMPLETED", "PAUSED", "ARCHIVED"]);

export const tagTypeEnum = pgEnum("tag_type", ["POSITIVE", "NEGATIVE", "NEUTRAL"]);
export const taxCategoryEnum = pgEnum("tax_category", [
  "equity_intraday",
  "equity_short_term",
  "equity_long_term",
  "fo_futures",
  "fo_options",
  "currency",
  "commodity",
  "btst"
]);

export const clientStatusEnum = pgEnum("client_status", ["ACTIVE", "INACTIVE"]);
export const projectTypeEnum = pgEnum("project_type", ["BACKTEST_SCRIPT", "ALGO_STRATEGY", "AUTOMATION_TOOL", "INDICATOR", "CUSTOM"]);
export const projectStatusEnum = pgEnum("project_status", ["ENQUIRY", "SCOPING", "IN_PROGRESS", "REVIEW", "DELIVERED", "ARCHIVED"]);
export const paymentStatusEnum = pgEnum("payment_status", ["UNPAID", "PARTIAL", "PAID"]);
export const senderTypeEnum = pgEnum("sender_type", ["FOUNDER", "CLIENT"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["DRAFT", "SENT", "PAID", "OVERDUE"]);
export const scriptLanguageEnum = pgEnum("script_language", ["PYTHON", "PINESCRIPT", "AMIBROKER", "AFL", "JAVASCRIPT"]);

export const ruleCategoryEnum = pgEnum("rule_category", ["RISK", "ENTRY", "EXIT", "MINDSET", "SIZING"]);
export const triggerTypeEnum = pgEnum("trigger_type", ["LIFE_EVENT", "EMOTION", "TIME", "STREAK", "MARKET_CONDITION"]);
export const announcementTypeEnum = pgEnum("announcement_type", ["INFO", "WARNING", "MAINTENANCE"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["DEPOSIT", "WITHDRAWAL"]);
export const postTypeEnum = pgEnum("post_type", ["INSIGHT", "REVIEW", "QUESTION", "MILESTONE"]);
export const playbookTypeEnum = pgEnum("playbook_type", ["STRATEGY_FRAMEWORK", "RISK_APPROACH", "PSYCHOLOGY", "WORKFLOW"]);
export const leaderboardPeriodEnum = pgEnum("leaderboard_period", ["WEEKLY", "MONTHLY", "ALL_TIME"]);

// ── Billing Enums ────────────────────────────────────────────────────
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "pro", "elite"]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active", "paused", "cancelled", "expired", "pending", "halted",
]);
export const billingPaymentStatusEnum = pgEnum("billing_payment_status", [
  "created", "authorized", "captured", "refunded", "failed",
]);

// ── Users tables ──────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    plan: planEnum("plan").notNull().default("solo"),
    role: roleEnum("role").notNull().default("trader"),
    traderType: varchar("trader_type", { length: 64 }).notNull().default("intraday"),
    onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
    isSuspended: boolean("is_suspended").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("users_clerk_id_idx").on(table.clerkId)]
);

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    defaultBroker: brokerEnum("default_broker"),
    defaultCurrency: varchar("default_currency", { length: 3 }).notNull().default("INR"),
    riskPerTrade: integer("risk_per_trade").notNull().default(100), // Note: stored as integer basis points (100 = 1%)
    dailyLossLimit: bigint("daily_loss_limit", { mode: "number" }).notNull().default(0), // Cents/paise
    timezone: varchar("timezone", { length: 64 }).notNull().default("Asia/Kolkata"),
    notifications: jsonb("notifications").notNull().default({
      tradeSync: true,
      dailyJournalReminder: true,
      drawdownAlerts: true,
      weeklyReview: false,
      brokerTokenExpiry: true,
    }),
    customBrokeragePaise: bigint("custom_brokerage_paise", { mode: "number" }),
    brokerageCapPaise: bigint("brokerage_cap_paise", { mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 128 }).notNull(),
    message: text("message").notNull(),
    severity: varchar("severity", { length: 64 }).notNull().default("info"), // info, warning, error
    metadata: jsonb("metadata"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("notifications_user_id_idx").on(table.userId)]
);

// ── Accounts Module ───────────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    broker: brokerEnum("broker").notNull(),
    initialCapital: bigint("initial_capital", { mode: "number" }).notNull().default(0),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)]
);

// ── Tags Module ───────────────────────────────────────────────────────

export const setupTags = pgTable(
  "setup_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    color: varchar("color", { length: 32 }),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("setup_tags_user_id_idx").on(table.userId)]
);

export const emotionTags = pgTable(
  "emotion_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // userId nullable for system-wide defaults
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    type: tagTypeEnum("type").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (table) => [index("emotion_tags_user_id_idx").on(table.userId)]
);

export const mistakeTags = pgTable(
  "mistake_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    category: varchar("category", { length: 128 }),
    estimatedCostTotal: bigint("estimated_cost_total", { mode: "number" }).notNull().default(0),
    occurrenceCount: integer("occurrence_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("mistake_tags_user_id_idx").on(table.userId)]
);

// ── Strategies Module ─────────────────────────────────────────────────

export const strategies = pgTable(
  "strategies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    version: varchar("version", { length: 64 }).notNull().default("v1.0"),
    rules: jsonb("rules"),
    entryConditions: text("entry_conditions"),
    exitConditions: text("exit_conditions"),
    stopLossType: varchar("stop_loss_type", { length: 128 }),
    takeProfitType: varchar("take_profit_type", { length: 128 }),
    timeframes: text("timeframes").array().notNull().default([]),
    instruments: text("instruments").array().notNull().default([]),
    status: statusEnum("status").notNull().default("ACTIVE"),
    tags: text("tags").array().notNull().default([]),
    backtestSummary: jsonb("backtest_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("strategies_user_id_idx").on(table.userId),
    index("strategies_created_at_idx").on(table.createdAt),
  ]
);

export const strategyVersions = pgTable(
  "strategy_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    strategyId: uuid("strategy_id")
      .notNull()
      .references(() => strategies.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 64 }).notNull(),
    snapshot: jsonb("snapshot").notNull(),
    changelog: text("changelog"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("strategy_versions_strategy_id_idx").on(table.strategyId)]
);

// ── Trades Module ─────────────────────────────────────────────────────

export const trades = pgTable(
  "trades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").references(() => accounts.id, { onDelete: "set null" }),
    symbol: varchar("symbol", { length: 128 }).notNull(),
    exchange: exchangeEnum("exchange").notNull(),
    instrumentType: instrumentTypeEnum("instrument_type").notNull(),
    direction: tradeDirectionEnum("direction").notNull(),
    // Base unit values, e.g. paise
    entryPrice: bigint("entry_price", { mode: "number" }).notNull(),
    exitPrice: bigint("exit_price", { mode: "number" }),
    quantity: integer("quantity").notNull(),
    entryTime: timestamp("entry_time", { withTimezone: true }).notNull(),
    exitTime: timestamp("exit_time", { withTimezone: true }),
    grossPnl: bigint("gross_pnl", { mode: "number" }),
    brokerage: bigint("brokerage", { mode: "number" }).notNull().default(0),
    taxes: bigint("taxes", { mode: "number" }).notNull().default(0),
    netPnl: bigint("net_pnl", { mode: "number" }),
    holdDurationSeconds: integer("hold_duration_seconds"),
    isOpen: boolean("is_open").notNull().default(true),
    // UUID array of tags
    setupTagIds: uuid("setup_tag_ids").array().notNull().default([]),
    emotionAtEntry: uuid("emotion_at_entry").references(() => emotionTags.id, { onDelete: "set null" }),
    emotionAtExit: uuid("emotion_at_exit").references(() => emotionTags.id, { onDelete: "set null" }),
    mistakeTagIds: uuid("mistake_tag_ids").array().notNull().default([]),
    strategyId: uuid("strategy_id").references(() => strategies.id, { onDelete: "set null" }),
    notes: text("notes"),
    screenshotUrls: text("screenshot_urls").array().notNull().default([]),
    rMultipleTarget: integer("r_multiple_target"), // basis points, e.g. 200 = 2.0R
    rMultipleActual: integer("r_multiple_actual"),
    maeAmount: bigint("mae_amount", { mode: "number" }), // Maximum adverse excursion
    mfeAmount: bigint("mfe_amount", { mode: "number" }), // Maximum favorable excursion
    maePercent: integer("mae_percent"), // basis points
    mfePercent: integer("mfe_percent"),
    isForwardTest: boolean("is_forward_test").notNull().default(false),
    deviationsFromPlan: jsonb("deviations_from_plan"),
    importSource: varchar("import_source", { length: 128 }),
    brokerOrderId: varchar("broker_order_id", { length: 256 }), // for deduplication
    importedAt: timestamp("imported_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("trades_user_id_idx").on(table.userId),
    index("trades_entry_time_idx").on(table.entryTime),
    index("trades_symbol_idx").on(table.symbol),
    index("trades_strategy_id_idx").on(table.strategyId),
    index("trades_setup_tag_ids_idx").using("gin", table.setupTagIds),
    index("trades_mistake_tag_ids_idx").using("gin", table.mistakeTagIds),
    index("trades_created_at_idx").on(table.createdAt),
    index("trades_deleted_at_idx").on(table.deletedAt),
  ]
);

export const tradeLegs = pgTable(
  "trade_legs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tradeId: uuid("trade_id")
      .notNull()
      .references(() => trades.id, { onDelete: "cascade" }),
    type: tradeLegTypeEnum("type").notNull(),
    price: bigint("price", { mode: "number" }).notNull(),
    quantity: integer("quantity").notNull(),
    executedAt: timestamp("executed_at", { withTimezone: true }).notNull(),
    orderId: varchar("order_id", { length: 256 }),
    fees: bigint("fees", { mode: "number" }).notNull().default(0),
  },
  (table) => [index("trade_legs_trade_id_idx").on(table.tradeId)]
);

// ── Journal Module ────────────────────────────────────────────────────

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: journalTypeEnum("type").notNull(),
    date: date("date").notNull(),
    title: varchar("title", { length: 256 }).notNull(),

    // ── DAILY fields ──────────────────────────────────────────────────
    moodScore: integer("mood_score"),       // 1-10
    sleepScore: integer("sleep_score"),     // 1-10
    stressScore: integer("stress_score"),   // 1-10
    marketBias: marketBiasEnum("market_bias"),
    riskBudgetForDay: bigint("risk_budget_for_day", { mode: "number" }),
    preMarketNotes: text("pre_market_notes"),      // TipTap HTML
    postMarketNotes: text("post_market_notes"),    // TipTap HTML
    dayScore: integer("day_score"),               // 1-10
    planCompliance: integer("plan_compliance"),    // 0-100
    linkedTradeIds: uuid("linked_trade_ids").array().notNull().default([]),
    mistakeTagIds: uuid("mistake_tag_ids").array().notNull().default([]),
    tradingRuleIds: uuid("trading_rule_ids").array().notNull().default([]),  // rules set for the day
    brokenRuleIds: uuid("broken_rule_ids").array().notNull().default([]),   // which were broken

    // ── WEEKLY fields ─────────────────────────────────────────────────
    weekStart: date("week_start"),
    weekEnd: date("week_end"),
    weekScore: integer("week_score"),
    processScore: integer("process_score"),
    whatWorked: text("what_worked"),
    whatDidntWork: text("what_didnt_work"),
    focusForNextWeek: text("focus_for_next_week"),
    emotionPatterns: text("emotion_patterns"),
    topTradeIds: uuid("top_trade_ids").array().notNull().default([]),
    worstTradeIds: uuid("worst_trade_ids").array().notNull().default([]),

    // ── MONTHLY fields ────────────────────────────────────────────────
    month: integer("month"),
    year: integer("year"),
    goalReview: text("goal_review"),
    goalsForNextMonth: text("goals_for_next_month"),
    equityCurveScreenshotUrl: text("equity_curve_screenshot_url"),
    overallStrategyAssessment: text("overall_strategy_assessment"),

    // ── TRADE NOTE fields ─────────────────────────────────────────────
    linkedTradeId: uuid("linked_trade_id").references(() => trades.id, { onDelete: "set null" }),
    tradeAnalysis: text("trade_analysis"),
    whatIPlanned: text("what_i_planned"),
    whatActuallyHappened: text("what_actually_happened"),
    lessonLearned: text("lesson_learned"),
    screenshotUrls: text("screenshot_urls").array().notNull().default([]),
    deviationsFromPlan: text("deviations_from_plan").array().notNull().default([]),
    nextTimeIWill: text("next_time_i_will"),

    // ── IDEA fields ───────────────────────────────────────────────────
    category: journalIdeaCategoryEnum("category"),
    content: text("content"),   // TipTap HTML for idea content
    relatedSymbols: text("related_symbols").array().notNull().default([]),
    hypothesis: text("hypothesis"),
    toTest: boolean("to_test").notNull().default(false),
    linkedExperimentId: uuid("linked_experiment_id").references(() => experiments.id, { onDelete: "set null" }),

    // ── State ─────────────────────────────────────────────────────────
    isDraft: boolean("is_draft").notNull().default(true),
    isLocked: boolean("is_locked").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("journal_entries_user_id_idx").on(table.userId),
    index("journal_entries_date_idx").on(table.date),
    index("journal_entries_type_idx").on(table.type),
    index("journal_entries_deleted_at_idx").on(table.deletedAt),
    index("journal_entries_linked_trade_idx").on(table.linkedTradeId),
  ]
);

export const journalAiReflections = pgTable(
  "journal_ai_reflections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id")
      .notNull()
      .references(() => journalEntries.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    whatYouDidWell: text("what_you_did_well"),
    blindSpots: text("blind_spots"),
    reflectionQuestion: text("reflection_question"),
    model: varchar("model", { length: 64 }),
    tokensUsed: integer("tokens_used"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("journal_ai_reflections_entry_id_idx").on(table.entryId),
    index("journal_ai_reflections_user_id_idx").on(table.userId),
  ]
);

export const experiments = pgTable(
  "experiments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    hypothesis: text("hypothesis"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    rules: jsonb("rules").notNull().default([]), // array of strings internally
    status: statusEnum("status").notNull().default("ACTIVE"),
    results: jsonb("results"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("experiments_user_id_idx").on(table.userId)]
);

export const experimentCheckins = pgTable(
  "experiment_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id")
      .notNull()
      .references(() => experiments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    rulesComplied: jsonb("rules_complied"),
    notes: text("notes"),
    linkedPnl: bigint("linked_pnl", { mode: "number" }),
  },
  (table) => [
    index("experiment_checkins_experiment_id_idx").on(table.experimentId),
    index("experiment_checkins_user_id_idx").on(table.userId),
  ]
);

// ── Analytics Module ──────────────────────────────────────────────────

export const dailySnapshots = pgTable(
  "daily_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    openBalance: bigint("open_balance", { mode: "number" }).notNull(),
    closeBalance: bigint("close_balance", { mode: "number" }).notNull(),
    realizedPnl: bigint("realized_pnl", { mode: "number" }).notNull().default(0),
    unrealizedPnl: bigint("unrealized_pnl", { mode: "number" }).notNull().default(0),
    tradeCount: integer("trade_count").notNull().default(0),
    winCount: integer("win_count").notNull().default(0),
    lossCount: integer("loss_count").notNull().default(0),
    largestWin: bigint("largest_win", { mode: "number" }).notNull().default(0),
    largestLoss: bigint("largest_loss", { mode: "number" }).notNull().default(0),
    commissions: bigint("commissions", { mode: "number" }).notNull().default(0),
    netPnl: bigint("net_pnl", { mode: "number" }).notNull().default(0),
    runningEquity: bigint("running_equity", { mode: "number" }).notNull(),
    drawdown: integer("drawdown").notNull().default(0), // basis points / percentage
    peakEquity: bigint("peak_equity", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("daily_snapshots_user_id_idx").on(table.userId),
    index("daily_snapshots_date_idx").on(table.date),
  ]
);

export const monthlySnapshots = pgTable(
  "monthly_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
    month: date("month").notNull(), // usually 1st day of month
    openBalance: bigint("open_balance", { mode: "number" }).notNull(),
    closeBalance: bigint("close_balance", { mode: "number" }).notNull(),
    realizedPnl: bigint("realized_pnl", { mode: "number" }).notNull().default(0),
    unrealizedPnl: bigint("unrealized_pnl", { mode: "number" }).notNull().default(0),
    tradeCount: integer("trade_count").notNull().default(0),
    winCount: integer("win_count").notNull().default(0),
    lossCount: integer("loss_count").notNull().default(0),
    largestWin: bigint("largest_win", { mode: "number" }).notNull().default(0),
    largestLoss: bigint("largest_loss", { mode: "number" }).notNull().default(0),
    commissions: bigint("commissions", { mode: "number" }).notNull().default(0),
    netPnl: bigint("net_pnl", { mode: "number" }).notNull().default(0),
    runningEquity: bigint("running_equity", { mode: "number" }).notNull(),
    drawdown: integer("drawdown").notNull().default(0),
    peakEquity: bigint("peak_equity", { mode: "number" }).notNull(),
    // Monthly aggregations
    sharpeRatio: integer("sharpe_ratio"),
    calmarRatio: integer("calmar_ratio"),
    profitFactor: integer("profit_factor"),
    winRate: integer("win_rate"), // basis points
    avgWin: bigint("avg_win", { mode: "number" }),
    avgLoss: bigint("avg_loss", { mode: "number" }),
    expectancy: bigint("expectancy", { mode: "number" }),
    maxDrawdown: integer("max_drawdown"), // bps
    maxDrawdownDuration: integer("max_drawdown_duration"), // days
    bestDay: date("best_day"),
    worstDay: date("worst_day"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("monthly_snapshots_user_id_idx").on(table.userId),
    index("monthly_snapshots_month_idx").on(table.month),
  ]
);

// ── Production & Communication Module ─────────────────────────────────

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("push_subscriptions_user_id_idx").on(table.userId)]
);

export const emailStatusEnum = pgEnum("email_status", ["QUEUED", "SENT", "FAILED", "BOUNCED", "OPENED"]);

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), // Optional, for system emails
    toAddress: text("to_address").notNull(),
    templateName: text("template_name").notNull(),
    subject: text("subject"),
    status: emailStatusEnum("status").notNull().default("QUEUED"),
    resendMessageId: varchar("resend_message_id", { length: 256 }),
    failureReason: text("failure_reason"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("email_logs_user_id_idx").on(table.userId)]
);

// ── Carry Forward Losses Module ────────────────────────────────────
export const carryForwardLosses = pgTable(
  "carry_forward_losses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fy: varchar("fy", { length: 16 }).notNull(), // e.g. "2024-25"
    speculative: bigint("speculative", { mode: "number" }).notNull().default(0), // Intraday equity
    nonSpeculative: bigint("non_speculative", { mode: "number" }).notNull().default(0), // F&O
    stcl: bigint("stcl", { mode: "number" }).notNull().default(0), // Short term capital loss
    ltcl: bigint("ltcl", { mode: "number" }).notNull().default(0), // Long term capital loss
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("carry_forward_losses_user_id_idx").on(table.userId)]
);

// ── Carry Forward Losses Relations ──────────────────────────────────
export const carryForwardLossesRelations = relations(carryForwardLosses, ({ one }) => ({
  user: one(users, {
    fields: [carryForwardLosses.userId],
    references: [users.id],
  }),
}));

// ── Tax Module ────────────────────────────────────────────────────────

export const taxClassifications = pgTable(
  "tax_classifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tradeId: uuid("trade_id")
      .notNull()
      .references(() => trades.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fy: varchar("fy", { length: 16 }).notNull(), // e.g. "2025-26"
    category: taxCategoryEnum("category").notNull(),
    grossProfit: bigint("gross_profit", { mode: "number" }).notNull().default(0),
    grossLoss: bigint("gross_loss", { mode: "number" }).notNull().default(0),
    turnover: bigint("turnover", { mode: "number" }).notNull().default(0),
    brokerage: bigint("brokerage", { mode: "number" }).notNull().default(0),
    stt: bigint("stt", { mode: "number" }).notNull().default(0),
    exchangeFees: bigint("exchange_fees", { mode: "number" }).notNull().default(0),
    stampDuty: bigint("stamp_duty", { mode: "number" }).notNull().default(0),
    gst: bigint("gst", { mode: "number" }).notNull().default(0),
    netProfitLoss: bigint("net_profit_loss", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("tax_classifications_user_id_idx").on(table.userId),
    index("tax_classifications_trade_id_idx").on(table.tradeId),
    index("tax_classifications_fy_idx").on(table.fy),
  ]
);

// ── Prop Trading Module (Admin/Founder only) ──────────────────────────

export const propAccounts = pgTable(
  "prop_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    capital: bigint("capital", { mode: "number" }).notNull().default(0),
    currentValue: bigint("current_value", { mode: "number" }).notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }
);

export const propTrades = pgTable(
  "prop_trades",
  {
    // Exact same shape as trades, roughly stripped down or direct match.
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => propAccounts.id, { onDelete: "cascade" }),
    symbol: varchar("symbol", { length: 128 }).notNull(),
    exchange: exchangeEnum("exchange").notNull(),
    instrumentType: instrumentTypeEnum("instrument_type").notNull(),
    direction: tradeDirectionEnum("direction").notNull(),
    entryPrice: bigint("entry_price", { mode: "number" }).notNull(),
    exitPrice: bigint("exit_price", { mode: "number" }),
    quantity: integer("quantity").notNull(),
    entryTime: timestamp("entry_time", { withTimezone: true }).notNull(),
    exitTime: timestamp("exit_time", { withTimezone: true }),
    grossPnl: bigint("gross_pnl", { mode: "number" }),
    brokerage: bigint("brokerage", { mode: "number" }).notNull().default(0),
    taxes: bigint("taxes", { mode: "number" }).notNull().default(0),
    netPnl: bigint("net_pnl", { mode: "number" }),
    holdDurationSeconds: integer("hold_duration_seconds"),
    isOpen: boolean("is_open").notNull().default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("prop_trades_account_id_idx").on(table.accountId),
    index("prop_trades_entry_time_idx").on(table.entryTime),
  ]
);

// ── Automation & Clients Module ────────────────────────────────────────

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Founder
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    phone: varchar("phone", { length: 32 }),
    company: varchar("company", { length: 256 }),
    brokers: text("brokers").array().notNull().default([]),
    notes: text("notes"),
    status: clientStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("clients_user_id_idx").on(table.userId)]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Founder
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").notNull().default("ENQUIRY"),
    requirements: jsonb("requirements"),
    deliverables: jsonb("deliverables"),
    quotedAmount: bigint("quoted_amount", { mode: "number" }).notNull().default(0), // paise
    paidAmount: bigint("paid_amount", { mode: "number" }).notNull().default(0),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("UNPAID"),
    paymentNotes: text("payment_notes"),
    startDate: date("start_date"),
    dueDate: date("due_date"),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    files: jsonb("files").array().notNull().default([]), // {name, r2Key, uploadedAt, version}
    internalNotes: text("internal_notes"),
    clientNotes: text("client_notes"),
    tags: text("tags").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("projects_client_id_idx").on(table.clientId),
    index("projects_user_id_idx").on(table.userId),
  ]
);

export const projectMilestones = pgTable(
  "project_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("project_milestones_project_id_idx").on(table.projectId)]
);

export const projectMessages = pgTable(
  "project_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull(), // userId or clientId
    senderType: senderTypeEnum("sender_type").notNull(),
    content: text("content").notNull(),
    attachmentUrls: text("attachment_urls").array().notNull().default([]),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("project_messages_project_id_idx").on(table.projectId)]
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    invoiceNumber: varchar("invoice_number", { length: 64 }).notNull().unique(),
    lineItems: jsonb("line_items").notNull().default([]), // {description, qty, unitPrice, total}
    subtotal: bigint("subtotal", { mode: "number" }).notNull(),
    cgst: bigint("cgst", { mode: "number" }).notNull().default(0),
    sgst: bigint("sgst", { mode: "number" }).notNull().default(0),
    igst: bigint("igst", { mode: "number" }).notNull().default(0),
    total: bigint("total", { mode: "number" }).notNull(),
    status: invoiceStatusEnum("status").notNull().default("DRAFT"),
    dueDate: date("due_date"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    notes: text("notes"),
    r2Key: varchar("r2_key", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("invoices_project_id_idx").on(table.projectId),
    index("invoices_client_id_idx").on(table.clientId),
  ]
);

export const scriptTemplates = pgTable(
  "script_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 128 }), // BACKTEST, ALGO, SCANNER etc
    language: scriptLanguageEnum("language").notNull(),
    code: text("code").notNull(),
    parameters: jsonb("parameters"),
    tags: text("tags").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }
);

// ── Psychology & AI Module ───────────────────────────────────────────

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    sleepHours: integer("sleep_hours"),
    sleepQuality: integer("sleep_quality"), // 1-5
    stressLevel: integer("stress_level"), // 1-5
    physicalState: integer("physical_state"), // 1-5
    mindsetScore: integer("mindset_score"), // 1-5
    lifeEvents: text("life_events"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("daily_checkins_user_id_idx").on(table.userId),
    index("daily_checkins_date_idx").on(table.date),
  ]
);

export const tradingRules = pgTable(
  "trading_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    category: ruleCategoryEnum("category").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    breakCount: integer("break_count").notNull().default(0),
    lastBrokenAt: timestamp("last_broken_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("trading_rules_user_id_idx").on(table.userId)]
);

export const ruleBreaks = pgTable(
  "rule_breaks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ruleId: uuid("rule_id")
      .notNull()
      .references(() => tradingRules.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tradeId: uuid("trade_id").references(() => trades.id, { onDelete: "set null" }),
    date: date("date").notNull(),
    reason: text("reason"),
    cost: bigint("cost", { mode: "number" }).notNull().default(0), // paise impact
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("rule_breaks_rule_id_idx").on(table.ruleId),
    index("rule_breaks_user_id_idx").on(table.userId),
  ]
);

export const triggerPatterns = pgTable(
  "trigger_patterns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pattern: text("pattern").notNull(),
    triggerType: triggerTypeEnum("trigger_type").notNull(),
    linkedEmotionTag: uuid("linked_emotion_tag").references(() => emotionTags.id, { onDelete: "set null" }),
    avgCostWhenTriggered: bigint("avg_cost_when_triggered", { mode: "number" }).notNull().default(0),
    occurrenceCount: integer("occurrence_count").notNull().default(0),
    discoveredAt: timestamp("discovered_at", { withTimezone: true }).notNull().defaultNow(),
    confirmedByUser: boolean("confirmed_by_user").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("trigger_patterns_user_id_idx").on(table.userId)]
);

export const aiCoachReports = pgTable(
  "ai_coach_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: date("week_start").notNull(),
    weekEnd: date("week_end").notNull(),
    reportData: jsonb("report_data"), // raw stats
    aiResponse: text("ai_response"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("ai_coach_reports_user_id_idx").on(table.userId),
    index("ai_coach_reports_week_idx").on(table.weekStart, table.weekEnd),
  ]
);

// ── Broker Integration Module ─────────────────────────────────────────

export const brokerConnections = pgTable(
  "broker_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    broker: brokerEnum("broker").notNull(),
    // All credential fields AES-256-GCM encrypted
    encryptedApiKey: text("encrypted_api_key"),
    encryptedApiSecret: text("encrypted_api_secret"),
    encryptedAccessToken: text("encrypted_access_token"),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    encryptedClientId: text("encrypted_client_id"),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    needsReauth: boolean("needs_reauth").notNull().default(false),
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
    lastSyncStatus: varchar("last_sync_status", { length: 64 }), // SUCCESS, ERROR, PARTIAL
    syncError: text("sync_error"),
    totalTradesSynced: integer("total_trades_synced").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("broker_connections_user_id_idx").on(table.userId)]
);

export const syncLogs = pgTable(
  "sync_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => brokerConnections.id, { onDelete: "cascade" }),
    broker: brokerEnum("broker").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    status: varchar("status", { length: 64 }).notNull().default("pending"), // success|partial|failed|pending
    newTradesCount: integer("new_trades_count").notNull().default(0),
    duplicateCount: integer("duplicate_count").notNull().default(0),
    errorMessage: text("error_message"),
    triggeredBy: varchar("triggered_by", { length: 32 }).notNull().default("auto"), // auto|manual
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sync_logs_user_id_idx").on(table.userId),
    index("sync_logs_connection_id_idx").on(table.connectionId),
    index("sync_logs_started_at_idx").on(table.startedAt),
  ]
);

export const accountTransactions = pgTable(
  "account_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => propAccounts.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    description: text("description"),
    executedAt: timestamp("executed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("account_transactions_account_id_idx").on(table.accountId)]
);

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 256 }).notNull(),
    body: text("body").notNull(),
    type: announcementTypeEnum("type").notNull().default("INFO"),
    showFrom: timestamp("show_from", { withTimezone: true }).notNull(),
    showUntil: timestamp("show_until", { withTimezone: true }),
    targetPlan: varchar("target_plan", { length: 64 }).notNull().default("ALL"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    adminId: uuid("admin_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 128 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(), // USER, PROP, SYSTEM
    metadata: jsonb("metadata"),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_action_idx").on(table.action),
  ]
);

export const communityPosts = pgTable(
  "community_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: postTypeEnum("type").notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    anonymousAlias: varchar("anonymous_alias", { length: 128 }),
    tags: text("tags").array().notNull().default([]),
    upvotes: integer("upvotes").notNull().default(0),
    replyCount: integer("reply_count").notNull().default(0),
    isPinned: boolean("is_pinned").notNull().default(false),
    isFlagged: boolean("is_flagged").notNull().default(false),
    status: varchar("status", { length: 64 }).notNull().default("PUBLISHED"), // PUBLISHED, HIDDEN, DELETED
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("community_posts_user_id_idx").on(table.userId)]
);

export const postReplies = pgTable(
  "post_replies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    anonymousAlias: varchar("anonymous_alias", { length: 128 }),
    upvotes: integer("upvotes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("post_replies_post_id_idx").on(table.postId)]
);

export const postUpvotes = pgTable(
  "post_upvotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("post_upvotes_unique_idx").on(table.postId, table.userId)]
);

export const playbooks = pgTable(
  "playbooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    type: playbookTypeEnum("type").notNull(),
    content: text("content").notNull(),
    instruments: text("instruments").array().notNull().default([]),
    timeframes: text("timeframes").array().notNull().default([]),
    isPublic: boolean("is_public").notNull().default(true),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    views: integer("views").notNull().default(0),
    bookmarks: integer("bookmarks").notNull().default(0),
    rating: integer("rating"), // 1-100 logic
    tags: text("tags").array().notNull().default([]),
    disclaimer: text("disclaimer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("playbooks_user_id_idx").on(table.userId)]
);

export const playbookBookmarks = pgTable(
  "playbook_bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playbookId: uuid("playbook_id")
      .notNull()
      .references(() => playbooks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("playbook_bookmarks_unique_idx").on(table.playbookId, table.userId)]
);

export const leaderboards = pgTable(
  "leaderboards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    period: leaderboardPeriodEnum("period").notNull(),
    disciplineScore: integer("discipline_score").notNull().default(0),
    journalStreak: integer("journal_streak").notNull().default(0),
    ruleComplianceScore: integer("rule_compliance_score").notNull().default(0),
    experimentCount: integer("experiment_count").notNull().default(0),
    rank: integer("rank"),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("leaderboards_period_idx").on(table.period)]
);

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 128 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    metadata: jsonb("metadata"),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("achievements_user_id_idx").on(table.userId)]
);

// ── Relations ─────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings),
  trades: many(trades),
  accounts: many(accounts),
  journalEntries: many(journalEntries),
  strategies: many(strategies),
  clients: many(clients),
  projects: many(projects),
  dailyCheckins: many(dailyCheckins),
  tradingRules: many(tradingRules),
  aiCoachReports: many(aiCoachReports),
  brokerConnections: many(brokerConnections),
  syncLogs: many(syncLogs),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  projects: many(projects),
  invoices: many(invoices),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  milestones: many(projectMilestones),
  messages: many(projectMessages),
  invoices: many(invoices),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one }) => ({
  project: one(projects, { fields: [projectMilestones.projectId], references: [projects.id] }),
}));

export const projectMessagesRelations = relations(projectMessages, ({ one }) => ({
  project: one(projects, { fields: [projectMessages.projectId], references: [projects.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  user: one(users, { fields: [trades.userId], references: [users.id] }),
  account: one(accounts, { fields: [trades.accountId], references: [accounts.id] }),
  strategy: one(strategies, { fields: [trades.strategyId], references: [strategies.id] }),
  legs: many(tradeLegs),
}));

export const tradeLegsRelations = relations(tradeLegs, ({ one }) => ({
  trade: one(trades, { fields: [tradeLegs.tradeId], references: [trades.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Add more relations as necessary depending on backend needs...

// ── Type Exports ──────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type Trade = typeof trades.$inferSelect;
export type NewTrade = typeof trades.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type TradeLeg = typeof tradeLegs.$inferSelect;
export type NewTradeLeg = typeof tradeLegs.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;
export type Experiment = typeof experiments.$inferSelect;
export type NewExperiment = typeof experiments.$inferInsert;
export type Strategy = typeof strategies.$inferSelect;
export type NewStrategy = typeof strategies.$inferInsert;
export type DailySnapshot = typeof dailySnapshots.$inferSelect;
export type MonthlySnapshot = typeof monthlySnapshots.$inferSelect;
export const TaxClassification = typeof taxClassifications.$inferSelect;
export type PropAccount = typeof propAccounts.$inferSelect;
export type PropTrade = typeof propTrades.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type ProjectMessage = typeof projectMessages.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type ScriptTemplate = typeof scriptTemplates.$inferSelect;
export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type TradingRule = typeof tradingRules.$inferSelect;
export type RuleBreak = typeof ruleBreaks.$inferSelect;
export type TriggerPattern = typeof triggerPatterns.$inferSelect;
export type AiCoachReport = typeof aiCoachReports.$inferSelect;
export type BrokerConnection = typeof brokerConnections.$inferSelect;
export type SyncLog = typeof syncLogs.$inferSelect;

// ── Billing Module ──────────────────────────────────────────────────

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique() // one active subscription per user
      .references(() => users.id, { onDelete: "cascade" }),
    // AES-256-GCM encrypted Razorpay identifiers (never plain-text)
    encryptedRazorpaySubId: text("encrypted_razorpay_sub_id"),
    encryptedRazorpayCustomerId: text("encrypted_razorpay_customer_id"),
    plan: subscriptionPlanEnum("plan").notNull().default("free"),
    billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
  ]
);

export const billingPayments = pgTable(
  "billing_payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id")
      .references(() => subscriptions.id, { onDelete: "set null" }),
    // Razorpay IDs stored plain — needed for lookup & idempotency checks
    razorpayPaymentId: text("razorpay_payment_id").unique(),
    razorpayOrderId: text("razorpay_order_id"),
    // Razorpay subscription ID stored encrypted
    encryptedRazorpaySubId: text("encrypted_razorpay_sub_id"),
    amount: bigint("amount", { mode: "number" }).notNull(),  // paise
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    status: billingPaymentStatusEnum("status").notNull().default("created"),
    method: varchar("method", { length: 64 }), // card/upi/netbanking/wallet
    description: text("description"),
    invoiceUrl: text("invoice_url"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    failureReason: text("failure_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("billing_payments_user_id_idx").on(table.userId),
    index("billing_payments_razorpay_payment_id_idx").on(table.razorpayPaymentId),
    index("billing_payments_status_idx").on(table.status),
  ]
);

export const featureUsage = pgTable(
  "feature_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feature: varchar("feature", { length: 128 }).notNull(), // 'trades_import', 'ai_reflection'
    month: varchar("month", { length: 7 }).notNull(),       // '2026-04'
    count: integer("count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("feature_usage_user_id_idx").on(table.userId),
    index("feature_usage_month_idx").on(table.userId, table.feature, table.month),
  ]
);

// Billing types
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type BillingPayment = typeof billingPayments.$inferSelect;
export type NewBillingPayment = typeof billingPayments.$inferInsert;
export type FeatureUsage = typeof featureUsage.$inferSelect;
