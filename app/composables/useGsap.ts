// composables/useGSAP.ts
import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { gsap } from "@/lib/gsap";

/** true once the current page is visible (loader gone / transition far enough in) */
export function usePageReady() {
  return useState("page-ready", () => false);
}

/** true while a route transition is running */
export function usePageTransitioning() {
  return useState("page-transitioning", () => false);
}

// a leaving page unmounts before its exit animation ends,
// so wait for the transition to finish before reverting its animations
function deferRevert(context: gsap.Context) {
  const nuxtApp = useNuxtApp();
  const transitioning = usePageTransitioning();

  return () => {
    if (transitioning.value) {
      nuxtApp.hooks.hookOnce("page:transition:finish", () => context.revert());
    } else {
      context.revert();
    }
  };
}

export function useGSAP(callback: () => void, scope?: Ref<HTMLElement | null>) {
  let revert: (() => void) | undefined;

  onMounted(() => {
    revert = deferRevert(gsap.context(callback, scope?.value || undefined));
  });

  onUnmounted(() => revert?.());
}

/** like useGSAP, but runs once the page is ready, for intro animations */
export function usePageEnter(
  callback: () => void,
  scope?: Ref<HTMLElement | null>,
) {
  const ready = usePageReady();
  let revert: (() => void) | undefined;
  let stop: (() => void) | undefined;

  onMounted(() => {
    stop = watch(
      ready,
      (isReady) => {
        if (!isReady || revert) return;
        revert = deferRevert(gsap.context(callback, scope?.value || undefined));
        queueMicrotask(() => stop?.());
      },
      { immediate: true },
    );
  });

  onUnmounted(() => {
    stop?.();
    revert?.();
  });
}
