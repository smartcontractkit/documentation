import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "@jest/globals"
import { onRequest } from "../../../middleware.ts"
import middleware, { config } from "../../../../middleware.ts"
import { MARKDOWN_NEGOTIATION_MATCHER } from "../negotiateMarkdown.ts"

const middlewareSourcePath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../middleware.ts")

function pageRequest(pathname: string, accept: string | null): Request {
  const headers = new Headers()
  if (accept !== null) headers.set("accept", accept)
  return new Request(`https://docs.chain.link${pathname}`, { headers })
}

describe("astro middleware", () => {
  it("rewrites to the markdown url and keeps the query string", async () => {
    const request = pageRequest("/cre/getting-started/cli-installation?lang=en", "text/markdown")
    let rewritten: string | undefined
    const response = await onRequest(
      {
        url: new URL(request.url),
        request,
        rewrite: async (target: string | URL | Request) => {
          rewritten = target instanceof Request ? target.url : target.toString()
          return new Response("markdown", { headers: { "content-type": "text/markdown; charset=utf-8" } })
        },
      } as never,
      async () => new Response("html", { headers: { "content-type": "text/html" } })
    )

    expect(rewritten).toBe("https://docs.chain.link/cre/getting-started/cli-installation.md?lang=en")
    expect(response).toBeInstanceOf(Response)
    if (!(response instanceof Response)) return
    expect(response.headers.get("content-type")).toContain("text/markdown")
  })

  it("adds the markdown link on an html response", async () => {
    const request = pageRequest("/cre/getting-started/cli-installation", "text/html")
    const response = await onRequest(
      {
        url: new URL(request.url),
        request,
        rewrite: async () => {
          throw new Error("html requests must not rewrite")
        },
      } as never,
      async () => new Response("<html></html>", { headers: { "content-type": "text/html; charset=utf-8" } })
    )

    expect(response).toBeInstanceOf(Response)
    if (!(response instanceof Response)) return
    expect(response.headers.get("link")).toBe(
      '</cre/getting-started/cli-installation.md>; rel="alternate"; type="text/markdown"'
    )
  })
})

describe("vercel middleware", () => {
  it("writes the matcher as a string literal", () => {
    const source = readFileSync(middlewareSourcePath, "utf8")
    expect(source).not.toContain("MARKDOWN_NEGOTIATION_MATCHER")
    expect(config.matcher).toEqual([MARKDOWN_NEGOTIATION_MATCHER])
    expect(config.runtime).toBe("nodejs")
  })

  it("rewrites when the caller asks for markdown", () => {
    const response = middleware(pageRequest("/data-feeds/price-feeds?lang=en", "text/markdown"))
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://docs.chain.link/data-feeds/price-feeds.md?lang=en"
    )
    expect(response.headers.get("x-middleware-request-x-astro-path")).toBe("/data-feeds/price-feeds.md?lang=en")
    expect(response.headers.get("x-middleware-next")).toBeNull()
  })

  it("passes html through with a markdown link", () => {
    const response = middleware(pageRequest("/data-feeds/price-feeds", "text/html"))
    expect(response.headers.get("x-middleware-next")).toBe("1")
    expect(response.headers.get("x-middleware-rewrite")).toBeNull()
    expect(response.headers.get("link")).toBe('</data-feeds/price-feeds.md>; rel="alternate"; type="text/markdown"')
  })

  it("does not rewrite an api path", () => {
    const response = middleware(pageRequest("/api/page-markdown", "text/markdown"))
    expect(response.headers.get("x-middleware-rewrite")).toBeNull()
    expect(response.headers.get("link")).toBeNull()
    expect(response.headers.get("x-middleware-next")).toBe("1")
  })
})
