import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered once. Only loaded through dynamic import() from the motion layer,
// so GSAP never lands in the first-load bundle.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/** The design system's one curve: --ease-out, cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE = CustomEase.create("build", "0.22,1,0.36,1");

export { gsap, ScrollTrigger, SplitText };
