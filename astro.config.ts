import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import preact from "@astrojs/preact"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeWrapAll from "rehype-wrap-all"
import sitemap from "@astrojs/sitemap"
import { RehypePlugins } from "@astrojs/markdown-remark"
import yaml from "@rollup/plugin-yaml"
import { ccipRedirects } from "./src/config/redirects/ccip"
import trailingSlashMiddleware from "./src/integrations/trailing-slash-middleware"
import { getLastModifiedDate } from "./src/utils/lastModified"
import redirectsJson from "./src/features/redirects/redirects.json"

// Prepare set of redirect source URLs to exclude from sitemap
// This prevents duplicate entries and ensures only canonical URLs are indexed
const redirectSources = new Set(
  redirectsJson.redirects
    .map((r) => r.source)
    .filter((source) => source)
    .map((source) => {
      const normalized = source.startsWith("/") ? source : `/${source}`
      return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized
    })
)

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  redirects: {
    "/ccip/directory": "/ccip/directory/mainnet",
    "/ccip/supported-networks": "/ccip/directory/mainnet",
    "/getting-started": "/getting-started/conceptual-overview",
    "/resources": "/resources/link-token-contracts",
    ...ccipRedirects,
  },
  integrations: [
    trailingSlashMiddleware(),
    preact({
      include: ["**/preact/*"],
    }),
    react({
      include: ["**/react/*"],
    }),
    sitemap({
      changefreq: "daily",
      filter: (page) => {
        // Exclude redirect source URLs from sitemap to prevent duplicates
        const pathname = new URL(page).pathname
        const cleanPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname

        // Exclude short format API reference URLs (e.g., /api-reference/v150, /ccip/api-reference/evm/v150)
        // These are aliases for versioned content - we keep only the canonical long format URLs
        const shortVersionPattern = /\/api-reference\/(?:.*\/)?v\d{3,4}(?:\/|$)/
        if (shortVersionPattern.test(cleanPath)) {
          return false
        }

        return !redirectSources.has(cleanPath)
      },
      serialize(item) {
        // Remove trailing slash from URLs (except for root)
        const url = new URL(item.url)
        if (url.pathname.endsWith("/") && url.pathname !== "/") {
          url.pathname = url.pathname.slice(0, -1)
          item.url = url.toString()
        }

        // Add last modified date using git commit history
        // Supports content files, API reference pages, and CCIP directory pages
        const path = url.pathname
        const lastModified = getLastModifiedDate(path)
        if (lastModified) {
          item.lastmod = lastModified.toISOString()
        }

        return item
      },
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug, // Required for autolink to work properly
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
      // Wrap tables in div with overflow supported
      [rehypeWrapAll, { selector: "table", wrapper: "div.overflow-wrapper" }],
    ] as RehypePlugins,
    syntaxHighlight: "prism",
    smartypants: false,
  },
  // output: 'static' (fully static or partial SSR with `prerender = false` ==> export const prerender = false;)
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [yaml()],
  },
  legacy: {
    collections: false,
  },
})
