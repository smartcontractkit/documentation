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

// Export a single `collections` object to register collections
export const collections = {
  "any-api": anyApiCollection,
}
