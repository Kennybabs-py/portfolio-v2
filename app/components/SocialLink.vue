<script lang="ts" setup>
import type { Platform } from "@/data/site";

// an icon-only link; the platform name is for screen readers and the tooltip
const props = defineProps<{
  platform: Platform;
  href: string;
}>();

const names: Record<Platform, string> = {
  email: "email",
  x: "x (twitter)",
  linkedin: "linkedin",
};

const external = computed(() => props.platform !== "email");
</script>

<template>
  <a
    class="social__link"
    :href="href"
    :aria-label="names[platform]"
    :title="names[platform]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    data-magnetic
  >
    <svg v-if="platform === 'x'" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>

    <svg v-else-if="platform === 'linkedin'" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>

    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
        d="M2.5 5.5h19v13h-19zM2.5 5.5l9.5 7.5 9.5-7.5"
      />
    </svg>
  </a>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.social__link {
  display: inline-grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-radius: 50%;
  color: inherit;
  transition:
    background-color 0.4s $ease-out-expo,
    color 0.4s $ease-out-expo,
    border-color 0.4s;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover,
  &:focus-visible {
    background-color: $color-accent;
    border-color: $color-accent;
    color: $color-ink;
  }
}
</style>
