import { describe, expect, it } from "@jest/globals"
import { pathToRegexp } from "path-to-regexp"
import {
  MARKDOWN_NEGOTIATION_MATCHER,
  acceptsMarkdown,
  markdownAlternatePath,
  negotiateMarkdown,
} from "@lib/markdown/negotiateMarkdown.js"

describe("acceptsMarkdown", () => {
  it.each([
    "text/markdown",
    "text/markdown;charset=utf-8",
    "text/markdown, text/html;q=0.9",
    "text/html;q=0.8, text/markdown",
    "TEXT/MARKDOWN",
    "text/markdown;q=0.1",
  ])("accepts %s", (header) => {
    expect(acceptsMarkdown(header)).toBe(true)
  })

  it.each([
    null,
    "",
    "text/html",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "*/*",
    "text/markdown;q=0",
    "text/markdown ; q=0",
    "application/vnd.text/markdown",
  ])("rejects %s", (header) => {
    expect(acceptsMarkdown(header)).toBe(false)
  })
})

describe("markdownAlternatePath", () => {
  it("maps a docs url and the site root", () => {
    expect(markdownAlternatePath("/ccip/getting-started")).toBe("/ccip/getting-started.md")
    expect(markdownAlternatePath("/ccip/getting-started/")).toBe("/ccip/getting-started.md")
    expect(markdownAlternatePath("/")).toBe("/index.md")
    expect(markdownAlternatePath("/api-reference/overview")).toBe("/api-reference/overview.md")
  })

  it("maps version directories that contain dots", () => {
    expect(markdownAlternatePath("/ccip/v1/evm/api-reference/v1.6.0/client")).toBe(
      "/ccip/v1/evm/api-reference/v1.6.0/client.md"
    )
    expect(markdownAlternatePath("/ccip/v1/evm/api-reference/v1.6.0")).toBe("/ccip/v1/evm/api-reference/v1.6.0.md")
    expect(markdownAlternatePath("/ccip/v1/evm/api-reference/v1.6.0/")).toBe("/ccip/v1/evm/api-reference/v1.6.0.md")
  })

  it("skips files, apis, and build assets", () => {
    expect(markdownAlternatePath("/ccip/getting-started.md")).toBeNull()
    expect(markdownAlternatePath("/llms.txt")).toBeNull()
    expect(markdownAlternatePath("/images/logo.png")).toBeNull()
    expect(markdownAlternatePath("/api/page-markdown")).toBeNull()
    expect(markdownAlternatePath("/api")).toBeNull()
    expect(markdownAlternatePath("/_astro/app.js")).toBeNull()
    expect(markdownAlternatePath("/samples/CRE/basic.ts")).toBeNull()
  })
})

describe("negotiateMarkdown", () => {
  it("rewrites only when the caller asks for markdown", () => {
    expect(negotiateMarkdown("/ccip/getting-started", "text/markdown")).toEqual({
      action: "rewrite",
      pathname: "/ccip/getting-started.md",
    })
    expect(negotiateMarkdown("/ccip/getting-started", "text/html")).toEqual({
      action: "html",
      alternatePath: "/ccip/getting-started.md",
    })
    expect(negotiateMarkdown("/api/ccip/v1/chains", "text/markdown")).toEqual({ action: "skip" })
  })
})

describe("MARKDOWN_NEGOTIATION_MATCHER", () => {
  const matcher = pathToRegexp(MARKDOWN_NEGOTIATION_MATCHER)

  it.each([
    "/",
    "/ccip/getting-started",
    "/ccip/getting-started/",
    "/api-reference/overview",
    "/ccip/v1/evm/api-reference/v1.6.0/client",
    "/ccip/v1/evm/api-reference/v1.6.0",
    "/ccip/v1/evm/api-reference/v1.6.0/",
    "/changelog",
    "/docs/off-chain-reporting",
  ])("includes %s", (pathname) => {
    expect(matcher.test(pathname)).toBe(true)
  })

  it("matches every path the alternate helper can rewrite", () => {
    const paths = [
      "/",
      "/ccip/getting-started",
      "/ccip/getting-started/",
      "/api-reference/overview",
      "/ccip/v1/evm/api-reference/v1.6.0/client",
      "/ccip/v1/evm/api-reference/v1.6.0",
      "/ccip/v1/svm/api-reference/v1.6.0/router",
      "/changelog",
      "/search-index",
      "/docs/off-chain-reporting",
    ]
    for (const pathname of paths) {
      expect(markdownAlternatePath(pathname)).not.toBeNull()
      expect(matcher.test(pathname)).toBe(true)
    }
  })

  it.each([
    "/api/page-markdown",
    "/images/foo.png",
    "/llms.txt",
    "/_astro/app.js",
    "/samples/CRE/basic.ts",
    "/ccip/getting-started.md",
  ])("excludes %s", (pathname) => {
    expect(matcher.test(pathname)).toBe(false)
  })
})
