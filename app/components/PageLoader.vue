<script setup lang="ts">
import { gsap } from "@/lib/gsap";
import { ref, onMounted } from "vue";

const emit = defineEmits<{
  // the curtain has started lifting, the page underneath can start its intro
  (e: "reveal"): void;
  (e: "complete"): void;
}>();

const loaderRef = ref<HTMLElement | null>(null);
const percentRef = ref<HTMLElement | null>(null);
const barWrapperRef = ref<HTMLElement | null>(null);
const barRef = ref<HTMLElement | null>(null);

const progress = ref(0);
const digits = ref<number[]>([0, 0, 0]);

watch(progress, (value) => {
  const str = Math.floor(value).toString().padStart(3, "0");
  digits.value = str.split("").map(Number);
});

onMounted(() => {
  const obj = { value: 0 };
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  gsap.to(obj, {
    value: 100,
    duration: reduceMotion ? 0.6 : 2.2,
    ease: "power2.inOut",
    onUpdate: () => {
      progress.value = Math.round(obj.value);

      if (barRef.value) {
        gsap.set(barRef.value, { scaleX: progress.value / 100 });
      }
    },
    onComplete: () => {
      const tl = gsap.timeline({
        onComplete: () => {
          emit("complete");
        },
      });

      tl.to(
        percentRef.value!.children,
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
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
          0.3,
        )
        .addLabel("lift", 0.9)
        .to(
          loaderRef.value,
          {
            yPercent: -100,
            duration: 1.4,
            ease: "expo-in-out",
          },
          "lift",
        )
        .fromTo(
          loaderRef.value,
          {
            borderBottomLeftRadius: "50% 0vh",
            borderBottomRightRadius: "50% 0vh",
          },
          {
            borderBottomLeftRadius: "50% 22vh",
            borderBottomRightRadius: "50% 22vh",
            duration: 0.8,
            ease: "power2.in",
          },
          "lift",
        )
        .call(() => emit("reveal"), [], "lift+=0.7");
    },
  });
});
</script>

<template>
  <div
    ref="loaderRef"
    class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white text-black overflow-hidden"
  >
    <div class="percentage" ref="percentRef">
      <div v-for="(digit, i) in digits" :key="i" class="digit-wrapper">
        <span
          class="digit-strip"
          :style="{ transform: `translateY(${-digit}em)` }"
        >
          <span v-for="n in 10" :key="n">{{ n - 1 }}</span>
        </span>
      </div>

      <span class="digits-percent-sign">%</span>
    </div>

    <div class="bar--wrapper" ref="barWrapperRef">
      <div ref="barRef" class="bar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

// every cell is 1em tall, so the strip offset scales with the font size
.percentage {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
  font-family: "Matemasie";
  font-weight: 800;
  font-size: clamp(3rem, 7vw, 10rem);
  line-height: 1;
  letter-spacing: 0.4rem;
}

.digit-wrapper {
  display: inline-block;
  height: 1em;
  overflow: hidden;
}

.digit-strip {
  display: flex;
  flex-direction: column;
  transition: transform 0.35s $ease-out-expo;
}

.digit-strip > span,
.digits-percent-sign {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1em;
}

.bar--wrapper {
  width: 60vw;
  height: 4px;
  border-radius: 20px;
  overflow: hidden;
  margin: 24px 0 0;
  background-color: rgba($color: #000, $alpha: 0.08);

  .bar {
    width: 100%;
    height: 100%;
    background-color: black;
    transform-origin: left;
    transform: scaleX(0);
    will-change: transform;
  }
}
</style>
