import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import embeds from "astro-embed/integration";
import { visit } from "unist-util-visit";
import { h } from "hastscript";

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
function myRemarkPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name !== "note") return;

        const data = node.data || (node.data = {});
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;
        console.log(data.properties);
        data.hProperties = h(tagName, { class: "note" }).properties;
      }
    });
  };
}

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
    remarkPlugins: [
      "remark-gfm",
      "remark-smartypants",
      "remark-directive",
      // myRemarkPlugin,
    ],
  },
});
