import { APIRoute } from "astro"
import {
  validateEnvironment,
  validateOutputKey,
  validateInternalIdFormat,
  createTokenMetadata,
  handleApiError,
  APIErrorType,
  createErrorResponse,
  CCIPError,
  loadChainConfiguration,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { TokenFilterType, TokenApiResponse, TokenChainData } from "~/lib/ccip/types/index.ts"
import { TokenDataService } from "~/lib/ccip/services/token-data.ts"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    logger.info({
      message: "Processing CCIP tokens request",
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

    // Get filters
    const filters: TokenFilterType = {
      token_id: params.get("token_id") || undefined,
      chain_id: params.get("chain_id") || undefined,
    }

    logger.debug({
      message: "Filter parameters parsed",
      requestId,
      filters,
    })

    // Validate output key - we'll still use this for formatting display options
    const outputKey = validateOutputKey(params.get("outputKey") || undefined)
    logger.debug({
      message: "Output key validated",
      requestId,
      outputKey,
    })

    // Validate internalIdFormat parameter (only applies when output_key=internalId)
    const internalIdFormat = validateInternalIdFormat(params.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    const config = await loadChainConfiguration(environment)
    logger.debug({
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

    logger.info({
      message: "Token data retrieved successfully",
      requestId,
      validTokenCount: Object.keys(tokens).length,
      errorCount: errors.length,
      filters,
    })

    // Apply internalIdFormat to transform chain keys when output_key=internalId
    let formattedTokens = tokens
    if (outputKey === "internalId") {
      const chainIdService = new ChainIdentifierService(environment, internalIdFormat)
      formattedTokens = {}

      for (const [tokenSymbol, chainData] of Object.entries(tokens)) {
        const formattedChainData: Record<string, TokenChainData> = {}

        for (const [chainKey, tokenChainData] of Object.entries(chainData)) {
          // Resolve and format the chain key
          const resolved = chainIdService.resolve(chainKey)
          if (resolved) {
            const formattedKey = chainIdService.format(resolved.directoryKey, internalIdFormat)
            formattedChainData[formattedKey] = tokenChainData
          } else {
            formattedChainData[chainKey] = tokenChainData
          }
        }

        formattedTokens[tokenSymbol] = formattedChainData
      }
    }

    // Create token-specific metadata using the utility function
    const metadata = createTokenMetadata(environment)
    metadata.ignoredTokenCount = serviceMetadata.ignoredTokenCount
    metadata.validTokenCount = serviceMetadata.validTokenCount

    const response: TokenApiResponse = {
      metadata,
      data: formattedTokens,
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
        requestId
      )
    }

    // Handle other errors
    return handleApiError(error, requestId)
  }
}
