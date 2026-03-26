"use client";

import { useSearchParams } from "next/navigation";
import { BackButton } from "@/components/back-button";

export function FeedbackBackButton() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const href =
    returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";

  return <BackButton href={href} label="Back to feedback" />;
}
