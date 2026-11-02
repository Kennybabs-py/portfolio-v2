<script lang="ts" setup>
import Clock from "../Clock.vue";
</script>

<template>
  <header class="header__wrapper">
    <nav class="nav">
      <div class="nav-col">
        <div class="nav-items name">
          <NuxtLink to="/">kehinde</NuxtLink>
        </div>

        <div class="nav-items">
          <span>dev. studio</span>
        </div>
      </div>

      <div class="nav-col">
        <div class="nav-items">
          <NuxtLink to="/projects">projects</NuxtLink>
          <!-- <NuxtLink to="/info">info</NuxtLink> -->
        </div>

        <!-- <div class="nav-items">
            <Link href="">twitter</Link>
            <Link href="">instagram</Link>
          </div> -->

        <div class="nav-items">
          <span>lagos, ng</span>
        </div>

        <!-- <div class="nav-items">
          <Clock />
        </div> -->
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@use "~/assets/css/index" as *;

header.header__wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  min-height: var(--header-height);
  color: $color-white;
  // blends against whatever page is underneath, including mid-transition
  mix-blend-mode: difference;

  nav.nav {
    @include flex(flex-start, space-between, row);
    width: 100%;
    padding: 1rem;
  }

  .nav-col {
    flex: 1;
    display: flex;
  }

  .nav-items {
    flex: 1;

    display: flex;
    flex-direction: column;

    & > * {
      color: inherit;
      font-weight: 200;
    }

    & > a {
      @extend %link--hidden;
      width: fit-content;
    }

    &.name {
      font-family: "Matemasie";
    }
  }

  .nav-col:nth-child(2) .nav-items:last-child {
    align-items: flex-end;
  }
}
</style>
