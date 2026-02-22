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

import type { TokenDirectoryApiResponse, TokenDirectoryMetadata, NamingConvention } from "~/lib/ccip/types/index.ts"
import { TokenDirectoryService } from "~/lib/ccip/services/token-directory.ts"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestId = crypto.randomUUID()

  try {
    const { tokenCanonicalSymbol, chain } = params

    logger.info({
      message: "Processing CCIP token directory request",
      requestId,
      url: request.url,
      tokenCanonicalSymbol,
      chain,
    })

    // Validate token symbol is provided
    if (!tokenCanonicalSymbol) {
      throw new CCIPError(400, "tokenCanonicalSymbol parameter is required")
    }

    // Validate chain parameter is provided
    if (!chain) {
      throw new CCIPError(400, "chain parameter is required")
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

    // Initialize services
    const tokenDirectoryService = new TokenDirectoryService(requestId)
    const chainIdService = new ChainIdentifierService(environment, internalIdFormat as NamingConvention)

    // Resolve chain identifier to get the formatted sourceChain for metadata
    const resolvedChain = chainIdService.resolve(chain)
    if (!resolvedChain) {
      throw new CCIPError(404, `Chain '${chain}' not found`)
    }

    // Get token directory data
    const result = await tokenDirectoryService.getTokenDirectory(
      environment,
      tokenCanonicalSymbol,
      chain,
      outputKey,
      internalIdFormat as NamingConvention
    )

    if (!result.data) {
      throw new CCIPError(404, `Token '${tokenCanonicalSymbol}' not found on chain '${chain}'`)
    }

    // Format sourceChain in metadata based on internalIdFormat
    const formattedSourceChain = chainIdService.format(resolvedChain.directoryKey, internalIdFormat as NamingConvention)

    logger.info({
      message: "Token directory data retrieved successfully",
      requestId,
      tokenCanonicalSymbol,
      chain,
      outboundLaneCount: Object.keys(result.data.outboundLanes).length,
      inboundLaneCount: Object.keys(result.data.inboundLanes).length,
    })

    // Create token directory metadata
    const metadata: TokenDirectoryMetadata = {
      environment,
      timestamp: new Date().toISOString(),
      requestId,
      symbol: tokenCanonicalSymbol,
      sourceChain: formattedSourceChain,
    }

    const response: TokenDirectoryApiResponse = {
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
      message: "Error processing token directory request",
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
