import type { APIRoute } from "astro"
import { validateEnvironment, handleApiError, APIErrorType, createErrorResponse, CCIPError } from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { SupportedTokensApiResponse, SupportedTokensMetadata } from "~/lib/ccip/types/index.ts"
import { LaneDataService } from "~/lib/ccip/services/lane-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { source, destination } = params

    logger.info({
      message: "Processing CCIP supported tokens request (by-chain-id)",
      requestId,
      url: request.url,
      source,
      destination,
    })

    // Validate path parameters
    if (!source) {
      throw new CCIPError(400, "source chain ID is required in path")
    }
    if (!destination) {
      throw new CCIPError(400, "destination chain ID is required in path")
    }

    const url = new URL(request.url)
    const queryParams = url.searchParams

    // Validate environment
    const environment = validateEnvironment(queryParams.get("environment") || undefined)
    logger.debug({
      message: "Environment validated",
      requestId,
      environment,
    })

    const laneDataService = new LaneDataService()
    const result = await laneDataService.getSupportedTokensWithRateLimits(environment, source, destination, "chainId")

    if (!result.data) {
      throw new CCIPError(404, `Lane from chain '${source}' to chain '${destination}' not found`)
    }

    logger.info({
      message: "Supported tokens data retrieved successfully",
      requestId,
      source,
      destination,
      tokenCount: result.tokenCount,
    })

    // Create metadata
    const metadata: SupportedTokensMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      sourceChain: source,
      destinationChain: destination,
      tokenCount: result.tokenCount,
    }

    const response: SupportedTokensApiResponse = {
      metadata,
      data: result.data,
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
      message: "Error processing supported tokens request",
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    if (error instanceof CCIPError) {
      return createErrorResponse(
        error.statusCode === 400
          ? APIErrorType.VALIDATION_ERROR
          : error.statusCode === 404
            ? APIErrorType.NOT_FOUND
            : APIErrorType.SERVER_ERROR,
        error.message,
        error.statusCode,
        {}
      )
    }

    if (error instanceof Error) {
      return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to process supported tokens request", 500, {
        message: error.message,
      })
    }
    return handleApiError(error)
  }
}
