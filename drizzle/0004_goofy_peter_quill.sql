CREATE TABLE "changelog_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "changelog_feedback" (
	"changelog_entry_id" uuid NOT NULL,
	"feedback_id" uuid NOT NULL,
	CONSTRAINT "changelog_feedback_changelog_entry_id_feedback_id_pk" PRIMARY KEY("changelog_entry_id","feedback_id")
);
--> statement-breakpoint
ALTER TABLE "changelog_feedback" ADD CONSTRAINT "changelog_feedback_changelog_entry_id_changelog_entries_id_fk" FOREIGN KEY ("changelog_entry_id") REFERENCES "public"."changelog_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "changelog_feedback" ADD CONSTRAINT "changelog_feedback_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;