import { gsap, SplitText } from "@/lib/gsap";
import { durations, eases, prefersReducedMotion, stagger } from "@/lib/motion";

type SplitKind = "lines" | "words" | "chars";

/**
 * Masked text reveal. Returns the tween so it can be placed on a timeline.
 * Call inside a gsap.context (usePageEnter) so the split reverts with the page.
 */
export function revealText(
  target: gsap.DOMTarget,
  kind: SplitKind = "lines",
  vars: gsap.TweenVars = {},
  // unsplit once revealed, e.g. to hand the text to another effect
  { revert = false } = {},
) {
  // chars are wrapped in words too, so lines only break between words
  const type = kind === "chars" ? "words, chars" : kind;
  const split = SplitText.create(target, { type, mask: kind });
  gsap.set(target, { autoAlpha: 1 });

  const onComplete = revert ? () => split.revert() : undefined;

  if (prefersReducedMotion()) {
    return gsap.from(split[kind], { autoAlpha: 0, onComplete });
  }

  return gsap.from(split[kind], {
    yPercent: 110,
    duration: durations.reveal,
    ease: eases.out,
    stagger: stagger[kind],
    onComplete,
    ...vars,
  });
}

/**
 * Wires every [data-scroll-reveal] inside `scope` to reveal as it scrolls in.
 * The attribute value picks the split: lines (default), words, chars or fade.
 */
export function scrollReveals(scope: HTMLElement | null) {
  if (!scope) return;

  scope.querySelectorAll<HTMLElement>("[data-scroll-reveal]").forEach((el) => {
    const kind = el.dataset.scrollReveal || "lines";
    const scrollTrigger = { trigger: el, start: "top 88%" };

    if (kind === "fade") {
      gsap.set(el, { autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      gsap.from(el, {
        autoAlpha: 0,
        y: 60,
        duration: durations.reveal,
        ease: eases.out,
        scrollTrigger,
      });
      return;
    }

    revealText(el, kind as SplitKind, { scrollTrigger });
  });
}
