import { z, defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { sectionValues } from "./config/sidebarSections.js"

enum Products {
  CCIP = "ccip",
  AUTOMATION = "automation",
  FUNCTIONS = "functions",
  VRF = "vrf",
  FEEDS = "feeds",
  GENERAL = "general",
  CHAINLINK_LOCAL = "chainlink-local",
}

export const productsInfo: Record<Products, { name: string; slug: string }> = {
  ccip: { name: "CCIP", slug: "ccip" },
  automation: { name: "Automation", slug: "chainlink-automation" },
  functions: { name: "Functions", slug: "chainlink-functions" },
  vrf: { name: "VRF", slug: "vrf" },
  feeds: { name: "Data Feeds", slug: "data-feeds" },
  general: { name: "General", slug: "/" },
  "chainlink-local": { name: "Chainlink Local", slug: "chainlink-local" },
}

const productEnum = z.preprocess((val) => (val as string).toLowerCase(), z.nativeEnum(Products))

const sectionEnum = z.enum(sectionValues)
export type Sections = z.infer<typeof sectionEnum>

/** metadata object */
const metadata = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    linkToWallet: z.boolean().optional(),
    canonical: z.string().optional(),
    excerpt: z.string().optional(),
  })
  .optional()

/** Base frontmatter for all standard docs */
const baseFrontmatter = z
  .object({
    section: sectionEnum,
    date: z.string().optional(),
    title: z.string(),
    whatsnext: z.record(z.string(), z.string()).optional(),
    isMdx: z.boolean().optional(),
    isIndex: z.boolean().optional(),
    metadata,
    datafeedtype: z.string().optional(),
    fileExtension: z.string().optional(),
  })
  .strict()

/** Different schema for quickstarts */
const quickstartsFrontmatter = z
  .object({
    title: z.string(),
    description: z.string(),
    githubSourceCodeUrl: z.string().optional(),
    image: z.string(),
    products: z.array(productEnum),
    time: z.string(),
    requires: z.string().optional(),
  })
  .strict()

/** Re-export for convenience */
export type BaseFrontmatter = z.infer<typeof baseFrontmatter>
export type QuickstartsFrontmatter = z.infer<typeof quickstartsFrontmatter>
export type Metadata = z.infer<typeof metadata>

/** --------------------------
 *  Define each collection with loader: glob()
 * -------------------------- */

const ccipCollection = defineCollection({
  loader: glob({
    base: "./src/content/ccip",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const dataFeedsCollection = defineCollection({
  loader: glob({
    base: "./src/content/data-feeds",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const chainlinkAutomationCollection = defineCollection({
  loader: glob({
    base: "./src/content/chainlink-automation",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const chainlinkFunctionsCollection = defineCollection({
  loader: glob({
    base: "./src/content/chainlink-functions",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const chainlinkNodesCollection = defineCollection({
  loader: glob({
    base: "./src/content/chainlink-nodes",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const dataStreamsCollection = defineCollection({
  loader: glob({
    base: "./src/content/data-streams",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const resourcesCollection = defineCollection({
  loader: glob({
    base: "./src/content/resources",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const vrfCollection = defineCollection({
  loader: glob({
    base: "./src/content/vrf",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const chainlinkLocalCollection = defineCollection({
  loader: glob({
    base: "./src/content/chainlink-local",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

/** Quickstarts collection uses a different schema */
const quickstartsCollection = defineCollection({
  loader: glob({
    base: "./src/content/quickstarts",
    pattern: "**/*.md?(x)",
  }),
  schema: quickstartsFrontmatter,
})

const architectureOverviewCollection = defineCollection({
  loader: glob({
    base: "./src/content/architecture-overview",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const gettingStartedCollection = defineCollection({
  loader: glob({
    base: "./src/content/getting-started",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

const anyApiCollection = defineCollection({
  loader: glob({
    base: "./src/content/any-api",
    pattern: "**/*.md?(x)",
  }),
  schema: baseFrontmatter,
})

/** --------------------------
 *  Combine them all in `collections` export
 * -------------------------- */

export const collections = {
  ccip: ccipCollection,
  "data-feeds": dataFeedsCollection,
  "chainlink-automation": chainlinkAutomationCollection,
  "chainlink-functions": chainlinkFunctionsCollection,
  "chainlink-nodes": chainlinkNodesCollection,
  "data-streams": dataStreamsCollection,
  resources: resourcesCollection,
  vrf: vrfCollection,
  "chainlink-local": chainlinkLocalCollection,
  quickstarts: quickstartsCollection,
  "architecture-overview": architectureOverviewCollection,
  "getting-started": gettingStartedCollection,
  "any-api": anyApiCollection,
}

export type Collection = keyof typeof collections
