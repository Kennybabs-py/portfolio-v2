<script lang="ts" setup>
// the theme itself is set before first paint by the script in app.vue; until
// a visitor chooses here, the site follows their device setting
const theme = ref<"light" | "dark" | null>(null);

const next = computed(() => (theme.value === "dark" ? "light" : "dark"));

function toggle() {
  theme.value = next.value;
  document.documentElement.dataset.theme = theme.value;
  try {
    localStorage.setItem("theme", theme.value);
  } catch {
    // storage blocked: the choice just lasts until the page is left
  }
}

onMounted(() => {
  theme.value =
    (document.documentElement.dataset.theme as "light" | "dark" | undefined) ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
});
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :class="{ 'theme-toggle--ready': theme }"
    :aria-label="`switch to ${next} mode`"
    @click="toggle"
  >
    {{ next }}
  </button>
</template>

<style lang="scss" scoped>
.theme-toggle {
  min-width: 2.25em;
  background: none;
  border: 0;
  color: var(--muted);
  font: inherit;
  font-style: italic;
  text-align: right;
  cursor: pointer;
  // the label depends on the visitor's theme, so it waits for the client
  visibility: hidden;

  &--ready {
    visibility: visible;
  }

  &:hover,
  &:focus-visible {
    color: var(--accent);
  }
}
</style>
