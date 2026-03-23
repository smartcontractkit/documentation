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

import type { LaneDetailApiResponse, LaneDetailMetadata } from "~/lib/ccip/types/index.ts"
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
      message: "Processing CCIP lane detail request (by-chain-id)",
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

    // Validate internalIdFormat parameter (controls output format for internal IDs)
    const internalIdFormat = validateInternalIdFormat(queryParams.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    // Initialize chain identifier service for formatting
    const chainIdService = new ChainIdentifierService(environment, internalIdFormat)

    const laneDataService = new LaneDataService()

    // Load reference data to resolve chain IDs to directory keys
    const { chainsReferenceData } = loadReferenceData({
      environment,
      version: Version.V1_2_0,
    })

    // Resolve chain IDs to directory keys
    const sourceDirectoryKey = laneDataService.resolveToInternalId(
      source,
      "chainId",
      chainsReferenceData as Record<string, ChainConfig>
    )
    const destDirectoryKey = laneDataService.resolveToInternalId(
      destination,
      "chainId",
      chainsReferenceData as Record<string, ChainConfig>
    )

    if (!sourceDirectoryKey || !destDirectoryKey) {
      throw new CCIPError(404, `Lane from chain '${source}' to chain '${destination}' not found`)
    }

    const result = await laneDataService.getLaneDetails(environment, sourceDirectoryKey, destDirectoryKey, "internalId")

    if (!result.data) {
      throw new CCIPError(404, `Lane from chain '${source}' to chain '${destination}' not found`)
    }

    logger.info({
      message: "Lane detail data retrieved successfully",
      requestId,
      source,
      destination,
    })

    // Format the internalId fields in the response data based on internalIdFormat
    const formattedSourceInternalId = chainIdService.format(sourceDirectoryKey, internalIdFormat)
    const formattedDestInternalId = chainIdService.format(destDirectoryKey, internalIdFormat)

    const formattedData = {
      ...result.data,
      sourceChain: {
        ...result.data.sourceChain,
        internalId: formattedSourceInternalId,
      },
      destinationChain: {
        ...result.data.destinationChain,
        internalId: formattedDestInternalId,
      },
    }

    // Create lane detail metadata (keep chain IDs as that's what user passed)
    const metadata: LaneDetailMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      sourceChain: source,
      destinationChain: destination,
    }

    const response: LaneDetailApiResponse = {
      metadata,
      data: formattedData,
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
      message: "Error processing lane detail request",
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle CCIPError specifically, preserving its status code
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
