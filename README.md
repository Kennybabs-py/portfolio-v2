# PORTFOLIO V2

kehinde's portfolio, built with Nuxt 4.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## Editing content

You shouldn't need to touch page code to change what the site says.

| What | Where |
| --- | --- |
| All copy (about, tools, contact, email, socials) | `app/data/site.ts` |
| Projects (title, year, stack, summary, colours, link) | `app/data/projects.ts` |
| Project screenshots | `public/projects/`, then set `image: "/projects/name.jpg"` on the project |

Projects show in the order they're listed (newest first). A project without an
`image` has no plate; one without a `url` has no link. A project's `accent` is its
title colour on hover: keep it at 3:1 contrast or better on both themes.

## Design

The site is one page, set like a printed catalogue: labels and years hang in the
left margin, text sits in a reading column, screenshots sit in the right column.

- Colours, grid and light/dark themes: the top of `app/assets/css/main.scss`; the toggle is
  `app/components/ThemeToggle.vue`, and the site follows the device until a visitor chooses
- Layout: `app/pages/index.vue`
- Fonts are self-hosted in `public/fonts/` (Source Serif 4, Mea Culpa for the mark)
- Nothing animates apart from smooth anchor scrolling, which respects reduced motion
