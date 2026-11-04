// all site copy lives here, so text changes never touch page code
export type Platform = "email" | "x" | "linkedin" | "github";

export interface ContactLink {
  platform: Platform;
  href: string;
}

export const site = {
  name: "kehinde",
  // the mark: header home link, favicon, share image and page titles
  brand: "kay",
  // the live address: canonical links, share previews and the sitemap
  url: "https://kennybabs.xyz",
  role: "software engineer",
  location: "lagos, ng",
  timezone: "Africa/Lagos",
  description:
    "kehinde, a software engineer in lagos crafting web applications and sites for individuals, studios and companies.",

  email: "babalolakehinde74@gmail.com",
  socials: [
    { platform: "x", href: "https://x.com/thisKehinde" },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/in/kehinde-babalola/",
    },
    { platform: "github", href: "https://github.com/Kennybabs-py" },
  ] as ContactLink[],

  about: {
    // set large, at the top of the page
    lede: "i'm kehinde, a software engineer in lagos, ng. i build web applications and sites for individuals, studios and companies.",
    paragraphs: [
      "i work ai-native: claude code and codex are part of how i plan, write and ship software, and i stay accountable for every line that goes out. everything below i built end to end, from the database to the interface.",
      "away from the keyboard you'll find me playing snooker, fifa, or taking long walks in order to meet my luck.",
    ],
  },

  contact: {
    prompt: "got an idea worth building?",
    cta: "let's talk",
  },

  // the last line of the page
  closing: "the subtle art of balancing thought and function.",

  tools: {
    groups: [
      {
        label: "ai",
        items: ["claude code", "codex", "gemini", "aws bedrock", "vercel/eve"],
      },
      {
        label: "stack",
        items: [
          "javascript",
          "react.js",
          "typescript",
          "python",
          "next.js",
          "vue",
          "nuxt",
          "gsap",
          "lenis",
          "scss",
          "git/github",
          "vite/vitest",
          "prisma",
          "postgresql",
          "supabase",
          "neon",
          "redis",
          "docker",
        ],
      },
    ],
    note: "learning java",
  },
};

/** absolute url for a site path, without a trailing slash (except the root) */
export function absoluteUrl(path: string) {
  const clean = path !== "/" ? path.replace(/\/+$/, "") : "";
  return `${site.url}${clean}`;
}

/** email first, then the socials; rendered as icon links */
export const contactLinks: ContactLink[] = [
  ...(site.email
    ? [{ platform: "email" as const, href: `mailto:${site.email}` }]
    : []),
  ...site.socials,
];
