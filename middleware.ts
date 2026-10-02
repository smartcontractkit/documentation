import { next, rewrite } from "@vercel/functions"
import {
  MARKDOWN_FALLBACK_HEADER,
  MARKDOWN_FALLBACK_PARAM,
  negotiateMarkdown,
} from "./src/lib/markdown/negotiateMarkdown.js"

// Vercel runs this before static HTML. Astro's src/middleware.ts does not.
// vercel.json redirects run first. Other old URLs are HTML refresh pages.
// Write the matcher as a string. Vercel reads this object as text.
// Keep it equal to the matcher exported from negotiateMarkdown.ts.
export default function middleware(request: Request): Response {
  const url = new URL(request.url)
  const decision = negotiateMarkdown(url.pathname, request.headers.get("accept"))

  if (decision.action === "rewrite") {
    const rewritten = new URL(url)
    rewritten.pathname = decision.pathname
    // The .md route serves HTML when this flag is set and the page has no markdown.
    rewritten.searchParams.set(MARKDOWN_FALLBACK_PARAM, "1")
    // Vercel keeps the original URL on the server function. That URL is the
    // HTML page, and the server crashes when it tries to render it.
    const headers = new Headers(request.headers)
    headers.set("x-astro-path", `${rewritten.pathname}${rewritten.search}`)
    headers.set(MARKDOWN_FALLBACK_HEADER, "1")
    return rewrite(rewritten, { request: { headers } })
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
  matcher: [
    "/((?!api/|_astro/|_image/|_vercel/|samples/)(?!.*\\.(?:avif|css|csv|eot|gif|go|gz|htm|html|ico|jpeg|jpg|js|json|map|md|mdx|mjs|mp3|mp4|otf|pdf|png|py|rs|sol|svg|toml|ts|tsx|ttf|txt|wasm|webm|webmanifest|webp|woff|woff2|xml|yaml|yml|zip)$).*)",
  ],
  runtime: "nodejs",
}
