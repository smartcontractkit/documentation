import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateOutputKey,
  handleApiError,
  successHeaders,
  commonHeaders,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "../utils.ts"
import { logger } from "@lib/logging/index.js"

import type { LaneFilterType, LaneApiResponse, LaneMetadata } from "../types/index.ts"
import { LaneDataService } from "../../services/lane-data.ts"

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
      sourceChainId: params.get("sourceChainId") || undefined,
      destinationChainId: params.get("destinationChainId") || undefined,
      sourceSelector: params.get("sourceSelector") || undefined,
      destinationSelector: params.get("destinationSelector") || undefined,
      sourceInternalId: params.get("sourceInternalId") || undefined,
      destinationInternalId: params.get("destinationInternalId") || undefined,
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
      headers: { ...commonHeaders, ...successHeaders },
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
        {}
      )
    }

    // Handle other errors
    if (error instanceof Error) {
      return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to process lanes request", 500, {
        message: error.message,
      })
    }
    return handleApiError(error)
  }
}
