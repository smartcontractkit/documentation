#!/usr/bin/env node
/**
 * Build-output regression check for self-hosted Swagger UI assets.
 *
 * Inspects the actual Vercel deployment output (`.vercel/output/static`) and fails the build when an
 * API reference page would load Swagger UI (or any other script/stylesheet) from a third-party origin,
 * references a Swagger file that was not emitted, or drifts onto a different copy of the Swagger assets.
 *
 * To cover a new Swagger reference page, add its route to `SWAGGER_PAGES` below.
 * See "Swagger UI" in README.md.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "node:url"

export const OUTPUT_DIR = ".vercel/output/static"

/** Every page that renders Swagger UI. The check fails if one of these is missing from the build output. */
export const SWAGGER_PAGES = [
  "/api/ace/coordinator/docs",
  "/api/ace/evaluation/docs",
  "/api/ace/reporting/docs",
  "/api/crec/docs",
  "/api/ccip/v1/docs",
] as const

type SwaggerKind = "bundle" | "preset" | "css"

const SWAGGER_FILES: Record<SwaggerKind, { pattern: RegExp; marker: string; label: string }> = {
  bundle: { pattern: /^swagger-ui-bundle(?:\.[\w-]+)?\.js$/, marker: "SwaggerUIBundle", label: "swagger-ui-bundle.js" },
  preset: {
    pattern: /^swagger-ui-standalone-preset(?:\.[\w-]+)?\.js$/,
    marker: "SwaggerUIStandalonePreset",
    label: "swagger-ui-standalone-preset.js",
  },
  css: { pattern: /^swagger-ui(?:\.[\w-]+)?\.css$/, marker: ".swagger-ui", label: "swagger-ui.css" },
}

// Synthetic application origin: any resource that resolves to a different origin is third-party.
// Resolving (instead of searching for "https://") also catches protocol-relative URLs such as //unpkg.com/x.js.
const APP_ORIGIN = "https://app.invalid"

type Resource = { tag: "script" | "link"; url: string }

