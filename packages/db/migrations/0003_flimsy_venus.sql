CREATE TABLE "offer_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_id" varchar(256) NOT NULL,
	"file_name" varchar(256) NOT NULL,
	"file_data" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
