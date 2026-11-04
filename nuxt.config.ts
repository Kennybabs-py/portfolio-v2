// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.scss"],
  modules: ["@nuxt/image"],

  // project images go in public/projects/, served as modern formats at the
  // sizes each <NuxtImg> asks for
  image: {
    format: ["avif", "webp"],
    quality: 80,
  },

  // the site is one page now; old links land on the matching section
  routeRules: {
    "/info": { redirect: "/#about" },
    "/projects": { redirect: "/#work" },
    "/projects/**": { redirect: "/#work" },
  },
});
