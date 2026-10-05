import { afterEach, describe, expect, it, jest } from "@jest/globals"
import { GET } from "../../../pages/[...path].md.js"

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

function pageContext(pathname: string, headers?: HeadersInit) {
  const url = new URL(pathname, "https://docs.chain.link")
  return {
    params: { path: url.pathname.replace(/^\//, "").replace(/\.md$/, "") },
    request: new Request(url, { headers }),
  }
}

describe("markdown html fallback", () => {
  it("returns the html page when the markdown file is missing", async () => {
    const fetchMock = jest.fn(async () => {
      return new Response("<html>changelog</html>", {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          link: '</changelog.md>; rel="alternate"; type="text/markdown"',
          "content-length": "24",
        },
      })
    })
    globalThis.fetch = fetchMock as typeof fetch

    const response = await GET(pageContext("/changelog.md?markdown_fallback=1") as never)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(response.headers.get("link")).toBeNull()
    expect(response.headers.get("cache-control")).toBe("private, no-store")
    expect(await response.text()).toContain("changelog")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [target, init] = fetchMock.mock.calls[0] as unknown as [URL | string, RequestInit]
    const targetUrl = new URL(target instanceof Request ? target.url : target.toString())
    expect(targetUrl.pathname).toBe("/changelog")
    expect(targetUrl.searchParams.has("markdown_fallback")).toBe(false)
    expect(new Headers(init.headers).get("accept")).toBe("text/html")
  })

  it("maps the home markdown miss back to /", async () => {
    const fetchMock = jest.fn(async () => new Response("<html>home</html>", { status: 200 }))
    globalThis.fetch = fetchMock as typeof fetch

    const response = await GET(pageContext("/index.md?markdown_fallback=1", { "x-markdown-fallback": "1" }) as never)
    expect(response.status).toBe(200)
    const [target] = fetchMock.mock.calls[0] as unknown as [URL | string]
    expect(new URL(target.toString()).pathname).toBe("/")
  })

  it("keeps a direct miss as 404", async () => {
    const fetchMock = jest.fn()
    globalThis.fetch = fetchMock as typeof fetch

    const response = await GET(pageContext("/changelog.md") as never)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe("Page not found.")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns markdown for a versioned api reference page", async () => {
    const fetchMock = jest.fn()
    globalThis.fetch = fetchMock as typeof fetch

    const client = await GET(pageContext("/ccip/v1/evm/api-reference/v1.6.0/client.md") as never)
    expect(client.status).toBe(200)
    expect(client.headers.get("content-type")).toContain("text/markdown")
    expect(await client.text()).toContain("# CCIP v1.6.0 Client Library API Reference")

    const index = await GET(pageContext("/ccip/v1/evm/api-reference/v1.6.0.md?markdown_fallback=1") as never)
    expect(index.status).toBe(200)
    expect(await index.text()).toContain("# CCIP v1.6.0 API Reference")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("still returns markdown for a real page", async () => {
    const fetchMock = jest.fn()
    globalThis.fetch = fetchMock as typeof fetch

    const response = await GET(pageContext("/cre/getting-started/cli-installation.md?markdown_fallback=1") as never)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/markdown")
    expect(await response.text()).toContain("Installing the CRE CLI")
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
