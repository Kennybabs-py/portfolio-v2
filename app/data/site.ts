// all site copy lives here, so text changes never touch page code
export type Platform = "email" | "x" | "linkedin";

export interface ContactLink {
  platform: Platform;
  href: string;
}

export const site = {
  name: "kehinde",
  role: "software engineer",
  tagline: "dev. studio",
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
  ] as ContactLink[],

  hero: {
    greeting: "hi, i'm kehinde.",
    motto: "build, iterate, build, repeat",
    // each entry is one line of the headline
    headline: ["a software", "engineer"],
    // segments with `to` render as links
    intro: [
      { text: "who resides in lagos, ng. i use " },
      { text: "tools", to: "/info#tools" },
      {
        text: " to craft web applications and sites for individuals, studios, and companies. i enjoy playing snooker, fifa and taking long walks in order to meet my luck.",
      },
    ] as { text: string; to?: string }[],
    closing: "the subtle art of balancing thoughts and function",
  },

  info: {
    statement:
      "i'm kehinde, a software engineer in lagos, ng. i craft web applications and sites for individuals, studios, and companies, balancing thought and function, and sweating the motion in between.",
  },

  footer: {
    eyebrow: "got an idea worth building?",
    cta: "let's talk",
  },

  tools: {
    groups: [
      {
        label: "ai",
        items: ["claude code", "codex", "gemini", "aws bedrock"],
      },
      {
        label: "stack",
        items: [
          "javascript",
          "typescript",
          "python",
          "next.js",
          "vue",
          "nuxt",
          "gsap",
          "lenis",
          "scss",
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

/** email first, then the socials; rendered as icon links */
export const contactLinks: ContactLink[] = [
  ...(site.email
    ? [{ platform: "email" as const, href: `mailto:${site.email}` }]
    : []),
  ...site.socials,
];
