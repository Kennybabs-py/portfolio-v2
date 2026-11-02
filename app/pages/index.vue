<script lang="ts" setup>
import { gsap, SplitText } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/data/site";
import ProjectList from "~/components/ProjectList.vue";
import SiteFooter from "~/components/SiteFooter.vue";

const containerRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

// letters stretch up towards the pointer, falling off with distance
const STRETCH_RADIUS = 260;
const STRETCH_SCALE = 0.22;
const STRETCH_LIFT = 6;

function stretchHeadline() {
  const hero = heroRef.value!;
  const split = SplitText.create(".hero--headline .line", {
    type: "words, chars",
  });

  const letters = split.chars.map((char) => ({
    el: char,
    scaleTo: gsap.quickTo(char, "scaleY", { duration: 0.6, ease: "power3" }),
    yTo: gsap.quickTo(char, "y", { duration: 0.6, ease: "power3" }),
    x: 0,
    y: 0,
  }));

  gsap.set(split.chars, { transformOrigin: "50% 100%" });

  function measure() {
    for (const letter of letters) {
      const rect = letter.el.getBoundingClientRect();
      letter.x = rect.left + rect.width / 2;
      letter.y = rect.top + rect.height / 2;
    }
  }

  function onMove(event: PointerEvent) {
    for (const letter of letters) {
      const distance = Math.hypot(event.clientX - letter.x, event.clientY - letter.y);
      const pull = Math.max(0, 1 - distance / STRETCH_RADIUS) ** 2;
      letter.scaleTo(1 + pull * STRETCH_SCALE);
      letter.yTo(-pull * STRETCH_LIFT);
    }
  }

  function onLeave() {
    for (const letter of letters) {
      letter.scaleTo(1);
      letter.yTo(0);
    }
  }

  measure();
  window.addEventListener("resize", measure);
  // positions shift as the hero scrolls, re-measure on enter
  hero.addEventListener("pointerenter", measure);
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerleave", onLeave);

  return () => {
    window.removeEventListener("resize", measure);
    hero.removeEventListener("pointerenter", measure);
    hero.removeEventListener("pointermove", onMove);
    hero.removeEventListener("pointerleave", onLeave);
    split.revert();
  };
}

usePageEnter(() => {
  const interactive =
    !prefersReducedMotion() &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let cleanup: (() => void) | undefined;

  gsap
    .timeline({
      onComplete: () => {
        if (interactive) cleanup = stretchHeadline();
      },
    })
    // unsplit after the reveal, the stretch effect needs unmasked letters
    .add(revealText(".hero--headline .line", "chars", {}, { revert: true }), 0)
    .add(revealText(".hero--greeting", "words"), 0.2)
    .add(revealText(".hero--motto", "words"), 0.35)
    .add(revealText(".hero--intro", "lines"), 0.5)
    .from(".hero--scroll", { autoAlpha: 0, duration: 1 }, 0.9);

  scrollReveals(containerRef.value);

  if (!prefersReducedMotion()) {
    // the headline drifts and fades as the hero scrolls away
    gsap.to(".hero--headline", {
      yPercent: 30,
      autoAlpha: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero__wrapper",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  return () => cleanup?.();
}, containerRef);
</script>

<template>
  <section class="home__wrapper" ref="containerRef">
    <div ref="heroRef" class="hero__wrapper">
      <div class="hero__top">
        <p class="hero--greeting" data-reveal>{{ site.hero.greeting }}</p>
        <p class="hero--motto" data-reveal>{{ site.hero.motto }}</p>
      </div>

      <h1 class="hero--headline">
        <span
          v-for="line in site.hero.headline"
          :key="line"
          class="line"
          data-reveal
        >
          {{ line }}
        </span>
      </h1>

      <div class="hero__bottom">
        <p class="hero--intro" data-reveal>
          <template v-for="segment in site.hero.intro" :key="segment.text">
            <NuxtLink v-if="segment.to" :to="segment.to">{{ segment.text }}</NuxtLink>
            <template v-else>{{ segment.text }}</template>
          </template>
        </p>

        <span class="hero--scroll" aria-hidden="true">
          scroll <span class="hero--scroll__line" />
        </span>
      </div>
    </div>

    <p class="closing--text" data-scroll-reveal>{{ site.hero.closing }}</p>

    <div class="work__wrapper">
      <div class="work__header">
        <h2 data-scroll-reveal="words">selected work</h2>
        <NuxtLink to="/projects" data-cursor="all work">see all</NuxtLink>
      </div>

      <ProjectList />
    </div>

    <SiteFooter />
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

section.home__wrapper {
  position: relative;
  width: 100%;
  min-height: 100svh;
  background-color: var(--color-ink);
  color: var(--color-paper);

  .hero__wrapper {
    position: relative;
    width: 100%;
    height: 100svh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    padding: calc(var(--header-height) + 1rem) var(--gutter) var(--gutter);
  }

  .hero__top {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  // the site's one use of the script face
  .hero--greeting {
    font-family: var(--font-script);
    font-size: var(--step-3);
    line-height: 1;
  }

  .hero--motto {
    font-size: var(--step--1);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-muted);
  }

  .hero--headline {
    display: flex;
    flex-direction: column;
    font-family: var(--font-display);
    text-transform: uppercase;
    // sized so the longest line spans the width, capped by height on wide screens
    font-size: clamp(3.5rem, 17.2vw, 36svh);
    line-height: 0.9;
    letter-spacing: -0.01em;

    .line {
      display: block;
      white-space: nowrap;
    }
  }

  .hero__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
  }

  .hero--intro {
    max-width: 44ch;
    font-size: var(--step-0);
    line-height: 1.6;

    & a {
      @extend %link;
      color: inherit;
    }
  }

  .hero--scroll {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--step--1);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    flex-shrink: 0;

    .hero--scroll__line {
      width: 1px;
      height: 3rem;
      background: currentColor;
      animation: scroll-cue 2s $ease-in-out infinite;
    }
  }

  .closing--text {
    max-width: 22ch;
    padding: clamp(6rem, 18vh, 12rem) var(--gutter) 0;
    font-size: var(--step-4);
    line-height: 1.05;
  }

  .work__wrapper {
    padding: clamp(6rem, 15vh, 10rem) var(--gutter) 0;
  }

  .work__header {
    @include flex(baseline, space-between, row);
    padding-bottom: 1.5rem;

    h2 {
      font-size: var(--step--1);
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    a {
      @extend %link;
      color: inherit;
      font-size: var(--step--1);
    }
  }

  @include mediaMax("sm-tablet") {
    .hero--scroll {
      display: none;
    }
  }
}

// the line draws down, then retracts downwards
@keyframes scroll-cue {
  0% {
    transform: scaleY(0);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
  50.1% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}
</style>
