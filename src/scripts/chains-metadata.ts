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
interface Explorer {
  name: string
  url: string
  standard: string
  icon?: string
}

interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

interface ChainMetadata {
  name: string
  chain: string
  chainId: number
  rpc: string[]
  faucets: string[]
  nativeCurrency: NativeCurrency
  infoURL: string
  shortName: string
  networkId: number
  icon?: string
  explorers?: Explorer[]
  title?: string
  features?: Array<{ name: string }>
  status?: string
  redFlags?: string[]
  parent?: {
    type: string
    chain: string
    bridges?: Array<{ url: string }>
  }
  slip44?: number
}

// Type guard functions
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNativeCurrency(value: unknown): value is NativeCurrency {
  if (!isRecord(value)) return false
  return typeof value.name === "string" && typeof value.symbol === "string" && typeof value.decimals === "number"
}

function isExplorer(value: unknown): value is Explorer {
  if (!isRecord(value)) return false
  return (
    typeof value.name === "string" &&
    typeof value.url === "string" &&
    typeof value.standard === "string" &&
    (value.icon === undefined || typeof value.icon === "string")
  )
}

function validateChainMetadataArray(data: unknown): ChainMetadata[] {
  if (!Array.isArray(data)) {
    throw new ValidationError("Expected an array of chain metadata", data)
  }

  return data.map((item) => {
    if (!isRecord(item)) {
      throw new ValidationError("Chain metadata must be an object", item)
    }

    // Essential properties that we absolutely need
    if (typeof item.chainId !== "number") {
      throw new ValidationError("Chain metadata must have a numeric chainId", item)
    }

    // Validate known fields but keep the original object
    const warnings: string[] = []

    // Check for unknown fields by comparing with our type definition
    const knownFields = new Set([
      "name",
      "chain",
      "chainId",
      "rpc",
      "faucets",
      "nativeCurrency",
      "infoURL",
      "shortName",
      "networkId",
      "icon",
      "explorers",
      "title",
      "features",
      "status",
      "redFlags",
      "parent",
      "slip44",
    ])

    Object.keys(item).forEach((key) => {
      if (!knownFields.has(key)) {
        warnings.push(`Unknown field detected: "${key}" with value: ${JSON.stringify(item[key])}`)
      }
    })

    // Validate known fields without modifying the structure
    if (item.name !== undefined && typeof item.name !== "string") {
      warnings.push(`Invalid name format: expected string, got ${typeof item.name}`)
    }

    if (item.chain !== undefined && typeof item.chain !== "string") {
      warnings.push(`Invalid chain format: expected string, got ${typeof item.chain}`)
    }

    if (item.rpc !== undefined && (!Array.isArray(item.rpc) || !item.rpc.every((url) => typeof url === "string"))) {
      warnings.push("Invalid rpc format: expected array of strings")
    }

    if (
      item.faucets !== undefined &&
      (!Array.isArray(item.faucets) || !item.faucets.every((url) => typeof url === "string"))
    ) {
      warnings.push("Invalid faucets format: expected array of strings")
    }

    if (item.nativeCurrency !== undefined && !isNativeCurrency(item.nativeCurrency)) {
      warnings.push("Invalid nativeCurrency format")
    }

    if (item.infoURL !== undefined && typeof item.infoURL !== "string") {
      warnings.push(`Invalid infoURL format: expected string, got ${typeof item.infoURL}`)
    }

    if (item.shortName !== undefined && typeof item.shortName !== "string") {
      warnings.push(`Invalid shortName format: expected string, got ${typeof item.shortName}`)
    }

    if (item.networkId !== undefined && typeof item.networkId !== "number") {
      warnings.push(`Invalid networkId format: expected number, got ${typeof item.networkId}`)
    }

    if (item.icon !== undefined && typeof item.icon !== "string") {
      warnings.push(`Invalid icon format: expected string, got ${typeof item.icon}`)
    }

    if (item.explorers !== undefined) {
      if (!Array.isArray(item.explorers)) {
        warnings.push("Invalid explorers format: expected array")
      } else {
        item.explorers.forEach((explorer, index) => {
          if (!isExplorer(explorer)) {
            warnings.push(`Invalid explorer format at index ${index}`)
          }
        })
      }
    }

    // Log warnings if any
    if (warnings.length > 0) {
      console.warn(`\nWarnings for chain ${item.chainId}:`)
      warnings.forEach((warning) => console.warn(`  - ${warning}`))
    }

    // Return the original item, maintaining its structure
    // We've validated the essential fields above, so this cast is safe
    return item as unknown as ChainMetadata
  })
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
 * Get differences between two objects for logging
 * @param oldObj Original object
 * @param newObj New object
 * @param parent Parent key path
 * @returns Array of difference strings
 */
function getObjectDiffs(oldObj: unknown, newObj: unknown, parent = ""): string[] {
  if (!isRecord(oldObj) || !isRecord(newObj)) {
    if (oldObj !== newObj) {
      return [`${parent}: "${oldObj}" -> "${newObj}"`]
    }
    return []
  }

  const diffs: string[] = []
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])

  for (const key of allKeys) {
    const oldVal = oldObj[key]
    const newVal = newObj[key]
    const keyPath = parent ? `${parent}.${key}` : key

    // Skip if both values are undefined or equal
    if (oldVal === newVal) continue

    // Handle arrays specially
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      if (!isEqual(oldVal, newVal)) {
        // For arrays, just show the length change if different
        if (oldVal.length !== newVal.length) {
          diffs.push(`${keyPath}: array length changed from ${oldVal.length} to ${newVal.length}`)
        } else {
          diffs.push(`${keyPath}: array contents changed`)
        }
      }
      continue
    }

    // Recursive check for nested objects
    if (isRecord(oldVal) && isRecord(newVal)) {
      diffs.push(...getObjectDiffs(oldVal, newVal, keyPath))
      continue
    }

    // Simple value change
    if (oldVal !== newVal) {
      diffs.push(`${keyPath}: "${oldVal}" -> "${newVal}"`)
    }
  }

  return diffs
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

  // Update/add new chains with change detection
  newChains.forEach((newChain) => {
    const existingChain = merged.get(newChain.chainId)
    if (existingChain) {
      if (!isEqual(existingChain, newChain)) {
        console.warn(`\nChanges detected for chain ${newChain.chainId}:`)
        const diffs = getObjectDiffs(existingChain, newChain)
        diffs.forEach((diff) => console.warn(`  ${diff}`))
      } else {
        console.log(`\nChain ${newChain.chainId} exists and is identical - no update needed`)
      }
    } else {
      console.warn(`\nAdding new chain ${newChain.chainId}`)
    }
    merged.set(newChain.chainId, newChain)
  })

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
    // First get the raw data without validation
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
    if (!Array.isArray(data)) {
      throw new ValidationError("Expected an array of chain metadata", data)
    }

    // Pre-filter the chains we're interested in
    const requestedChains = data.filter(
      (item) => isRecord(item) && typeof item.chainId === "number" && chainIds.includes(item.chainId)
    )

    // Now validate only the chains we care about
    const validatedChains = validateChainMetadataArray(requestedChains)

    if (validatedChains.length === 0) {
      throw new ValidationError("No valid chains found to update", chainIds)
    }

    // Check for missing chains
    const foundChainIds = new Set(validatedChains.map((chain) => chain.chainId))
    const missingChainIds = chainIds.filter((id) => !foundChainIds.has(id))

    if (missingChainIds.length > 0) {
      console.warn(`Warning: The following chain IDs were not found: ${missingChainIds.join(", ")}`)
    }

    // Track which chains actually need updates
    const changedChains = validatedChains.filter((newChain) => {
      const existingChain = currentChainsMetadata.find((chain) => chain.chainId === newChain.chainId)
      return !existingChain || !isEqual(existingChain, newChain)
    })

    if (changedChains.length > 0) {
      const updatedChains = mergeChainMetadata(currentChainsMetadata, validatedChains)
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
      console.log(`\nSuccessfully updated ${changedChains.length} chain(s)`)
    } else {
      console.log(`\nNo updates needed - all chains are up to date`)
    }
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
