<script setup lang="ts">
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { durations, eases, exitCurve, prefersReducedMotion } from "@/lib/motion";
import PageLoader from "./components/PageLoader.vue";
import Cursor from "./components/Cursor.vue";
import type { LenisOptions } from "lenis";

// lenis is driven by gsap's ticker so ScrollTrigger and smooth scroll share a frame
const lenisOptions: LenisOptions = { autoRaf: false };
const lenis = useLenis();

const { finishLoader, isLoading } = useLoader();
const pageReady = usePageReady();
const transitioning = usePageTransitioning();
const shadeRef = ref<HTMLElement | null>(null);

const DURATION = durations.page;
// how far into the transition the new page starts its intro
const READY_AT = 0.75;

function update(time: number) {
  lenis.value?.raf(time * 1000);
}

onMounted(() => {
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);
});

onBeforeUnmount(() => gsap.ticker.remove(update));

watch(lenis, (instance) => instance?.on("scroll", ScrollTrigger.update));

useHead({
  htmlAttrs: { lang: "en" },
  titleTemplate: (title) => (title ? `${title} — kehinde` : "kehinde — software engineer"),
  link: [
    { rel: "preload", href: "/fonts/anton-regular.woff2", as: "font", type: "font/woff2", crossorigin: "" },
    { rel: "preload", href: "/fonts/lato-regular.woff2", as: "font", type: "font/woff2", crossorigin: "" },
  ],
});

useSeoMeta({
  description:
    "kehinde, a software engineer in lagos crafting web applications and sites for individuals, studios and companies.",
  ogType: "website",
  ogSiteName: "kehinde",
  twitterCard: "summary_large_image",
});

// without a loader on screen, the first page can run its intro right away
if (!isLoading.value) pageReady.value = true;

const router = useRouter();

router.beforeEach((to, from) => {
  if (to.path === from.path) return;
  // don't stack transitions or navigate under the loader
  if (transitioning.value || isLoading.value) return false;
});

const onLeave = (el: Element, done: () => void) => {
  const page = el as HTMLElement;
  const scrollY = window.scrollY;

  transitioning.value = true;
  pageReady.value = false;
  lenis.value?.stop();

  // pin the old page at its current scroll position and cut it off at the
  // bottom of the viewport, so its bottom edge is on screen and can curve
  gsap.set(page, {
    position: "fixed",
    top: -scrollY,
    left: 0,
    width: "100%",
    height: scrollY + window.innerHeight,
    minHeight: 0, // pages set min-height: 100svh+, which would beat height
    overflow: "hidden",
    zIndex: 5, // above the shade (4), below the header (10)
  });

  // the new page renders underneath from the top
  window.scrollTo(0, 0);
  lenis.value?.scrollTo(0, { immediate: true, force: true });

  if (prefersReducedMotion()) {
    gsap.to(page, { autoAlpha: 0, duration: 0.4, onComplete: done });
    return;
  }

  gsap
    .timeline({ onComplete: done })
    .to(
      page,
      { y: -window.innerHeight, duration: DURATION, ease: eases.inOut },
      0,
    )
    .fromTo(
      page,
      {
        borderBottomLeftRadius: "50% 0vh",
        borderBottomRightRadius: "50% 0vh",
      },
      {
        borderBottomLeftRadius: `50% ${exitCurve}`,
        borderBottomRightRadius: `50% ${exitCurve}`,
        duration: DURATION * 0.6,
        ease: "power2.in",
      },
      0,
    )
    .fromTo(
      shadeRef.value,
      { autoAlpha: 0.7 },
      { autoAlpha: 0, duration: DURATION, ease: eases.inOut },
      0,
    );
};

const onEnter = (el: Element, done: () => void) => {
  const finish = () => {
    lenis.value?.start();
    ScrollTrigger.refresh();
    transitioning.value = false;
    done();
  };

  if (prefersReducedMotion()) {
    pageReady.value = true;
    gsap.from(el, { autoAlpha: 0, duration: 0.4, onComplete: finish });
    return;
  }

  gsap
    .timeline({ onComplete: finish })
    .fromTo(
      el,
      { y: "25vh" },
      { y: 0, duration: DURATION, ease: eases.inOut, clearProps: "transform" },
      0,
    )
    .call(() => (pageReady.value = true), [], DURATION * READY_AT);
};

function onLoaderReveal() {
  pageReady.value = true;
}
</script>

<template>
  <PageLoader
    v-if="isLoading"
    @reveal="onLoaderReveal"
    @complete="finishLoader"
  />

  <VueLenis root :options="lenisOptions" />

  <NuxtLayout>
    <NuxtPage
      :transition="{
        name: 'page',
        css: false,
        onLeave,
        onEnter,
      }"
    />
  </NuxtLayout>

  <Cursor />

  <!-- darkens the incoming page while the old one lifts off it -->
  <div ref="shadeRef" class="page__shade" />
</template>

<style>
.page__shade {
  position: fixed;
  inset: 0;
  z-index: 4;
  background: #000;
  pointer-events: none;
  visibility: hidden;
}
</style>
