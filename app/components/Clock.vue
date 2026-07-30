<script lang="ts" setup>
const length = ref(12);
const secondCount = ref(1);
const timerId = ref<number | null>();

const secondHandRef = useTemplateRef<HTMLDivElement>("secondHandRef");
const hourHandRef = useTemplateRef<HTMLDivElement>("hourHandRef");
const minuteHandRef = useTemplateRef<HTMLDivElement | null>("minuteHandRef");

function startInterval() {
  stopInterval();

  timerId.value = setInterval(() => {
    secondCount.value = secondCount.value === 60 ? 1 : secondCount.value + 1;
  }, 1000);
}

function stopInterval() {
  if (!timerId.value) return;
  clearInterval(timerId.value);
  timerId.value = null;
}

onBeforeMount(() => {
  startInterval();
});

onBeforeUnmount(() => {
  stopInterval();
});

watch(secondCount, () => {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  if (secondHandRef.value) {
    secondHandRef.value.style.transform = `rotate(${secondDeg}deg)`;
  }
  if (minuteHandRef.value) {
    minuteHandRef.value.style.transform = `rotate(${minuteDeg}deg)`;
  }

  if (hourHandRef.value) {
    hourHandRef.value.style.transform = `rotate(${hourDeg}deg)`;
  }
});
</script>

<template>
  <div class="round--clock--wrapper">
    <div class="round--clock" :style="{ '--radius': 40, '--length': length }">
      <div class="dot" />
      <div class="hand second-hand" ref="secondHandRef" />

      <div class="hand hour-hand" ref="hourHandRef" />

      <div class="hand minute-hand" ref="minuteHandRef" />

      <span
        v-for="value in 10"
        :key="value"
        :style="{ '--index': value + 1 }"
        class="minute--mark"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.round--clock--wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  padding: 5px;
  border: 1px solid transparent;

  .round--clock {
    position: relative;
    width: calc(var(--radius) * 1px);
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  .dot {
    position: absolute;
    width: calc(var(--radius) * 0.04 * 1px);
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: #fff;
  }

  .minute--mark {
    --height: calc(var(--radius) / 20);
    --rotation: calc((var(--index) / var(--length)) * 360);
    --position: calc((var(--radius) - var(--height)) / -2 * 1px);

    display: inline-block;
    position: absolute;
    width: 2px;
    height: calc(var(--height) * 1px);
    background-color: #fff;
    transform: rotate(calc(var(--rotation) * 1deg)) translateY(var(--position));
  }

  .hand {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform-origin: 50% 100%;
    transform: rotate(0deg);
    background-color: #fff;
    border-radius: 2px;
  }

  .hour-hand {
    width: 1.4px;
    height: calc((var(--radius) / 2.5) * 1px);
    background-color: #fff;
    z-index: 3;
  }

  .minute-hand {
    width: 1px;
    height: calc((var(--radius) / 2.1) * 1px);
    background-color: #fff;
    z-index: 4;
  }

  .second-hand {
    width: 1px;
    height: calc((var(--radius) / 2.2) * 1px);
    background-color: red;
    z-index: 5;
  }
}
</style>
