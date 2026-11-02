import { projects } from "../../app/data/projects";
import { absoluteUrl } from "../../app/data/site";

// every page, with each project's case study pulled from the project list,
// so adding a project adds it here too
export default defineEventHandler((event) => {
  const paths = [
    "/",
    "/projects",
    "/info",
    ...projects.map((project) => `/projects/${project.slug}`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`)
    .join("\n");

  setHeader(event, "content-type", "application/xml; charset=utf-8");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
});
