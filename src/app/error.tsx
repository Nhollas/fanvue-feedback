"use client";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-text-secondary">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-6 py-3 font-medium text-black transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
