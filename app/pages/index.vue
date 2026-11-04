<script lang="ts" setup>
import { contactLinks, site } from "@/data/site";
import { projects } from "@/data/projects";
import Clock from "~/components/Clock.vue";
import SocialLink from "~/components/SocialLink.vue";
import ThemeToggle from "~/components/ThemeToggle.vue";
</script>

<template>
  <div class="page">
    <header class="masthead">
      <NuxtLink to="/" class="mark" :aria-label="`${site.name}, home`">{{ site.brand }}</NuxtLink>

      <nav aria-label="main">
        <a href="#work">work</a>
        <a href="#tools">tools</a>
        <a href="#contact">contact</a>
        <ThemeToggle />
      </nav>
    </header>

    <main>
      <section id="about" class="section">
        <h2 class="label">about</h2>
        <div class="section__body prose">
          <h1 class="lede">{{ site.about.lede }}</h1>
          <p v-for="paragraph in site.about.paragraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
      </section>

      <section id="work" class="section">
        <h2 class="label">work</h2>
        <p class="section__body note">selected projects, newest first</p>

        <ol class="entries">
          <li
            v-for="project in projects"
            :key="project.slug"
            class="entry"
            :style="{ '--entry-accent': project.accent }"
          >
            <span class="entry__year label">{{ project.year }}</span>

            <div class="entry__text">
              <h3 class="entry__title">
                <a v-if="project.url" :href="project.url" target="_blank" rel="noopener">
                  {{ project.title }}<span class="arrow" aria-hidden="true">&nbsp;↗</span>
                </a>
                <template v-else>{{ project.title }}</template>
              </h3>
              <p>{{ project.summary }}</p>
              <p class="entry__stack">{{ project.stack.join(" · ") }}</p>
            </div>

            <figure
              v-if="project.image"
              class="entry__plate"
              :style="{ backgroundColor: project.color }"
            >
              <NuxtImg
                :src="project.image"
                :alt="`${project.title} homepage`"
                width="480"
                height="300"
                densities="x1 x2"
                loading="lazy"
              />
            </figure>
          </li>
        </ol>
      </section>

      <section id="tools" class="section">
        <h2 class="label">tools</h2>
        <div class="section__body">
          <dl class="tools">
            <div v-for="group in site.tools.groups" :key="group.label">
              <dt class="label">{{ group.label }}</dt>
              <dd>{{ group.items.join(" · ") }}</dd>
            </div>
          </dl>
          <p class="note">currently {{ site.tools.note }}</p>
        </div>
      </section>

      <section id="contact" class="section">
        <h2 class="label">contact</h2>
        <div class="section__body">
          <p>
            {{ site.contact.prompt }}
            <a class="link" :href="`mailto:${site.email}`">{{ site.contact.cta }}</a>.
          </p>
          <ul class="socials">
            <li v-for="link in contactLinks" :key="link.platform">
              <SocialLink :platform="link.platform" :href="link.href" />
            </li>
          </ul>
        </div>
      </section>
    </main>

    <footer class="colophon">
      <em>{{ site.closing }}</em>
      <Clock />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.page {
  max-width: calc(var(--col-margin) + 38rem + var(--col-plate) + 2 * var(--col-gap) + 2 * var(--gutter));
  margin-inline: auto;
  padding-inline: var(--gutter);
}

// the catalogue's one voice for margin labels and years
.label {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.75rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

h2.label {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.35em;
}

.note {
  color: var(--muted);
  font-style: italic;
}

.link {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--muted);
  text-underline-offset: 0.2em;

  &:hover,
  &:focus-visible {
    color: var(--accent);
    text-decoration-color: currentColor;
  }
}

.masthead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-block: 2rem 4rem;

  .mark {
    font-family: var(--font-script);
    font-size: 3rem;
    line-height: 1;
  }

  nav {
    display: flex;
    gap: 1.25rem;
  }

  nav a {
    font-size: 1rem;

    &:hover,
    &:focus-visible {
      color: var(--accent);
    }
  }
}

.section {
  display: grid;
  grid-template-columns: var(--col-margin) minmax(0, 38rem) var(--col-plate);
  column-gap: var(--col-gap);
  padding-block: 1.25rem 4rem;
  border-top: 1px solid var(--rule);
  scroll-margin-top: 1rem;

  &__body {
    grid-column: 2;
  }
}

.prose p + p,
.lede + p {
  margin-top: 1rem;
}

.lede {
  font-size: clamp(1.625rem, 1.3rem + 1.4vw, 2.375rem);
  line-height: 1.22;
  letter-spacing: -0.01em;
  margin-bottom: 1.75rem;
  text-wrap: pretty;
}

#about .section__body {
  grid-column: 2 / -1;

  p {
    max-width: 38rem;
  }
}

.entries {
  grid-column: 1 / -1;
  list-style: none;
  margin-top: 2rem;
}

.entry {
  display: grid;
  grid-template-columns: var(--col-margin) minmax(0, 38rem) var(--col-plate);
  column-gap: var(--col-gap);
  padding-block: 1.5rem;
  border-top: 1px solid var(--rule);

  &:last-child {
    padding-bottom: 0;
  }

  &__year {
    font-variant-numeric: lining-nums tabular-nums;
  }

  &__title {
    font-size: 1.5rem;
    line-height: 1.75rem;
    margin-bottom: 0.5rem;

    a:hover,
    a:focus-visible {
      color: var(--entry-accent);
    }
  }

  .arrow {
    color: var(--muted);
    font-size: 0.75em;
  }

  a:hover .arrow,
  a:focus-visible .arrow {
    color: inherit;
  }

  &__stack {
    margin-top: 0.75rem;
    color: var(--muted);
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  &__plate {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    outline: 1px solid var(--rule);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }
  }
}

.tools {
  display: grid;
  gap: 1rem;

  dt {
    display: block;
  }
}

.tools + .note {
  margin-top: 1rem;
}

.socials {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.colophon {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.25rem 2rem;
  padding-block: 1.25rem 2.5rem;
  border-top: 1px solid var(--rule);
  color: var(--muted);
  font-size: 0.9375rem;

  em {
    font-size: 0.8125rem;
  }
}

// the plate column goes first, then the margin folds into the text
@media (max-width: 1040px) {
  .section,
  .entry {
    grid-template-columns: var(--col-margin) minmax(0, 1fr);
  }

  .entry__plate {
    grid-column: 2;
    margin-top: 1.25rem;
    max-width: 26rem;
  }
}

@media (max-width: 640px) {
  .masthead {
    padding-bottom: 2.5rem;
  }

  .section,
  .entry {
    display: block;
  }

  .section {
    padding-bottom: 3rem;
  }

  .label + .section__body {
    margin-top: 0.5rem;
  }

  .entry__plate {
    max-width: none;
  }
}
</style>
