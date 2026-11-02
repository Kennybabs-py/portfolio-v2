<script setup lang="ts">
import { gsap } from "@/lib/gsap";
import { durations, eases, exitCurve, prefersReducedMotion } from "@/lib/motion";
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

const SEEN_KEY = "loader-seen";

function playExit() {
  gsap
    .timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        emit("complete");
      },
    })
    .to(
      percentRef.value!.children,
      {
        yPercent: -100,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
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
        duration: 0.5,
        ease: "power3.in",
      },
      0.1,
    )
    .addLabel("lift", 0.4)
    .to(
      loaderRef.value,
      {
        yPercent: -100,
        duration: durations.page,
        ease: eases.inOut,
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
        borderBottomLeftRadius: `50% ${exitCurve}`,
        borderBottomRightRadius: `50% ${exitCurve}`,
        duration: 0.8,
        ease: "power2.in",
      },
      "lift",
    )
    .call(() => emit("reveal"), [], "lift+=0.6");
}

onMounted(async () => {
  // returning visitor: the loader was hidden before paint (see app.vue head)
  if (document.documentElement.classList.contains(SEEN_KEY)) {
    emit("reveal");
    emit("complete");
    return;
  }

  const obj = { value: 0 };

  // the counter runs alongside font loading; the exit waits for both
  const counter = gsap.to(obj, {
    value: 100,
    duration: prefersReducedMotion() ? 0.3 : 0.9,
    ease: "power2.inOut",
    onUpdate: () => {
      progress.value = Math.round(obj.value);

      if (barRef.value) {
        gsap.set(barRef.value, { scaleX: progress.value / 100 });
      }
    },
  });

  await Promise.all([counter, document.fonts.ready]);
  playExit();
});
</script>

<template>
  <div
    ref="loaderRef"
    class="page__loader"
    role="status"
    aria-label="loading"
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

.page__loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-paper);
  color: var(--color-ink);

}

// every cell is 1em tall, so the strip offset scales with the font size
.percentage {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 10rem);
  line-height: 1;
  letter-spacing: 0.02em;
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
    background-color: var(--color-ink);
    transform-origin: left;
    transform: scaleX(0);
    will-change: transform;
  }
}
</style>

<style>
/* set before first paint for returning visitors (see app.vue head);
   unscoped, since a scoped :global() would drop the .page__loader part */
.loader-seen .page__loader {
  display: none;
}
</style>
