CREATE TABLE "votes" (
	"feedback_id" uuid NOT NULL,
	"voter_identifier" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_feedback_id_voter_identifier_pk" PRIMARY KEY("feedback_id","voter_identifier")
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;