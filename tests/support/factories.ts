import type {
  ChangelogEntry,
  Comment,
  Feedback,
  StatusChange,
} from "@/db/schema";

export function buildFeedback(overrides: Partial<Feedback> = {}): Feedback {
  return {
    id: crypto.randomUUID(),
    title: "Test feedback",
    description: "Test description",
    category: "creator",
    status: "requested",
    voteCount: 0,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    ...overrides,
  };
}

export function buildComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: crypto.randomUUID(),
    feedbackId: crypto.randomUUID(),
    authorName: "Test User",
    content: "Test comment",
    createdAt: new Date("2026-01-15"),
    ...overrides,
  };
}

export function buildChangelogEntry(
  overrides: Partial<ChangelogEntry> = {},
): ChangelogEntry {
  return {
    id: crypto.randomUUID(),
    title: "Test changelog entry",
    description: "Test changelog description",
    publishedAt: new Date("2026-02-01"),
    ...overrides,
  };
}

export function buildStatusChange(
  overrides: Partial<StatusChange> = {},
): StatusChange {
  return {
    id: crypto.randomUUID(),
    feedbackId: crypto.randomUUID(),
    fromStatus: "requested",
    toStatus: "under_review",
    changedAt: new Date("2026-01-20"),
    ...overrides,
  };
}
