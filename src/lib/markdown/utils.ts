/**
 * Utility functions for markdown transformation
 */

import path from "path"
import type { Frontmatter } from "./types.js"

/**
 * Extract frontmatter from raw MDX content
 * @param raw - Raw MDX file content
 * @returns Frontmatter data and body content
 */
export function extractFrontmatter(raw: string): Frontmatter {
  // Lightweight frontmatter extractor to avoid extra deps
  // Supports triple-dash YAML frontmatter at the start of the file
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3)
    if (end > 0) {
      const fm = raw.slice(3, end).trim()
      const body = raw.slice(end + 4)
      // Very minimal parsing for title, metadata.lastModified, and sdkLang
      const fmTitleMatch = fm.match(/^\s*title:\s*"?(.+?)"?\s*$/m)
      const lastModMatch = fm.match(/^\s*metadata:\s*[\s\S]*?lastModified:\s*"?(.+?)"?\s*$/m)
      const sdkLangMatch = fm.match(/^\s*sdkLang:\s*"?(.+?)"?\s*$/m)
      const fmTitle = fmTitleMatch ? fmTitleMatch[1] : undefined
      const fmLastModified = lastModMatch ? lastModMatch[1] : undefined
      const sdkLang = sdkLangMatch ? sdkLangMatch[1] : undefined
      return { body, fmTitle, fmLastModified, sdkLang }
    }
  }
  return { body: raw }
}

/**
 * Convert absolute file path to content-relative path
 * @param absFile - Absolute file path
 * @returns Path relative to src/content/
 */
export function toContentRelative(absFile: string): string {
  const idx = absFile.indexOf(path.normalize("src/content/"))
  return idx >= 0 ? absFile.slice(idx + "src/content/".length) : absFile
}

/**
 * Convert content-relative path to canonical URL
 * @param section - Section name (e.g., 'ccip')
 * @param relFromContent - Path relative to src/content/
 * @param siteBase - Base URL for the site
 * @returns Full canonical URL
 */
export function toCanonicalUrl(section: string, relFromContent: string, siteBase: string): string {
  // relFromContent like "ccip/index.mdx" or "ccip/foo/bar.mdx"
  const withoutExt = relFromContent.replace(/\.(md|mdx)$/i, "")
  let slug = withoutExt
  if (slug.endsWith("/index")) slug = slug.slice(0, -"/index".length)
  if (!slug.startsWith(section)) slug = `${section}/${slug}`
  if (!slug.startsWith("/")) slug = `/${slug}`
  return `${siteBase}${slug}`
}

/**
 * Infer page title from file path
 * @param relFromContent - Path relative to src/content/
 * @returns Inferred title
 */
export function inferTitleFromPath(relFromContent: string): string {
  const base = path.basename(relFromContent, path.extname(relFromContent))
  if (base.toLowerCase() === "index") {
    const parts = relFromContent.split(path.sep).filter(Boolean)
    return parts.length >= 2 ? titleCase(parts[parts.length - 2]) : "Documentation"
  }
  return titleCase(base)
}

/**
 * Convert string to title case
 * @param s - Input string
 * @returns Title-cased string
 */
export function titleCase(s: string): string {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

/**
 * Get page language from filename or frontmatter
 * @param absFile - Absolute file path
 * @param sdkLang - SDK language from frontmatter
 * @returns Language code or null if not language-specific
 */
export function getPageLanguage(absFile: string, sdkLang?: string): string | null {
  // Return the language if specified in frontmatter
  if (sdkLang) return sdkLang.toLowerCase()

  // Check filename suffix (e.g., "page-go.mdx" -> "go", "page-ts.mdx" -> "ts")
  const basename = path.basename(absFile, path.extname(absFile))
  const match = basename.match(/-(go|ts)$/)
  if (match) return match[1]

  // No language specified = common to all languages
  return null
}

/**
 * Check if page should be included in language-specific file
 * @param pageLanguage - Language of the page
 * @param targetLanguage - Target language for the file
 * @returns True if page should be included
 */
export function shouldIncludeInLanguageFile(pageLanguage: string | null, targetLanguage: string): boolean {
  // Include if page is common (no language) or matches target language
  return pageLanguage === null || pageLanguage === targetLanguage
}

/**
 * Convert value to ISO date string
 * @param val - Date value (string or Date)
 * @returns ISO date string (YYYY-MM-DD) or undefined
 */
export function getIsoStringOrUndefined(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined
  const d = new Date(val)
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}

/**
 * Unescape markdown for plain text output
 * @param s - Markdown string
 * @returns Unescaped string
 */
export function unescapeForPlainText(s: string): string {
  let inFence = false
  return s
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      return line
        .replace(/\\_/g, "_")
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
    })
    .filter((line) => line.trim() !== "{/* prettier-ignore */}")
    .join("\n")
}
