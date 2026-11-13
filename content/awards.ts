import { z } from "zod";
import { photos } from "./photos";
import { announcementSchema, hackathonSchema } from "./schema";

// Sources: the build plan, the resume, project READMEs, and Juno (RAITE 2024:
// joined, no award; RAITE 2025: did not join; RAITE 2026: he won the
// hackathon, while "Overall Champion" was the university's title, not his;
// EDUtech Asia 2026: HeriTech was 1st Runner-Up in the Planet Protectors
// Challenge, top 2 of 285 teams, per Juno's LinkedIn post of 2026-11-08). Only the
// EDUtech Asia date comes from a source; the order within 2026 needs Juno's
// confirmation. RAITE 2026 was delayed and held on 1 October 2026 (Juno,
// 2026-11-13); the trophy and certificates still print 11 September.
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
    date: "1 October 2026",
    location: "Pampanga State University Gymnasium, Bacolor",
    result:
      "Hackathon winner · Best Technical Implementation · Best User Experience",
    rank: { prefix: "#", value: 1 },
    project: "proctor-ai",
    highlight: true,
    photo: photos.raiteHackathon,
    source: {
      label: "Announcement on LinkedIn",
      href: "https://www.linkedin.com/posts/amaro-juno-alonzo-b7b867330_hard-work-pays-off-representing-the-university-ugcPost-7512004939133501440-4dha/",
    },
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
    source: {
      label: "Announcement on LinkedIn",
      href: "https://www.linkedin.com/posts/amaro-juno-alonzo-b7b867330_canyouhackit2026-ibpap-mapatunai-share-7514331064052477952-ANcm/",
    },
  },
  {
    event: "EDUtech Asia 2026 · Planet Protectors Challenge",
    year: 2026,
    date: "4–5 November 2026",
    location: "Sands Expo & Convention Centre, Singapore",
    result: "1st Runner-Up · top 2 of 285 teams from across Asia",
    rank: { prefix: "#", value: 2, of: 285 },
    project: "heritech",
    highlight: true,
    photo: photos.edutechCeremony,
    source: {
      label: "Announcement on LinkedIn",
      href: "https://www.linkedin.com/posts/amaro-juno-alonzo-b7b867330_edutechasia2026-heritechapp-googleforeducation-ugcPost-7525055836554125312-tFeh/",
    },
  },
]);

/** The hero's "New" line: the latest result, linking to its project. */
export const announcement = announcementSchema.parse({
  label: "New",
  text: "1st Runner-Up at EDUtech Asia 2026, Singapore",
  href: "/projects/heritech",
});

type AwardStripItem = {
  label: string;
  event: string;
  rank: string;
  value: number;
  /** Field size, shown as "of 285 teams". */
  of?: number;
};

/** The four results on the home page award strip. Juno's only international
 *  result leads (his choice, 2026-11-09); the rest follow plan order. */
export const awardStrip: readonly AwardStripItem[] = [
  {
    label: "1st Runner-Up of 285 teams",
    event: "EDUtech Asia · Singapore",
    rank: "#",
    value: 2,
    of: 285,
  },
  { label: "Hackathon winner", event: "RAITE 2026", rank: "#", value: 1 },
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
];
