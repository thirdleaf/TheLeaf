CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."billing_payment_status" AS ENUM('created', 'authorized', 'captured', 'refunded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('QUEUED', 'SENT', 'FAILED', 'BOUNCED', 'OPENED');--> statement-breakpoint
CREATE TYPE "public"."journal_idea_category" AS ENUM('MARKET_OBSERVATION', 'STRATEGY_IDEA', 'RISK_MANAGEMENT', 'PSYCHOLOGY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('free', 'pro', 'elite');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'paused', 'cancelled', 'expired', 'pending', 'halted');--> statement-breakpoint
ALTER TYPE "public"."broker" ADD VALUE 'SAHI' BEFORE 'OTHER';--> statement-breakpoint
CREATE TABLE "billing_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"razorpay_payment_id" text,
	"razorpay_order_id" text,
	"encrypted_razorpay_sub_id" text,
	"amount" bigint NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "billing_payment_status" DEFAULT 'created' NOT NULL,
	"method" varchar(64),
	"description" text,
	"invoice_url" text,
	"paid_at" timestamp with time zone,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_payments_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id")
);
--> statement-breakpoint
CREATE TABLE "carry_forward_losses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"fy" varchar(16) NOT NULL,
	"speculative" bigint DEFAULT 0 NOT NULL,
	"non_speculative" bigint DEFAULT 0 NOT NULL,
	"stcl" bigint DEFAULT 0 NOT NULL,
	"ltcl" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"to_address" text NOT NULL,
	"template_name" text NOT NULL,
	"subject" text,
	"status" "email_status" DEFAULT 'QUEUED' NOT NULL,
	"resend_message_id" varchar(256),
	"failure_reason" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"feature" varchar(128) NOT NULL,
	"month" varchar(7) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_ai_reflections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"what_you_did_well" text,
	"blind_spots" text,
	"reflection_question" text,
	"model" varchar(64),
	"tokens_used" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"encrypted_razorpay_sub_id" text,
	"encrypted_razorpay_customer_id" text,
	"plan" "subscription_plan" DEFAULT 'free' NOT NULL,
	"billing_cycle" "billing_cycle" DEFAULT 'monthly' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp with time zone,
	"trial_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "journal_entries" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."journal_type";--> statement-breakpoint
CREATE TYPE "public"."journal_type" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'TRADE_NOTE', 'IDEA');--> statement-breakpoint
ALTER TABLE "journal_entries" ALTER COLUMN "type" SET DATA TYPE "public"."journal_type" USING "type"::"public"."journal_type";--> statement-breakpoint
ALTER TABLE "tax_classifications" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."tax_category";--> statement-breakpoint
CREATE TYPE "public"."tax_category" AS ENUM('equity_intraday', 'equity_short_term', 'equity_long_term', 'fo_futures', 'fo_options', 'currency', 'commodity', 'btst');--> statement-breakpoint
ALTER TABLE "tax_classifications" ALTER COLUMN "category" SET DATA TYPE "public"."tax_category" USING "category"::"public"."tax_category";--> statement-breakpoint
ALTER TABLE "sync_logs" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "user_settings" ALTER COLUMN "notifications" SET DEFAULT '{"tradeSync":true,"dailyJournalReminder":true,"drawdownAlerts":true,"weeklyReview":false,"brokerTokenExpiry":true}'::jsonb;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_coach_reports" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "broker_connections" ADD COLUMN "encrypted_refresh_token" text;--> statement-breakpoint
ALTER TABLE "broker_connections" ADD COLUMN "needs_reauth" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "broker_connections" ADD COLUMN "total_trades_synced" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "community_posts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_checkins" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "pre_market_notes" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "post_market_notes" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "mistake_tag_ids" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "trading_rule_ids" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "broken_rule_ids" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "week_start" date;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "week_end" date;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "week_score" integer;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "process_score" integer;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "what_worked" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "what_didnt_work" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "focus_for_next_week" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "emotion_patterns" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "top_trade_ids" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "worst_trade_ids" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "month" integer;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "goal_review" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "goals_for_next_month" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "equity_curve_screenshot_url" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "overall_strategy_assessment" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "linked_trade_id" uuid;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "trade_analysis" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "what_i_planned" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "what_actually_happened" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "lesson_learned" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "screenshot_urls" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "deviations_from_plan" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "next_time_i_will" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "category" "journal_idea_category";--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "related_symbols" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "hypothesis" text;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "to_test" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "linked_experiment_id" uuid;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "is_draft" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "is_locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leaderboards" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "playbooks" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "prop_accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "started_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "new_trades_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "duplicate_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD COLUMN "triggered_by" varchar(32) DEFAULT 'auto' NOT NULL;--> statement-breakpoint
ALTER TABLE "trades" ADD COLUMN "broker_order_id" varchar(256);--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "custom_brokerage_paise" bigint;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "brokerage_cap_paise" bigint;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "trader_type" varchar(64) DEFAULT 'intraday' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD CONSTRAINT "billing_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD CONSTRAINT "billing_payments_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carry_forward_losses" ADD CONSTRAINT "carry_forward_losses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_usage" ADD CONSTRAINT "feature_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_ai_reflections" ADD CONSTRAINT "journal_ai_reflections_entry_id_journal_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_ai_reflections" ADD CONSTRAINT "journal_ai_reflections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_payments_user_id_idx" ON "billing_payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "billing_payments_razorpay_payment_id_idx" ON "billing_payments" USING btree ("razorpay_payment_id");--> statement-breakpoint
CREATE INDEX "billing_payments_status_idx" ON "billing_payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "carry_forward_losses_user_id_idx" ON "carry_forward_losses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_logs_user_id_idx" ON "email_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feature_usage_user_id_idx" ON "feature_usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feature_usage_month_idx" ON "feature_usage" USING btree ("user_id","feature","month");--> statement-breakpoint
CREATE INDEX "journal_ai_reflections_entry_id_idx" ON "journal_ai_reflections" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "journal_ai_reflections_user_id_idx" ON "journal_ai_reflections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_linked_trade_id_trades_id_fk" FOREIGN KEY ("linked_trade_id") REFERENCES "public"."trades"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_linked_experiment_id_experiments_id_fk" FOREIGN KEY ("linked_experiment_id") REFERENCES "public"."experiments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "journal_entries_type_idx" ON "journal_entries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "journal_entries_deleted_at_idx" ON "journal_entries" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "journal_entries_linked_trade_idx" ON "journal_entries" USING btree ("linked_trade_id");--> statement-breakpoint
CREATE INDEX "sync_logs_started_at_idx" ON "sync_logs" USING btree ("started_at");--> statement-breakpoint
ALTER TABLE "sync_logs" DROP COLUMN "trades_imported";--> statement-breakpoint
ALTER TABLE "sync_logs" DROP COLUMN "error";