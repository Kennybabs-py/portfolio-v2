<script lang="ts" setup>
import Header from "~/components/app-layout/Header.vue";
</script>

<template>
  <a class="skip-link" href="#main">skip to content</a>
  <Header />
  <main id="main">
    <slot />
  </main>
</template>

<style lang="scss" scoped>
.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 10000;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: var(--color-ink);
  translate: 0 -150%;
  transition: translate 0.3s;

  &:focus-visible {
    translate: 0 0;
  }
}
</style>
