import { ArrowLeftIcon, Button } from "@fanvue/ui";
import Link from "next/link";

export function BackButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Button
      asChild
      size="32"
      variant="primary"
      className={className ? `self-start ${className}` : "self-start"}
    >
      <Link href={href}>
        <ArrowLeftIcon />
        {label}
      </Link>
    </Button>
  );
}
