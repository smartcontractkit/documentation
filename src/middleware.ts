import type { MiddlewareHandler } from "astro"

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = context.url
  const pathname = url.pathname.replace(/\/$/, "") || "/"
  const accept = context.request.headers.get("accept") || ""

  const isAssetLike = pathname.startsWith("/_astro") || pathname.includes(".")
  const wantsMarkdown = accept.toLowerCase().includes("text/markdown") && !pathname.endsWith(".md") && !isAssetLike

  if (wantsMarkdown) {
    const markdownPath = pathname === "/" ? "/index.md" : `${pathname}.md`
    return context.rewrite(markdownPath)
  }

  const response = await next()

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("text/html") || isAssetLike) {
    return response
  }

  const markdownPath = pathname === "/" ? "/index.md" : `${pathname}.md`
  response.headers.append("Link", `<${markdownPath}>; rel="alternate"; type="text/markdown"`)

  return response
}
