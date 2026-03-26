import { Suspense } from "react";
import { submitFeedback } from "@/actions/submit-feedback";
import { BackButton } from "@/components/back-button";
import { SubmitFeedbackProvider } from "@/contexts/submit-feedback";
import { aiDuplicateDetection } from "@/lib/flags";
import { SubmitFeedbackForm } from "./submit-feedback-form";

export default function SubmitPage() {
  return (
    <SubmitFeedbackProvider value={submitFeedback}>
      <div className="flex flex-col gap-8">
        <BackButton href="/" label="Back to feedback" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Share your ideas to help improve Fanvue
          </p>
        </div>
        <Suspense fallback={<SubmitFeedbackForm />}>
          <SubmitFormWithFlags />
        </Suspense>
      </div>
    </SubmitFeedbackProvider>
  );
}

async function SubmitFormWithFlags() {
  const duplicateDetectionEnabled = await aiDuplicateDetection();
  return <SubmitFeedbackForm duplicateDetection={duplicateDetectionEnabled} />;
}
