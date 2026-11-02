import { gsap, SplitText, ScrollTrigger, CustomEase } from "@/lib/gsap";

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);

  // shared eases, mirrored in assets/css/_eases.scss
  CustomEase.create("expo-in-out", "0.87, 0, 0.13, 1");
  CustomEase.create("quart-in-out", "0.77, 0, 0.175, 1");
  CustomEase.create("expo-out", "0.19, 1, 0.22, 1");
});
