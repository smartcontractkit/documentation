import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateFilters,
  validateOutputKey,
  validateEnrichFeeTokens,
  validateSearch,
  validateFamily,
  validateSearchParams,
  validateInternalIdFormat,
  generateChainKey,
  createMetadata,
  loadChainConfiguration,
  FilterType,
  APIErrorType,
  createErrorResponse,
  CCIPError,
} from "~/lib/ccip/utils.ts"
import { jsonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"

import type { ChainDetails, ChainApiResponse, ChainFamily } from "~/lib/ccip/types/index.ts"
import { ChainDataService, getAllChainsForSearch } from "~/lib/ccip/services/chain-data.ts"
import { searchChains } from "~/lib/ccip/services/chain-search.ts"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"

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

    // Validate search and family (new unified search params)
    const search = validateSearch(params.get("search"))
    const family = validateFamily(params.get("family"))
    logger.debug({
      message: "Search params validated",
      requestId,
      search,
      family,
    })

    // Validate legacy filters
    const filters: FilterType = {
      chainId: params.get("chainId") || undefined,
      selector: params.get("selector") || undefined,
      internalId: params.get("internalId") || undefined,
    }
    validateFilters(filters)

    // Validate mutual exclusion of search and legacy filters
    validateSearchParams(search, filters)

    // Warn if family is used with legacy filters (family has no effect in legacy mode)
    const hasLegacyFilter = filters.chainId || filters.selector || filters.internalId
    if (family && hasLegacyFilter) {
      logger.warn({
        message: "family parameter is ignored when using legacy filters (chainId, selector, internalId)",
        requestId,
        family,
        filters,
      })
    }

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

    // Validate internalIdFormat parameter (only applies when outputKey=internalId)
    const internalIdFormat = validateInternalIdFormat(params.get("internalIdFormat") || undefined)
    logger.debug({
      message: "Internal ID format validated",
      requestId,
      internalIdFormat,
    })

    // Validate enrichFeeTokens parameter
    const enrichFeeTokens = validateEnrichFeeTokens(params.get("enrichFeeTokens") || undefined)
    logger.debug({
      message: "EnrichFeeTokens parameter validated",
      requestId,
      enrichFeeTokens,
    })

    // Initialize chain identifier service for formatting (only used when outputKey=internalId)
    const chainIdService = new ChainIdentifierService(environment, internalIdFormat)

    const config = await loadChainConfiguration(environment)
    logger.debug({
      message: "Chain configuration loaded",
      requestId,
      environment,
      chainCount: Object.keys(config.chainsConfig).length,
    })

    const chainDataService = new ChainDataService(config.chainsConfig, requestId)

    let data: Record<ChainFamily, ChainDetails[]>
    let errors: { chainId: number; networkId: string; reason: string; missingFields: string[] }[]
    const metadata = createMetadata(environment, requestId)

    if (search) {
      // SEARCH MODE: Get all chains (supported + unsupported) and search
      const {
        data: supportedData,
        errors: supportedErrors,
        metadata: _serviceMetadata,
      } = await chainDataService.getFilteredChains(environment, {}, enrichFeeTokens)

      // Flatten supported chains from all families
      const supportedChains = [
        ...supportedData.evm,
        ...supportedData.solana,
        ...supportedData.aptos,
        ...supportedData.sui,
        ...supportedData.tron,
        ...supportedData.canton,
        ...supportedData.ton,
        ...supportedData.stellar,
        ...supportedData.starknet,
      ]

      // Get all chains including unsupported
      const allChains = getAllChainsForSearch(environment, supportedChains)

      // Execute search with optional family filter
      const { results, searchType } = searchChains(search, allChains, family)

      // Group results by family
      data = { evm: [], solana: [], aptos: [], sui: [], tron: [], canton: [], ton: [], stellar: [], starknet: [] }
      for (const chain of results) {
        data[chain.chainFamily].push(chain)
      }

      errors = supportedErrors
      metadata.validChainCount = results.length
      metadata.ignoredChainCount = supportedErrors.length
      metadata.searchQuery = search
      metadata.searchType = searchType

      logger.info({
        message: "Search completed successfully",
        requestId,
        searchQuery: search,
        searchType,
        resultCount: results.length,
        family,
      })
    } else {
      // LEGACY MODE: Existing filter behavior (supported chains only)
      const {
        data: serviceData,
        errors: serviceErrors,
        metadata: serviceMetadata,
      } = await chainDataService.getFilteredChains(environment, filters, enrichFeeTokens)

      // Add supported: true to all chains in legacy mode
      data = {
        evm: serviceData.evm.map((c) => ({ ...c, supported: true })),
        solana: serviceData.solana.map((c) => ({ ...c, supported: true })),
        aptos: serviceData.aptos.map((c) => ({ ...c, supported: true })),
        sui: serviceData.sui.map((c) => ({ ...c, supported: true })),
        tron: serviceData.tron.map((c) => ({ ...c, supported: true })),
        canton: serviceData.canton.map((c) => ({ ...c, supported: true })),
        ton: serviceData.ton.map((c) => ({ ...c, supported: true })),
        stellar: serviceData.stellar.map((c) => ({ ...c, supported: true })),
        starknet: serviceData.starknet.map((c) => ({ ...c, supported: true })),
      }

      errors = serviceErrors
      metadata.validChainCount = serviceMetadata.validChainCount
      metadata.ignoredChainCount = serviceMetadata.ignoredChainCount

      logger.info({
        message: "Chain data retrieved successfully",
        requestId,
        validChainCount: serviceMetadata.validChainCount,
        errorCount: errors.length,
        filters,
      })
    }

    // Convert each chain family's array to a keyed object structure as required by the API
    // Always apply internalIdFormat to format the internalId field in each chain object
    const formattedData = Object.entries(data).reduce(
      (acc, [familyKey, chainList]) => {
        acc[familyKey] = chainList.reduce(
          (familyAcc, chain) => {
            let key: string

            // Always format the internalId field based on internalIdFormat
            const resolved = chainIdService.resolve(chain.internalId)
            const formattedInternalId = resolved
              ? chainIdService.format(resolved.directoryKey, internalIdFormat)
              : chain.internalId
            const formattedChain = { ...chain, internalId: formattedInternalId }

            if (outputKey === "chainId") {
              key = generateChainKey(chain.chainId, chain.chainType, outputKey)
            } else if (outputKey === "internalId") {
              key = formattedInternalId
            } else if (outputKey) {
              key = chain[outputKey].toString()
            } else {
              key = chain.internalId
            }

            familyAcc[key] = formattedChain
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
      headers: jsonHeaders,
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
        requestId
      )
    }

    // Handle all other errors generically without exposing internal details
    return createErrorResponse(
      APIErrorType.SERVER_ERROR,
      "An unexpected error occurred while processing the request.",
      500,
      requestId
    )
  }
}
