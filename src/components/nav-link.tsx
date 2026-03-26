"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
      }`}
      {...(isActive && { "aria-current": "page" as const })}
    >
      {children}
    </Link>
  );
}
