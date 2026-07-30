<script setup lang="ts">
import { gsap, SplitText } from "@/lib/gsap";
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  (e: "complete"): void;
}>();

const loaderRef = ref<HTMLElement | null>(null);
const percentRef = ref<HTMLElement | null>(null);
const barWrapperRef = ref<HTMLElement | null>(null);
const barRef = ref<HTMLElement | null>(null);
const progress = ref(0);

onMounted(() => {
  const duration = 2.2;
  const obj = { value: 0 };

  gsap.to(obj, {
    value: 100,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      progress.value = Math.round(obj.value);
      if (percentRef.value) {
        percentRef.value.textContent = `${progress.value}`;
      }
      if (barRef.value) {
        gsap.set(barRef.value, { scaleX: progress.value / 100 });
      }
    },
    onComplete: () => {
      const percentSplit = SplitText.create(percentRef.value, {
        type: "chars",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          emit("complete");
        },
      });

      tl.to(
        percentSplit.chars,
        {
          y: -40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.in",
        },
        0,
      )
        .to(
          barWrapperRef.value,
          {
            scaleX: 0,
            transformOrigin: "right",
            opacity: 0,
            duration: 0.8,
            ease: "power3.in",
          },
          0,
        )
        .to(
          loaderRef.value,
          {
            yPercent: -100,
            duration: 1.8,
            ease: "power4.inOut",
          },
          0.1,
        );
    },
  });
});
</script>

<template>
  <div
    ref="loaderRef"
    class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white text-black"
    style="clip-path: inset(0 0 0 0)"
  >
    <div class="relative overflow-hidden">
      <span ref="percentRef" class="percentage"> 0 </span>
    </div>

    <div class="bar--wrapper" ref="barWrapperRef">
      <div ref="barRef" class="bar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.percentage {
  font-family: "Matemasie";
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.05rem;
  font-size: clamp(4.5rem, 12vw, 9rem);
}

.bar--wrapper {
  width: 60vw;
  height: 20px;
  border-radius: 20px;
  overflow: hidden;
  margin: 24px 0 0;
  background-color: rgba($color: #fff, $alpha: 0.1);
  will-change: width;

  .bar {
    width: 100%;
    height: 100%;
    background-color: black;
    transform-origin: left;
    transform: scaleX(0);
    will-change: transform width;
  }
}
</style>
