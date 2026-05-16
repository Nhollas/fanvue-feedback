import { Logo } from "@fanvue/ui";
import Link from "next/link";
import { Suspense } from "react";

import { NavLink } from "@/components/nav-link";

export function Header() {
  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Fanvue Feedback home">
          <Logo variant="full" color="whiteAlways" />
        </Link>
        <nav className="flex items-center gap-6">
          <Suspense>
            <NavLink href="/">Feedback</NavLink>
            <NavLink href="/roadmap">Roadmap</NavLink>
            <NavLink href="/changelog">Changelog</NavLink>
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
