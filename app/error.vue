<script lang="ts" setup>
import type { NuxtError } from "#app";
import { site } from "@/data/site";

const props = defineProps<{ error: NuxtError }>();

const is404 = computed(() => props.error.statusCode === 404);

useHead({ title: `${is404.value ? "not found" : "error"} — ${site.brand}` });
</script>

<template>
  <main class="error">
    <h1>{{ error.statusCode }}</h1>
    <p>
      {{ is404 ? "this page took a long walk and never came back." : "something broke on our side." }}
    </p>
    <button type="button" @click="clearError({ redirect: '/' })">back home</button>
  </main>
</template>

<style lang="scss" scoped>
.error {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  max-width: 34rem;
  margin-inline: auto;
  padding: var(--gutter);

  h1 {
    font-size: 2.5rem;
    line-height: 1.1;
  }

  button {
    width: fit-content;
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    text-decoration-color: var(--muted);
    text-underline-offset: 0.2em;
    cursor: pointer;

    &:hover {
      color: var(--accent);
      text-decoration-color: currentColor;
    }
  }
}
</style>
