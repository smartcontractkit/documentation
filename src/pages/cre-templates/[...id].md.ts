import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { serializeFrontmatter } from "../../utils/markdown"

interface Props {
  entry: Awaited<ReturnType<typeof getCollection<"cre-templates">>>[number]
}

export async function getStaticPaths() {
  const creTemplatesEntries = await getCollection("cre-templates")

  return creTemplatesEntries.map((entry) => {
    const routeId = entry.id.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "")

    return {
      params: { id: routeId },
      props: { entry },
    }
  })
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as Props

  const frontmatter = serializeFrontmatter(entry.data)

  return new Response(`${frontmatter}${entry.body ?? ""}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
