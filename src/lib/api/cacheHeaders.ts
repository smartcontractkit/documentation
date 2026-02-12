/**
 * Shared cache header configurations for API endpoints
 *
 * Cache Strategy:
 * - 5-minute CDN cache (s-max-age=300)
 * - Stale-while-revalidate for graceful degradation
 * - CDN-specific headers for Vercel optimization
 * - No browser cache (CDN-only caching)
 */

/**
 * Standard cache headers for all API endpoints
 * - CDN cache: 5 minutes
 * - Serves stale content while revalidating in background
 * - Optimized for Vercel CDN
 */
export const standardCacheHeaders = {
  "Cache-Control": "s-max-age=300, stale-while-revalidate",
  "CDN-Cache-Control": "max-age=300",
  "Vercel-CDN-Cache-Control": "max-age=300",
}

/**
 * Cache headers for text/plain responses
 * Used by: /api/page-markdown
 */
export const textPlainHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  ...standardCacheHeaders,
}

/**
 * Cache headers for application/json responses
 * Used by: /api/ccip/v1/* endpoints
 */
export const jsonHeaders = {
  "Content-Type": "application/json",
  ...standardCacheHeaders,
}

/**
 * Common headers without caching directives
 * For endpoints that need custom cache control
 */
export const commonHeaders = {
  "Content-Type": "application/json",
}
