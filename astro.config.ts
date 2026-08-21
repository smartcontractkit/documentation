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
import jsxRendererTag from "./src/integrations/jsx-renderer-tag"
import redirectsJson from "./src/features/redirects/redirects.json"
import { extractCanonicalUrlsWithLanguageVariants } from "./src/utils/sidebar"
import remarkCodeFenceFilename from "./src/lib/markdown/remarkCodeFenceFilename"
import rehypeCodeSampleFences from "./src/lib/markdown/rehypeCodeSampleFences"

config() // Load .env file

// Files that opt into Preact via a `/** @jsxImportSource preact */` pragma.
// @astrojs/preact's Vite JSX transform claims every .tsx/.jsx file by default
// (regardless of its own pragma) unless scoped with `include`, and it wins the
// transform race over @astrojs/react's for a given file regardless of
// integration registration order — so every Preact file must be listed here
// and excluded from react() below, or files without the pragma silently get
// compiled with Preact's JSX runtime instead of React's.
//
// This is a file-path (resolved module id) list, NOT an import-specifier list
// — Vite's transform hook always receives the resolved absolute path, so this
// is unaffected by how a component is imported elsewhere (relative, `~/`,
// `@components/*` aliases, or a barrel file) — unlike SSR renderer selection
// at runtime (handled separately by the jsx-renderer-tag integration, which
// tags each component directly and doesn't need this list).
const preactFiles = [
  "**/components/Address.tsx",
  "**/ChainSelector/ChainSelector.tsx",
  "**/ChainSelector/ChainSelector.example.tsx",
  "**/components/CopyText.tsx",
  "**/components/DownloadButton.tsx",
  "**/Footer/NewsletterCTA.tsx",
  "**/Footer/NewsletterSignupForm.tsx",
  "**/Hexagon/Cube.tsx",
  "**/Hexagon/Hexagon.tsx",
  "**/Assets/ThumbDownIcon.tsx",
  "**/Assets/ThumbUpIcon.tsx",
  "**/PageContent/Feedback.tsx",
  "**/Quickstart/TableOfContents/TableOfContents.tsx",
  "**/SectionWrapper/SectionWrapper.tsx",
  "**/StickyHeader/StickyHeader.tsx",
  "**/components/TableOfContents/TableOfContents.tsx",
  "**/components/Tabs/Tabs.tsx",
  "**/components/Tabs/TabsContent.tsx",
  "**/billing/TokenCalculator.tsx",
  "**/billing/TokenCalculatorDropdown.tsx",
  "**/chainlink-automation/components/AutomationConfig.tsx",
  "**/chainlink-automation/components/NetworkIcons.tsx",
  "**/chainlink-functions/components/NetworkIcons.tsx",
  "**/Tooltip/SimplePreactTooltip.tsx",
  "**/ens/components/EnsLookupForm.tsx",
  "**/ens/components/EnsManualLookupForm.tsx",
  "**/feeds/components/ExpandableTableWrapper.tsx",
  "**/feeds/components/FeedList.tsx",
  "**/get-price/HistoricalPrice.tsx",
  "**/get-price/LatestPrice.tsx",
  "**/get-price/PriceButton.tsx",
  "**/pause-notice/CheckHeartbeat.tsx",
  "**/pause-notice/PauseNotice.tsx",
  "**/feeds/components/Tables.tsx",
  "**/landing/assets/VideoPlayerIcon.tsx",
  "**/landing/components/ProductCard.tsx",
  "**/landing/components/Tabs.tsx",
  "**/vrf/v2/components/CostTable.tsx",
  "**/vrf/v2/components/Dropdown.tsx",
  "**/vrf/v2/components/MethodCheckbox.tsx",
]

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
    trailingSlashMiddleware(),
    jsxRendererTag(),
    preact({
      include: preactFiles,
    }),
    react({
      exclude: preactFiles,
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

        // Exclude canonical URLs that have language-specific variants (from sidebar config)
        if (canonicalUrlsWithLanguageVariants.has(cleanPath)) {
          return false
        }

        // CCIP directory API v1 interactive page: noindex + omit from sitemap to avoid competing with CCIP Tools REST (v2)
        if (cleanPath === "/api/ccip/v1/docs") {
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
    // Ensure our fence-meta parser runs for `.mdx` pages (in addition to `markdown.remarkPlugins`).
    mdx({
      remarkPlugins: [remarkCodeFenceFilename],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkCodeFenceFilename],
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
})
