import { defineConfig } from "astro/config"
import preact from "@astrojs/preact"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeWrapAll from "rehype-wrap-all"
import sitemap from "@astrojs/sitemap"
import { RehypePlugins } from "@astrojs/markdown-remark"

// https://astro.build/config
export default defineConfig({
  site: "https://docs.chain.link",
  redirects: {
    "/getting-started": "/getting-started/conceptual-overview",
    "/resources": "/resources/link-token-contracts",
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
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "_astro/_entries/[name].[hash:22].mjs",
          chunkFileNames: "_astro/_chunks/[name].[hash:22].mjs",
          assetFileNames: "_astro/_assets/[name].[hash:22][extname]",
        },
      },
    },
  },
})
