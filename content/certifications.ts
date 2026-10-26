import { z } from "zod";
import { certificationSchema } from "./schema";

// Source: the resumes (the Modern one groups IT Specialist under Certiport).
// Add `url` to each one once its credential link is known.
export const certifications = z.array(certificationSchema).parse([
  {
    title: "AI Fundamentals: Foundations for Understanding AI",
    issuer: "Cisco",
    year: 2026,
  },
  { title: "Hardware and Upgrade Support", issuer: "Cisco", year: 2026 },
  { title: "IT Customer Support Basics", issuer: "Cisco", year: 2026 },
  { title: "CCNA: Introduction to Networks", issuer: "Cisco" },
  { title: "AWS Academy Graduate – Cloud Foundations", issuer: "AWS Academy" },
  { title: "IT Specialist – Cybersecurity", issuer: "Certiport" },
  { title: "IT Specialist – Databases", issuer: "Certiport" },
]);
