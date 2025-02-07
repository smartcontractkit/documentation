import type { APIRoute } from "astro"
import {
  validateEnvironment,
  validateFilters,
  validateOutputKey,
  createMetadata,
  handleApiError,
  successHeaders,
  commonHeaders,
  loadChainConfiguration,
  FilterType,
} from "../utils"

import type { ChainDetails, ChainApiResponse } from "../types"
import { ChainDataService } from "../../services/chain-data"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const params = url.searchParams

    // Validate environment
    const environment = validateEnvironment(params.get("environment") || undefined)

    // Validate filters
    const filters: FilterType = {
      chainId: params.get("chainId") || undefined,
      selector: params.get("selector") || undefined,
      internalId: params.get("internalId") || undefined,
    }
    validateFilters(filters)

    // Validate output key
    const outputKey = validateOutputKey(params.get("outputKey") || undefined)

    const config = await loadChainConfiguration(environment)
    const chainDataService = new ChainDataService(config.chainsConfig, config.selectorConfig)
    const { chains, errors, metadata: serviceMetadata } = await chainDataService.getFilteredChains(environment, filters)

    const metadata = createMetadata(environment)
    metadata.ignoredChainCount = serviceMetadata.ignoredChainCount
    metadata.validChainCount = serviceMetadata.validChainCount

    const response: ChainApiResponse = {
      metadata,
      data: {
        evm: chains.reduce((acc, chain) => {
          const key = outputKey ? chain[outputKey].toString() : chain.internalId
          acc[key] = chain
          return acc
        }, {} as Record<string, ChainDetails>),
      },
      ignored: errors,
    }

    return new Response(JSON.stringify(response), {
      headers: { ...commonHeaders, ...successHeaders },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
