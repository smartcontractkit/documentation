import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import { astroCallouts } from "./integrations/astro-callouts"
import { solidityRemixCode } from "./integrations/solidity-remix"
import { youtubeEmbed } from "./integrations/youtube-embed"
import mdx from "@astrojs/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link/",
  integrations: [
    preact({ compat: true }),
    sitemap({ changefreq: "daily" }),
    astroCallouts(),
    solidityRemixCode(),
    youtubeEmbed(),
    mdx(),
  ],
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
  },
})
