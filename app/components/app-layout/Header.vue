<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import Clock from "../Clock.vue";
import HeaderBall from "./HeaderBall.vue";
import { site } from "@/data/site";

const nameRef = ref<HTMLElement | null>(null);
const nameLink = computed(() => nameRef.value?.querySelector("a") ?? null);

// the backdrop takes on the background of whichever page sits under the header
// (dark pages, the light projects page, or the page lifting away mid-transition)
const backdropRef = ref<HTMLElement | null>(null);
let lastSample = 0;

function sampleTint(time: number) {
  if (time - lastSample < 0.1 || !backdropRef.value) return;
  lastSample = time;

  const y = backdropRef.value.offsetHeight + 1;
  const page = document.elementFromPoint(innerWidth / 2, y)?.closest("main > *");
  if (!page) return;

  backdropRef.value.style.setProperty("--tint", getComputedStyle(page).backgroundColor);
}

onMounted(() => gsap.ticker.add(sampleTint));
onBeforeUnmount(() => gsap.ticker.remove(sampleTint));
</script>

<template>
  <!-- blurs whatever scrolls under the header; kept outside it so the header's
       blend mode still works against the page -->
  <div ref="backdropRef" class="header__backdrop" aria-hidden="true" />

  <header class="header__wrapper">
    <nav class="nav" aria-label="main">
      <div class="nav-col">
        <div ref="nameRef" class="nav-items name">
          <NuxtLink to="/" :aria-label="`${site.name}, home`">{{ site.brand }}</NuxtLink>
        </div>

        <div class="nav-items hide-sm">
          <span>{{ site.tagline }}</span>
        </div>
      </div>

      <div class="nav-col">
        <div class="nav-items links">
          <NuxtLink to="/projects">projects</NuxtLink>
          <NuxtLink to="/info">info</NuxtLink>
        </div>

        <div class="nav-items location">
          <span>{{ site.location }}</span>
          <Clock class="hide-sm" />
        </div>
      </div>
    </nav>

    <!-- 0.313em: where the k of "kay" peaks in Mea Culpa -->
    <HeaderBall :anchor="nameLink" :peak-x="0.313" />
  </header>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

.header__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9; // above pages and the transition shade, below the header
  width: 100%;
  height: calc(var(--header-height) + 1.5rem);
  pointer-events: none;
  // a wash of the page colour over the blur, so what's underneath doesn't show
  background-color: color-mix(in srgb, var(--tint, #{$color-ink}) 90%, transparent);
  transition: background-color 0.4s;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  // full blur behind the header, easing out below it instead of a hard edge
  mask-image: linear-gradient(
    to bottom,
    #000 calc(100% - 1.5rem),
    transparent
  );
}

header.header__wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  min-height: var(--header-height);
  color: $color-white;
  font-size: var(--step--1);
  text-transform: lowercase;
  // blends against whatever page is underneath, including mid-transition
  mix-blend-mode: difference;

  nav.nav {
    @include flex(flex-start, space-between, row);
    gap: 1rem;
    width: 100%;
    padding: 1rem var(--gutter);
  }

  .nav-col {
    flex: 1;
    display: flex;
    gap: 1rem;
  }

  .nav-items {
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    & > * {
      color: inherit;
    }

    & > a {
      @extend %link--hidden;
      width: fit-content;
    }

    &:not(.name) > a.router-link-active::after {
      transform: scaleX(1);
      transform-origin: left center;
    }

    // the cursive "kay" mark
    &.name {
      font-family: var(--font-script);
      font-size: var(--step-3);
      line-height: 1;
      // room above for the football balanced on the k
      margin-top: 0.35rem;

      // script strokes spill past the text box; no clipping, no underline
      & > a {
        overflow: visible;

        &::after {
          display: none;
        }
      }
    }
  }

  .nav-items.location {
    align-items: flex-end;
  }

  @include mediaMax("sm-tablet") {
    font-size: var(--step-0);

    .hide-sm {
      display: none;
    }

    // links side by side, so they read as navigation, not a list
    .nav-items.links {
      flex-direction: row;
      gap: 1rem;
    }

    .nav-col:first-child {
      flex: 0 0 auto;
    }
  }
}
</style>
