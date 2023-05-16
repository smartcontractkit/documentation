import redirects from "./src/features/redirects/redirects.json"

export const config = {
  matcher: ["/((?!api|src|_astro|assets|.ico|.png|.svg|images|favicon.ico).*)"],
}

export default function middleware(request: Request) {
  const referrer = request.referrer
  const url = new URL(request.url)
  const pathname = url.pathname

  const redirect = redirects.redirects.find((entry) => entry.source === pathname)

  if (redirect) {
    console.log("redirect found")

    // You can also set request headers in NextResponse.rewrite
    const finalUrl = new URL(request.url)
    finalUrl.pathname = redirect.destination
    finalUrl.searchParams.append("referrer", referrer)
    return Response.redirect(finalUrl)
  }
}
