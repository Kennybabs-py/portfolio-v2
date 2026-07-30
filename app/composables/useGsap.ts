// composables/useGSAP.ts
import { onMounted, onUnmounted, type Ref } from "vue";
import { gsap } from "@/lib/gsap";

export function useGSAP(callback: () => void, scope?: Ref<HTMLElement | null>) {
  let context: gsap.Context;

  onMounted(() => {
    context = gsap.context(callback, scope?.value || undefined);
  });

  onUnmounted(() => {
    if (context) context.revert();
  });
}
