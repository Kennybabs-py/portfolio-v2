<script lang="ts" setup>
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

// Easter egg: a ball balanced on the top-left corner of the name. Scrolling
// down knocks it off; scrolling up kicks it back into the air, harder the
// closer you are to the top; reaching the top kicks it home onto the name.
const props = defineProps<{ anchor: HTMLElement | null }>();

const ballRef = ref<HTMLElement | null>(null);
const squashRef = ref<HTMLElement | null>(null);
const spinRef = ref<SVGElement | null>(null);
const enabled = ref(false);
const diameter = ref(14);

// px, seconds
const GRAVITY = 2600;
const FLOOR_BOUNCE = 0.62;
const WALL_BOUNCE = 0.7;
const AIR_DRAG = 0.15;
const ROLL_FRICTION = 2.6;
const SETTLE_SPEED = 80; // a floor hit slower than this stops bouncing
const KICK_PER_PX = 2.2;
const KICK_PAUSE_MS = 90; // a scroll flick is one kick, released once it pauses
const MIN_KICK = 380;
const MAX_KICK_HEIGHT = 0.8; // fraction of the viewport a scroll-kick can reach
const STEP = 1 / 240;

type Mode = "rest" | "free" | "home";

const ball = {
  mode: "rest" as Mode,
  r: 7,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  spin: 0,
  grounded: false,
};

const rest = { x: 0, y: 0 };
const sway = { t: 0, settle: 0, settleT: 0 };
const home = { x0: 0, y0: 0, vx: 0, vy: 0, t: 0, T: 0 };
const squash = { s: 0, v: 0 };

let pendingKick = 0;
let lastUpScroll = 0;
let wantsHome = false;
let lastScrollY = 0;
let cleanup: (() => void) | undefined;

const transitioning = usePageTransitioning();

function viewport() {
  return {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
  };
}

/** centre of the ball when it sits on the top-left corner of the first glyph */
function measureRest() {
  const el = props.anchor;
  if (!el) return;

  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const raw = el.textContent?.trim() ?? "";
  const text = style.textTransform === "uppercase" ? raw.toUpperCase() : raw;

  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const metrics = ctx.measureText(text);

  // locate the baseline inside the line box, then the cap height above it
  const contentHeight =
    metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  const baseline =
    rect.top + (rect.height - contentHeight) / 2 + metrics.fontBoundingBoxAscent;
  const capTop = baseline - metrics.actualBoundingBoxAscent;
  const glyphLeft = rect.left - metrics.actualBoundingBoxLeft;

  ball.r = Math.max(6, parseFloat(style.fontSize) * 0.32);
  diameter.value = ball.r * 2;
  // hang a little past the edge, so it looks ready to roll off
  rest.x = glyphLeft + ball.r * 0.55;
  rest.y = capTop - ball.r;
}

function impact(speed: number) {
  squash.s = Math.min(speed / 3200, 0.32);
  squash.v = 0;
}

function fallOff() {
  ball.mode = "free";
  ball.grounded = false;
  ball.vx = -(70 + Math.random() * 60);
  ball.vy = -40;
  ball.spin = ball.vx / ball.r;
}

/** distance from the top of the page, 0 at the top and 1 at the bottom */
function scrollDepth() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
}

function kick() {
  const { width, height } = viewport();
  const closeness = 1 - scrollDepth();
  const maxSpeed = Math.sqrt(2 * GRAVITY * height * MAX_KICK_HEIGHT);
  const speed = gsap.utils.clamp(
    MIN_KICK,
    maxSpeed,
    pendingKick * KICK_PER_PX * (0.7 + 1.3 * closeness),
  );

  ball.vy = -speed;
  // a scuffed kick: some sideways, drifting back towards the middle
  ball.vx += (Math.random() - 0.5) * 280 + (width / 2 - ball.x) * 0.12;
  ball.spin = ball.vx / ball.r + (Math.random() - 0.5) * 10;
  ball.grounded = false;
  pendingKick = 0;
  squash.s = -0.18; // stretch as it leaves the foot
}

