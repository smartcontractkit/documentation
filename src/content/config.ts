import { z, defineCollection } from "astro:content"

// Define a `type` and `schema` for each collection
const anyApiCollection = defineCollection({
  type: "content", // 'content' for Markdown
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      isMdx: z.boolean(),
      permalink: z.string(),
      whatsnext: z.object({}).optional(),
      metadata: z
        .object({
          title: z.string(),
          description: z.string(),
          image: z.object({
            0: z.string(),
          }),
        })
        .optional(),
    })
    .strict(),
})
const architectureOverviewCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      permalink: z.string(),
      whatsnext: z.object({}).optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          image: z
            .object({
              0: z.string(),
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
})
const bifCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      isIndex: z.boolean(),
    })
    .strict(),
})
const chainlinkAutomationCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      section: z.string(),
      date: z.string(),
      title: z.string(),
      whatsnext: z.object({}).optional(),
      isMdx: z.boolean().optional(),
    })
    .strict(),
})
// Export a single `collections` object to register collections
export const collections = {
  "any-api": anyApiCollection,
  "architecture-overview": architectureOverviewCollection,
  "blockchain-integrations-framework": bifCollection,
  "chainlink-automation": chainlinkAutomationCollection,
}
