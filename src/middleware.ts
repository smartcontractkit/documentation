import type { MiddlewareHandler } from "astro"
import { negotiateMarkdown } from "@lib/markdown/negotiateMarkdown.js"

export const onRequest: MiddlewareHandler = async (context, next) => {
  const decision = negotiateMarkdown(context.url.pathname, context.request.headers.get("accept"))

  if (decision.action === "rewrite") {
    const rewritten = new URL(context.url)
    rewritten.pathname = decision.pathname
    return context.rewrite(rewritten)
  }

  const response = await next()
  if (decision.action !== "html") return response

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("text/html")) return response

  response.headers.append("Link", `<${decision.alternatePath}>; rel="alternate"; type="text/markdown"`)
  return response
}
