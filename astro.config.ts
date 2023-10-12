import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import rehypeWrapAll from "rehype-wrap-all"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  // trailingSlash: 'never',
  integrations: [preact(), react(), sitemap({ changefreq: "daily" }), mdx()],
  markdown: {
    drafts: true,
    rehypePlugins: [
      // Wrap tables in div with overflow supported
      [rehypeWrapAll, { selector: "table", wrapper: "div.overflow-wrapper" }],
    ],
    syntaxHighlight: "prism",
    smartypants: false,
    gfm: true,
  },
})
