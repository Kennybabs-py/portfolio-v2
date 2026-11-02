// one source of truth for how things move; eases mirrored in assets/css/_eases.scss
export const eases = {
  inOut: "expo-in-out",
  out: "expo-out",
  quartInOut: "quart-in-out",
} as const;

export const easeCurves: Record<(typeof eases)[keyof typeof eases], string> = {
  "expo-in-out": "0.87, 0, 0.13, 1",
  "expo-out": "0.19, 1, 0.22, 1",
  "quart-in-out": "0.77, 0, 0.175, 1",
};

export const durations = {
  page: 1.3,
  reveal: 1.2,
  fast: 0.6,
} as const;

export const stagger = {
  chars: 0.035,
  words: 0.06,
  lines: 0.08,
} as const;

/** vertical radius of the curved bottom edge on page / loader exits */
export const exitCurve = "22vh";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
