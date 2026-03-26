DROP INDEX "feedback_embeddings_embedding_idx";--> statement-breakpoint
ALTER TABLE "feedback_embeddings" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "feedback_embeddings" ADD COLUMN "title_embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "feedback_embeddings" ADD COLUMN "description_embedding" vector(1536);--> statement-breakpoint
CREATE INDEX "feedback_embeddings_title_idx" ON "feedback_embeddings" USING hnsw ("title_embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "feedback_embeddings_description_idx" ON "feedback_embeddings" USING hnsw ("description_embedding" vector_cosine_ops);