import type { APIRoute } from "astro"
import { commonHeaders, corsHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"
import { getGraphQLClient } from "~/lib/ccip/graphql/client.ts"
import { validateQuery } from "~/lib/ccip/graphql/proxy/whitelist.ts"
import { getCached, setCache, buildCacheKey } from "~/lib/ccip/graphql/proxy/cache.ts"
import { isIntrospectionQuery, getIntrospectionResponse } from "~/lib/ccip/graphql/proxy/introspection.ts"

export const prerender = false

function errorResponse(status: number, message: string, requestId: string): Response {
  return new Response(
    JSON.stringify({
      errors: [{ message }],
      extensions: { requestId },
    }),
    {
      status,
      headers: commonHeaders,
    }
  )
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: "CCIP GraphQL proxy. Use POST with a JSON body containing a 'query' field.",
    }),
    { headers: commonHeaders }
  )
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    const body = await request.json()
    const { query, variables } = body

    if (!query || typeof query !== "string") {
      return errorResponse(400, "Missing or invalid 'query' field", requestId)
    }

    if (isIntrospectionQuery(query)) {
      logger.debug({ message: "Serving introspection from static schema", requestId })
      return new Response(JSON.stringify(getIntrospectionResponse()), {
        headers: commonHeaders,
      })
    }

    const validation = validateQuery(query)
    if (!validation.valid) {
      logger.warn({ message: "Query rejected by whitelist", requestId, reason: validation.reason })
      return errorResponse(403, validation.reason || "Query not allowed", requestId)
    }

    const cacheKey = buildCacheKey(query, variables)
    const cached = getCached(cacheKey)
    if (cached) {
      logger.debug({ message: "Proxy cache hit", requestId })
      return new Response(JSON.stringify({ data: cached }), {
        headers: commonHeaders,
      })
    }

    const client = getGraphQLClient()
    const data = await client.request(query, variables)

    setCache(cacheKey, data)

    return new Response(JSON.stringify({ data }), {
      headers: commonHeaders,
    })
  } catch (error) {
    logger.error({
      message: "GraphQL proxy error",
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return errorResponse(502, "Upstream request failed", requestId)
  }
}
