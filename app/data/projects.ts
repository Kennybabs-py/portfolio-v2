export interface Project {
  slug: string;
  title: string;
  /** shown in the list and case study only when set */
  year?: string;
  role: string;
  stack: string[];
  summary: string;
  /** cover colour, shown behind the image while it loads (or instead of one) */
  color: string;
  /** path under public/, e.g. "/projects/my-site.jpg"; served via <NuxtImg> */
  image?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    slug: "scholara",
    title: "scholara",
    role: "full-stack engineering",
    stack: [
      "react",
      "vite",
      "typescript",
      "supabase",
      "openrouter api",
      "lenis",
      "gsap",
    ],
    summary:
      "ai study tools for students: flashcards generated from your notes, a 24/7 ai tutor, adaptive quizzes, and multiple explanations of the same answer.",
    color: "#0b2ad1",
    image: "/projects/scholara.jpg",
    url: "https://scholara.ng",
  },
  {
    slug: "stadeo",
    title: "stadeo",
    role: "full-stack engineering",
    stack: [
      "next.js",
      "typescript",
      "prisma",
      "postgresql",
      "neon",
      "circle wallets",
      "better-auth",
      "redis",
      "render",
      "docker",
      "vercel",
      "claude code",
    ],
    summary:
      "live football markets: back home, draw or away, then sell any time or hold to the whistle. claude code worked as my junior engineer.",
    color: "#0c1222",
    image: "/projects/stadeo.jpg",
    url: "https://stadeo.app",
  },
  {
    slug: "sachet-pool",
    title: "sachet pool",
    role: "full-stack engineering",
    stack: [
      "next.js",
      "typescript",
      "prisma",
      "postgresql",
      "neon",
      "better-auth",
      "viem",
      "wagmi",
      "rainbowkit",
      "cron jobs",
      "vercel",
      "claude code",
    ],
    summary:
      "a pari-mutuel football pool on robinhood chain: stake $sach on a result, winners split the pot by stake, and every settlement is verifiable on-chain. claude code as my assistant.",
    color: "#141414",
    image: "/projects/sachet.jpg",
    url: "https://www.sachetpool.xyz",
  },
];

export function findProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return null;

  return {
    project: projects[index]!,
    next: projects[(index + 1) % projects.length]!,
  };
}
