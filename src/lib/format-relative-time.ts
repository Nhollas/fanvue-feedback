const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

export function formatRelativeTime(date: Date, now = Date.now()): string {
  const diffSeconds = Math.floor((now - date.getTime()) / 1000);

  if (diffSeconds < 60) return "just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return rtf.format(-diffMinutes, "minute");

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return rtf.format(-diffHours, "hour");

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return rtf.format(-diffDays, "day");

  const nowDate = new Date(now);
  const months =
    (nowDate.getFullYear() - date.getFullYear()) * 12 +
    (nowDate.getMonth() - date.getMonth());

  if (months < 12) return rtf.format(-months, "month");

  const years = nowDate.getFullYear() - date.getFullYear();
  return rtf.format(-years, "year");
}
