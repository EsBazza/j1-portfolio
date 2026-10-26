import { profile } from "@/content/profile";
import { ogCard, ogSize } from "@/lib/og";

export const alt = `${profile.name}, ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    caption: "Build log · Portfolio",
    title: profile.name,
    subtitle: "RAITE 2026 Hackathon winner · Next.js · TypeScript · Gemini",
  });
}
