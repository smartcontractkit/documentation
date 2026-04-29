import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { serializeFrontmatter } from "../../utils/markdown" // use shared util if you created it

interface Props {
  entry: Awaited<ReturnType<typeof getCollection<"chainlink-nodes">>>[number]
}

export async function getStaticPaths() {
  const chainlinkNodesEntries = await getCollection("chainlink-nodes")

  return chainlinkNodesEntries.map((entry) => {
    const routeId = entry.id.replace(/\.(md|mdx)$/, "")

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
