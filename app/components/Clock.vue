<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/data/site";

// lagos time, drawn as a small watch face with a sweeping second hand
const hourRef = ref<SVGGElement | null>(null);
const minuteRef = ref<SVGGElement | null>(null);
const secondRef = ref<SVGGElement | null>(null);

const hours = ref("--");
const minutes = ref("--");
const colonOn = ref(true);

const ticks = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  major: i % 3 === 0,
}));

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

// difference between the visitor's clock and lagos, so each frame can use
// Date.now() instead of formatting a date 60 times a second
let offsetMs = 0;

function measureOffset() {
  const now = new Date();
  const [h, m, s] = formatter.format(now).split(":").map(Number) as [
    number,
    number,
    number,
  ];
  const lagosMs = ((h * 60 + m) * 60 + s) * 1000 + now.getMilliseconds();
  const localMs =
    ((now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds()) * 1000 +
    now.getMilliseconds();
  offsetMs = lagosMs - localMs;
}

function draw(smooth: boolean) {
  const now = new Date(Date.now() + offsetMs);
  const ms = now.getMilliseconds();
  const s = now.getSeconds() + (smooth ? ms / 1000 : 0);
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  hourRef.value?.setAttribute("transform", `rotate(${h * 30})`);
  minuteRef.value?.setAttribute("transform", `rotate(${m * 6})`);
  secondRef.value?.setAttribute("transform", `rotate(${s * 6})`);

  hours.value = String(now.getHours()).padStart(2, "0");
  minutes.value = String(now.getMinutes()).padStart(2, "0");
  colonOn.value = ms < 500;
}

let cleanup: (() => void) | undefined;

onMounted(() => {
  measureOffset();
  const smooth = !prefersReducedMotion();

  if (smooth) {
    const tick = () => draw(true);
    gsap.ticker.add(tick);
    cleanup = () => gsap.ticker.remove(tick);
  } else {
    draw(false);
    const id = setInterval(() => draw(false), 1000);
    cleanup = () => clearInterval(id);
  }

  // re-sync now and then, in case the visitor's clock or timezone shifts
  const resync = setInterval(measureOffset, 60_000);
  const stop = cleanup;
  cleanup = () => {
    stop?.();
    clearInterval(resync);
  };
});

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <div
    class="clock"
    role="img"
    :aria-label="`local time in lagos ${hours}:${minutes}`"
  >
    <svg class="clock__face" viewBox="-50 -50 100 100" aria-hidden="true">
      <circle class="clock__rim" r="46" />

      <line
        v-for="tick in ticks"
        :key="tick.angle"
        class="clock__tick"
        :class="{ 'is-major': tick.major }"
        :transform="`rotate(${tick.angle})`"
        x1="0"
        y1="-40"
        x2="0"
        :y2="tick.major ? -30 : -36"
      />

      <g ref="hourRef" class="clock__hand clock__hand--hour">
        <line x1="0" y1="6" x2="0" y2="-20" />
      </g>
      <g ref="minuteRef" class="clock__hand clock__hand--minute">
        <line x1="0" y1="8" x2="0" y2="-32" />
      </g>
      <g ref="secondRef" class="clock__hand clock__hand--second">
        <line x1="0" y1="12" x2="0" y2="-38" />
        <circle cy="-26" r="3" />
      </g>

      <circle class="clock__cap" r="4" />
    </svg>

    <span class="clock__time">
      {{ hours }}<span class="clock__colon" :class="{ 'is-off': !colonOn }">:</span>{{ minutes }}
      <span class="clock__zone">wat</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.clock {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .clock__face {
    width: 2rem;
    height: 2rem;
    overflow: visible;
  }

  .clock__rim {
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
  }

  .clock__tick {
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    opacity: 0.45;

    &.is-major {
      stroke-width: 4;
      opacity: 1;
    }
  }

  .clock__hand line {
    stroke: currentColor;
    stroke-linecap: round;
  }

  .clock__hand--hour line {
    stroke-width: 7;
  }

  .clock__hand--minute line {
    stroke-width: 4.5;
  }

  // inverse of the accent: the header's difference blend turns it back into
  // the accent over light pages (and cyan over dark ones)
  .clock__hand--second {
    line {
      stroke: #00b1e0;
      stroke-width: 2;
    }

    circle {
      fill: #00b1e0;
    }
  }

  .clock__cap {
    fill: currentColor;
  }

  .clock__time {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .clock__colon {
    transition: opacity 0.2s;

    &.is-off {
      opacity: 0.25;
    }
  }

  .clock__zone {
    margin-left: 0.15rem;
    font-size: 0.75em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.55;
  }
}
</style>
