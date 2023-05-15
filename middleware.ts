import redirects from "./src/features/redirects/redirects.json"

export function middleware(request: Request) {
  const referrer = request.referrer
  const url = new URL(request.url)
  const pathname = url.pathname

  const sanitizeSource = (source: string) => {
    let newSource = source
    if (newSource[newSource.length - 1] === "/") newSource = newSource.slice(0, newSource.length - 1)
    if (newSource[0] === "/") return newSource.slice(1, newSource.length)
    return newSource
  }

  const redirect = redirects.redirects.find((entry) => sanitizeSource(entry.source) === pathname)
  console.info({ url, pathname, redirect })

  if (redirect) {
    // You can also set request headers in NextResponse.rewrite
    const finalUrl = new URL(redirect.destination)
    finalUrl.searchParams.append("referrer", referrer)

    return Response.redirect(new URL(redirect.destination, request.url))
  }
}
