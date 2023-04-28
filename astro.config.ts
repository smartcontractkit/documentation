import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import mdx from "@astrojs/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  // trailingSlash: 'never',
  integrations: [preact({ compat: true }), sitemap({ changefreq: "daily" }), mdx()],
  markdown: {
    drafts: true,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
        },
      ],
    ],
    syntaxHighlight: "prism",
    smartypants: false,
    gfm: true,
  },
})
