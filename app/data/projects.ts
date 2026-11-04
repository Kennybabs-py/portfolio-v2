export interface Project {
  slug: string;
  title: string;
  year: string;
  stack: string[];
  summary: string;
  /** shown behind the image while it loads */
  color: string;
  /** title colour on hover; keep it at 3:1+ contrast on both light and dark */
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
    url: "https://stadeo.app",
  },
  {
    slug: "sachet-pool",
    title: "sachet pool",
    year: "2026",
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
    url: "https://www.sachetpool.xyz",
  },
  {
    slug: "scholara",
    title: "scholara",
    year: "2024",
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
    url: "https://scholara.ng",
  },
  {
    slug: "fractal-visions",
    title: "fractal visions",
    year: "2023",
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
      "a multi-chain nft marketplace with a launchpad, for creators and for users getting into the blockchain market.",
    color: "#8b5cf6",
    accent: "#8a6dcc",
  },
];
