import type { Ref } from "vue";

interface Loader {
  isLoading: Ref<boolean>;
  finishLoader: () => void;
}

declare module "#app" {
  interface NuxtApp {
    $loader: Loader;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $loader: Loader;
  }
}

export {};
