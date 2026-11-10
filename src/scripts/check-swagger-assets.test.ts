import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals"
import { checkSwaggerAssets, extractResources, SWAGGER_PAGES } from "./check-swagger-assets.js"

const BUNDLE_URL = "/_astro/swagger-ui-bundle.A123.js"
const PRESET_URL = "/_astro/swagger-ui-standalone-preset.B456.js"
const CSS_URL = "/_astro/swagger-ui.C789.css"

function referencePage(extraMarkup = ""): string {
  return `<!doctype html><html><head>
    <link rel="stylesheet" href="${CSS_URL}">
  </head><body>
    <div id="swagger-ui"></div>
    <script src="${BUNDLE_URL}" defer></script>
    <script src="${PRESET_URL}" defer></script>
    <script>window.addEventListener("load", () => SwaggerUIBundle({ dom_id: "#swagger-ui" }))</script>
    ${extraMarkup}
  </body></html>`
}

describe("Swagger deployment assets", () => {
  let outputDir: string

  function writeFile(relativePath: string, content: string): void {
    const file = path.join(outputDir, relativePath)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }

  function writePage(route: string, html: string): void {
    writeFile(path.join(route, "index.html"), html)
  }

  beforeEach(() => {
    outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "swagger-assets-test-"))
    writeFile(BUNDLE_URL, "window.SwaggerUIBundle = function () {}")
    writeFile(PRESET_URL, "window.SwaggerUIStandalonePreset = {}")
    writeFile(CSS_URL, ".swagger-ui { color: black; }")
    for (const route of SWAGGER_PAGES) writePage(route, referencePage())
  })

  afterEach(() => {
    fs.rmSync(outputDir, { recursive: true, force: true })
  })

  test("accepts the five references sharing local assets", () => {
    expect(checkSwaggerAssets(outputDir)).toEqual([])
  })

  test.each([
    ["hexadecimal URL entities", '<script src="&#x2f;&#x2f;unpkg.com/extra.js"></script>'],
    ["decimal URL entities", '<script src="https&#58;//unpkg.com/extra.js"></script>'],
    ["named URL entities", '<script src="https&colon;//unpkg.com/extra.js"></script>'],
    ["stylesheet URL entities", '<link rel="stylesheet" href="https&#58;//unpkg.com/extra.css">'],
    ["stylesheet rel entities", '<link rel="style&#115;heet" href="//unpkg.com/extra.css">'],
    ["preload as entities", '<link rel="preload" as="scr&#105;pt" href="//unpkg.com/extra.js">'],
  ])("rejects an external resource hidden by %s", (_name, markup) => {
    writePage(SWAGGER_PAGES[0], referencePage(markup))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(
      expect.stringContaining("third-party origin (https://unpkg.com)")
    )
  })

  test.each([
    ["literal HTTPS", '<script src="https://unpkg.com/extra.js"></script>'],
    ["protocol-relative HTTPS", '<script src="//unpkg.com/extra.js"></script>'],
    ["module preload", '<link rel="modulepreload" href="//unpkg.com/extra.js">'],
  ])("still rejects an external %s resource", (_name, markup) => {
    writePage(SWAGGER_PAGES[0], referencePage(markup))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(expect.stringContaining("third-party origin"))
  })

  test("still rejects a data URL", () => {
    writePage(SWAGGER_PAGES[0], referencePage('<script src="data:text/javascript,alert(1)"></script>'))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(expect.stringContaining("is a data: URL"))
  })

  test("still rejects a missing reference page", () => {
    fs.rmSync(path.join(outputDir, SWAGGER_PAGES[0], "index.html"))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(expect.stringContaining("expected reference page is missing"))
  })

  test("still rejects a missing emitted asset", () => {
    fs.rmSync(path.join(outputDir, BUNDLE_URL))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(
      expect.stringContaining("referenced Swagger file does not exist")
    )
  })

  test("still rejects a duplicate bundle", () => {
    writePage(SWAGGER_PAGES[0], referencePage(`<script src="${BUNDLE_URL}"></script>`))

    expect(checkSwaggerAssets(outputDir)).toContainEqual(
      expect.stringContaining("expected exactly one swagger-ui-bundle.js reference, found 2")
    )
  })

  test.each([
    ["plain code", '<pre><code>SwaggerUIBundle({ url: "/openapi.json" })</code></pre>'],
    ["escaped HTML", '<pre>&lt;script src="//unpkg.com/swagger-ui-bundle.js"&gt;&lt;/script&gt;</pre>'],
    ["documentation link", '<a href="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js">SwaggerUIBundle</a>'],
    ["HTML comment", '<!-- <script src="//unpkg.com/swagger-ui-bundle.js"></script> -->'],
    ["inert template", `<template>${referencePage()}</template>`],
    ["noscript fallback", `<noscript>${referencePage()}</noscript>`],
    ["JSON metadata", '<script type="application/ld+json">{"example":"SwaggerUIBundle({})"}</script>'],
    ["JavaScript string", '<script>const example = "SwaggerUIBundle({})"</script>'],
    ["JavaScript comment", "<script>/* SwaggerUIBundle({}) */</script>"],
  ])("does not register a documentation example containing %s", (_name, markup) => {
    writePage("/guides/swagger-example", `<!doctype html><html><body>${markup}</body></html>`)

    expect(checkSwaggerAssets(outputDir)).toEqual([])
  })

  test("still detects an unregistered reference page", () => {
    writePage("/api/new/docs", referencePage())

    expect(checkSwaggerAssets(outputDir)).toContainEqual(
      expect.stringContaining("api/new/docs/index.html: loads Swagger UI assets but is not listed in SWAGGER_PAGES")
    )
  })

  test("detects an unregistered encoded loader without relying on inline code", () => {
    const encodedUrl = BUNDLE_URL.replace(/swagger/g, "&#115;&#119;&#97;&#103;&#103;&#101;&#114;")
    writePage("/api/new/docs", `<html><body><script src="${encodedUrl}"></script></body></html>`)

    expect(checkSwaggerAssets(outputDir)).toContainEqual(expect.stringContaining("not listed in SWAGGER_PAGES"))
  })
})

describe("HTML resource extraction", () => {
  test("decodes attributes once, using HTML attribute parsing rules", () => {
    expect(extractResources('<script src="/_astro/extra.js?example=&amp;sol;&amp;sol;unpkg.com"></script>')).toEqual([
      { tag: "script", url: "/_astro/extra.js?example=&sol;&sol;unpkg.com" },
    ])
  })

  test("supports quoted angle brackets, duplicate attributes, and document order", () => {
    expect(
      extractResources(`<script data-example="a > b" src="/first.js" src="//unpkg.com/ignored.js"></script>
        <link rel="style&#115;heet" href="/second.css">`)
    ).toEqual([
      { tag: "script", url: "/first.js" },
      { tag: "link", url: "/second.css" },
    ])
  })

  test("ignores comments, escaped examples, raw script text, and template contents", () => {
    expect(
      extractResources(`<!-- <script src="//unpkg.com/comment.js"></script> -->
        <pre>&lt;link rel="stylesheet" href="//unpkg.com/example.css"&gt;</pre>
        <script>const example = "<script src='//unpkg.com/string.js'>";</script>
        <template><script src="//unpkg.com/template.js"></script></template>
        <script src="/actual.js"></script>`)
    ).toEqual([{ tag: "script", url: "/actual.js" }])
  })
})
