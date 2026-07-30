<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "#app";
import { gsap } from "@/lib/gsap";

const router = useRouter();

const overlayRef = useTemplateRef<HTMLDivElement>("overlayRef");
const blocksRef = ref<HTMLDivElement[]>([]);
const isTransitioning = ref(false);

function createBlocks() {
  if (!overlayRef.value) return;

  overlayRef.value.innerHTML = "";
  blocksRef.value = [];

  for (let i = 0; i < 10; i++) {
    const block = document.createElement("div");
    block.className = "transition--block";
    overlayRef.value.appendChild(block);
    blocksRef.value.push(block);
  }
}

function revealPage(delay?: number) {
  gsap.set(blocksRef.value, { scaleX: 1, transformOrigin: "right" });

  gsap.to(blocksRef.value, {
    scaleX: 0,
    duration: 0.4,
    stagger: 0.05,
    delay: delay || 0,
    ease: "power2.out",
    transformOrigin: "right",
    onComplete: () => {
      isTransitioning.value = false;
    },
  });
}

onMounted(() => {
  createBlocks();
  gsap.set(blocksRef.value, { scaleX: 0, transformOrigin: "left" });
  revealPage();
});

const removeBefore = router.beforeEach((to, from, next) => {
  if (from.matched.length === 0 || to.path === from.path) {
    next();
    return;
  }

  if (isTransitioning.value) {
    next(false);
    return;
  }

  isTransitioning.value = true;

  gsap.to(blocksRef.value, {
    scaleX: 1,
    duration: 0.4,
    stagger: 0.05,
    ease: "power2.out",
    transformOrigin: "left",
    onComplete: () => {
      next();
    },
  });
});

const removeAfter = router.afterEach((to, from) => {
  if (from.matched.length === 0) {
    createBlocks();
    gsap.set(blocksRef.value, { scaleX: 1, transformOrigin: "left" });
  }

  if (to.path === from.path) return;

  nextTick(() => {
    revealPage();
  });
});

onUnmounted(() => {
  removeBefore();
  removeAfter();
});
</script>

<template>
  <div>
    <div className="page__transition__overlay" ref="overlayRef" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.page__transition__overlay {
  @include flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 20;
}
</style>
