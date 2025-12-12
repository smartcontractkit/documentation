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

import type { TokenFinalityApiResponse, TokenDetailMetadata } from "~/lib/ccip/types/index.ts"
import { TokenDataService } from "~/lib/ccip/services/token-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { tokenCanonicalSymbol } = params

    logger.info({
      message: "Processing CCIP token finality request",
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
    const outputKey = validateOutputKey(queryParams.get("output_key") || undefined)
    logger.debug({
      message: "Output key validated",
      requestId,
      outputKey,
    })

    const tokenDataService = new TokenDataService()
    const result = await tokenDataService.getTokenFinality(environment, tokenCanonicalSymbol, outputKey)

    if (!result) {
      throw new CCIPError(404, `Token '${tokenCanonicalSymbol}' not found`)
    }

    logger.info({
      message: "Token finality data retrieved successfully",
      requestId,
      tokenCanonicalSymbol,
      chainCount: result.metadata.chainCount,
    })

    // Create token finality metadata
    const metadata: TokenDetailMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      tokenSymbol: tokenCanonicalSymbol,
      chainCount: result.metadata.chainCount,
    }

    const response: TokenFinalityApiResponse = {
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
      message: "Error processing token finality request",
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
        {}
      )
    }

    // Handle other errors
    if (error instanceof Error) {
      return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to process token finality request", 500, {
        message: error.message,
      })
    }
    return handleApiError(error)
  }
}
