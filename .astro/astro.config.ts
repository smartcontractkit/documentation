import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import react from "@astrojs/react"
import { astroCallouts } from "./integrations/astro-callouts"
import { solidityRemixCode } from "./integrations/solidity-remix"
import mdx from "@astrojs/mdx"

import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  legacy: {
    astroFlavoredMarkdown: true,
  },
  integrations: [
    preact(),
    react(),
    sitemap(),
    mdx(),
    astroCallouts(),
    solidityRemixCode(),
  ],
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-smartypants", "remark-directive"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "prepend",
        },
      ],
    ],
  },
})
