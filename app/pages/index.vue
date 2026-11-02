<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { prefersReducedMotion } from "@/lib/motion";
import ProjectList from "~/components/ProjectList.vue";
import SiteFooter from "~/components/SiteFooter.vue";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  gsap
    .timeline()
    .add(revealText(".role--text h1", "chars"), 0)
    .add(revealText(".hi--text", "words"), 0.2)
    .add(revealText(".build--text", "words"), 0.4)
    .add(revealText(".intro--text", "lines"), 0.5)
    .add(revealText(".the--subtle--text", "words"), 0.7);

  scrollReveals(containerRef.value);

  if (prefersReducedMotion()) return;

  // the role line drifts and fades as the hero scrolls away
  gsap.to(".role--text", {
    yPercent: 40,
    autoAlpha: 0.2,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero__wrapper",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}, containerRef);
</script>

<template>
  <section class="home__wrapper" ref="containerRef">
    <div class="hero__wrapper">
      <p class="hi--text" data-reveal>hi, i'm kehinde.</p>

      <h3 class="build--text" data-reveal>build, iterate, build, repeat</h3>

      <div class="role--text">
        <h1 data-reveal>a software engineer</h1>
      </div>

      <p class="intro--text" data-reveal>
        who resides in lagos, ng. i use
        <NuxtLink to="/info#tools">tools</NuxtLink> to craft web applications
        and sites for individuals, studios, and companies. i enjoy playing
        snooker, fifa and taking long walks in order to meet my luck.
      </p>

      <h2 class="the--subtle--text" data-reveal>
        the subtle art of balancing thoughts and function
      </h2>
    </div>

    <div class="work__wrapper">
      <div class="work__header">
        <h2 data-scroll-reveal="chars">selected work</h2>
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
    padding: calc(var(--header-height) + 1rem) var(--gutter) var(--gutter);

    .hi--text {
      font-family: var(--font-script);
      font-size: var(--step-3);
      line-height: 1;
    }

    .role--text {
      @include flex(center, center, row);
      width: 100%;
      position: absolute;
      inset: 0;
      padding-inline: var(--gutter);
      pointer-events: none;

      & > h1 {
        text-transform: uppercase;
        text-align: center;
        // wraps to two lines on phones instead of shrinking
        font-size: clamp(3.25rem, 10vw, 20vmin);
        font-family: var(--font-display);
        line-height: 0.95;
      }
    }

    .intro--text {
      position: absolute;
      bottom: 14%;
      width: min(calc(100% - 2 * var(--gutter)), 700px);
      left: 50%;
      translate: -50% 0;
      text-align: center;
      text-transform: uppercase;
      font-size: var(--step--1);
      line-height: 1.8;

      & a {
        @extend %link;
        color: inherit;
      }
    }

    .the--subtle--text {
      position: absolute;
      bottom: var(--gutter);
      inset-inline: var(--gutter);
      font-weight: 400;
      font-size: var(--step-3);
      font-family: var(--font-script);
      line-height: 1.1;
    }

    .build--text {
      position: absolute;
      right: var(--gutter);
      top: calc(var(--header-height) + 1rem);
      font-size: var(--step--1);
      text-transform: uppercase;
      letter-spacing: 0.08em;

      @include mediaMax("sm-tablet") {
        position: static;
        margin-top: 0.75rem;
      }
    }
  }

  .work__wrapper {
    padding: clamp(6rem, 15vh, 10rem) var(--gutter) 0;
  }

  .work__header {
    @include flex(baseline, space-between, row);
    padding-bottom: 1.5rem;

    h2 {
      font-family: var(--font-script);
      font-size: var(--step-3);
      line-height: 1;
    }

    a {
      @extend %link;
      color: inherit;
      font-size: var(--step--1);
    }
  }
}
</style>
