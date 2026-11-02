<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { prefersReducedMotion } from "@/lib/motion";
import { findProject } from "@/data/projects";
import SiteFooter from "~/components/SiteFooter.vue";

const route = useRoute();
const found = findProject(String(route.params.slug));

if (!found) {
  throw createError({ statusCode: 404, statusMessage: "project not found" });
}

const { project, next } = found;
const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  gsap
    .timeline()
    .add(revealText(".case--title", "chars"), 0)
    // split the items, not the <dl>, so the grid survives
    .add(revealText(".case--meta dt, .case--meta dd", "lines"), 0.3);

  gsap.set(".case--meta", { autoAlpha: 1 });

  scrollReveals(containerRef.value);

  if (prefersReducedMotion()) return;

  // cover opens up and its contents drift as it scrolls through
  gsap.fromTo(
    ".case__cover",
    { clipPath: "inset(12% 8% 12% 8% round 1rem)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 0rem)",
      ease: "none",
      scrollTrigger: {
        trigger: ".case__cover",
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    },
  );

  gsap.fromTo(
    ".case__cover__inner",
    { yPercent: -3 },
    {
      yPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: ".case__cover",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}, containerRef);

useSeoMeta({
  title: project.title,
  description: project.summary,
});
</script>

<template>
  <article ref="containerRef" class="case__wrapper">
    <header class="case__header">
      <h1 class="case--title" :style="{ color: project.accent }" data-reveal>
        {{ project.title }}
      </h1>

      <dl class="case--meta" data-reveal>
        <div>
          <dt>role</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div v-if="project.year">
          <dt>year</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div>
          <dt>stack</dt>
          <dd>{{ project.stack.join(", ") }}</dd>
        </div>
        <div v-if="project.url">
          <dt>live</dt>
          <dd>
            <a :href="project.url" target="_blank" rel="noopener">visit site ↗</a>
          </dd>
        </div>
      </dl>
    </header>

    <figure class="case__cover" :style="{ backgroundColor: project.color }">
      <div class="case__cover__inner">
        <NuxtImg
          v-if="project.image"
          :src="project.image"
          :alt="project.title"
          width="1440"
          densities="x1 x2"
          preload
        />
        <span v-else>{{ project.title }}</span>
      </div>
    </figure>

    <section class="case__body">
      <h2 data-scroll-reveal="words">overview</h2>
      <p data-scroll-reveal>{{ project.summary }}</p>
    </section>

    <NuxtLink
      :to="`/projects/${next.slug}`"
      class="case__next"
      data-cursor="next"
    >
      <span class="label" data-scroll-reveal="words">next project</span>
      <span
        class="title"
        :style="{ color: next.accent }"
        data-scroll-reveal="chars"
      >
        {{ next.title }}
      </span>
    </NuxtLink>

    <SiteFooter />
  </article>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

.case__wrapper {
  min-height: 100svh;
  background-color: var(--color-ink);
  color: var(--color-paper);
  padding-top: calc(var(--header-height) + 1rem);

  .case__header {
    padding: 0 var(--gutter) clamp(3rem, 8vh, 6rem);
  }

  .case--title {
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: 0.9;
    text-transform: uppercase;
  }

  .case--meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    font-size: var(--step--1);

    dt {
      color: $color-muted;
      margin-bottom: 0.25rem;
    }

    a {
      @extend %link;
      color: inherit;
    }
  }

  // same shape as the 16:10 site screenshots, so the whole page shows
  .case__cover {
    aspect-ratio: 16 / 10;
    max-height: 90svh;
    width: 100%;
    overflow: hidden;

    // a little taller than the frame, just enough for a gentle parallax
    .case__cover__inner {
      height: 108%;
      display: grid;
      place-items: center;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }

    span {
      font-family: var(--font-display);
      font-size: var(--step-5);
      text-transform: uppercase;
      color: $color-ink;
    }
  }

  .case__body {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    padding: clamp(5rem, 12vh, 8rem) var(--gutter);

    h2 {
      @extend %label;
    }

    p {
      font-size: var(--step-2);
      line-height: 1.35;
      max-width: 32ch;
    }

    @include mediaMax("tablet") {
      grid-template-columns: 1fr;
    }
  }

  .case__next {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(5rem, 12vh, 8rem) var(--gutter);
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    color: inherit;
    text-decoration: none;

    .label {
      font-size: var(--step--1);
      color: $color-muted;
    }

    .title {
      font-family: var(--font-display);
      font-size: var(--step-5);
      line-height: 1;
      text-transform: uppercase;
      transition: opacity 0.4s;
    }

    // the title carries the project's own colour, so hover dims it instead
    &:hover .title {
      opacity: 0.7;
    }
  }
}
</style>
