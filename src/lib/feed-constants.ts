export const STATUSES = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "under_review", label: "Under Review" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
] as const;

export const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "creator", label: "Creator" },
  { value: "fan", label: "Fan" },
] as const;

export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "most_voted", label: "Most Voted" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];
export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
