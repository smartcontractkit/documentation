/**
 * Shared cache and CORS header configurations for API endpoints
 *
 * Cache Strategy:
 * - 5-minute CDN cache (s-max-age=300)
 * - Stale-while-revalidate for graceful degradation
 * - CDN-specific headers for Vercel optimization
 * - No browser cache (CDN-only caching)
 *
 * CORS Policy:
 * - Open access (Access-Control-Allow-Origin: *)
 * - Public, read-only API designed for cross-origin consumption
 */

/**
 * CORS headers for cross-origin access
 * Enables browser-based clients (dApps, scripts) to consume the API
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

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
  ...corsHeaders,
  ...standardCacheHeaders,
}

/**
 * Cache headers for application/json responses
 * Used by: /api/ccip/v1/* endpoints
 */
export const jsonHeaders = {
  "Content-Type": "application/json",
  ...corsHeaders,
  ...standardCacheHeaders,
}

/**
 * Common headers without caching directives
 * For endpoints that need custom cache control
 */
export const commonHeaders = {
  "Content-Type": "application/json",
  ...corsHeaders,
}
