import { config } from "dotenv"
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
import redirectsJson from "./src/features/redirects/redirects.json"
import tailwind from "@astrojs/tailwind"

config() // Load .env file
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
  trailingSlash: "never",
  redirects: {
    "/ccip/directory": "/ccip/directory/mainnet",
    "/ccip/supported-networks": "/ccip/directory/mainnet",
    "/getting-started": "/getting-started/conceptual-overview",
    "/resources": "/resources/link-token-contracts",
    ...ccipRedirects,
  },
  integrations: [
    tailwind(),
    trailingSlashMiddleware(),
    preact({
      include: ["**/preact/*"],
    }),
    react({
      include: ["**/react/*"],
    }),
    sitemap({
      changefreq: "daily",
      customPages: [
        "https://docs.chain.link/llms.txt",
        "https://docs.chain.link/vrf/llms-full.txt",
        "https://docs.chain.link/ccip/llms-full.txt",
        "https://docs.chain.link/data-feeds/llms-full.txt",
        "https://docs.chain.link/data-streams/llms-full.txt",
        "https://docs.chain.link/chainlink-functions/llms-full.txt",
        "https://docs.chain.link/chainlink-automation/llms-full.txt",
        "https://docs.chain.link/resources/llms-full.txt",
        "https://docs.chain.link/architecture-overview/llms-full.txt",
        "https://docs.chain.link/getting-started/llms-full.txt",
        "https://docs.chain.link/chainlink-nodes/llms-full.txt",
        "https://docs.chain.link/chainlink-local/llms-full.txt",
      ],
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
    build: {
      target: "esnext", // Use latest ES features, no transpilation for modern browsers
      // Optimize CSS delivery
      cssMinify: true,
      // Increase the threshold for inlining assets to reduce render-blocking CSS
      assetsInlineLimit: 20000, // Inline CSS files up to 20KB to eliminate render-blocking
      // Removed manual chunking to prevent serverless function bloat
      // rollupOptions: {
      //   output: {
      //     manualChunks: ...
      //   }
      // },
    },
    esbuild: {
      target: "esnext", // Match build target for consistency
    },
    css: {
      devSourcemap: false,
    },
  },
  legacy: {
    collections: false,
  },
})
