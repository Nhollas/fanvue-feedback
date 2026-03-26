CREATE TABLE "feedback_embeddings" (
	"feedback_id" uuid PRIMARY KEY NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback_embeddings" ADD CONSTRAINT "feedback_embeddings_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_embeddings_embedding_idx" ON "feedback_embeddings" USING hnsw ("embedding" vector_cosine_ops);