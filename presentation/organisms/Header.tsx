import Image from "next/image";

import { SkipLink } from "../atoms/SkipLink";
import { HomeLink, menuLinkClassName } from "../atoms/HomeLink";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-brand text-brand-foreground">
      <SkipLink />
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Image
          alt="ESL FACEIT Group"
          className="h-14 w-14"
          fetchPriority="high"
          height={56}
          loading="eager"
          preload
          sizes="56px"
          src="/esl-faceit-group.png"
          width={56}
        />
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <HomeLink />
            </li>
            <li>
              <a className={menuLinkClassName} href="https://miasalazar.netlify.app/">
                Portfolio
                <span className="sr-only"> (external site)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
