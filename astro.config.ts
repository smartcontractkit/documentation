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
import type { AstroIntegration, RehypePlugins } from "astro"
import { unified } from "@astrojs/markdown-remark"
import yaml from "@rollup/plugin-yaml"
import { fileURLToPath } from "node:url"
import { ccipRedirects } from "./src/config/redirects/ccip"
import trailingSlashMiddleware from "./src/integrations/trailing-slash-middleware"
import redirectsJson from "./src/features/redirects/redirects.json"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import { extractCanonicalUrlsWithLanguageVariants } from "./src/utils/sidebar"
import { preactModulesMatcher } from "./src/utils/preactModules"
import { isSunsetDocsPath, SUNSET_PAGES_STAY_IN_SITEMAP } from "./src/config/sunset"
import remarkCodeFenceFilename from "./src/lib/markdown/remarkCodeFenceFilename"
import remarkCodeFenceLanguageAlias from "./src/lib/markdown/remarkCodeFenceLanguageAlias"
import remarkPrismTolk from "./src/lib/markdown/prismTolk"
import rehypeCodeSampleFences from "./src/lib/markdown/rehypeCodeSampleFences"

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

// Extract canonical URLs that have language-specific variants from sidebar config
// These redirect pages should NOT be in the sitemap
// Only the actual content pages (-go, -ts) are indexed
const canonicalUrlsWithLanguageVariants = extractCanonicalUrlsWithLanguageVariants()

// Preact files (`@jsxImportSource preact` pragma) and the barrels that only re-export them; everything else is React
const preactModules = preactModulesMatcher(fileURLToPath(new URL(".", import.meta.url)))

/** Dev-only gallery: injected only under `astro dev`, so builds never see it. */
const devOnlyComponentGallery: AstroIntegration = {
  name: "dev-only-component-gallery",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command === "dev") {
        injectRoute({ pattern: "/dev/components", entrypoint: "./src/dev/gallery.astro" })
      }
    },
  },
}

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  trailingSlash: "never",
  // Prefetch internal links so client-side navigations (ClientRouter) feel instant.
  // "hover" (not "viewport") avoids prefetching the hundreds of links in the docs sidebar at once.
  //
  // NOTE (Astro 5 -> 7 upgrade): `prefetch` and `<ClientRouter />` are stable in Astro 5 and remain
  // the supported API in Astro 6/7, so this config carries over unchanged. The one thing to revisit
  // is `patches/astro+5.18.2.patch` (dev-server module-graph perf fix): it is pinned to 5.18.2 and
  // will fail to apply after the upgrade. Check whether the upstream fix has landed by then; if not,
  // regenerate the patch against the new version with `npx patch-package astro`.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  redirects: {
    "/ccip/directory": "/ccip/directory/mainnet",
    "/ccip/supported-networks": "/ccip/directory/mainnet",
    "/getting-started": "/getting-started/conceptual-overview",
    "/resources": "/resources/link-token-contracts",
    "/chainlink-platform": "/chainlink-platform/getting-started",
    "/chainlink-platform/overview": "/chainlink-platform/getting-started",
    ...ccipRedirects,
  },
  integrations: [
    devOnlyComponentGallery,
    trailingSlashMiddleware(),
    preact({
      include: [preactModules],
    }),
    react({
      // Also keep node_modules out: a custom `exclude` replaces @vitejs/plugin-react's default node_modules exclusion
      exclude: [preactModules, /\/node_modules\//],
    }),
    sitemap({
      changefreq: "daily",
      customPages: [
        "https://docs.chain.link/llms.txt",
        "https://docs.chain.link/ace/llms-full.txt",
        "https://docs.chain.link/cre/go/llms-full.txt",
        "https://docs.chain.link/cre/ts/llms-full.txt",
        "https://docs.chain.link/vrf/llms-full.txt",
        "https://docs.chain.link/ccip/llms-full.txt",
        "https://docs.chain.link/data-feeds/llms-full.txt",
        "https://docs.chain.link/data-streams/llms-full.txt",
        "https://docs.chain.link/dta-technical-standard/llms-full.txt",
        "https://docs.chain.link/datalink/llms-full.txt",
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

        // Sunset pages stay listed for now so a crawler can recrawl and read noindex.
        // Flip SUNSET_PAGES_STAY_IN_SITEMAP to false after a few weeks.
        if (!SUNSET_PAGES_STAY_IN_SITEMAP && isSunsetDocsPath(cleanPath)) {
          return false
        }

        // Exclude short format API reference URLs (e.g., /api-reference/v150, /ccip/evm/api-reference/v150)
        // These are aliases for versioned content - we keep only the canonical long format URLs
        const shortVersionPattern = /\/api-reference\/(?:.*\/)?v\d{3,4}(?:\/|$)/
        if (shortVersionPattern.test(cleanPath)) {
          return false
        }

        // Exclude canonical URLs that have language-specific variants (from sidebar config)
        if (canonicalUrlsWithLanguageVariants.has(cleanPath)) {
          return false
        }

        // CCIP directory API v1 interactive page: noindex + omit from sitemap to avoid competing with CCIP Tools REST (v2)
        if (cleanPath === "/api/ccip/v1/docs") {
          return false
        }

        // Old v1 glossary. The URL stays. It is not a current product page.
        if (cleanPath === "/resources/glossary") {
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
    // Inherits the remark/rehype plugins of `markdown.processor`
    mdx(),
  ],
  markdown: {
    // Unified (remark/rehype) pipeline for `.md` and `.mdx`: Astro 7's default Sätteri processor doesn't run these plugins
    processor: unified({
      remarkPlugins: [remarkCodeFenceFilename, remarkCodeFenceLanguageAlias, remarkPrismTolk],
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
        rehypeCodeSampleFences,
      ] as RehypePlugins,
      smartypants: false,
    }),
    syntaxHighlight: "prism",
  },
  // HTML whitespace rules, as before Astro 7 (its 'jsx' default drops whitespace between inline elements)
  compressHTML: true,
  // output: 'static' (fully static or partial SSR with `prerender = false` ==> export const prerender = false;)
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [yaml()],
    build: {
      target: "esnext", // Use latest ES features, no transpilation for modern browsers
      // Optimize CSS delivery. esbuild, as before Vite 8: its default LightningCSS minifier merges
      // `backdrop-filter` + `-webkit-backdrop-filter` into the last one, dropping the blur in Chrome/Firefox
      cssMinify: "esbuild",
      // Increase the threshold for inlining assets to reduce render-blocking CSS
      assetsInlineLimit: 20000, // Inline CSS files up to 20KB to eliminate render-blocking
      // Removed manual chunking to prevent serverless function bloat
      // rollupOptions: {
      //   output: {
      //     manualChunks: ...
      //   }
      // },
    },
    oxc: {
      target: "esnext", // Match build target for consistency
    },
    css: {
      devSourcemap: false,
      // Tailwind 3 runs through PostCSS directly (formerly wired by the deprecated @astrojs/tailwind integration)
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  },
})
