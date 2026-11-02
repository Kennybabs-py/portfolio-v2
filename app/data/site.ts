// all site copy lives here, so text changes never touch page code
export const site = {
  name: "kehinde",
  role: "software engineer",
  tagline: "dev. studio",
  location: "lagos, ng",
  timezone: "Africa/Lagos",
  description:
    "kehinde, a software engineer in lagos crafting web applications and sites for individuals, studios and companies.",

  // TODO: fill these in; the contact block only renders what is set
  email: "",
  socials: [] as { label: string; href: string }[],

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

  tools: ["typescript", "vue", "nuxt", "gsap", "lenis", "scss"],
};
