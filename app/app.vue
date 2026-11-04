<script setup lang="ts">
import { absoluteUrl, site } from "@/data/site";

const title = `${site.brand} — ${site.name}, ${site.role}`;
const shareImage = absoluteUrl("/og.png");

useHead({
  htmlAttrs: { lang: "en" },
  titleTemplate: (page) => (page ? `${page} — ${site.brand}` : title),
  link: [
    { rel: "canonical", href: absoluteUrl("/") },
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "preload", href: "/fonts/sourceserif4-roman.woff2", as: "font", type: "font/woff2", crossorigin: "" },
    { rel: "preload", href: "/fonts/meaculpa-regular.woff2", as: "font", type: "font/woff2", crossorigin: "" },
  ],
  script: [
    // before first paint, so a saved theme never flashes the other one
    {
      innerHTML:
        "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
      tagPosition: "head",
    },
  ],
});

useSeoMeta({
  description: site.description,
  ogTitle: title,
  ogDescription: site.description,
  ogType: "website",
  ogSiteName: site.brand,
  ogUrl: absoluteUrl("/"),
  ogImage: shareImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${site.brand}: ${site.name}, ${site.role} in ${site.location}`,
  twitterCard: "summary_large_image",
  twitterImage: shareImage,
  twitterSite: "@thisKehinde",
});
</script>

<template>
  <NuxtPage />
</template>
