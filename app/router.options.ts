import type { RouterConfig } from "@nuxt/schema";
import { START_LOCATION } from "vue-router";

// Nuxt's default waits for the page transition to finish before scrolling,
// which jumps the new page at the end. The old page is pinned in place while
// it animates out, so the new page can be scrolled as soon as it renders.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // first load: the page is already rendered
    if (from === START_LOCATION) {
      return savedPosition ?? (to.hash ? { el: to.hash } : { left: 0, top: 0 });
    }

    if (to.path === from.path) {
      if (to.hash) return { el: to.hash, behavior: "smooth" };
      return false;
    }

    const nuxtApp = useNuxtApp();

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce("page:finish", () => {
        requestAnimationFrame(() => {
          if (savedPosition) resolve(savedPosition);
          else if (to.hash) resolve({ el: to.hash });
          else resolve({ left: 0, top: 0 });
        });
      });
    });
  },
};