/** a ballistic arc from where the ball is to its spot on the name */
function kickHome() {
  measureRest();
  // peak just above the name, then drop onto it
  const apexY = rest.y - Math.max(40, ball.r * 5);
  const vy = -Math.sqrt(2 * GRAVITY * (ball.y - apexY));
  const rise = -vy / GRAVITY;
  const drop = Math.sqrt((2 * (rest.y - apexY)) / GRAVITY);

  Object.assign(home, {
    x0: ball.x,
    y0: ball.y,
    vx: (rest.x - ball.x) / (rise + drop),
    vy,
    t: 0,
    T: rise + drop,
  });

  ball.mode = "home";
  ball.grounded = false;
  ball.spin = home.vx / ball.r;
  wantsHome = false;
  pendingKick = 0;
  squash.s = -0.2;
}

function land() {
  ball.mode = "rest";
  ball.vx = ball.vy = 0;
  sway.settle = ball.r * 0.9;
  sway.settleT = 0;
  impact(900);
}

function stepFree(h: number) {
  const { width, height } = viewport();
  const floor = height - ball.r;

  ball.vy += GRAVITY * h;
  ball.vx *= 1 - AIR_DRAG * h;
  ball.x += ball.vx * h;
  ball.y += ball.vy * h;

  if (ball.y >= floor) {
    ball.y = floor;
    if (ball.vy > SETTLE_SPEED) {
      impact(ball.vy);
      ball.vy = -ball.vy * FLOOR_BOUNCE;
      ball.vx *= 0.92;
      // contact with the ground pulls the spin towards rolling
      ball.spin += (ball.vx / ball.r - ball.spin) * 0.6;
    } else {
      ball.vy = 0;
      ball.grounded = true;
    }
  } else if (ball.y < floor - 0.5) {
    ball.grounded = false;
  }

  if (ball.grounded) {
    ball.vx *= 1 - ROLL_FRICTION * h;
    if (Math.abs(ball.vx) < 3) ball.vx = 0;
    ball.spin = ball.vx / ball.r;
  }

  if (ball.x < ball.r) {
    ball.x = ball.r;
    ball.vx = -ball.vx * WALL_BOUNCE;
    ball.spin *= -0.5;
  } else if (ball.x > width - ball.r) {
    ball.x = width - ball.r;
    ball.vx = -ball.vx * WALL_BOUNCE;
    ball.spin *= -0.5;
  }

  if (ball.y < ball.r) {
    ball.y = ball.r;
    ball.vy = -ball.vy * 0.5;
  }

  ball.angle += ball.spin * h;
}

function stepRest(dt: number) {
  sway.t += dt;
  sway.settleT += dt;

  // a restless teeter, with an occasional lean that looks like it'll go
  const lean = Math.sin(sway.t * 1.9) * 0.6 + Math.sin(sway.t * 0.63) * 0.4;
  const urge = Math.max(0, Math.sin(sway.t * 0.41)) ** 6;
  const settle =
    sway.settle * Math.exp(-3 * sway.settleT) * Math.sin(sway.settleT * 9);
  const offset = lean * ball.r * (0.28 + 0.6 * urge) + settle;

  ball.x = rest.x + offset;
  // past the corner it dips, as if tipping over the edge
  ball.y = rest.y + Math.max(0, -offset) ** 2 / (ball.r * 4);
  ball.angle = offset / ball.r;
}

function stepHome(dt: number) {
  home.t = Math.min(home.t + dt, home.T);
  ball.x = home.x0 + home.vx * home.t;
  ball.y = home.y0 + home.vy * home.t + 0.5 * GRAVITY * home.t ** 2;
  ball.angle += ball.spin * dt;
  if (home.t >= home.T) land();
}

function stepSquash(dt: number) {
  // damped spring back to round
  squash.v += (-900 * squash.s - 18 * squash.v) * dt;
  squash.s += squash.v * dt;
}

function render() {
  const { r, x, y, angle } = ball;
  ballRef.value!.style.transform = `translate3d(${x - r}px, ${y - r}px, 0)`;
  squashRef.value!.style.transform = `scale(${1 + squash.s * 0.5}, ${1 - squash.s})`;
  spinRef.value!.style.transform = `rotate(${angle}rad)`;
}

