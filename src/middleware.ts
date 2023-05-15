import redirects from "./features/redirects/redirects.json"

export function middleware(request: Request) {
  const referrer = request.referrer
  const url = new URL(request.url)
  const pathname = url.pathname

  const redirect = redirects.redirects.find((entry) => entry.source === pathname)
  console.log({ url, pathname, redirect })

  if (redirect) {
    // You can also set request headers in NextResponse.rewrite
    const finalUrl = new URL(redirect.destination)
    finalUrl.searchParams.append("referrer", referrer)

    return Response.redirect(redirect.destination)
  }
}
