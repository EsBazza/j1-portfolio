import { profile } from "@/content/profile";
import { projects, tagLabels } from "@/content/projects";
import { resumePdfs, sections } from "@/lib/site";

export type PaletteAction =
  | { type: "go"; href: string }
  | { type: "open"; href: string }
  | { type: "download"; href: string }
  | { type: "copy"; text: string; done: string }
  | { type: "theme" }
  | { type: "pet"; command: "toggle" | "switch" | "treat" };

export type PaletteItem = {
  id: string;
  group: "Projects" | "Go to" | "Actions";
  label: string;
  hint?: string;
  /** Extra words the search matches on (stack, tags, other names). */
  keywords?: string;
  action: PaletteAction;
};

/** Everything the command palette can do, built from the site's content. */
export function paletteItems(): PaletteItem[] {
  const projectItems = [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p): PaletteItem => ({
      id: `project-${p.slug}`,
      group: "Projects",
      label: p.title,
      hint: p.awards[0]?.title ?? p.tagline,
      keywords: [p.aka, ...p.stack, ...p.tags.map((t) => tagLabels[t])]
        .filter(Boolean)
        .join(" "),
      action: { type: "go", href: `/projects/${p.slug}` },
    }));

  const pages: PaletteItem[] = [
    {
      id: "go-home",
      group: "Go to",
      label: "Home",
      action: { type: "go", href: "/" },
    },
    ...sections.map((s): PaletteItem => ({
      id: `go-${s.id}`,
      group: "Go to",
      label: s.label,
      hint: "Home page section",
      action: { type: "go", href: `/#${s.id}` },
    })),
    {
      id: "go-all-projects",
      group: "Go to",
      label: "All projects",
      hint: `${projects.length} projects`,
      action: { type: "go", href: "/projects" },
    },
    {
      id: "go-resume",
      group: "Go to",
      label: "Resume",
      hint: "Web version",
      keywords: "cv",
      action: { type: "go", href: "/resume" },
    },
  ];

  const actions: PaletteItem[] = [
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      hint: profile.email,
      keywords: "contact mail",
      action: { type: "copy", text: profile.email, done: "Email copied" },
    },
    ...resumePdfs.map((pdf): PaletteItem => ({
      id: `download-${pdf.file}`,
      group: "Actions",
      label: `Download resume (${pdf.label})`,
      keywords: "cv pdf",
      action: { type: "download", href: `/resume/${pdf.file}` },
    })),
    {
      id: "open-github",
      group: "Actions",
      label: "Open GitHub",
      hint: profile.links.github.href.replace("https://", ""),
      keywords: "code repos",
      action: { type: "open", href: profile.links.github.href },
    },
    {
      id: "open-linkedin",
      group: "Actions",
      label: "Open LinkedIn",
      keywords: "profile",
      action: { type: "open", href: profile.links.linkedin.href },
    },
    {
      id: "theme",
      group: "Actions",
      label: "Switch light / dark theme",
      keywords: "mode color",
      action: { type: "theme" },
    },
    {
      id: "pet-wake",
      group: "Actions",
      label: "Wake the pet / put it to bed",
      hint: "D",
      keywords: "dog cat byte pixel puppy kitten easter egg",
      action: { type: "pet", command: "toggle" },
    },
    {
      id: "pet-switch",
      group: "Actions",
      label: "Switch pet",
      keywords: "dog cat byte pixel",
      action: { type: "pet", command: "switch" },
    },
    {
      id: "pet-treat",
      group: "Actions",
      label: "Give the pet a treat",
      keywords: "dog cat snack food",
      action: { type: "pet", command: "treat" },
    },
  ];

  return [...projectItems, ...pages, ...actions];
}
