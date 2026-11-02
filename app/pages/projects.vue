<template>
  <section
    ref="containerRef"
    class="min-h-svh bg-[#faf9f6] text-[#030201] px-4 pt-[calc(var(--header-height)+1rem)]"
  >
    <h1
      class="projects--title text-[clamp(4rem,16vw,14rem)] leading-none font-['Anton'] uppercase invisible"
    >
      projects
    </h1>
  </section>
</template>

<script lang="ts" setup>
import { gsap, SplitText } from "@/lib/gsap";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  const title = SplitText.create(".projects--title", {
    type: "chars",
    mask: "chars",
  });

  gsap.set(".projects--title", { autoAlpha: 1 });
  gsap.from(title.chars, {
    yPercent: 110,
    stagger: 0.04,
    duration: 1.2,
    ease: "expo-out",
  });
}, containerRef);
</script>
