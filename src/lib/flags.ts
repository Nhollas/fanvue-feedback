import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const aiDuplicateDetection = flag<boolean>({
  key: "ai-duplicate-detection",
  adapter: vercelAdapter(),
  description:
    "Enable AI-powered duplicate detection on the submit feedback form",
});
