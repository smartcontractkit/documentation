import redirectsFile from "./src/features/redirects/redirects.json"

export const config = {
  matcher: "/((?!api|static|.*\\..*|_astro|src).*)",
}

const { redirects } = redirectsFile

export default function middleware(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const referrer = request.headers.get("referer")

  const redirect = redirects.find((entry) => entry.source === pathname)

  if (redirect) {
    const finalUrl = new URL(request.url)
    finalUrl.pathname = redirect.destination
    if (referrer) {
      finalUrl.searchParams.append("referrer", referrer)
    }
    return Response.redirect(finalUrl)
  }
}
