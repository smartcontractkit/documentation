import redirects from "./src/features/redirects/redirects.json"

export const config = {
  matcher: "/((?!api|static|.*\\..*|_astro|src).*)",
}

const testRedirections = [
  {
    source: "/docs/chainlink-keepers/introduction",
    destination: "/chainlink-automation/introduction",
    statuscode: 301,
  },
]

export default function middleware(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const referrer = request.headers.get("referer")

  const redirect = testRedirections.find((entry) => entry.source === pathname)

  if (redirect) {
    const finalUrl = new URL(request.url)
    finalUrl.pathname = redirect.destination
    if (referrer) {
      finalUrl.searchParams.append("referrer", referrer)
    }
    return Response.redirect(finalUrl)
  }
}
