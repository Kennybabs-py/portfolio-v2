<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { site } from "@/data/site";
import SiteFooter from "~/components/SiteFooter.vue";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  gsap
    .timeline()
    .add(revealText(".info--title", "chars"), 0)
    .add(revealText(".info--statement", "lines"), 0.3);

  scrollReveals(containerRef.value);
}, containerRef);

useSeoMeta({
  title: "info",
  description: `about ${site.name}, a ${site.role} in ${site.location}.`,
});
</script>

<template>
  <section ref="containerRef" class="info__wrapper">
    <header class="info__header">
      <h1 class="info--title" data-reveal>info</h1>

      <p class="info--statement" data-reveal>
        i'm {{ site.name }}, a {{ site.role }} in {{ site.location }}. i craft
        web applications and sites for individuals, studios, and companies,
        balancing thought and function, and sweating the motion in between.
      </p>
    </header>

    <div id="tools" class="info__block">
      <h2 data-scroll-reveal="words">tools</h2>
      <ul>
        <li v-for="tool in site.tools" :key="tool" data-scroll-reveal="chars">
          {{ tool }}
        </li>
      </ul>
    </div>

    <div id="contact" class="info__block">
      <h2 data-scroll-reveal="words">contact</h2>

      <ul v-if="site.email || site.socials.length">
        <li v-if="site.email" data-scroll-reveal="fade">
          <a :href="`mailto:${site.email}`">{{ site.email }}</a>
        </li>
        <li v-for="social in site.socials" :key="social.href" data-scroll-reveal="fade">
          <a :href="social.href" target="_blank" rel="noopener">{{ social.label }}</a>
        </li>
      </ul>
      <p v-else data-scroll-reveal>contact details coming soon.</p>
    </div>

    <SiteFooter />
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

.info__wrapper {
  min-height: 100svh;
  background-color: var(--color-ink);
  color: var(--color-paper);
  padding-top: calc(var(--header-height) + 1rem);

  .info__header {
    padding: 0 var(--gutter) clamp(5rem, 12vh, 8rem);
  }

  .info--title {
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: 0.9;
    text-transform: uppercase;
  }

  .info--statement {
    max-width: 24ch;
    margin-top: 3rem;
    margin-left: auto;
    font-size: var(--step-3);
    line-height: 1.15;
  }

  .info__block {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    padding: 3rem var(--gutter);
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    margin-inline: var(--gutter);
    padding-inline: 0;

    h2 {
      font-family: var(--font-script);
      font-size: var(--step-3);
      line-height: 1;
    }

    ul {
      list-style: none;
      font-family: var(--font-display);
      font-size: var(--step-3);
      line-height: 1.1;
      text-transform: uppercase;
    }

    a {
      @extend %link--hidden;
      color: inherit;
    }

    p {
      font-size: var(--step-1);
    }

    @include mediaMax("tablet") {
      grid-template-columns: 1fr;
    }
  }
}
</style>
