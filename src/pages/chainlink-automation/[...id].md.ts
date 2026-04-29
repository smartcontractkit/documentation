import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import yaml from "yaml"

interface Props {
  entry: Awaited<ReturnType<typeof getCollection<"chainlink-automation">>>[number]
}

function normalizeFrontmatterValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map(normalizeFrontmatterValue)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeFrontmatterValue(nestedValue)])
    )
  }

  return value
}

function serializeFrontmatter(data: Record<string, unknown>) {
  const normalized = normalizeFrontmatterValue(data)

  if (!normalized || typeof normalized !== "object" || Object.keys(normalized).length === 0) {
    return ""
  }

  return `---\n${yaml.stringify(normalized).trimEnd()}\n---\n\n`
}

export async function getStaticPaths() {
  const chainlinkAutomationEntries = await getCollection("chainlink-automation")

  return chainlinkAutomationEntries.map((entry) => {
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
