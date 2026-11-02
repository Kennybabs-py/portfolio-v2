<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { eases, prefersReducedMotion } from "@/lib/motion";

// a ring that trails the pointer, grows over interactive elements and shows
// the element's data-cursor label; [data-magnetic] elements lean towards it
const cursorRef = ref<HTMLElement | null>(null);
const label = ref("");
const active = ref(false);

const INTERACTIVE = "a, button, [data-cursor]";
const MAGNET_STRENGTH = 0.35;

let magnet: HTMLElement | null = null;
let cleanup: (() => void) | undefined;

onMounted(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches || prefersReducedMotion()) return;

  const cursor = cursorRef.value!;
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

  function releaseMagnet() {
    if (!magnet) return;
    gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    magnet = null;
  }

  function onMove(event: PointerEvent) {
    gsap.set(cursor, { autoAlpha: 1 });
    xTo(event.clientX);
    yTo(event.clientY);

    const target = event.target as Element | null;
    const interactive = target?.closest<HTMLElement>(INTERACTIVE) ?? null;
    active.value = !!interactive;
    label.value = interactive?.dataset.cursor ?? "";

    const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
    if (nextMagnet !== magnet) releaseMagnet();

    if (nextMagnet) {
      magnet = nextMagnet;
      const rect = nextMagnet.getBoundingClientRect();
      gsap.to(nextMagnet, {
        x: (event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH,
        y: (event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH,
        duration: 0.6,
        ease: eases.out,
      });
    }
  }

  function onLeave() {
    gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
    releaseMagnet();
  }

  window.addEventListener("pointermove", onMove);
  document.documentElement.addEventListener("pointerleave", onLeave);

  cleanup = () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
});

// the element under the pointer changes on navigation without the pointer moving
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    active.value = false;
    label.value = "";
  },
);

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <div
    ref="cursorRef"
    class="cursor"
    :class="{ 'is-active': active, 'has-label': !!label }"
    aria-hidden="true"
  >
    <span class="cursor__ring" />
    <span class="cursor__label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  pointer-events: none;
  visibility: hidden;
  mix-blend-mode: difference;
  color: $color-paper;

  .cursor__ring {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    translate: -50% -50%;
    border: 1px solid currentColor;
    border-radius: 50%;
    transition:
      scale 0.5s $ease-out-expo,
      background-color 0.3s;
    scale: 0.4;
  }

  .cursor__label {
    position: absolute;
    translate: -50% -50%;
    font-size: var(--step--1);
    text-transform: lowercase;
    color: $color-ink;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
  }

  &.is-active .cursor__ring {
    scale: 1;
  }

  &.has-label {
    .cursor__ring {
      scale: 2;
      background-color: currentColor;
    }

    .cursor__label {
      opacity: 1;
    }
  }
}
</style>
