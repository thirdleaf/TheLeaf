CREATE TYPE "public"."broker" AS ENUM('zerodha', 'upstox', 'angel_one', 'fyers', 'dhan', 'other');--> statement-breakpoint
CREATE TYPE "public"."exchange" AS ENUM('NSE', 'BSE', 'MCX', 'NFO', 'BFO', 'CDS', 'CRYPTO');--> statement-breakpoint
CREATE TYPE "public"."instrument_type" AS ENUM('EQ', 'FUT', 'CE', 'PE', 'COMMODITY', 'CURRENCY');--> statement-breakpoint
CREATE TYPE "public"."journal_type" AS ENUM('PRE_SESSION', 'POST_SESSION', 'WEEKLY', 'MONTHLY', 'TRADE_NOTE');--> statement-breakpoint
CREATE TYPE "public"."market_bias" AS ENUM('BULLISH', 'BEARISH', 'NEUTRAL');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('solo', 'quant_builder', 'prop_mentor');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('trader', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."tag_type" AS ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL');--> statement-breakpoint
CREATE TYPE "public"."tax_category" AS ENUM('INTRADAY_SPECULATIVE', 'FO_NON_SPECULATIVE', 'STCG', 'LTCG', 'BTST');--> statement-breakpoint
CREATE TYPE "public"."trade_direction" AS ENUM('LONG', 'SHORT');--> statement-breakpoint
CREATE TYPE "public"."trade_leg_type" AS ENUM('ENTRY', 'EXIT', 'SCALE_IN', 'SCALE_OUT');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"broker" "broker" NOT NULL,
	"initial_capital" bigint DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid,
	"date" date NOT NULL,
	"open_balance" bigint NOT NULL,
	"close_balance" bigint NOT NULL,
	"realized_pnl" bigint DEFAULT 0 NOT NULL,
	"unrealized_pnl" bigint DEFAULT 0 NOT NULL,
	"trade_count" integer DEFAULT 0 NOT NULL,
	"win_count" integer DEFAULT 0 NOT NULL,
	"loss_count" integer DEFAULT 0 NOT NULL,
	"largest_win" bigint DEFAULT 0 NOT NULL,
	"largest_loss" bigint DEFAULT 0 NOT NULL,
	"commissions" bigint DEFAULT 0 NOT NULL,
	"net_pnl" bigint DEFAULT 0 NOT NULL,
	"running_equity" bigint NOT NULL,
	"drawdown" integer DEFAULT 0 NOT NULL,
	"peak_equity" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emotion_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(128) NOT NULL,
	"type" "tag_type" NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiment_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"rules_complied" jsonb,
	"notes" text,
	"linked_pnl" bigint
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"hypothesis" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"rules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "status" DEFAULT 'ACTIVE' NOT NULL,
	"results" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "journal_type" NOT NULL,
	"date" date NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text,
	"mood_score" integer,
	"sleep_score" integer,
	"stress_score" integer,
	"market_bias" "market_bias",
	"day_score" integer,
	"risk_budget_for_day" bigint,
	"linked_trade_ids" uuid[] DEFAULT '{}' NOT NULL,
	"plan_compliance" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mistake_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"category" varchar(128),
	"estimated_cost_total" bigint DEFAULT 0 NOT NULL,
	"occurrence_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid,
	"month" date NOT NULL,
	"open_balance" bigint NOT NULL,
	"close_balance" bigint NOT NULL,
	"realized_pnl" bigint DEFAULT 0 NOT NULL,
	"unrealized_pnl" bigint DEFAULT 0 NOT NULL,
	"trade_count" integer DEFAULT 0 NOT NULL,
	"win_count" integer DEFAULT 0 NOT NULL,
	"loss_count" integer DEFAULT 0 NOT NULL,
	"largest_win" bigint DEFAULT 0 NOT NULL,
	"largest_loss" bigint DEFAULT 0 NOT NULL,
	"commissions" bigint DEFAULT 0 NOT NULL,
	"net_pnl" bigint DEFAULT 0 NOT NULL,
	"running_equity" bigint NOT NULL,
	"drawdown" integer DEFAULT 0 NOT NULL,
	"peak_equity" bigint NOT NULL,
	"sharpe_ratio" integer,
	"calmar_ratio" integer,
	"profit_factor" integer,
	"win_rate" integer,
	"avg_win" bigint,
	"avg_loss" bigint,
	"expectancy" bigint,
	"max_drawdown" integer,
	"max_drawdown_duration" integer,
	"best_day" date,
	"worst_day" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prop_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"capital" bigint DEFAULT 0 NOT NULL,
	"current_value" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prop_trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"symbol" varchar(128) NOT NULL,
	"exchange" "exchange" NOT NULL,
	"instrument_type" "instrument_type" NOT NULL,
	"direction" "trade_direction" NOT NULL,
	"entry_price" bigint NOT NULL,
	"exit_price" bigint,
	"quantity" integer NOT NULL,
	"entry_time" timestamp with time zone NOT NULL,
	"exit_time" timestamp with time zone,
	"gross_pnl" bigint,
	"brokerage" bigint DEFAULT 0 NOT NULL,
	"taxes" bigint DEFAULT 0 NOT NULL,
	"net_pnl" bigint,
	"hold_duration_seconds" integer,
	"is_open" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setup_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"color" varchar(32),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"version" varchar(64) DEFAULT 'v1.0' NOT NULL,
	"rules" jsonb,
	"entry_conditions" text,
	"exit_conditions" text,
	"stop_loss_type" varchar(128),
	"take_profit_type" varchar(128),
	"timeframes" text[] DEFAULT '{}' NOT NULL,
	"instruments" text[] DEFAULT '{}' NOT NULL,
	"status" "status" DEFAULT 'ACTIVE' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"backtest_summary" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategy_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategy_id" uuid NOT NULL,
	"version" varchar(64) NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changelog" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trade_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"fy" varchar(16) NOT NULL,
	"category" "tax_category" NOT NULL,
	"gross_profit" bigint DEFAULT 0 NOT NULL,
	"gross_loss" bigint DEFAULT 0 NOT NULL,
	"turnover" bigint DEFAULT 0 NOT NULL,
	"brokerage" bigint DEFAULT 0 NOT NULL,
	"stt" bigint DEFAULT 0 NOT NULL,
	"exchange_fees" bigint DEFAULT 0 NOT NULL,
	"stamp_duty" bigint DEFAULT 0 NOT NULL,
	"gst" bigint DEFAULT 0 NOT NULL,
	"net_profit_loss" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trade_legs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trade_id" uuid NOT NULL,
	"type" "trade_leg_type" NOT NULL,
	"price" bigint NOT NULL,
	"quantity" integer NOT NULL,
	"executed_at" timestamp with time zone NOT NULL,
	"order_id" varchar(256),
	"fees" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid,
	"symbol" varchar(128) NOT NULL,
	"exchange" "exchange" NOT NULL,
	"instrument_type" "instrument_type" NOT NULL,
	"direction" "trade_direction" NOT NULL,
	"entry_price" bigint NOT NULL,
	"exit_price" bigint,
	"quantity" integer NOT NULL,
	"entry_time" timestamp with time zone NOT NULL,
	"exit_time" timestamp with time zone,
	"gross_pnl" bigint,
	"brokerage" bigint DEFAULT 0 NOT NULL,
	"taxes" bigint DEFAULT 0 NOT NULL,
	"net_pnl" bigint,
	"hold_duration_seconds" integer,
	"is_open" boolean DEFAULT true NOT NULL,
	"setup_tag_ids" uuid[] DEFAULT '{}' NOT NULL,
	"emotion_at_entry" uuid,
	"emotion_at_exit" uuid,
	"mistake_tag_ids" uuid[] DEFAULT '{}' NOT NULL,
	"strategy_id" uuid,
	"notes" text,
	"screenshot_urls" text[] DEFAULT '{}' NOT NULL,
	"r_multiple_target" integer,
	"r_multiple_actual" integer,
	"mae_amount" bigint,
	"mfe_amount" bigint,
	"mae_percent" integer,
	"mfe_percent" integer,
	"is_forward_test" boolean DEFAULT false NOT NULL,
	"deviations_from_plan" jsonb,
	"import_source" varchar(128),
	"imported_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"default_broker" "broker",
	"default_currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"risk_per_trade" integer DEFAULT 100 NOT NULL,
	"daily_loss_limit" bigint DEFAULT 0 NOT NULL,
	"timezone" varchar(64) DEFAULT 'Asia/Kolkata' NOT NULL,
	"notifications" jsonb DEFAULT '{"email":true,"pushOnTradeClose":true,"dailySummary":true,"weeklyReport":false,"riskAlerts":true}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(256) NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(256) NOT NULL,
	"plan" "plan" DEFAULT 'solo' NOT NULL,
	"role" "role" DEFAULT 'trader' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_snapshots" ADD CONSTRAINT "daily_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_snapshots" ADD CONSTRAINT "daily_snapshots_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emotion_tags" ADD CONSTRAINT "emotion_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_checkins" ADD CONSTRAINT "experiment_checkins_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_checkins" ADD CONSTRAINT "experiment_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mistake_tags" ADD CONSTRAINT "mistake_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_snapshots" ADD CONSTRAINT "monthly_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_snapshots" ADD CONSTRAINT "monthly_snapshots_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prop_trades" ADD CONSTRAINT "prop_trades_account_id_prop_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."prop_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setup_tags" ADD CONSTRAINT "setup_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategy_versions" ADD CONSTRAINT "strategy_versions_strategy_id_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_classifications" ADD CONSTRAINT "tax_classifications_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_classifications" ADD CONSTRAINT "tax_classifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_legs" ADD CONSTRAINT "trade_legs_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_emotion_at_entry_emotion_tags_id_fk" FOREIGN KEY ("emotion_at_entry") REFERENCES "public"."emotion_tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_emotion_at_exit_emotion_tags_id_fk" FOREIGN KEY ("emotion_at_exit") REFERENCES "public"."emotion_tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_strategy_id_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_snapshots_user_id_idx" ON "daily_snapshots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_snapshots_date_idx" ON "daily_snapshots" USING btree ("date");--> statement-breakpoint
CREATE INDEX "emotion_tags_user_id_idx" ON "emotion_tags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "experiment_checkins_experiment_id_idx" ON "experiment_checkins" USING btree ("experiment_id");--> statement-breakpoint
CREATE INDEX "experiment_checkins_user_id_idx" ON "experiment_checkins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "experiments_user_id_idx" ON "experiments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "journal_entries_user_id_idx" ON "journal_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "journal_entries_date_idx" ON "journal_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "mistake_tags_user_id_idx" ON "mistake_tags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monthly_snapshots_user_id_idx" ON "monthly_snapshots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monthly_snapshots_month_idx" ON "monthly_snapshots" USING btree ("month");--> statement-breakpoint
CREATE INDEX "prop_trades_account_id_idx" ON "prop_trades" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "prop_trades_entry_time_idx" ON "prop_trades" USING btree ("entry_time");--> statement-breakpoint
CREATE INDEX "setup_tags_user_id_idx" ON "setup_tags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "strategies_user_id_idx" ON "strategies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "strategies_created_at_idx" ON "strategies" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "strategy_versions_strategy_id_idx" ON "strategy_versions" USING btree ("strategy_id");--> statement-breakpoint
CREATE INDEX "tax_classifications_user_id_idx" ON "tax_classifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tax_classifications_trade_id_idx" ON "tax_classifications" USING btree ("trade_id");--> statement-breakpoint
CREATE INDEX "tax_classifications_fy_idx" ON "tax_classifications" USING btree ("fy");--> statement-breakpoint
CREATE INDEX "trade_legs_trade_id_idx" ON "trade_legs" USING btree ("trade_id");--> statement-breakpoint
CREATE INDEX "trades_user_id_idx" ON "trades" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trades_entry_time_idx" ON "trades" USING btree ("entry_time");--> statement-breakpoint
CREATE INDEX "trades_symbol_idx" ON "trades" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "trades_strategy_id_idx" ON "trades" USING btree ("strategy_id");--> statement-breakpoint
CREATE INDEX "trades_setup_tag_ids_idx" ON "trades" USING gin ("setup_tag_ids");--> statement-breakpoint
CREATE INDEX "trades_created_at_idx" ON "trades" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_clerk_id_idx" ON "users" USING btree ("clerk_id");