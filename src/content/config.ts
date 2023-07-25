import { z, defineCollection } from "astro:content"

export const sectionEnum = z.enum([
  "anyApi",
  "global",
  "bif",
  "ccip",
  "automation",
  "chainlinkFunctions",
  "nodeOperator",
  "dataFeeds",
  "gettingStarted",
  "legacy",
  "vrf",
])

const baseFrontmatter = z
  .object({
    section: sectionEnum,
    date: z.string().optional(),
    title: z.string(),
    whatsnext: z.record(z.string(), z.string()).optional(),
    isMdx: z.boolean().optional(),
    isIndex: z.boolean().optional(),
    metadata: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z
          .object({
            0: z.string(),
          })
          .optional(),
        linkToWallet: z.boolean().optional(),
      })
      .optional(),
    excerpt: z.string().optional(),
    datafeedtype: z.string().optional(),
  })
  .strict()

const baseCollection = defineCollection({
  type: "content",
  schema: baseFrontmatter,
})

const anyApiCollection = baseCollection
const architectureOverviewCollection = baseCollection
const bifCollection = baseCollection
const chainlinkAutomationCollection = baseCollection
const chainlinkFunctionsCollection = baseCollection
const chainlinkNodesCollection = baseCollection
const dataFeedsCollection = baseCollection
const gettingStartedCollection = baseCollection
const resourcesCollection = baseCollection
const vrfCollection = baseCollection
const ccipCollection = baseCollection

export const collections = {
  "any-api": anyApiCollection,
  "architecture-overview": architectureOverviewCollection,
  "blockchain-integrations-framework": bifCollection,
  "chainlink-automation": chainlinkAutomationCollection,
  "chainlink-functions": chainlinkFunctionsCollection,
  "chainlink-nodes": chainlinkNodesCollection,
  "data-feeds": dataFeedsCollection,
  "getting-started": gettingStartedCollection,
  resources: resourcesCollection,
  vrf: vrfCollection,
  ccip: ccipCollection,
}
