CREATE TYPE "public"."category" AS ENUM('creator', 'fan');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('requested', 'under_review', 'planned', 'in_progress', 'completed', 'rejected');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "category" NOT NULL,
	"status" "status" DEFAULT 'requested' NOT NULL,
	"vote_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
