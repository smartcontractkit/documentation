import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateFilters,
  validateOutputKey,
  generateChainKey,
  createMetadata,
  handleApiError,
  successHeaders,
  commonHeaders,
  loadChainConfiguration,
  FilterType,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "../utils.ts"
import { logger } from "@lib/logging/index.js"

import type { ChainDetails, ChainApiResponse } from "../types/index.ts"
import { ChainDataService } from "../../services/chain-data.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const requestId = crypto.randomUUID()

  try {
    logger.info({
      message: "Processing CCIP chains request",
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

    // Validate filters
    const filters: FilterType = {
      chainId: params.get("chainId") || undefined,
      selector: params.get("selector") || undefined,
      internalId: params.get("internalId") || undefined,
    }
    validateFilters(filters)
    logger.debug({
      message: "Filters validated",
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

    const config = await loadChainConfiguration(environment)
    logger.debug({
      message: "Chain configuration loaded",
      requestId,
      environment,
      chainCount: Object.keys(config.chainsConfig).length,
    })

    const chainDataService = new ChainDataService(config.chainsConfig)
    const { data, errors, metadata: serviceMetadata } = await chainDataService.getFilteredChains(environment, filters)

    logger.info({
      message: "Chain data retrieved successfully",
      requestId,
      validChainCount: serviceMetadata.validChainCount,
      errorCount: errors.length,
      filters,
    })

    const metadata = createMetadata(environment)
    metadata.ignoredChainCount = serviceMetadata.ignoredChainCount
    metadata.validChainCount = serviceMetadata.validChainCount

    // Convert each chain family's array to a keyed object structure as required by the API
    const formattedData = Object.entries(data).reduce(
      (acc, [family, chainList]) => {
        acc[family] = chainList.reduce(
          (familyAcc, chain) => {
            const key =
              outputKey === "chainId"
                ? generateChainKey(chain.chainId, chain.chainType, outputKey)
                : outputKey
                  ? chain[outputKey].toString()
                  : chain.internalId
            familyAcc[key] = chain
            return familyAcc
          },
          {} as Record<string, ChainDetails>
        )
        return acc
      },
      {} as Record<string, Record<string, ChainDetails>>
    )

    const response: ChainApiResponse = {
      metadata,
      data: formattedData,
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
      message: "Error processing chains request",
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
      return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to process chain request", 500, {
        message: error.message,
      })
    }
    return handleApiError(error)
  }
}
