# PORTFOLIO V2

kehinde's portfolio, built with Nuxt 4, GSAP and Lenis.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## Editing content

You shouldn't need to touch page code to change what the site says.

| What | Where |
| --- | --- |
| All copy (hero, info statement, footer, tools, email, socials) | `app/data/site.ts` |
| Projects (title, year, stack, summary, colours, link) | `app/data/projects.ts` |
| Project screenshots | `public/projects/`, then set `image: "/projects/name.jpg"` on the project |

Projects show in the order they're listed (newest first). A project without an
`image` shows its name on its `color`; one without a `url` has no "visit site" link.
Keep a project's `accent` (its title colour) at 3:1 contrast or better on both the
light and dark backgrounds.

## Design tokens

- Colours, fonts and the type scale: `app/assets/css/_variables.scss` and the
  `:root` block in `app/assets/css/main.scss`
- Fonts are self-hosted in `public/fonts/` (Anton, Lato, Instrument Serif, Mea Culpa)
- Motion timings and eases: `app/lib/motion.ts`

## Moving parts

- **Page transitions**: `app/app.vue`. The old page lifts away with a curved bottom edge.
  Scroll restoring on back/forward lives in `app/router.options.ts`.
- **Loader**: `app/components/PageLoader.vue`, shown once per browser session.
- **Text reveals**: `app/lib/reveal.ts`. Add `data-scroll-reveal` (`lines`, `words`,
  `chars` or `fade`) to any element to reveal it on scroll.
- **Header football**: `app/components/app-layout/HeaderBall.vue`. The physics
  constants at the top tune how it falls, bounces and gets kicked.
- **Cursor**: `app/components/Cursor.vue`. `data-cursor="label"` shows a label,
  `data-magnetic` pulls an element towards the pointer.
