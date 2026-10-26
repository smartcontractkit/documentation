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
import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { ChainConfig } from "@config/data/ccip/types.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { source, destination } = params

    logger.info({
      message: "Processing CCIP supported tokens request (by-selector)",
      requestId,
      url: request.url,
      source,
      destination,
    })

    // Validate path parameters
    if (!source) {
      throw new CCIPError(400, "source selector is required in path")
    }
    if (!destination) {
      throw new CCIPError(400, "destination selector is required in path")
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

    // Validate internalIdFormat parameter (controls output format for internal IDs)
    const internalIdFormat = validateInternalIdFormat(queryParams.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    // Initialize chain identifier service for formatting (reserved for future use)
    const _chainIdService = new ChainIdentifierService(environment, internalIdFormat)

    const laneDataService = new LaneDataService()

    // Load reference data to resolve selectors to directory keys
    const { chainsReferenceData } = loadReferenceData({
      environment,
      version: Version.V1_2_0,
    })

    // Resolve selectors to directory keys
    const sourceDirectoryKey = laneDataService.resolveToInternalId(
      source,
      "selector",
      chainsReferenceData as Record<string, ChainConfig>
    )
    const destDirectoryKey = laneDataService.resolveToInternalId(
      destination,
      "selector",
      chainsReferenceData as Record<string, ChainConfig>
    )

    if (!sourceDirectoryKey || !destDirectoryKey) {
      throw new CCIPError(404, `Lane from selector '${source}' to selector '${destination}' not found`)
    }

    const result = await laneDataService.getSupportedTokensWithRateLimits(
      environment,
      sourceDirectoryKey,
      destDirectoryKey,
      "internalId"
    )

    if (!result.data) {
      throw new CCIPError(404, `Lane from selector '${source}' to selector '${destination}' not found`)
    }

    logger.info({
      message: "Supported tokens data retrieved successfully",
      requestId,
      source,
      destination,
      tokenCount: result.tokenCount,
    })

    // Create metadata (keep selectors in metadata as that's what user passed)
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
        requestId
      )
    }

    // Handle other errors
    return handleApiError(error, requestId)
  }
}
