export interface Project {
  slug: string;
  title: string;
  year: string;
  role: string;
  stack: string[];
  summary: string;
  /** cover colour, shown behind the image while it loads (or instead of one) */
  color: string;
  /** path under public/, e.g. "/projects/my-site.jpg"; served via <NuxtImg> */
  image?: string;
  url?: string;
}

// TODO: placeholders, replace with real work before launch
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "project one",
    year: "2026",
    role: "design & development",
    stack: ["nuxt", "gsap", "lenis"],
    summary:
      "placeholder case study. describe the brief, what you built and the result in two or three sentences.",
    color: "#ff4e1f",
  },
  {
    slug: "project-two",
    title: "project two",
    year: "2025",
    role: "frontend development",
    stack: ["vue", "typescript", "scss"],
    summary:
      "placeholder case study. describe the brief, what you built and the result in two or three sentences.",
    color: "#3c76f1",
  },
  {
    slug: "project-three",
    title: "project three",
    year: "2025",
    role: "development",
    stack: ["nuxt", "tailwind"],
    summary:
      "placeholder case study. describe the brief, what you built and the result in two or three sentences.",
    color: "#15c077",
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
