"use client";

import { Suspense, useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/format-relative-time";

type RelativeTimeProps = {
  date: Date;
  className?: string;
};

function RelativeTimeContent({ date, className }: RelativeTimeProps) {
  const [text, setText] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    setText(formatRelativeTime(date));
  }, [date]);

  return (
    <time
      dateTime={date.toISOString()}
      className={className}
      suppressHydrationWarning
    >
      {text}
    </time>
  );
}

export function RelativeTime(props: RelativeTimeProps) {
  return (
    <Suspense>
      <RelativeTimeContent {...props} />
    </Suspense>
  );
}
