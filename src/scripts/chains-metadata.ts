import linkNameSymbol from "./reference/linkNameSymbol.json"
import currentChainsMetadata from "./reference/chains.json"
import fetch from "node-fetch"
import { isEqual } from "lodash"
import { writeFile } from "fs/promises"
import { normalize } from "path"
import { format } from "prettier"

// Configuration constants
const CONFIG = {
  CHAINS_METADATA_SOURCE: "https://chainid.network/chains.json",
  REQUEST_TIMEOUT_MS: 5000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  CURRENT_CHAINS_PATH: "./src/scripts/reference/chains.json",
  CHAINS_TO_BE_PATH: "./src/scripts/reference/chainsToBe.json",
} as const

// Custom error types for better error handling
class ChainMetadataError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = "ChainMetadataError"
  }
}

class ValidationError extends ChainMetadataError {
  constructor(message: string, public readonly invalidData?: unknown) {
    super(message)
    this.name = "ValidationError"
  }
}

// Type definitions
interface ChainMetadata {
  name: string
  chain: string
  chainId: number
}

interface ChainValidationResult {
  validChainIds: number[]
  missingChainIds: number[]
}

// Type guard functions
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isChainMetadata(value: unknown): value is ChainMetadata {
  if (!isRecord(value)) return false

  const hasRequiredProperties =
    typeof value.name === "string" && typeof value.chain === "string" && typeof value.chainId === "number"

  return hasRequiredProperties
}

function validateChainMetadataArray(data: unknown): ChainMetadata[] {
  if (!Array.isArray(data)) {
    throw new ValidationError("Expected an array of chain metadata", data)
  }

  const invalidItems = data.filter((item) => !isChainMetadata(item))
  if (invalidItems.length > 0) {
    throw new ValidationError("Some items in the array are not valid chain metadata", invalidItems)
  }

  return data as ChainMetadata[]
}

/**
 * Parse and validate chain IDs from command line input
 * @param input Comma-separated chain IDs
 * @throws {ValidationError} When input format is invalid
 * @returns {number[]} Array of valid chain IDs
 */
function parseChainIds(input: string): number[] {
  try {
    const chainIds = input.split(",").map((id) => {
      const parsed = parseInt(id.trim(), 10)
      if (isNaN(parsed)) {
        throw new ValidationError(`Invalid chain ID: ${id}`, id)
      }
      return parsed
    })

    if (chainIds.length === 0) {
      throw new ValidationError("No valid chain IDs provided", input)
    }

    return chainIds
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError("Failed to parse chain IDs", input)
  }
}

// Helper function for delayed retry
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Helper function to fetch chains metadata from reference api with retry mechanism
 * @throws {ChainMetadataError} When the fetch operation fails after all retries
 * @returns {Promise<ChainMetadata[]>} Array of chain metadata
 */
const getChainsMetadata = async (): Promise<ChainMetadata[]> => {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS)

      const response = await fetch(CONFIG.CHAINS_METADATA_SOURCE, {
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return validateChainMetadataArray(data)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (error instanceof ValidationError) {
        throw error // Don't retry validation errors
      }

      if (attempt < CONFIG.MAX_RETRIES) {
        await delay(CONFIG.RETRY_DELAY_MS * attempt) // Exponential backoff
        continue
      }
    }
  }

  throw new ChainMetadataError(`Failed to fetch chain metadata after ${CONFIG.MAX_RETRIES} attempts`, lastError)
}

/**
 * Validate requested chains against API response
 * @param chainIds Requested chain IDs
 * @param apiChains Chain metadata from API
 * @returns {ChainValidationResult} Validation result with valid and missing chain IDs
 */
function validateRequestedChains(chainIds: number[], apiChains: ChainMetadata[]): ChainValidationResult {
  const apiChainIds = new Set(apiChains.map((chain) => chain.chainId))
  const validChainIds: number[] = []
  const missingChainIds: number[] = []

  chainIds.forEach((chainId) => {
    if (apiChainIds.has(chainId)) {
      validChainIds.push(chainId)
    } else {
      missingChainIds.push(chainId)
    }
  })

  return { validChainIds, missingChainIds }
}

/**
 * Helper function to filter and sort chain metadata
 * @param chainsMetadata All chain metadata
 * @param targetChainIds Target chain IDs to filter
 * @returns {ChainMetadata[]} Filtered and sorted chain metadata
 */
