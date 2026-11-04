<script lang="ts" setup>
import { site } from "@/data/site";

// lagos time, filled in on the client so the server's clock never shows
const time = ref("");

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timezone,
});

function tick() {
  time.value = format.format(new Date());
}

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  tick();
  timer = setInterval(tick, 15000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <span class="clock">{{ site.location }}<template v-if="time">, {{ time }} wat</template></span>
</template>

<style scoped>
.clock {
  font-variant-numeric: lining-nums tabular-nums;
}
</style>
