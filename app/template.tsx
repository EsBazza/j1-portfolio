import type { ReactNode } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PageMotion />
    </>
  );
}
