import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import embeds from "astro-embed/integration";
import { cllAdmonitions } from "./src/lib/remark/admonitions.mjs";

export default defineConfig({
  site: "https://docs.chain.link",
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
    embeds(),
    AutoImport({
      imports: [
        "./src/components/CodeSample/CodeSample.astro",
        {
          "astro-embed": ["Tweet", "YouTube"],
        },
      ],
    }),
  ],
  markdown: {
    // Example: The default set of remark plugins used by Astro
    remarkPlugins: [
      "remark-gfm",
      "remark-smartypants",
      "remark-directive",
      cllAdmonitions,
    ],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "prepend" }],
    ],
  },
});
