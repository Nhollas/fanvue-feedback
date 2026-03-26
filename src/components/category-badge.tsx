import type { BadgeVariant } from "@fanvue/ui";
import { Badge } from "@fanvue/ui";
import type { Feedback } from "@/db/schema";

const categoryConfig: Record<
  Feedback["category"],
  { label: string; variant: BadgeVariant }
> = {
  creator: { label: "Creator", variant: "brand" },
  fan: { label: "Fan", variant: "pink" },
};

export function CategoryBadge({
  category,
}: {
  category: Feedback["category"];
}) {
  const config = categoryConfig[category];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
