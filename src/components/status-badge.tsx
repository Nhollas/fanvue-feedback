import type { BadgeVariant } from "@fanvue/ui";
import { Badge } from "@fanvue/ui";
import type { Feedback } from "@/db/schema";

const statusConfig: Record<
  Feedback["status"],
  { label: string; variant: BadgeVariant }
> = {
  requested: { label: "Requested", variant: "default" },
  under_review: { label: "Under Review", variant: "warning" },
  planned: { label: "Planned", variant: "special" },
  in_progress: { label: "In Progress", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
};

export function StatusBadge({ status }: { status: Feedback["status"] }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
