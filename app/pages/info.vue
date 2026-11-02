<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { revealText, scrollReveals } from "@/lib/reveal";
import { contactLinks, site } from "@/data/site";
import SiteFooter from "~/components/SiteFooter.vue";
import SocialLink from "~/components/SocialLink.vue";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  gsap
    .timeline()
    .add(revealText(".info--title", "chars"), 0)
    .add(revealText(".info--statement", "lines"), 0.3)
    .add(revealText(".info--aside", "words"), 0.7);

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

      <div class="info--copy">
        <p class="info--statement" data-reveal>
          {{ site.info.statement }}
        </p>
        <p v-if="site.info.aside" class="info--aside" data-reveal>
          {{ site.info.aside }}
        </p>
      </div>
    </header>

    <div id="tools" class="info__block">
      <h2 data-scroll-reveal="words">tools</h2>

      <div class="tools">
        <div
          v-for="group in site.tools.groups"
          :key="group.label"
          class="tools__group"
        >
          <h3 data-scroll-reveal="words">{{ group.label }}</h3>
          <ul>
            <li v-for="tool in group.items" :key="tool" data-scroll-reveal="chars">
              {{ tool }}
            </li>
          </ul>
        </div>

        <p v-if="site.tools.note" class="tools__note" data-scroll-reveal="words">
          * {{ site.tools.note }}
        </p>
      </div>
    </div>

    <div id="contact" class="info__block">
      <h2 data-scroll-reveal="words">contact</h2>

      <ul class="contacts" data-scroll-reveal="fade">
        <li v-for="link in contactLinks" :key="link.href">
          <SocialLink :platform="link.platform" :href="link.href" />
        </li>
      </ul>
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

  .info--copy {
    max-width: 24ch;
    margin-top: 3rem;
    margin-left: auto;
    font-size: var(--step-3);
  }

  .info--statement {
    line-height: 1.15;
  }

  .info--aside {
    margin-top: 1.5rem;
    font-size: var(--step-1);
    line-height: 1.4;
    color: $color-muted;
  }

  .info__block {
    // #tools / #contact jumps land below the fixed header
    scroll-margin-top: var(--header-height);
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    padding: 3rem var(--gutter);
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    margin-inline: var(--gutter);
    padding-inline: 0;

    h2 {
      @extend %label;
    }

    ul {
      list-style: none;
    }

    .tools {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .tools__group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      h3 {
        @extend %label;
        color: $color-muted;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.1em 0.5em;
        font-family: var(--font-display);
        font-size: var(--step-3);
        line-height: 1.1;
        text-transform: uppercase;
      }

      // slashes between items, not after the last
      li:not(:last-child)::after {
        content: "/";
        margin-left: 0.5em;
        color: $color-muted;
      }
    }

    .tools__note {
      @extend %label;
      color: $color-muted;
    }

    .contacts {
      display: flex;
      gap: 0.75rem;
    }

    @include mediaMax("tablet") {
      grid-template-columns: 1fr;
    }
  }
}
</style>
