/**
 * Middleware that handles URL redirects for both paths with and without trailing slashes.
 * It checks incoming requests and:
 * 1. Ignores root path ('/') and URLs with file extensions
 * 2. For all URLs, checks if there's a matching redirect in the config by:
 *    - For paths with trailing slash: tries without the slash
 *    - For paths without trailing slash: uses as is
 * 3. If a redirect exists, performs a 301 redirect to the configured destination
 *
 * Example: Both '/ccip/api-reference/client' and '/ccip/api-reference/client/'
 * will be redirected to their configured destination, while only storing
 * '/ccip/api-reference/client' in the redirects config.
 */

import type { AstroIntegration } from "astro"

export default function trailingSlashMiddleware(): AstroIntegration {
  return {
    name: "trailing-slash-middleware",
    hooks: {
      "astro:middleware": ({ middleware }) => {
        middleware.push(async ({ request, locals }, next) => {
          const pathname = new URL(request.url).pathname

          // Skip if URL already has a file extension or if it's the root
          if (pathname === "/" || pathname.includes(".")) {
            return await next()
          }

          // Try both versions of the path (with and without trailing slash)
          const pathToCheck = pathname.endsWith("/")
            ? pathname.slice(0, -1) // Remove trailing slash
            : pathname

          const destination = locals.redirects?.[pathToCheck]?.destination

          if (destination) {
            return new Response(null, {
              status: 301,
              headers: {
                Location: destination,
              },
            })
          }

          return await next()
        })
      },
    },
  }
}