function filterAndSortChains(chainsMetadata: ChainMetadata[], targetChainIds?: number[]): ChainMetadata[] {
  let filteredChains = chainsMetadata

  if (targetChainIds) {
    const targetChainIdSet = new Set(targetChainIds)
    filteredChains = chainsMetadata.filter((chain) => targetChainIdSet.has(chain.chainId))
  }

  return filteredChains.sort((a, b) => a.chainId - b.chainId)
}

/**
 * Update existing chains with new ones while maintaining sort order
 * @param current Current chain metadata
 * @param newChains New chain metadata to merge
 * @returns {ChainMetadata[]} Merged and sorted chain metadata
 */
function mergeChainMetadata(current: ChainMetadata[], newChains: ChainMetadata[]): ChainMetadata[] {
  const merged = new Map<number, ChainMetadata>()

  // Add current chains to map
  current.forEach((chain) => merged.set(chain.chainId, chain))

  // Update/add new chains
  newChains.forEach((chain) => merged.set(chain.chainId, chain))

  // Convert back to array and sort
  return Array.from(merged.values()).sort((a, b) => a.chainId - b.chainId)
}

/**
 * Handle specific chain IDs update flow
 * @param chainIds Requested chain IDs
 * @throws {ChainMetadataError} When update operation fails
 */
async function handleSpecificChains(chainIds: number[]): Promise<void> {
  try {
    const apiChains = await getChainsMetadata()
    const { validChainIds, missingChainIds } = validateRequestedChains(chainIds, apiChains)

    if (missingChainIds.length > 0) {
      console.warn(`Warning: The following chain IDs were not found: ${missingChainIds.join(", ")}`)
    }

    if (validChainIds.length === 0) {
      throw new ValidationError("No valid chains found to update", chainIds)
    }

    const newChains = filterAndSortChains(apiChains, validChainIds)
    const updatedChains = mergeChainMetadata(currentChainsMetadata, newChains)

    await writeFile(
      normalize(CONFIG.CURRENT_CHAINS_PATH),
      format(JSON.stringify(updatedChains), {
        parser: "json",
        semi: true,
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 120,
      }),
      { flag: "w" }
    )

    console.log(`Successfully updated ${validChainIds.length} chains`)
  } catch (error) {
    throw new ChainMetadataError("Failed to update specific chains", error)
  }
}

/**
 * Handle full comparison flow (original functionality)
 */
async function handleFullComparison(): Promise<void> {
  try {
    const toBeChainsMetadata = await getSupportedChainsMetadata()
    const result = isEqual(currentChainsMetadata, toBeChainsMetadata)
      ? { isEqual: true }
      : { isEqual: false, toBeChainsMetadata }

    if (!result.isEqual && result.toBeChainsMetadata) {
      await writeFile(
        normalize(CONFIG.CHAINS_TO_BE_PATH),
        format(JSON.stringify(result.toBeChainsMetadata), {
          parser: "json",
          semi: true,
          trailingComma: "es5",
          singleQuote: true,
          printWidth: 120,
        }),
        { flag: "w" }
      )
    }
  } catch (error) {
    throw new ChainMetadataError("Failed to handle full comparison", error)
  }
}

/**
 * Helper function to filter the chain metadata to keep only the supported chain ids
 * The result is then sorted by chainId in ascending order
 * @throws {ChainMetadataError} When filtering or sorting operations fail
 * @returns {Promise<ChainMetadata[]>} Filtered and sorted chain metadata
 */
const getSupportedChainsMetadata = async (): Promise<ChainMetadata[]> => {
  try {
    const chainsMetadata = await getChainsMetadata()
    const supportedChainsMetadata = chainsMetadata.filter((chainMetadata) => {
      if (!chainMetadata.chainId) {
        throw new ValidationError("Chain metadata missing chainId", chainMetadata)
      }
      return chainMetadata.chainId.toString() in linkNameSymbol
    })

    return supportedChainsMetadata.sort((a, b) => a.chainId - b.chainId)
  } catch (error) {
    if (error instanceof ChainMetadataError) {
      throw error
    }
    throw new ChainMetadataError("Failed to process supported chains metadata", error)
  }
}

// Main execution
const main = async () => {
  try {
    const chainIdsArg = process.argv[2]
    if (chainIdsArg) {
      const chainIds = parseChainIds(chainIdsArg)
      await handleSpecificChains(chainIds)
    } else {
      await handleFullComparison()
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
