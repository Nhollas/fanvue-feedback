import { BackButton } from "@/components/back-button";
import { db } from "@/db";
import { changelogEntries } from "@/db/schema";

import { ChangelogDetailContent } from "./changelog-detail-content";

export async function generateStaticParams() {
  const entries = await db
    .select({ id: changelogEntries.id })
    .from(changelogEntries);
  return entries.map(({ id }) => ({ id }));
}

export default async function ChangelogDetailPage(
  props: PageProps<"/changelog/[id]">,
) {
  const { id } = await props.params;

  return (
    <div className="flex flex-col gap-6">
      <BackButton
        href="/changelog"
        label="Back to changelog"
        className="mb-1"
      />

      <ChangelogDetailContent id={id} />
    </div>
  );
}
