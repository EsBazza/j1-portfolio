import { z } from "zod";
import { skillGroupSchema } from "./schema";

// Source: the resume's Technical Skills section, regrouped into the plan's
// four groups. No proficiency levels.
export const skills = z.array(skillGroupSchema).parse([
  {
    name: "Frontend",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
    ],
  },
  {
    name: "Backend",
    items: ["Node.js", "Prisma ORM", "Spring Boot", "Python", "Java"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "MySQL", "Supabase", "Firebase"],
  },
  {
    name: "AI & Cloud",
    items: [
      "Gemini API",
      "AI-assisted development (Claude, Gemini)",
      "AWS",
      "Google Cloud",
      "Vercel",
      "Git",
    ],
  },
]);
