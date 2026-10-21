import type { Solution } from "./types.ts"

export const demoSinglePage: Solution = {
  slug: "demo-single-page",
  title: "Demo: Single Page Solution",
  description: "Fixture proving the single-page layout: no left navigation, centred content, summary block.",
  products: ["ccip"],
  categories: ["demo"],
  datePublished: "2026-09-08",
  hidden: true,
  // No `nav`. One page means no sidebar.
}
