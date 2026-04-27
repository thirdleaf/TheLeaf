CREATE TYPE "public"."announcement_type" AS ENUM('INFO', 'WARNING', 'MAINTENANCE');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "public"."leaderboard_period" AS ENUM('WEEKLY', 'MONTHLY', 'ALL_TIME');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('UNPAID', 'PARTIAL', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."playbook_type" AS ENUM('STRATEGY_FRAMEWORK', 'RISK_APPROACH', 'PSYCHOLOGY', 'WORKFLOW');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('INSIGHT', 'REVIEW', 'QUESTION', 'MILESTONE');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ENQUIRY', 'SCOPING', 'IN_PROGRESS', 'REVIEW', 'DELIVERED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('BACKTEST_SCRIPT', 'ALGO_STRATEGY', 'AUTOMATION_TOOL', 'INDICATOR', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."rule_category" AS ENUM('RISK', 'ENTRY', 'EXIT', 'MINDSET', 'SIZING');--> statement-breakpoint
CREATE TYPE "public"."script_language" AS ENUM('PYTHON', 'PINESCRIPT', 'AMIBROKER', 'AFL', 'JAVASCRIPT');--> statement-breakpoint
CREATE TYPE "public"."sender_type" AS ENUM('FOUNDER', 'CLIENT');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('DEPOSIT', 'WITHDRAWAL');--> statement-breakpoint
CREATE TYPE "public"."trigger_type" AS ENUM('LIFE_EVENT', 'EMOTION', 'TIME', 'STREAK', 'MARKET_CONDITION');--> statement-breakpoint
CREATE TABLE "account_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" bigint NOT NULL,
	"description" text,
	"executed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(128) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"metadata" jsonb,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_coach_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"week_start" date NOT NULL,
	"week_end" date NOT NULL,
	"report_data" jsonb,
	"ai_response" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"body" text NOT NULL,
	"type" "announcement_type" DEFAULT 'INFO' NOT NULL,
	"show_from" timestamp with time zone NOT NULL,
	"show_until" timestamp with time zone,
	"target_plan" varchar(64) DEFAULT 'ALL' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"admin_id" uuid,
	"action" varchar(128) NOT NULL,
	"category" varchar(64) NOT NULL,
	"metadata" jsonb,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "broker_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"broker" "broker" NOT NULL,
	"encrypted_api_key" text,
	"encrypted_api_secret" text,
	"encrypted_access_token" text,
	"encrypted_client_id" text,
	"token_expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp with time zone,
	"last_sync_status" varchar(64),
	"sync_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(32),
	"company" varchar(256),
	"brokers" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"status" "client_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "post_type" NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"anonymous_alias" varchar(128),
	"tags" text[] DEFAULT '{}' NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"status" varchar(64) DEFAULT 'PUBLISHED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"sleep_hours" integer,
	"sleep_quality" integer,
	"stress_level" integer,
	"physical_state" integer,
	"mindset_score" integer,
	"life_events" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"invoice_number" varchar(64) NOT NULL,
	"line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subtotal" bigint NOT NULL,
	"cgst" bigint DEFAULT 0 NOT NULL,
	"sgst" bigint DEFAULT 0 NOT NULL,
	"igst" bigint DEFAULT 0 NOT NULL,
	"total" bigint NOT NULL,
	"status" "invoice_status" DEFAULT 'DRAFT' NOT NULL,
	"due_date" date,
	"paid_at" timestamp with time zone,
	"notes" text,
	"r2_key" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "leaderboards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period" "leaderboard_period" NOT NULL,
	"discipline_score" integer DEFAULT 0 NOT NULL,
	"journal_streak" integer DEFAULT 0 NOT NULL,
	"rule_compliance_score" integer DEFAULT 0 NOT NULL,
	"experiment_count" integer DEFAULT 0 NOT NULL,
	"rank" integer,
	"calculated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(128) NOT NULL,
	"message" text NOT NULL,
	"severity" varchar(64) DEFAULT 'info' NOT NULL,
	"metadata" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playbook_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"type" "playbook_type" NOT NULL,
	"content" text NOT NULL,
	"instruments" text[] DEFAULT '{}' NOT NULL,
	"timeframes" text[] DEFAULT '{}' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"bookmarks" integer DEFAULT 0 NOT NULL,
	"rating" integer,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"disclaimer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"anonymous_alias" varchar(128),
	"upvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_type" "sender_type" NOT NULL,
	"content" text NOT NULL,
	"attachment_urls" text[] DEFAULT '{}' NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"due_date" date,
	"completed_at" timestamp with time zone,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"type" "project_type" NOT NULL,
	"status" "project_status" DEFAULT 'ENQUIRY' NOT NULL,
	"requirements" jsonb,
	"deliverables" jsonb,
	"quoted_amount" bigint DEFAULT 0 NOT NULL,
	"paid_amount" bigint DEFAULT 0 NOT NULL,
	"payment_status" "payment_status" DEFAULT 'UNPAID' NOT NULL,
	"payment_notes" text,
	"start_date" date,
	"due_date" date,
	"delivered_at" timestamp with time zone,
	"files" jsonb[] DEFAULT '{}' NOT NULL,
	"internal_notes" text,
	"client_notes" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rule_breaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rule_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"trade_id" uuid,
	"date" date NOT NULL,
	"reason" text,
	"cost" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "script_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"type" varchar(128),
	"language" "script_language" NOT NULL,
	"code" text NOT NULL,
	"parameters" jsonb,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"broker" "broker" NOT NULL,
	"trades_imported" integer DEFAULT 0 NOT NULL,
	"status" varchar(64) NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trading_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"category" "rule_category" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"break_count" integer DEFAULT 0 NOT NULL,
	"last_broken_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trigger_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pattern" text NOT NULL,
	"trigger_type" "trigger_type" NOT NULL,
	"linked_emotion_tag" uuid,
	"avg_cost_when_triggered" bigint DEFAULT 0 NOT NULL,
	"occurrence_count" integer DEFAULT 0 NOT NULL,
	"discovered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_by_user" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_snapshots" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "monthly_snapshots" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tax_classifications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "trades" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_suspended" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_account_id_prop_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."prop_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_coach_reports" ADD CONSTRAINT "ai_coach_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broker_connections" ADD CONSTRAINT "broker_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_checkins" ADD CONSTRAINT "daily_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_bookmarks" ADD CONSTRAINT "playbook_bookmarks_playbook_id_playbooks_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbooks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_bookmarks" ADD CONSTRAINT "playbook_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_replies" ADD CONSTRAINT "post_replies_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_replies" ADD CONSTRAINT "post_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_upvotes" ADD CONSTRAINT "post_upvotes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_upvotes" ADD CONSTRAINT "post_upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_breaks" ADD CONSTRAINT "rule_breaks_rule_id_trading_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."trading_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_breaks" ADD CONSTRAINT "rule_breaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rule_breaks" ADD CONSTRAINT "rule_breaks_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_connection_id_broker_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."broker_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_rules" ADD CONSTRAINT "trading_rules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_patterns" ADD CONSTRAINT "trigger_patterns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_patterns" ADD CONSTRAINT "trigger_patterns_linked_emotion_tag_emotion_tags_id_fk" FOREIGN KEY ("linked_emotion_tag") REFERENCES "public"."emotion_tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_transactions_account_id_idx" ON "account_transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "achievements_user_id_idx" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_coach_reports_user_id_idx" ON "ai_coach_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_coach_reports_week_idx" ON "ai_coach_reports" USING btree ("week_start","week_end");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "broker_connections_user_id_idx" ON "broker_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clients_user_id_idx" ON "clients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_posts_user_id_idx" ON "community_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_checkins_user_id_idx" ON "daily_checkins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_checkins_date_idx" ON "daily_checkins" USING btree ("date");--> statement-breakpoint
CREATE INDEX "invoices_project_id_idx" ON "invoices" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "invoices_client_id_idx" ON "invoices" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "leaderboards_period_idx" ON "leaderboards" USING btree ("period");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "playbook_bookmarks_unique_idx" ON "playbook_bookmarks" USING btree ("playbook_id","user_id");--> statement-breakpoint
CREATE INDEX "playbooks_user_id_idx" ON "playbooks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_replies_post_id_idx" ON "post_replies" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_upvotes_unique_idx" ON "post_upvotes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "project_messages_project_id_idx" ON "project_messages" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_milestones_project_id_idx" ON "project_milestones" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_client_id_idx" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rule_breaks_rule_id_idx" ON "rule_breaks" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "rule_breaks_user_id_idx" ON "rule_breaks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sync_logs_user_id_idx" ON "sync_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sync_logs_connection_id_idx" ON "sync_logs" USING btree ("connection_id");--> statement-breakpoint
CREATE INDEX "trading_rules_user_id_idx" ON "trading_rules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trigger_patterns_user_id_idx" ON "trigger_patterns" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trades_mistake_tag_ids_idx" ON "trades" USING gin ("mistake_tag_ids");--> statement-breakpoint
CREATE INDEX "trades_deleted_at_idx" ON "trades" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "public"."accounts" ALTER COLUMN "broker" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."broker_connections" ALTER COLUMN "broker" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."sync_logs" ALTER COLUMN "broker" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."user_settings" ALTER COLUMN "default_broker" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."broker";--> statement-breakpoint
CREATE TYPE "public"."broker" AS ENUM('ZERODHA', 'UPSTOX', 'ANGELONE', 'FYERS', 'DHAN', 'GROWW', 'OTHER');--> statement-breakpoint
ALTER TABLE "public"."accounts" ALTER COLUMN "broker" SET DATA TYPE "public"."broker" USING "broker"::"public"."broker";--> statement-breakpoint
ALTER TABLE "public"."broker_connections" ALTER COLUMN "broker" SET DATA TYPE "public"."broker" USING "broker"::"public"."broker";--> statement-breakpoint
ALTER TABLE "public"."sync_logs" ALTER COLUMN "broker" SET DATA TYPE "public"."broker" USING "broker"::"public"."broker";--> statement-breakpoint
ALTER TABLE "public"."user_settings" ALTER COLUMN "default_broker" SET DATA TYPE "public"."broker" USING "default_broker"::"public"."broker";