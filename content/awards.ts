import { z } from "zod";
import { photos } from "./photos";
import { hackathonSchema } from "./schema";

// Sources: the build plan, the resume, project READMEs, and Juno (RAITE 2024:
// joined, no award; RAITE 2025: did not join; RAITE 2026: he won the
// hackathon, while "Overall Champion" was the university's title, not his). Only the EduTech Asia date
// comes from a source; the order within 2026 needs Juno's confirmation.
export const hackathons = z.array(hackathonSchema).parse([
  {
    event: "RAITE 2024",
    year: 2024,
    result: "Participant",
  },
  {
    event: "IBM Bob Hackathon",
    year: 2026,
    result: "Built PixelForge AI",
    project: "pixelforge-ai",
  },
  {
    event: "RAITE 2026",
    year: 2026,
    date: "4 September 2026",
    location: "Pampanga State University Gymnasium, Bacolor",
    result:
      "Hackathon winner · Best Technical Implementation · Best User Experience",
    rank: { prefix: "#", value: 1 },
    project: "proctor-ai",
    highlight: true,
    photo: photos.raiteHackathon,
  },
  {
    event: "Philippine Startup Challenge XI",
    year: 2026,
    location: "Central Luzon regional round",
    result: "Top 20",
    rank: { prefix: "Top ", value: 20 },
    project: "proctor-ai",
  },
  {
    event: "Can You HackIT: The IBPAP Challenge",
    year: 2026,
    location: "Clark",
    result: "Top 3",
    rank: { prefix: "Top ", value: 3 },
    project: "mapatunai",
    photo: photos.canYouHackIt,
  },
  {
    event: "EduTech Asia 2026 · Planet Protectors Challenge",
    year: 2026,
    date: "4–5 November 2026",
    location: "Singapore",
    result: "Top 8 Finalist",
    rank: { prefix: "Top ", value: 8 },
    project: "heritech",
  },
]);

/** The four results on the home page award strip, in plan order. */
export const awardStrip = [
  { label: "Hackathon winner", event: "RAITE 2026", rank: "#", value: 1 },
  {
    label: "Finalist, Singapore",
    event: "EduTech Asia 2026",
    rank: "Top ",
    value: 8,
  },
  {
    label: "Can You HackIT",
    event: "IBPAP Challenge",
    rank: "Top ",
    value: 3,
  },
  {
    label: "Regional round",
    event: "Philippine Startup Challenge XI",
    rank: "Top ",
    value: 20,
  },
] as const;
