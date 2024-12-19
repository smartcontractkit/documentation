import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel/serverless"
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
    preact({
      include: ["**/preact/*"],
    }),
    react({
      include: ["**/react/*"],
    }),
    sitemap({ changefreq: "daily" }),
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
  output: "hybrid",
  adapter: vercel(),
  vite: {
    plugins: [yaml()],
  },
})
