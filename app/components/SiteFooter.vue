<script lang="ts" setup>
import { site } from "@/data/site";

const lenis = useLenis();
const year = new Date().getFullYear();

const contactHref = site.email ? `mailto:${site.email}` : "/info#contact";

function backToTop() {
  lenis.value?.scrollTo(0, { duration: 1.6 });
}
</script>

<template>
  <footer class="site__footer">
    <p class="eyebrow" data-scroll-reveal="words">{{ site.footer.eyebrow }}</p>

    <NuxtLink :to="contactHref" class="cta" data-magnetic data-cursor="say hi">
      <span data-scroll-reveal="chars">{{ site.footer.cta }}</span>
    </NuxtLink>

    <div class="footer__bottom">
      <span>© {{ year }} {{ site.name }}</span>

      <ul v-if="site.socials.length" class="socials">
        <li v-for="social in site.socials" :key="social.href">
          <a :href="social.href" target="_blank" rel="noopener">{{ social.label }}</a>
        </li>
      </ul>

      <button type="button" data-magnetic @click="backToTop">back to top ↑</button>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use "@/assets/css/index" as *;

.site__footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(6rem, 15vh, 10rem) var(--gutter) var(--gutter);

  .eyebrow {
    @extend %label;
  }

  .cta {
    display: inline-block;
    width: fit-content;
    font-family: var(--font-display);
    font-size: var(--step-6);
    line-height: 0.9;
    text-transform: uppercase;
    color: inherit;
    text-decoration: none;
    transition: color 0.4s;

    &:hover {
      color: $color-accent;
    }
  }

  .footer__bottom {
    @include flex(center, space-between, row wrap);
    gap: 1rem;
    margin-top: 4rem;
    padding-top: 1rem;
    border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    font-size: var(--step--1);
  }

  .socials {
    display: flex;
    gap: 1.5rem;
    list-style: none;

    a {
      @extend %link--hidden;
      color: inherit;
    }
  }

  button {
    color: inherit;
    cursor: pointer;
  }
}
</style>
