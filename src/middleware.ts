import type { MiddlewareHandler } from "astro"

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next()

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("text/html")) {
    return response
  }

  const url = new URL(context.request.url)
  const pathname = url.pathname.replace(/\/$/, "") || "/"

  if (pathname.startsWith("/_astro") || pathname.includes(".")) {
    return response
  }

  const markdownPath = pathname === "/" ? "/index.md" : `${pathname}.md`

  response.headers.append("Link", `<${markdownPath}>; rel="alternate"; type="text/markdown"`)

  return response
}
