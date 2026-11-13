import { imageSchema } from "./schema";

// Event photos from Juno. Reused by the hackathon log and the case studies.
export const photos = {
  // Juno's formal portrait, from his resume, with the white studio
  // background cut out so it sits on the page's own surface color.
  portrait: imageSchema.parse({
    src: "/profile/juno-portrait.webp",
    alt: "Portrait of Juno Alonzo in a dark suit and tie",
    width: 483,
    height: 452,
  }),
  // UACAP capstone defense, 10 November 2026: photo from Juno, 2026-11-13.
  uacapDefense: imageSchema.parse({
    src: "/events/uacap-capstone-defense.webp",
    alt: "Students and faculty standing together after the UACAP capstone defense, beside a screen showing the paper title: UACAP, an integrated health information management system with PhilHealth YAKAP integration for university healthcare services",
    width: 1280,
    height: 960,
  }),
  raiteHackathon: imageSchema.parse({
    src: "/events/raite-2026-hackathon.webp",
    alt: "The Proctor.AI team at RAITE 2026 with the hackathon champion trophy and the Best User Experience and Best Technical Implementation certificates",
    width: 1280,
    height: 720,
  }),
  canYouHackIt: imageSchema.parse({
    src: "/events/can-you-hackit-3rd-place.webp",
    alt: "Team UA-HOW 2 on stage in Clark after placing 3rd at Can You HackIT? The IBPAP Challenge, holding the University of the Assumption College of Information Technology flag",
    width: 1280,
    height: 960,
  }),
  raiteRegistration: imageSchema.parse({
    src: "/events/raite-2026-registration-portal.webp",
    alt: "University of the Assumption student developers recognised on stage at RAITE 2026, Pampanga State University, for building the registration portal",
    width: 480,
    height: 640,
  }),
  // RAITE 2026 hackathon: from Juno's LinkedIn post of 2026-10-03.
  raiteChampionStage: imageSchema.parse({
    src: "/events/raite-2026-champion-stage.webp",
    alt: "The University of the Assumption team on stage at Pampanga State University as the screen names them Hackathon Programming champion",
    width: 480,
    height: 640,
  }),
  raiteTrophy: imageSchema.parse({
    src: "/events/raite-2026-trophy.webp",
    alt: "The 2026 Hackathon Programming champion trophy with the champion plaque and the Best Technical Implementation and Best User Experience certificates",
    width: 800,
    height: 450,
  }),
  raiteWork: imageSchema.parse({
    src: "/events/raite-2026-hackathon-work.webp",
    alt: "Team members talking through the build at a table during the hackathon, Proctor.AI open on a laptop",
    width: 800,
    height: 450,
  }),
  raiteTeamWork: imageSchema.parse({
    src: "/events/raite-2026-hackathon-team-work.webp",
    alt: "The team coding side by side on laptops during the hackathon",
    width: 800,
    height: 450,
  }),
  // EDUtech Asia 2026, Singapore: from Juno's LinkedIn post of 2026-11-08.
  edutechCeremony: imageSchema.parse({
    src: "/events/edutech-asia-2026-award-ceremony.webp",
    alt: "The HeriTech team at the EDUtech Asia Planet Protectors award ceremony in Singapore, holding the University of the Assumption flag and the 1st Runner-Up trophy",
    width: 800,
    height: 600,
  }),
  edutechStage: imageSchema.parse({
    src: "/events/edutech-asia-2026-stage.webp",
    alt: "On stage at the award ceremony with the event hosts, the University of the Assumption flag held in front",
    width: 800,
    height: 600,
  }),
  edutechTrophy: imageSchema.parse({
    src: "/events/edutech-asia-2026-trophy.webp",
    alt: "The team and their faculty mentor in the audience, showing their medals and the Planet Protectors 1st Runner-Up trophy",
    width: 800,
    height: 600,
  }),
  edutechBooth: imageSchema.parse({
    src: "/events/edutech-asia-2026-booth.webp",
    alt: "The team at the HeriTech booth at Sands Expo, with the HeriTech poster and the app running on two laptops",
    width: 800,
    height: 600,
  }),
  edutechBoothMentor: imageSchema.parse({
    src: "/events/edutech-asia-2026-booth-mentor.webp",
    alt: "A selfie at booth PP18 with the faculty mentor, the HeriTech poster and the app's How HeriTech works page on screen",
    width: 800,
    height: 600,
  }),
  edutechSpeakers: imageSchema.parse({
    src: "/events/edutech-asia-2026-speakers.webp",
    alt: "The team giving a thumbs up with two EDUtech Asia speakers on the exhibition floor",
    width: 960,
    height: 1280,
  }),
  edutechSign: imageSchema.parse({
    src: "/events/edutech-asia-2026-sign.webp",
    alt: "The team and their mentor behind the giant EDUtech Asia 2026 letters, holding the HeriTech poster and the trophy",
    width: 800,
    height: 600,
  }),
  edutechMarinaBay: imageSchema.parse({
    src: "/events/edutech-asia-2026-marina-bay.webp",
    alt: "The team at dusk by the Singapore waterfront with Marina Bay Sands behind them, holding their medals, the trophy and the University of the Assumption flag",
    width: 960,
    height: 1280,
  }),
};
