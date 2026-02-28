import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateOutputKey,
  validateInternalIdFormat,
  handleApiError,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { TokenDetailApiResponse, TokenDetailMetadata, TokenDetailDataResponse } from "~/lib/ccip/types/index.ts"
import { TokenDataService } from "~/lib/ccip/services/token-data.ts"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { tokenCanonicalSymbol } = params

    logger.info({
      message: "Processing CCIP token detail request",
      requestId,
      url: request.url,
      tokenCanonicalSymbol,
    })

    // Validate token symbol is provided
    if (!tokenCanonicalSymbol) {
      throw new CCIPError(400, "tokenCanonicalSymbol parameter is required")
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

    // Validate output key for chain representation
    const outputKey = validateOutputKey(queryParams.get("outputKey") || undefined)
    logger.debug({
      message: "Output key validated",
      requestId,
      outputKey,
    })

    // Validate internalIdFormat parameter (only applies when outputKey=internalId)
    const internalIdFormat = validateInternalIdFormat(queryParams.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    const tokenDataService = new TokenDataService()
    const result = await tokenDataService.getTokenWithFinality(environment, tokenCanonicalSymbol, outputKey)

    if (!result) {
      throw new CCIPError(404, `Token '${tokenCanonicalSymbol}' not found`)
    }

    // Apply internalIdFormat to transform chain keys when output_key=internalId
    let formattedData = result.data
    if (outputKey === "internalId") {
      const chainIdService = new ChainIdentifierService(environment, internalIdFormat)
      const formatted: TokenDetailDataResponse = {}

      for (const [chainKey, chainData] of Object.entries(result.data)) {
        const resolved = chainIdService.resolve(chainKey)
        if (resolved) {
          const formattedKey = chainIdService.format(resolved.directoryKey, internalIdFormat)
          formatted[formattedKey] = chainData
        } else {
          formatted[chainKey] = chainData
        }
      }

      formattedData = formatted
    }

    logger.info({
      message: "Token detail data retrieved successfully",
      requestId,
      tokenCanonicalSymbol,
      chainCount: result.metadata.chainCount,
    })

    // Create token detail metadata
    const metadata: TokenDetailMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      tokenSymbol: tokenCanonicalSymbol,
      chainCount: result.metadata.chainCount,
    }

    const response: TokenDetailApiResponse = {
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
      message: "Error processing token detail request",
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
