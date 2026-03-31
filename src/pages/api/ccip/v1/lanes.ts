import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateOutputKey,
  handleApiError,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { LaneFilterType, LaneApiResponse, LaneMetadata } from "~/lib/ccip/types/index.ts"
import { LaneDataService } from "~/lib/ccip/services/lane-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    logger.info({
      message: "Processing CCIP lanes request",
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

    // Get filters for lanes
    const filters: LaneFilterType = {
      sourceChainId: params.get("source_chain_id") || undefined,
      destinationChainId: params.get("destination_chain_id") || undefined,
      sourceSelector: params.get("source_selector") || undefined,
      destinationSelector: params.get("destination_selector") || undefined,
      sourceInternalId: params.get("source_internal_id") || undefined,
      destinationInternalId: params.get("destination_internal_id") || undefined,
      version: params.get("version") || undefined,
    }

    logger.debug({
      message: "Filter parameters parsed",
      requestId,
      filters,
    })

    // Validate output key
    const outputKey = validateOutputKey(params.get("outputKey") || undefined)
    logger.debug({
      message: "Output key validated",
      requestId,
      outputKey,
    })

    // Validate that at least one valid filter parameter is provided when filters are used
    const hasFilters = Object.values(filters).some((value) => value !== undefined)
    if (hasFilters) {
      // Validate filter format (basic validation for comma-separated values)
      for (const [key, value] of Object.entries(filters)) {
        if (value && typeof value === "string") {
          // Basic validation - ensure no empty values after split
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0)
          if (values.length === 0) {
            throw new CCIPError(400, `Invalid filter value for ${key}: cannot be empty`)
          }
        }
      }
    }

    const laneDataService = new LaneDataService()
    const {
      data,
      errors,
      metadata: serviceMetadata,
    } = await laneDataService.getFilteredLanes(environment, filters, outputKey)

    logger.info({
      message: "Lane data retrieved successfully",
      requestId,
      validLaneCount: Object.keys(data).length,
      errorCount: errors.length,
      filters,
    })

    // Create lane-specific metadata
    const metadata: LaneMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      ignoredLaneCount: serviceMetadata.ignoredLaneCount,
      validLaneCount: serviceMetadata.validLaneCount,
    }

    const response: LaneApiResponse = {
      metadata,
      data,
      ignored: errors,
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
      message: "Error processing lanes request",
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