function tick(_time: number, deltaMs: number) {
  const dt = Math.min(deltaMs / 1000, 1 / 30);

  if (ball.mode === "rest") {
    stepRest(dt);
  } else if (ball.mode === "home") {
    stepHome(dt);
  } else {
    for (let left = dt; left > 0; left -= STEP) stepFree(Math.min(STEP, left));

    if (ball.grounded && wantsHome) kickHome();
    else if (
      ball.grounded &&
      pendingKick > 6 &&
      performance.now() - lastUpScroll > KICK_PAUSE_MS
    ) {
      kick();
    }
  }

  stepSquash(dt);
  render();
}

function onScroll() {
  const y = window.scrollY;
  const delta = y - lastScrollY;
  lastScrollY = y;

  // programmatic jumps during page transitions aren't the visitor scrolling
  if (transitioning.value) {
    wantsHome = y <= 1 && ball.mode !== "rest";
    return;
  }

  if (delta > 0) {
    wantsHome = false;
    pendingKick = Math.max(0, pendingKick - delta * 0.5);

    if (ball.mode === "rest" && y > 2) fallOff();
    else if (ball.mode === "home") {
      // scrolled away mid-flight: let gravity have it back
      ball.mode = "free";
      ball.vx = home.vx;
      ball.vy = home.vy + GRAVITY * home.t;
    }
  } else if (delta < 0 && ball.mode === "free") {
    pendingKick = Math.min(pendingKick - delta, 900);
    lastUpScroll = performance.now();
    if (y <= 1) wantsHome = true;
  }
}

function onResize() {
  measureRest();
  const { width, height } = viewport();
  ball.x = Math.min(ball.x, width - ball.r);
  if (ball.mode === "free") ball.y = Math.min(ball.y, height - ball.r);
}

onMounted(async () => {
  if (prefersReducedMotion()) return;

  await document.fonts.ready;
  enabled.value = true;
  await nextTick();

  measureRest();
  lastScrollY = window.scrollY;

  if (lastScrollY > 2) {
    // arrived mid-page (e.g. back navigation): it has already fallen
    ball.mode = "free";
    ball.x = rest.x;
    ball.y = window.innerHeight - ball.r;
    ball.grounded = true;
  } else {
    ball.x = rest.x;
    ball.y = rest.y;
  }

  render();
  gsap.ticker.add(tick);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  cleanup = () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
});

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <div
    v-if="enabled"
    ref="ballRef"
    class="header__ball"
    :style="{ width: `${diameter}px`, height: `${diameter}px` }"
    aria-hidden="true"
  >
    <div ref="squashRef" class="header__ball__squash">
      <!-- a small football: centre panel, seams and rim panels -->
      <svg ref="spinRef" viewBox="-50 -50 100 100">
        <defs>
          <clipPath id="header-ball-clip">
            <circle r="48" />
          </clipPath>
        </defs>
        <circle r="48" class="leather" />
        <g clip-path="url(#header-ball-clip)" class="panels">
          <polygon points="0,-17 16.2,-5.3 10,13.8 -10,13.8 -16.2,-5.3" />
          <g v-for="i in 5" :key="i" :transform="`rotate(${(i - 1) * 72})`">
            <line x1="0" y1="-17" x2="0" y2="-33" />
            <polygon
              :transform="`rotate(36) translate(0 -47)`"
              points="0,-13 12.4,-4 7.6,10.5 -7.6,10.5 -12.4,-4"
            />
          </g>
        </g>
        <circle r="48" class="outline" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

.header__ball {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  will-change: transform;

  .header__ball__squash {
    width: 100%;
    height: 100%;
    transform-origin: 50% 100%;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  // paper ball, ink panels; the header's difference blend flips it on light pages
  .leather {
    fill: $color-paper;
  }

  .panels {
    fill: $color-ink;
    stroke: $color-ink;
    stroke-width: 3;
  }

  .outline {
    fill: none;
    stroke: $color-ink;
    stroke-width: 2;
  }
}
</style>
