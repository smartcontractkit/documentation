import { APIRoute } from "astro"
import {
  validateEnvironment,
  validateOutputKey,
  createTokenMetadata,
  handleApiError,
  successHeaders,
  commonHeaders,
  LogLevel,
  structuredLog,
  APIErrorType,
  createErrorResponse,
  CCIPError,
  loadChainConfiguration,
} from "../utils.ts"

import type { TokenFilterType, TokenApiResponse } from "../types/index.ts"
import { TokenDataService } from "../../services/token-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    structuredLog(LogLevel.INFO, {
      message: "Processing CCIP tokens request",
      requestId,
      url: request.url,
    })

    const url = new URL(request.url)
    const params = url.searchParams

    // Validate environment
    const environment = validateEnvironment(params.get("environment") || undefined)
    structuredLog(LogLevel.DEBUG, {
      message: "Environment validated",
      requestId,
      environment,
    })

    // Get filters
    const filters: TokenFilterType = {
      token_id: params.get("token_id") || undefined,
      chain_id: params.get("chain_id") || undefined,
    }

    structuredLog(LogLevel.DEBUG, {
      message: "Filter parameters parsed",
      requestId,
      filters,
    })

    // Validate output key - we'll still use this for formatting display options
    const outputKey = validateOutputKey(params.get("outputKey") || undefined)
    structuredLog(LogLevel.DEBUG, {
      message: "Output key validated",
      requestId,
      outputKey,
    })

    const config = await loadChainConfiguration(environment)
    structuredLog(LogLevel.DEBUG, {
      message: "Chain configuration loaded",
      requestId,
      environment,
      chainCount: Object.keys(config.chainsConfig).length,
    })

    const tokenDataService = new TokenDataService()
    const {
      tokens,
      errors,
      metadata: serviceMetadata,
    } = await tokenDataService.getFilteredTokens(environment, filters, outputKey)

    structuredLog(LogLevel.INFO, {
      message: "Token data retrieved successfully",
      requestId,
      validTokenCount: Object.keys(tokens).length,
      errorCount: errors.length,
      filters,
    })

    // Create token-specific metadata using the utility function
    const metadata = createTokenMetadata(environment)
    metadata.ignoredTokenCount = serviceMetadata.ignoredTokenCount
    metadata.validTokenCount = serviceMetadata.validTokenCount

    const response: TokenApiResponse = {
      metadata,
      data: tokens,
      ignored: errors,
    }

    structuredLog(LogLevel.INFO, {
      message: "Sending successful response",
      requestId,
      metadata,
    })

    return new Response(JSON.stringify(response), {
      headers: { ...commonHeaders, ...successHeaders },
    })
  } catch (error) {
    structuredLog(LogLevel.ERROR, {
      message: "Error processing tokens request",
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
      return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to process token request", 500, {
        message: error.message,
      })
    }
    return handleApiError(error)
  }
}
