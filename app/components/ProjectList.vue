<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { eases } from "@/lib/motion";
import { projects } from "@/data/projects";

// a cover card that follows the pointer over the list and swaps per row
const listRef = ref<HTMLElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const hovered = ref(-1);

let xTo: gsap.QuickToFunc | undefined;
let yTo: gsap.QuickToFunc | undefined;

onMounted(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  xTo = gsap.quickTo(previewRef.value, "x", { duration: 0.7, ease: "power3" });
  yTo = gsap.quickTo(previewRef.value, "y", { duration: 0.7, ease: "power3" });
});

function onMove(event: PointerEvent) {
  const rect = listRef.value!.getBoundingClientRect();
  xTo?.(event.clientX - rect.left);
  yTo?.(event.clientY - rect.top);
}

function onEnter(index: number) {
  if (!xTo) return;
  hovered.value = index;
  gsap.to(previewRef.value, {
    scale: 1,
    autoAlpha: 1,
    duration: 0.6,
    ease: eases.out,
  });
}

function onLeave() {
  hovered.value = -1;
  gsap.to(previewRef.value, {
    scale: 0.6,
    autoAlpha: 0,
    duration: 0.4,
    ease: "power2.in",
  });
}
</script>

<template>
  <div
    ref="listRef"
    class="project__list"
    :class="{ 'is-hovering': hovered !== -1 }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <ul>
      <li
        v-for="(project, index) in projects"
        :key="project.slug"
        :class="{ 'is-hovered': hovered === index }"
        @pointerenter="onEnter(index)"
      >
        <NuxtLink :to="`/projects/${project.slug}`" data-cursor="view">
          <!-- touch screens can't hover, so they get the cover inline -->
          <span
            class="thumb"
            :style="{ backgroundColor: project.color }"
            aria-hidden="true"
          >
            <NuxtImg
              v-if="project.image"
              :src="project.image"
              alt=""
              width="800"
              densities="x1 x2"
              loading="lazy"
            />
          </span>
          <span class="index">{{ String(index + 1).padStart(2, "0") }}</span>
          <span class="title" data-scroll-reveal="chars">{{ project.title }}</span>
          <span class="role">{{ project.role }}</span>
          <span class="year">{{ project.year ?? "" }}</span>
        </NuxtLink>
      </li>
    </ul>

    <div ref="previewRef" class="project__preview" aria-hidden="true">
      <div
        v-for="(project, index) in projects"
        :key="project.slug"
        class="project__preview__cover"
        :class="{ 'is-current': hovered === index }"
        :style="{ backgroundColor: project.color }"
      >
        <NuxtImg
          v-if="project.image"
          :src="project.image"
          alt=""
          width="420"
          densities="x1 x2"
          loading="lazy"
        />
        <span v-else>{{ project.title }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.project__list {
  position: relative;

  ul {
    list-style: none;
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }

  li {
    border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    transition: opacity 0.4s;
  }

  // dim the rows that aren't hovered
  &.is-hovering li:not(.is-hovered) {
    opacity: 0.35;
  }

  a {
    display: grid;
    grid-template-columns: 3rem 1fr auto auto;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1.25rem 0;
    color: inherit;
    text-decoration: none;
  }

  .index,
  .role,
  .year {
    font-size: var(--step--1);
    color: color-mix(in srgb, currentColor 60%, transparent);
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--step-4);
    line-height: 1;
    text-transform: uppercase;
    transition: translate 0.6s $ease-out-expo;
  }

  li.is-hovered .title {
    translate: 1rem 0;
  }

  .thumb {
    display: none;
  }

  @media (hover: none) {
    .thumb {
      display: block;
      grid-column: 1 / -1;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      border-radius: 0.5rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
      }
    }
  }

  @include mediaMax("sm-tablet") {
    a {
      grid-template-columns: 2rem 1fr auto;
      gap: 0.75rem;
    }

    .role {
      display: none;
    }
  }
}

.project__preview {
  position: absolute;
  top: 0;
  left: 0;
  // landscape, matching the 16:10 site screenshots
  width: clamp(16rem, 28vw, 26rem);
  aspect-ratio: 16 / 10;
  translate: -50% -50%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 0.5rem;
  visibility: hidden;
  scale: 0.6;
  z-index: 2;

  .project__preview__cover {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    clip-path: inset(100% 0 0 0);
    transition: clip-path 0.7s $ease-in-out-expo;

    &.is-current {
      clip-path: inset(0 0 0 0);
      z-index: 1;
    }

    span {
      font-family: var(--font-display);
      font-size: var(--step-2);
      text-transform: uppercase;
      color: $color-ink;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }
  }
}
</style>
