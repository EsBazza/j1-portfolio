"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { scrollToTop } from "@/components/motion/MotionLayer";

/**
 * A link home that, on the home page itself, scrolls back to the top instead
 * of doing nothing. Without JavaScript it is a plain link to "/".
 */
export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href="/"
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented || pathname !== "/") return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        scrollToTop();
      }}
    />
  );
}
