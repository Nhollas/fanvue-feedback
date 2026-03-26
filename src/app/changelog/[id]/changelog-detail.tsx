import {
  ArrowUpRightIcon,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  Divider,
} from "@fanvue/ui";
import Link from "next/link";

import { RelativeTime } from "@/components/relative-time";
import type { ChangelogEntry } from "@/db/schema";

type LinkedFeedbackItem = {
  feedbackId: string;
  feedbackTitle: string;
};

type ChangelogDetailProps = {
  entry: ChangelogEntry;
  linkedFeedback: LinkedFeedbackItem[];
};

export function ChangelogDetail({
  entry,
  linkedFeedback,
}: ChangelogDetailProps) {
  return (
    <Card>
      <CardHeader>
        <h1 className="typography-semibold-body-lg text-content-primary">
          {entry.title}
        </h1>
      </CardHeader>
      <CardContent>
        <CardDescription className="whitespace-pre-line">
          {entry.description}
        </CardDescription>
        <RelativeTime
          date={entry.publishedAt}
          className="text-sm text-white/40"
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-3">
        {linkedFeedback.length > 0 && (
          <div className="w-full">
            <Divider label="Linked feedback" />
            <ul className="flex flex-wrap gap-2 py-2">
              {linkedFeedback.map((fb) => (
                <li key={fb.feedbackId} className="list-none">
                  <Button variant="brand" size="32" asChild>
                    <Link href={`/feedback/${fb.feedbackId}`}>
                      {fb.feedbackTitle}
                      <ArrowUpRightIcon />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
