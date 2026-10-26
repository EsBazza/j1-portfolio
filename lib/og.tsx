import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const ogSize = { width: 1200, height: 630 };

/** Shared "build log" Open Graph card: caption, title, subtitle. */
export function ogCard({
  caption,
  title,
  subtitle,
}: {
  caption: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0d0d0b",
        color: "#edebe4",
        backgroundImage:
          "linear-gradient(to right, rgba(237,235,228,0.06) 1px, transparent 1px)",
        backgroundSize: "100px 100%",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#f2a93b",
        }}
      >
        {caption}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 24 ? 76 : 104,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#a3a097" }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#8a877e",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <span>{profile.shortName}</span>
        <span>{profile.role}</span>
      </div>
    </div>,
    ogSize,
  );
}
