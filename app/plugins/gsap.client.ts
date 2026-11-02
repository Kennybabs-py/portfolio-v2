import { gsap, SplitText, ScrollTrigger, CustomEase } from "@/lib/gsap";
import { easeCurves } from "@/lib/motion";

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);

  for (const [name, curve] of Object.entries(easeCurves)) {
    CustomEase.create(name, curve);
  }
});