function parseAttributes(rawAttributes: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  for (const match of rawAttributes.matchAll(/([^\s=/"'<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ""
  }
  return attributes
}

/**
 * Script `src` and stylesheet-like `href` attributes, in document order.
 * Inline script bodies are intentionally skipped. This only reads the build output to find resource URLs;
 * it never rewrites or sanitizes HTML.
 */
export function extractResources(html: string): Resource[] {
  const resources: Resource[] = []
  const tagPattern = /<(script|link)\b([^>]*)>/gi
  // Matches end tags such as `</script>` and `</script >`.
  const scriptEndPattern = /<\/script\b[^>]*>/gi

  let match: RegExpExecArray | null
  while ((match = tagPattern.exec(html)) !== null) {
    const attributes = parseAttributes(match[2])

    if (match[1].toLowerCase() === "script") {
      if (attributes.src !== undefined) resources.push({ tag: "script", url: attributes.src })
      // Jump past the script body so markup-like text inside inline scripts is never read as tags.
      scriptEndPattern.lastIndex = tagPattern.lastIndex
      const end = scriptEndPattern.exec(html)
      tagPattern.lastIndex = end ? scriptEndPattern.lastIndex : html.length
      continue
    }

    const { rel = "", href, as = "" } = attributes
    const rels = rel.toLowerCase().split(/\s+/)
    const loadsCode =
      rels.includes("stylesheet") ||
      rels.includes("modulepreload") ||
      (rels.includes("preload") && ["script", "style"].includes(as.toLowerCase()))
    if (loadsCode && href !== undefined) resources.push({ tag: "link", url: href })
  }
  return resources
}

function classify(pathname: string): SwaggerKind | undefined {
  const basename = path.posix.basename(pathname)
  return (Object.keys(SWAGGER_FILES) as SwaggerKind[]).find((kind) => SWAGGER_FILES[kind].pattern.test(basename))
}

function pagePathFor(outputDir: string, route: string): string {
  return path.join(outputDir, route, "index.html")
}

function collectHtmlFiles(directory: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectHtmlFiles(fullPath, found)
    else if (entry.name.endsWith(".html")) found.push(fullPath)
  }
  return found
}

function checkEmittedCss(cssText: string, label: string, errors: string[]): void {
  for (const match of cssText.matchAll(/@import\s+(?:url\(\s*)?["']?([^"')\s;]+)/gi)) {
    errors.push(`${label}: contains @import of "${match[1]}"`)
  }
  for (const match of cssText.matchAll(/url\(\s*(["']?)([^)"']*)\1\s*\)/gi)) {
    const target = match[2].trim()
    if (/^data:/i.test(target) || target === "") continue
    if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(target) || /^https?:/i.test(target)) {
      errors.push(`${label}: references remote url(${target})`)
    }
  }
}

export function checkSwaggerAssets(outputDir: string = OUTPUT_DIR, pages: readonly string[] = SWAGGER_PAGES): string[] {
  const errors: string[] = []
  const resolvedOutputDir = path.resolve(outputDir)

  if (!fs.existsSync(resolvedOutputDir)) {
    return [`Deployment output not found: ${outputDir} (run the Astro build first)`]
  }

  // Swagger assets referenced by each page, keyed by kind, to ensure every page shares one copy.
  const referencedByPage = new Map<string, Partial<Record<SwaggerKind, string>>>()
  // Files already validated, so each emitted asset is only read once.
  const checkedFiles = new Set<string>()

  for (const route of pages) {
    const pageFile = pagePathFor(resolvedOutputDir, route)
    if (!fs.existsSync(pageFile)) {
      errors.push(`${route}: expected reference page is missing from the build output (${pageFile})`)
      continue
    }

    const pageUrl = new URL(route, APP_ORIGIN)
    const found: Partial<Record<SwaggerKind, string[]>> = {}

    for (const resource of extractResources(fs.readFileSync(pageFile, "utf8"))) {
      const describe = `${route}: <${resource.tag}> ${resource.url}`

      if (/^\s*data:/i.test(resource.url)) {
        errors.push(`${describe.slice(0, 120)}... is a data: URL; assets must be emitted as separate files`)
        continue
      }

      let resolved: URL
      try {
        resolved = new URL(resource.url, pageUrl)
      } catch {
        errors.push(`${describe}: invalid URL`)
        continue
      }

      if (resolved.origin !== APP_ORIGIN) {
        errors.push(`${describe}: loaded from a third-party origin (${resolved.origin})`)
        continue
      }
      if (/\/@fs\/|node_modules/.test(resolved.pathname)) {
        errors.push(`${describe}: development or node_modules path leaked into the production output`)
        continue
      }

      const kind = classify(resolved.pathname)
      if (!kind) continue
      ;(found[kind] ??= []).push(resolved.pathname)

      const assetFile = path.resolve(resolvedOutputDir, `.${decodeURIComponent(resolved.pathname)}`)
      if (!assetFile.startsWith(resolvedOutputDir + path.sep) || !fs.existsSync(assetFile)) {
        errors.push(`${describe}: referenced Swagger file does not exist in the build output`)
        continue
      }
      if (checkedFiles.has(assetFile)) continue
      checkedFiles.add(assetFile)

      const { marker, label } = SWAGGER_FILES[kind]
      const content = fs.readFileSync(assetFile, "utf8")
      if (!content.includes(marker)) {
        errors.push(`${resolved.pathname}: does not look like ${label} (missing "${marker}"; possible HTML fallback)`)
      }
      if (kind === "css") checkEmittedCss(content, resolved.pathname, errors)
    }

    const referenced: Partial<Record<SwaggerKind, string>> = {}
    for (const kind of Object.keys(SWAGGER_FILES) as SwaggerKind[]) {
      const urls = found[kind] ?? []
      if (urls.length !== 1) {
        errors.push(
          `${route}: expected exactly one ${SWAGGER_FILES[kind].label} reference, found ${urls.length}${urls.length ? ` (${urls.join(", ")})` : ""}`
        )
      }
      if (urls[0]) referenced[kind] = urls[0]
    }
    referencedByPage.set(route, referenced)
  }

  // Every page must use the same emitted copy of each Swagger file.
  for (const kind of Object.keys(SWAGGER_FILES) as SwaggerKind[]) {
    const distinct = new Set([...referencedByPage.values()].map((refs) => refs[kind]).filter(Boolean))
    if (distinct.size > 1) {
      errors.push(`Pages reference different copies of ${SWAGGER_FILES[kind].label}: ${[...distinct].join(", ")}`)
    }
  }

  // Guard against a new Swagger page that is not registered in SWAGGER_PAGES (and so would not be validated).
  const registered = new Set(pages.map((route) => pagePathFor(resolvedOutputDir, route)))
  for (const htmlFile of collectHtmlFiles(resolvedOutputDir)) {
    if (registered.has(htmlFile)) continue
    const html = fs.readFileSync(htmlFile, "utf8")
    if (/SwaggerUIBundle|unpkg\.com\/swagger-ui|swagger-ui-bundle/.test(html)) {
      errors.push(
        `${path.relative(resolvedOutputDir, htmlFile)}: renders Swagger UI but is not listed in SWAGGER_PAGES (src/scripts/check-swagger-assets.ts)`
      )
    }
  }

  return errors
}

function main(): void {
  const outputDir = process.argv[2] ?? OUTPUT_DIR
  const errors = checkSwaggerAssets(outputDir)
  if (errors.length > 0) {
    console.error(`❌ Swagger asset check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`)
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }
  console.log(`✅ Swagger asset check passed: ${SWAGGER_PAGES.length} reference pages use self-hosted assets`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
