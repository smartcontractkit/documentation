import fs from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, "src", "content")
const OUT_DIR = path.join(ROOT, "src", "pages")

const PRODUCTS = [
  "ccip",
  "chainlink-local",
  "vrf",
  "data-feeds",
  "data-streams",
  "chainlink-functions",
  "chainlink-automation",
  "chainlink-nodes",
]

function dottedFromCompact(version: string) {
  if (!/^v\d{3,}$/.test(version)) return version
  const digits = version.slice(1)
  if (digits.length < 3) return version
  return `v${digits[0]}.${digits[1]}.${digits.slice(2)}`
}

function compactFromDotted(version: string) {
  return /^v\d+\.\d+\.\d+$/.test(version) ? version.replace(/\./g, "") : version
}

function normalize(p: string) {
  return p.replace(/\\/g, "/")
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results: string[] = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      results.push(...(await walk(full)))
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      results.push(full)
    }
  }

  return results
}

function toPublicRoute(product: string, filePath: string) {
  const rel = normalize(path.relative(path.join(CONTENT_DIR, product), filePath))

  if (!rel.startsWith("api-reference/")) return null

  const noExt = rel.replace(/\.mdx?$/, "")
  const noIndex = noExt.replace(/\/index$/, "")
  const route = noIndex.replace(/^api-reference\//, "")

  const parts = route.split("/")

  if (parts.length >= 2 && /^v\d+$/.test(parts[1])) {
    const vmType = parts[0]
    const compact = parts[1]
    const dotted = dottedFromCompact(compact)
    const rest = parts.slice(2).join("/")

    return rest
      ? `${product}/api-reference/${vmType}/${dotted}/${rest}`
      : `${product}/api-reference/${vmType}/${dotted}`
  }

  if (parts.length >= 1 && /^v\d+$/.test(parts[0])) {
    const compact = parts[0]
    const dotted = dottedFromCompact(compact)
    const rest = parts.slice(1).join("/")

    return rest ? `${product}/api-reference/${dotted}/${rest}` : `${product}/api-reference/${dotted}`
  }

  return `${product}/api-reference/${route}`
}

function toCollectionId(product: string, filePath: string) {
  const rel = normalize(path.relative(path.join(CONTENT_DIR, product), filePath))

  if (!rel.startsWith("api-reference/")) return null

  const noExt = rel.replace(/\.mdx?$/, "")
  const noIndex = noExt.replace(/\/index$/, "")
  const parts = noIndex.split("/")

  if (parts.length >= 3 && parts[0] === "api-reference" && /^v\d+\.\d+\.\d+$/.test(parts[2])) {
    parts[2] = compactFromDotted(parts[2])
  } else if (parts.length >= 2 && parts[0] === "api-reference" && /^v\d+\.\d+\.\d+$/.test(parts[1])) {
    parts[1] = compactFromDotted(parts[1])
  }

  return parts.join("/")
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

function pageTemplate(product: string, id: string) {
  return `---
import { getCollection } from "astro:content"
import ApiReferencePage from "~/components/ApiReferencePage.astro"

const entries = await getCollection("${product}")

const entry = entries.find((e) => {
  const normalized = e.id.replace(/\\\\/g, "/")
  return normalized === "${id}"
})

if (!entry) {
  throw new Error("Entry not found: ${id}")
}
---

<ApiReferencePage {entry} />
`
}

async function main() {
  for (const product of PRODUCTS) {
    await fs.rm(path.join(OUT_DIR, product, "api-reference"), {
      recursive: true,
      force: true,
    })
  }

  for (const product of PRODUCTS) {
    const productDir = path.join(CONTENT_DIR, product)

    try {
      const files = await walk(productDir)

      for (const file of files) {
        const publicRoute = toPublicRoute(product, file)
        const collectionId = toCollectionId(product, file)

        if (!publicRoute || !collectionId) continue

        const outPath = path.join("src", "pages", publicRoute + ".astro")
        const fullOutPath = path.join(ROOT, outPath)

        await ensureDir(path.dirname(fullOutPath))
        await fs.writeFile(fullOutPath, pageTemplate(product, collectionId))
      }
    } catch {
      // product may not exist
    }
  }

  console.log("Generated API reference routes")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
