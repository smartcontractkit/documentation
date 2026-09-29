import { next, rewrite } from "@vercel/functions"
import { MARKDOWN_NEGOTIATION_MATCHER, negotiateMarkdown } from "./src/lib/markdown/negotiateMarkdown.ts"

// Vercel runs this before static HTML. Astro's src/middleware.ts does not.
// Redirects in vercel.json run first, so an old URL still returns 301.
export default function middleware(request: Request): Response {
  const url = new URL(request.url)
  const decision = negotiateMarkdown(url.pathname, request.headers.get("accept"))

  if (decision.action === "rewrite") {
    const rewritten = new URL(url)
    rewritten.pathname = decision.pathname
    return rewrite(rewritten)
  }

  if (decision.action === "html") {
    return next({
      headers: {
        Link: `<${decision.alternatePath}>; rel="alternate"; type="text/markdown"`,
      },
    })
  }

  return next()
}

export const config = {
  matcher: [MARKDOWN_NEGOTIATION_MATCHER],
  runtime: "nodejs",
}
