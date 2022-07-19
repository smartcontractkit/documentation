import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import embeds from "astro-embed/integration";

export default defineConfig({
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
    embeds(),
    AutoImport({
      imports: [
        // Import a component’s default export
        // generates:
        // import A from './src/components/A.astro';
        "./src/components/CodeSample/CodeSample.astro",
        {
          // Import a module’s named exports
          // generates:
          // import { Tweet, YouTube } from 'astro-embed';
          "astro-embed": ["Tweet", "YouTube"],
        },
      ],
    }),
  ],
  markdown: {
    // Example: The default set of remark plugins used by Astro
    remarkPlugins: ["remark-gfm", "remark-smartypants"],
  },
});
