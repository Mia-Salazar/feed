"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const menuLinkClassName =
  "inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-sm font-semibold tracking-wide text-brand-foreground underline-offset-4 hover:underline focus-visible:outline-accent aria-[current=page]:border-accent";

export function HomeLink() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <Link
      aria-current={onHome ? "page" : undefined}
      className={menuLinkClassName}
      href="/"
      scroll={false}
    >
      Home
    </Link>
  );
}
