import { z } from "zod";

// Every content file parses its data at import time, so a missing or
// malformed field fails the build instead of shipping.

export const imageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const tagSchema = z.enum(["ai", "fullstack", "frontend", "winner"]);

export const awardSchema = z.object({
  title: z.string().min(1),
  event: z.string().min(1),
  year: z.number().int(),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  aka: z.string().optional(),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  awards: z.array(awardSchema).default([]),
  /** Context that is not an award, e.g. the hackathon it was built for. */
  context: z.string().optional(),
  /** Empty means the stack is still to be confirmed. */
  stack: z.array(z.string().min(1)),
  tags: z.array(tagSchema).min(1),
  featured: z.boolean(),
  order: z.number().int(),
  team: z.boolean(),
  repo: z.url().optional(),
  live: z.url().optional(),
  cover: imageSchema.optional(),
  screenshots: z.array(imageSchema).default([]),
  /** Photos from the event the project was built or recognised at. */
  photos: z.array(imageSchema).default([]),
  /** Juno's role; shown as a TODO until filled in. */
  role: z.string().optional(),
  year: z.number().int().optional(),
});

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  /** Personal brand shown as the hero title. */
  brand: z.string().min(1),
  role: z.string().min(1),
  pitch: z.string().min(1),
  /** The hero's longer introduction. */
  intro: z.string().min(1),
  /** Core stack shown under the hero introduction. */
  coreStack: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  email: z.email(),
  links: z.object({ github: linkSchema, linkedin: linkSchema }),
  about: z.array(z.string().min(1)).min(1),
  education: z.object({
    school: z.string().min(1),
    location: z.string().min(1),
    degree: z.string().min(1),
    years: z.string().min(1),
    capstone: z.string().min(1),
  }),
  honors: z.array(z.object({ title: z.string(), terms: z.string() })),
  languages: z.array(z.string().min(1)).min(1),
  seeking: z.string().min(1),
});

export const hackathonSchema = z.object({
  event: z.string().min(1),
  year: z.number().int(),
  /** Only set when the source gives a date. */
  date: z.string().optional(),
  location: z.string().optional(),
  result: z.string().min(1),
  /** Short form for the award strip, e.g. "Top 3". */
  rank: z
    .object({ prefix: z.string(), value: z.number().int().positive() })
    .optional(),
  project: z.string().optional(),
  highlight: z.boolean().default(false),
  photo: imageSchema.optional(),
});

export const skillGroupSchema = z.object({
  name: z.enum(["Frontend", "Backend", "Databases", "AI & Cloud"]),
  items: z.array(z.string().min(1)).min(1),
});

export const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  year: z.number().int().optional(),
  url: z.url().optional(),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  org: z.string().min(1),
  duration: z.string().min(1),
  points: z.array(z.string().min(1)).min(1),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectTag = z.infer<typeof tagSchema>;
export type ProjectImage = z.infer<typeof imageSchema>;
export type Hackathon = z.infer<typeof hackathonSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
