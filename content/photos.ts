import { imageSchema } from "./schema";

// Event photos from Juno. Reused by the hackathon log and the case studies.
export const photos = {
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
};
