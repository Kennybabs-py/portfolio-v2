<script lang="ts" setup>
import type { NuxtError } from "#app";
import { site } from "@/data/site";

const props = defineProps<{ error: NuxtError }>();

const is404 = computed(() => props.error.statusCode === 404);

useHead({ title: `${is404.value ? "not found" : "error"} — ${site.name}` });

function goHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <main class="error__wrapper">
    <h1>{{ error.statusCode }}</h1>
    <p>
      {{ is404 ? "this page took a long walk and never came back." : "something broke on our side." }}
    </p>
    <button type="button" data-magnetic @click="goHome">back home</button>
  </main>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

.error__wrapper {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: var(--gutter);
  text-align: center;
  background-color: var(--color-ink);
  color: var(--color-paper);

  h1 {
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: 0.9;
  }

  p {
    font-size: var(--step-1);
    max-width: 30ch;
  }

  button {
    @extend %link;
    color: inherit;
    cursor: pointer;
    font-size: var(--step-0);
  }
}
</style>
