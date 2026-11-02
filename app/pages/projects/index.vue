<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectList from "~/components/ProjectList.vue";
import SiteFooter from "~/components/SiteFooter.vue";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  gsap
    .timeline()
    .add(revealText(".projects--title", "chars"), 0)
    .add(revealText(".projects--count", "words"), 0.3);

  scrollReveals(containerRef.value);
}, containerRef);

useSeoMeta({
  title: "projects",
  ogTitle: `projects — ${site.brand}`,
  description: `selected projects by ${site.name}, a ${site.role} in ${site.location}.`,
  ogDescription: `selected projects by ${site.name}, a ${site.role} in ${site.location}.`,
});
</script>

<template>
  <section ref="containerRef" class="projects__wrapper">
    <header class="projects__header">
      <h1 class="projects--title" data-reveal>projects</h1>
      <p class="projects--count" data-reveal>
        ({{ String(projects.length).padStart(2, "0") }})
      </p>
    </header>

    <ProjectList />

    <SiteFooter />
  </section>
</template>

<style lang="scss" scoped>
.projects__wrapper {
  min-height: 100svh;
  background-color: var(--color-paper);
  color: var(--color-ink);
  padding-top: calc(var(--header-height) + 1rem);

  .projects__header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0 var(--gutter) clamp(3rem, 8vh, 6rem);
  }

  .projects--title {
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: 0.9;
    text-transform: uppercase;
  }

  .projects--count {
    font-size: var(--step-1);
    padding-top: 0.5rem;
  }

  :deep(.project__list) {
    margin-inline: var(--gutter);
  }
}
</style>
