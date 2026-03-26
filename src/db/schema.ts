import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["creator", "fan"]);

export const statusEnum = pgEnum("status", [
  "requested",
  "under_review",
  "planned",
  "in_progress",
  "completed",
  "rejected",
]);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: categoryEnum("category").notNull(),
    status: statusEnum("status").notNull().default("requested"),
    voteCount: integer("vote_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    index("feedback_search_idx").using(
      "gin",
      sql`to_tsvector('english', title || ' ' || description)`,
    ),
  ],
);

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  feedbackId: uuid("feedback_id")
    .notNull()
    .references(() => feedback.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Comment = typeof comments.$inferSelect;

export const statusChanges = pgTable("status_changes", {
  id: uuid("id").defaultRandom().primaryKey(),
  feedbackId: uuid("feedback_id")
    .notNull()
    .references(() => feedback.id, { onDelete: "cascade" }),
  fromStatus: statusEnum("from_status").notNull(),
  toStatus: statusEnum("to_status").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type StatusChange = typeof statusChanges.$inferSelect;

export const changelogEntries = pgTable("changelog_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ChangelogEntry = typeof changelogEntries.$inferSelect;

export const changelogFeedback = pgTable(
  "changelog_feedback",
  {
    changelogEntryId: uuid("changelog_entry_id")
      .notNull()
      .references(() => changelogEntries.id, { onDelete: "cascade" }),
    feedbackId: uuid("feedback_id")
      .notNull()
      .references(() => feedback.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.changelogEntryId, table.feedbackId],
    }),
  ],
);

export const feedbackEmbeddings = pgTable(
  "feedback_embeddings",
  {
    feedbackId: uuid("feedback_id")
      .notNull()
      .primaryKey()
      .references(() => feedback.id, { onDelete: "cascade" }),
    titleEmbedding: vector("title_embedding", { dimensions: 1536 }),
    descriptionEmbedding: vector("description_embedding", {
      dimensions: 1536,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("feedback_embeddings_title_idx").using(
      "hnsw",
      table.titleEmbedding.op("vector_cosine_ops"),
    ),
    index("feedback_embeddings_description_idx").using(
      "hnsw",
      table.descriptionEmbedding.op("vector_cosine_ops"),
    ),
  ],
);

export const votes = pgTable(
  "votes",
  {
    feedbackId: uuid("feedback_id")
      .notNull()
      .references(() => feedback.id, { onDelete: "cascade" }),
    voterIdentifier: text("voter_identifier").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.feedbackId, table.voterIdentifier] }),
  ],
);
