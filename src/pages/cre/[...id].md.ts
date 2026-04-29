import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { serializeFrontmatter } from "../../utils/markdown"

interface Props {
  entry: Awaited<ReturnType<typeof getCollection<"cre">>>[number]
}

export async function getStaticPaths() {
  const allEntries = await getCollection("cre")
  const pagesByPageId = new Map<string, any[]>()
  const standalonePages: any[] = []

  // Group entries by pageId or treat as standalone
  for (const entry of allEntries) {
    if (entry.data.pageId && entry.data.sdkLang) {
      if (!pagesByPageId.has(entry.data.pageId)) {
        pagesByPageId.set(entry.data.pageId, [])
      }
      pagesByPageId.get(entry.data.pageId)!.push(entry)
    } else {
      standalonePages.push(entry)
    }
  }

  const paths: Array<{
    params: { id: string }
    props: { entry: Awaited<ReturnType<typeof getCollection<"cre">>>[number] }
  }> = []

  // Create routes only for language-specific pages
  for (const entries of pagesByPageId.values()) {
    const goEntry = entries.find((e) => e.data.sdkLang === "go")
    const tsEntry = entries.find((e) => e.data.sdkLang === "ts")

    if (goEntry) {
      paths.push({
        params: { id: goEntry.id.replace(/\.(md|mdx)$/, "") },
        props: { entry: goEntry },
      })
    }

    if (tsEntry) {
      paths.push({
        params: { id: tsEntry.id.replace(/\.(md|mdx)$/, "") },
        props: { entry: tsEntry },
      })
    }
  }

  // Standalone pages
  standalonePages.forEach((entry) => {
    const routeId = entry.id.replace(/\.(md|mdx)$/, "")
    paths.push({
      params: { id: routeId },
      props: { entry },
    })
  })

  return paths
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
