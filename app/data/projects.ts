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
  /** title colour; keep it at 3:1+ contrast on both paper and ink */
  accent: string;
  /** path under public/, e.g. "/projects/my-site.jpg"; served via <NuxtImg> */
  image?: string;
  url?: string;
}

// newest first
export const projects: Project[] = [
  {
    slug: "stadeo",
    title: "stadeo",
    year: "2026",
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
    accent: "#af7430",
    image: "/projects/stadeo.jpg",
    url: "https://stadeo.app"
  },
  {
    slug: "sachet-pool",
    title: "sachet pool",
    year: "2026",
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
    accent: "#2b8163",
    image: "/projects/sachet.jpg",
    url: "https://www.sachetpool.xyz"
  },
  {
    slug: "scholara",
    title: "scholara",
    year: "2024",
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
    accent: "#6475d7",
    image: "/projects/scholara.jpg",
    url: "https://scholara.ng"
  },
  {
    slug: "fractal-visions",
    title: "fractal visions",
    year: "2023",
    role: "full-stack engineering",
    stack: [
      "next.js",
      "typescript",
      "postgresql",
      "supabase",
      "thirdweb",
      "alchemy apis",
      "viem",
      "upstash redis",
      "vercel",
    ],
    summary:
      "a multi-chain nft marketplace with a launchpad, for creators and for users getting into the blockchain market. paused when the company behind it ran into funding issues.",
    color: "#8b5cf6",
    accent: "#8a6dcc",
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
