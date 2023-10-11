/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeWrapAll from "rehype-wrap-all"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
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
      rehypeSlug as any,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ] as any,
      // Wrap tables in div with overflow supported
      [rehypeWrapAll, { selector: "table", wrapper: "div.overflow-wrapper" }],
    ],
    syntaxHighlight: "prism",
    smartypants: false,
  },
})
