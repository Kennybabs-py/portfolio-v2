// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.scss"],
  modules: ["lenis/nuxt", "@nuxt/image"],

  // project images go in public/projects/, served as modern formats at the
  // sizes each <NuxtImg> asks for
  image: {
    format: ["avif", "webp"],
    quality: 80,
  },

  vite: {
    optimizeDeps: {
      include: ["gsap", "gsap/CustomEase", "gsap/ScrollTrigger", "gsap/SplitText"],
    },
  },
});
