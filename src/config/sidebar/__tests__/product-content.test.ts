import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "@jest/globals"
import { SIDEBAR_SECTIONS } from "../../sidebarSections.ts"

/** Section keys plus the shared "platform" block id used by ProductSection. */
const VALID_PRODUCTS = new Set<string>([...Object.values(SIDEBAR_SECTIONS), "platform"])
const CONTENT_DIR = path.resolve("src/content/chainlink-platform")

function mdxFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return mdxFiles(full)
    return entry.isFile() && entry.name.endsWith(".mdx") ? [full] : []
  })
}

function productTokens(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].flatMap((match) =>
    match[1]
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  )
}

describe("product-scoped platform content", () => {
  const files = mdxFiles(CONTENT_DIR)

  it("uses valid ProductSection product keys", () => {
    const invalid: string[] = []
    for (const file of files) {
      const relative = path.relative(process.cwd(), file)
      for (const product of productTokens(fs.readFileSync(file, "utf8"), /<ProductSection product="([^"]+)"/g)) {
        if (!VALID_PRODUCTS.has(product)) invalid.push(`${relative}: product="${product}"`)
      }
    }
    expect(invalid).toEqual([])
  })

  it("uses valid ProductOnly product keys", () => {
    const invalid: string[] = []
    for (const file of files) {
      const relative = path.relative(process.cwd(), file)
      for (const product of productTokens(fs.readFileSync(file, "utf8"), /<ProductOnly products="([^"]+)"/g)) {
        if (!VALID_PRODUCTS.has(product)) invalid.push(`${relative}: products="${product}"`)
      }
    }
    expect(invalid).toEqual([])
  })
})
