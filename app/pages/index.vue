<script lang="ts" setup>
import { useGSAP } from "~/composables/useGsap";
import { gsap, SplitText } from "@/lib/gsap";

const { finishLoader, isLoading } = useLoader();

const containerRef = ref<HTMLElement | null>(null);

useGSAP(() => {
  const homeText = SplitText.create("#homeText", { type: "chars" });

  gsap.set("#homeText", { autoAlpha: 1 });

  gsap.set(homeText.chars, { y: 400 });

  gsap.to(homeText.chars, {
    y: 0,
    duration: 1,
    stagger: 0.075,
    ease: "power4.out",
    delay: 1,
  });

  gsap.to("#homeImage", {
    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
    y: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 1.5,
  });
}, containerRef);
</script>

<template>
  <section class="home__wrapper" ref="containerRef">
    <p class="hi--text">hi, i, kehinde.</p>

    <h2 class="the--subtle--text">
      the subtle art of balancing thoughts and function
    </h2>

    <h3>build, iterate, build, repeat</h3>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

section.home__wrapper {
  // @include flex;
  position: relative;
  width: 100vw;
  min-height: 100vh;
  padding: 1rem;
  border: 2px solid red;

  .hi--text {
    letter-spacing: -0.01rem;
    // text-transform: uppercase;
    font-weight: 300;
    text-align: left;
    font-size: clamp(12px, 2.5vw, 1rem);
    font-family: "Nunito";
    // clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 100%);
    // opacity: 0;

    .char {
      position: relative;
      will-change: transform;
      opacity: 0;
    }
  }

  .the--subtle--text {
    letter-spacing: -0.01rem;
    text-transform: uppercase;
    font-weight: 800;
    text-align: left;
    font-size: clamp(3vmin, 5vw, 5vmin);
    font-family: "Anton";
    max-width: 400px;
    line-height: 50px;
    margin: 1rem 0 0;
    // line-height: 100px;
    // clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 100%);
    // opacity: 0;

    .char {
      position: relative;
      will-change: transform;
      opacity: 0;
    }
  }

  figure {
    position: absolute;
    bottom: 2%;
    right: 1%;
    width: 20vmin;
    aspect-ratio: 1/1.4;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
