import { z } from "zod";
import { experienceSchema } from "./schema";

// Source: the resume.
export const experience = z.array(experienceSchema).parse([
  {
    role: "Student Assistant",
    org: "OMISS, University of the Assumption",
    duration: "3 months",
    points: [
      "Helped students connect to the campus Wi-Fi mesh network and troubleshot computer and printer issues",
      "Assisted office employees with everyday technical tasks",
    ],
  },
]);
