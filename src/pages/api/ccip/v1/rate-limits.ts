import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateRateLimitsFilters,
  createRateLimitsMetadata,
  handleApiError,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { RateLimitsApiResponse } from "~/lib/ccip/types/index.ts"
import { RateLimitsDataService } from "~/lib/ccip/services/rate-limits-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    logger.info({
      message: "Processing CCIP rate-limits request",
      requestId,
      url: request.url,
    })

    const url = new URL(request.url)
    const params = url.searchParams

    // Validate environment
    const environment = validateEnvironment(params.get("environment") || undefined)
    logger.debug({
      message: "Environment validated",
      requestId,
      environment,
    })

    // Validate and parse rate limits filters
    const filters = validateRateLimitsFilters({
      sourceInternalId: params.get("source_internal_id") || undefined,
      destinationInternalId: params.get("destination_internal_id") || undefined,
      tokens: params.get("tokens") || undefined,
      direction: params.get("direction") || undefined,
      rateType: params.get("rate_type") || undefined,
    })

    logger.debug({
      message: "Filter parameters validated",
      requestId,
      filters,
    })

    const rateLimitsService = new RateLimitsDataService()
    const { data, metadata: serviceMetadata } = await rateLimitsService.getFilteredRateLimits(environment, filters)

    logger.info({
      message: "Rate limits data retrieved successfully",
      requestId,
      tokenCount: serviceMetadata.tokenCount,
      sourceChain: filters.sourceInternalId,
      destinationChain: filters.destinationInternalId,
    })

    // Create rate-limits-specific metadata
    const metadata = createRateLimitsMetadata(
      environment,
      filters.sourceInternalId,
      filters.destinationInternalId,
      serviceMetadata.tokenCount
    )

    const response: RateLimitsApiResponse = {
      metadata,
      data,
    }

    logger.info({
      message: "Sending successful response",
      requestId,
      metadata,
    })

    return new Response(JSON.stringify(response), {
      headers: jsonHeaders,
    })
  } catch (error) {
    logger.error({
      message: "Error processing rate-limits request",
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle CCIPError specifically, preserving its status code
    if (error instanceof CCIPError) {
      return createErrorResponse(
        error.statusCode === 400 ? APIErrorType.VALIDATION_ERROR : APIErrorType.SERVER_ERROR,
        error.message,
        error.statusCode,
        requestId
      )
    }

    // Handle other errors
    return handleApiError(error, requestId)
  }
}
