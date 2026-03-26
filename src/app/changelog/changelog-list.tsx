import {
  ArrowUpRightIcon,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@fanvue/ui";
import Link from "next/link";
import { RelativeTime } from "@/components/relative-time";
import type { ChangelogEntry } from "@/db/schema";

export type ChangelogEntryWithFeedback = ChangelogEntry & {
  feedbackItems: { id: string; title: string }[];
};

export function ChangelogList({
  entries,
}: {
  entries: ChangelogEntryWithFeedback[];
}) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-white/50">No changelog entries yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="relative has-[>a:focus-visible]:ring-2 has-[>a:focus-visible]:ring-secondary has-[>a:focus-visible]:ring-offset-2 has-[>a:focus-visible]:ring-offset-page"
        >
          <Link
            href={`/changelog/${entry.id}`}
            className="absolute inset-0 rounded-md focus-visible:outline-none"
            aria-label={entry.title}
          />
          <CardHeader>
            <h2 className="typography-semibold-body-lg text-content-primary">
              {entry.title}
            </h2>
          </CardHeader>
          <CardContent>
            <CardDescription className="whitespace-pre-line">
              {entry.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex-col items-start gap-3">
            <RelativeTime
              date={entry.publishedAt}
              className="text-sm text-white/40"
            />
            {entry.feedbackItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.feedbackItems.map((fb) => (
                  <Button key={fb.id} variant="brand" size="24" asChild>
                    <Link href={`/feedback/${fb.id}`} className="relative z-10">
                      {fb.title}
                      <ArrowUpRightIcon />
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
