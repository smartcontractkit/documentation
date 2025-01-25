import { z, defineCollection } from "astro:content"

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

const sectionEnum = z.enum([
  "global",
  "ccip",
  "automation",
  "chainlinkFunctions",
  "nodeOperator",
  "dataFeeds",
  "dataStreams",
  "legacy",
  "vrf",
  "chainlinkLocal",
])

export type Sections = z.infer<typeof sectionEnum>

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

export type BaseFrontmatter = z.infer<typeof baseFrontmatter>
export type QuickstartsFrontmatter = z.infer<typeof quickstartsFrontmatter>
export type Metadata = z.infer<typeof metadata>

const baseCollection = defineCollection({
  type: "content",
  schema: baseFrontmatter,
})

const quickstartsCollection = defineCollection({
  type: "content",
  schema: quickstartsFrontmatter,
})

const architectureOverviewCollection = baseCollection
const chainlinkAutomationCollection = baseCollection
const chainlinkFunctionsCollection = baseCollection
const chainlinkNodesCollection = baseCollection
const dataFeedsCollection = baseCollection
const dataStreamsCollection = baseCollection
const resourcesCollection = baseCollection
const vrfCollection = baseCollection
const ccipCollection = baseCollection

export const collections = {
  "architecture-overview": architectureOverviewCollection,
  "chainlink-automation": chainlinkAutomationCollection,
  "chainlink-functions": chainlinkFunctionsCollection,
  "chainlink-nodes": chainlinkNodesCollection,
  "data-feeds": dataFeedsCollection,
  "data-streams": dataStreamsCollection,
  quickstarts: quickstartsCollection,
  resources: resourcesCollection,
  vrf: vrfCollection,
  ccip: ccipCollection,
  "chainlink-local": baseCollection,
}

export type Collection = keyof typeof collections
