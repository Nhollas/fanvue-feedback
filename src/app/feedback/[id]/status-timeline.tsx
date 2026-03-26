import { RelativeTime } from "@/components/relative-time";
import type { Feedback, StatusChange } from "@/db/schema";

type StatusTimelineProps = {
  statusChanges: StatusChange[];
};

const statusColors: Record<Feedback["status"], string> = {
  requested: "#737373",
  under_review: "#FF9000",
  planned: "#9772FF",
  in_progress: "#4FB2F9",
  completed: "#1CC848",
  rejected: "#CE2D2D",
};

const statusLabels: Record<Feedback["status"], string> = {
  requested: "Requested",
  under_review: "Under Review",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

type Step = {
  status: Feedback["status"];
  changedAt: Date | null;
};

function deriveSteps(statusChanges: StatusChange[]): Step[] {
  const first = statusChanges[0];
  if (!first) return [];
  return [
    { status: first.fromStatus, changedAt: null },
    ...statusChanges.map((c) => ({
      status: c.toStatus,
      changedAt: c.changedAt,
    })),
  ];
}

export function StatusTimeline({ statusChanges }: StatusTimelineProps) {
  if (statusChanges.length === 0) return null;

  const steps = deriveSteps(statusChanges);

  return (
    <section
      aria-label="Status history"
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Dot row — line sits behind dots via absolute positioning */}
      {steps.map((step, i) => {
        const color = statusColors[step.status];
        const isLast = i === steps.length - 1;
        const isFirst = i === 0;

        return (
          <div
            key={`dot-${step.status}`}
            className="relative flex items-center justify-center py-1"
          >
            {/* Line segment — spans from center of this cell to the right */}
            {!isLast && (
              <div className="absolute top-1/2 right-0 left-1/2 h-0.5 -translate-y-1/2 bg-white/15" />
            )}
            {/* Line segment — spans from left edge to center of this cell */}
            {!isFirst && (
              <div className="absolute top-1/2 right-1/2 left-0 h-0.5 -translate-y-1/2 bg-white/15" />
            )}
            <div
              className={`relative rounded-full ${isLast ? "size-4" : "size-3"}`}
              style={{
                backgroundColor: color,
                boxShadow: isLast ? `0 0 0 4px ${color}33` : undefined,
              }}
            />
          </div>
        );
      })}

      {/* Label row */}
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;

        return (
          <div
            key={`label-${step.status}`}
            className="flex flex-col items-center pt-1"
          >
            <span
              className={`text-xs whitespace-nowrap ${
                isLast ? "font-medium text-white" : "text-white/50"
              }`}
            >
              {statusLabels[step.status]}
            </span>
            {step.changedAt && (
              <RelativeTime
                date={step.changedAt}
                className="text-xs text-white/30"
              />
            )}
          </div>
        );
      })}
    </section>
  );
}
