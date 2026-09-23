import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateInternalIdFormat,
  handleApiError,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { SupportedTokensApiResponse, SupportedTokensMetadata } from "~/lib/ccip/types/index.ts"
import { LaneDataService } from "~/lib/ccip/services/lane-data.ts"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { source, destination } = params

    logger.info({
      message: "Processing CCIP supported tokens request (by-internal-id)",
      requestId,
      url: request.url,
      source,
      destination,
    })

    // Validate path parameters
    if (!source) {
      throw new CCIPError(400, "source internal ID is required in path")
    }
    if (!destination) {
      throw new CCIPError(400, "destination internal ID is required in path")
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

    // Validate internalIdFormat parameter (controls output format)
    const internalIdFormat = validateInternalIdFormat(queryParams.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    // Initialize chain identifier service for formatting
    const chainIdService = new ChainIdentifierService(environment, internalIdFormat)

    // Resolve source and destination to directory keys for data lookup
    const sourceResolved = chainIdService.resolve(source)
    const destResolved = chainIdService.resolve(destination)

    if (!sourceResolved) {
      throw new CCIPError(400, `Invalid source chain identifier: '${source}'`)
    }
    if (!destResolved) {
      throw new CCIPError(400, `Invalid destination chain identifier: '${destination}'`)
    }

    const laneDataService = new LaneDataService()
    const result = await laneDataService.getSupportedTokensWithRateLimits(
      environment,
      sourceResolved.directoryKey,
      destResolved.directoryKey,
      "internalId"
    )

    if (!result.data) {
      throw new CCIPError(404, `Lane from '${source}' to '${destination}' not found`)
    }

    logger.info({
      message: "Supported tokens data retrieved successfully",
      requestId,
      source,
      destination,
      tokenCount: result.tokenCount,
    })

    // Format chain identifiers based on internalIdFormat
    const formattedSource = chainIdService.format(sourceResolved.directoryKey, internalIdFormat)
    const formattedDest = chainIdService.format(destResolved.directoryKey, internalIdFormat)

    // Create metadata with formatted chain identifiers
    const metadata: SupportedTokensMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      sourceChain: formattedSource,
      destinationChain: formattedDest,
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
        requestId
      )
    }

    // Handle other errors
    return handleApiError(error, requestId)
  }
}
