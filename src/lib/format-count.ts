const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(count: number): string {
  return formatter.format(count);
}
