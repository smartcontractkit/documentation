import type { MiddlewareHandler } from "astro"
import { MARKDOWN_FALLBACK_PARAM, negotiateMarkdown } from "@lib/markdown/negotiateMarkdown.js"

export const onRequest: MiddlewareHandler = async (context, next) => {
  const decision = negotiateMarkdown(context.url.pathname, context.request.headers.get("accept"))

  if (decision.action === "rewrite") {
    const rewritten = new URL(context.url)
    rewritten.pathname = decision.pathname
    // The .md route serves HTML when this flag is set and the page has no markdown.
    rewritten.searchParams.set(MARKDOWN_FALLBACK_PARAM, "1")
    return context.rewrite(rewritten)
  }

  const response = await next()
  if (decision.action !== "html") return response

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("text/html")) return response

  response.headers.append("Link", `<${decision.alternatePath}>; rel="alternate"; type="text/markdown"`)
  return response
}
