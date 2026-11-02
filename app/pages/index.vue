<script lang="ts" setup>
import { gsap, SplitText } from "@/lib/gsap";

const containerRef = ref<HTMLElement | null>(null);

usePageEnter(() => {
  const hiText = SplitText.create(".hi--text", { type: "words", mask: "words" });
  const roleText = SplitText.create(".role--text h2", {
    type: "chars",
    mask: "chars",
  });
  const introText = SplitText.create(".intro--text", {
    type: "lines",
    mask: "lines",
  });
  const subtleText = SplitText.create(".the--subtle--text", {
    type: "words",
    mask: "words",
  });

  gsap.set("[data-reveal]", { autoAlpha: 1 });

  gsap
    .timeline({ defaults: { duration: 1.2, ease: "expo-out" } })
    .from(roleText.chars, { yPercent: 110, stagger: 0.035 }, 0)
    .from(hiText.words, { yPercent: 110, stagger: 0.075 }, 0.2)
    .from(".build--text", { autoAlpha: 0, y: 12 }, 0.4)
    .from(introText.lines, { yPercent: 110, stagger: 0.08 }, 0.5)
    .from(subtleText.words, { yPercent: 110, stagger: 0.04 }, 0.7);
}, containerRef);
</script>

<template>
  <section class="home__wrapper" ref="containerRef">
    <div class="hero__wrapper">
      <p class="hi--text" data-reveal>hi, i, kehinde.</p>

      <h3 class="build--text" data-reveal>build, iterate, build, repeat</h3>

      <div class="role--text">
        <h2 data-reveal>a frontend engineer</h2>
      </div>

      <p class="intro--text" data-reveal>
        who resides in lagos, ng. i use
        <NuxtLink to="#tools">tools</NuxtLink> to craft web applications and
        sites for individuals, studios, and companies. i enjoy playing snooker,
        fifa and taking long walks in order to meet my luck.
      </p>

      <h2 class="the--subtle--text" data-reveal>
        the subtle art of balancing thoughts and function
      </h2>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

section.home__wrapper {
  position: relative;
  width: 100%;
  min-height: 100svh;
  background-color: #030201;

  // hidden until the intro timeline runs, avoids a flash of unsplit text
  [data-reveal] {
    visibility: hidden;
  }

  .hero__wrapper {
    position: relative;
    width: 100%;
    height: 100svh;
    overflow: hidden;
    padding: calc(var(--header-height) + 1rem) 1rem 1rem;

    .hi--text {
      letter-spacing: -0.01rem;
      font-weight: 300;
      text-align: left;
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-family: "Lavishly-Yours";
    }

    .role--text {
      @include flex(center, center, row);
      gap: 1rem;
      width: 100%;
      position: absolute;
      inset: 0;
      pointer-events: none;

      & > h2 {
        letter-spacing: -0.01rem;
        text-transform: uppercase;
        font-weight: 800;
        text-align: center;
        font-size: clamp(10vmin, 10vw, 20vmin);
        font-family: "Anton";
        line-height: 1;
      }
    }

    .intro--text {
      position: absolute;
      bottom: 12%;
      width: min(90%, 700px);
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      text-transform: uppercase;
      font-size: clamp(0.8rem, 2vw, 1rem);
      line-height: 1.8;

      & a {
        @extend %link;
      }
    }

    .the--subtle--text {
      position: absolute;
      bottom: 1rem;
      inset-inline: 1rem;
      letter-spacing: -0.01rem;
      font-weight: 400;
      font-size: clamp(1.5rem, 3vw, 2.75rem);
      font-family: "Mea Culpa";
      line-height: 1.2;
    }

    .build--text {
      position: absolute;
      right: 1rem;
      top: calc(var(--header-height) + 1rem);
      font-family: "Matemasie";
      font-size: clamp(0.8rem, 2vw, 1rem);
    }
  }
}
</style>
