import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import yaml from "yaml"

interface Props {
  entry: Awaited<ReturnType<typeof getCollection<"ccip">>>[number]
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
  const ccipEntries = await getCollection("ccip")
  const pathMap = new Map()

  for (const entry of ccipEntries) {
    const urlPath = entry.id.replace(/\.(md|mdx)$/, "")

    if (urlPath.startsWith("directory/") || urlPath.startsWith("tutorials/")) {
      continue
    }

    if (urlPath.includes("/api-reference/") && urlPath.includes("/v")) {
      const parts = urlPath.split("/")
      const versionIndex = parts.findIndex((part) => part.startsWith("v") && /^v\d+$/.test(part))

      if (versionIndex !== -1) {
        const versionPart = parts[versionIndex]

        if (versionPart.length === 4) {
          const formattedVersion = `v${versionPart[1]}.${versionPart[2]}.${versionPart[3]}`
          parts[versionIndex] = formattedVersion
          pathMap.set(parts.join("/"), entry)
        } else {
          pathMap.set(urlPath, entry)
        }
      } else {
        pathMap.set(urlPath, entry)
      }
    } else {
      pathMap.set(urlPath, entry)
    }
  }

  return Array.from(pathMap.entries()).map(([urlPath, entry]) => ({
    params: { id: urlPath },
    props: { entry },
  }))
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
