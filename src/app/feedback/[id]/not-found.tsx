import { ArrowLeftIcon } from "@fanvue/ui";
import Link from "next/link";

export default function FeedbackNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <h2 className="text-xl font-semibold">Feedback not found</h2>
      <p className="text-text-secondary">
        This feedback item doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-6 py-3 font-medium text-black transition-colors hover:bg-accent-hover"
      >
        <ArrowLeftIcon className="size-4" />
        Back to feedback
      </Link>
    </div>
  );
}
