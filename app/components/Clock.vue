<script lang="ts" setup>
import { site } from "@/data/site";

const length = 12;

const secondHandRef = useTemplateRef<HTMLDivElement>("secondHandRef");
const hourHandRef = useTemplateRef<HTMLDivElement>("hourHandRef");
const minuteHandRef = useTemplateRef<HTMLDivElement>("minuteHandRef");
const label = ref("");

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

let timerId: ReturnType<typeof setInterval> | undefined;

function tick() {
  // read the time in lagos, not the visitor's timezone
  const [h, m, s] = formatter.format(new Date()).split(":").map(Number) as [
    number,
    number,
    number,
  ];

  const minutes = m + s / 60;
  const hours = (h % 12) + minutes / 60;

  secondHandRef.value!.style.transform = `rotate(${(s / 60) * 360}deg)`;
  minuteHandRef.value!.style.transform = `rotate(${(minutes / 60) * 360}deg)`;
  hourHandRef.value!.style.transform = `rotate(${(hours / 12) * 360}deg)`;
  label.value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

onMounted(() => {
  tick();
  timerId = setInterval(tick, 1000);
});

onBeforeUnmount(() => clearInterval(timerId));
</script>

<template>
  <div class="round--clock--wrapper">
    <div
      class="round--clock"
      role="img"
      :aria-label="`local time in lagos ${label}`"
      :style="{ '--radius': 28, '--length': length }"
    >
      <div class="dot" />
      <div class="hand second-hand" ref="secondHandRef" />
      <div class="hand hour-hand" ref="hourHandRef" />
      <div class="hand minute-hand" ref="minuteHandRef" />

      <span
        v-for="value in length"
        :key="value"
        :style="{ '--index': value }"
        class="minute--mark"
      />
    </div>

    <span class="time">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.round--clock--wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .round--clock {
    position: relative;
    width: calc(var(--radius) * 1px);
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
    border-radius: 50%;
  }

  .dot {
    position: absolute;
    width: 2px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: currentColor;
  }

  .minute--mark {
    --height: 2;
    --rotation: calc((var(--index) / var(--length)) * 360);
    --position: calc((var(--radius) - var(--height) - 3) / -2 * 1px);

    position: absolute;
    width: 1px;
    height: calc(var(--height) * 1px);
    background-color: currentColor;
    transform: rotate(calc(var(--rotation) * 1deg)) translateY(var(--position));
  }

  .hand {
    position: absolute;
    bottom: 50%;
    left: calc(50% - 0.5px);
    transform-origin: 50% 100%;
    background-color: currentColor;
    border-radius: 2px;
  }

  .hour-hand {
    width: 1.4px;
    height: calc((var(--radius) / 4) * 1px);
    z-index: 3;
  }

  .minute-hand {
    width: 1px;
    height: calc((var(--radius) / 2.8) * 1px);
    z-index: 4;
  }

  .second-hand {
    width: 1px;
    height: calc((var(--radius) / 2.6) * 1px);
    // inverse of the accent: the header's difference blend turns it back into
    // the accent over light pages (and cyan over dark ones)
    background-color: #00b1e0;
    z-index: 5;
  }

  .time {
    font-variant-numeric: tabular-nums;
    min-width: 5ch;
  }
}
</style>
