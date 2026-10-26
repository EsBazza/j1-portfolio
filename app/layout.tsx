import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import { THEME_COLORS, themeScript } from "@/lib/theme";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amaro Alonzo — Full-Stack & AI Developer",
  description:
    "Portfolio of Amaro Juno D. Alonzo, a full-stack and AI developer building with Next.js, TypeScript, PostgreSQL and the Gemini API.",
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.dark,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
