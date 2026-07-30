<script setup lang="ts">
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import PageLoader from "./components/PageLoader.vue";
import type { LenisOptions } from "lenis";

const lenisOptions: LenisOptions = {};

const { finishLoader, isLoading } = useLoader();

function onLoaderComplete() {
  finishLoader();
}

gsap.registerPlugin(SplitText, ScrollTrigger);
</script>

<template>
  <PageLoader v-if="isLoading" @complete="onLoaderComplete" />

  <PageTransition>
    <NuxtLayout>
      <VueLenis root :options="lenisOptions" />
      <NuxtPage />
    </NuxtLayout>
  </PageTransition>
</template>
