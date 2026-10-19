"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export function RestoreFeedScroll() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const scrollY = useSelector((state: RootState) => state.posts.scrollY);

  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;

    if (pathname !== "/" || !previous.startsWith("/posts/") || scrollY <= 0) {
      return;
    }

    // Coming back from a post. Scroll again next frame, once the feed has its height.
    const restore = () => window.scrollTo(0, scrollY);
    restore();
    const frame = requestAnimationFrame(restore);

    return () => cancelAnimationFrame(frame);
  }, [pathname, scrollY]);

  return null;
}
