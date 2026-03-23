/**
 * Reference data resolver — bridges static reference data (tokens.json, chains.json)
 * with the GraphQL API by providing token address lookups and chain name mapping.
 *
 * This module caches loaded reference data per environment to avoid repeated
 * file reads during a single serverless invocation.
 *
 * Key responsibilities:
 * - Resolve token symbol + directory key → token address (from tokens.json)
 * - Map directory key → selector name (for GraphQL `network` field)
 * - Batch resolve all chain addresses for a token
 */

import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"
import { Environment, Version } from "~/config/data/ccip/types.ts"
import { loadReferenceData } from "~/config/data/ccip/index.ts"
import { directoryToSupportedChain, getChainTypeAndFamily } from "~/features/utils/index.ts"
import type { ChainFamily } from "~/lib/ccip/graphql/utils/address-display.ts"

// Cache loaded reference data and chain services per environment
const refDataCache = new Map<
  string,
  {
    tokensReferenceData: Record<string, Record<string, { tokenAddress?: string }>>
    chainIdService: ChainIdentifierService
  }
>()

function getRefData(environment: Environment) {
  const cached = refDataCache.get(environment)
  if (cached) return cached

  const { tokensReferenceData } = loadReferenceData({ environment, version: Version.V1_2_0 })
  const chainIdService = new ChainIdentifierService(environment)

  const entry = {
    tokensReferenceData: tokensReferenceData as Record<string, Record<string, { tokenAddress?: string }>>,
    chainIdService,
  }
  refDataCache.set(environment, entry)
  return entry
}

/**
 * Resolves a token address from tokens.json using token symbol and directory key.
 * @returns Token address or null if not found
 */
export function resolveTokenAddress(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string
): string | null {
  const { tokensReferenceData } = getRefData(environment)
  return tokensReferenceData[tokenSymbol]?.[directoryKey]?.tokenAddress || null
}

/**
 * Resolves all token addresses for a token across all chains.
 * @returns Map of directoryKey → tokenAddress
 */
export function resolveAllTokenAddresses(environment: Environment, tokenSymbol: string): Record<string, string> {
  const { tokensReferenceData } = getRefData(environment)
  const chainEntries = tokensReferenceData[tokenSymbol]
  if (!chainEntries) return {}

  const result: Record<string, string> = {}
  for (const [directoryKey, info] of Object.entries(chainEntries)) {
    if (info.tokenAddress) {
      result[directoryKey] = info.tokenAddress
    }
  }
  return result
}

/**
 * Maps a directory key (e.g., "mainnet") to a selector name (e.g., "ethereum-mainnet").
 * Selector names are used as the `network` field in GraphQL queries.
 * @returns Selector name, or the input directoryKey if no mapping exists
 */
export function toSelectorName(environment: Environment, directoryKey: string): string {
  const { chainIdService } = getRefData(environment)
  return chainIdService.getSelectorName(directoryKey) ?? directoryKey
}

/**
 * Resolves a user-provided token symbol to its canonical form in tokens.json.
 * Handles case-insensitive matching and whitespace trimming.
 * @returns Canonical token symbol or null if not found
 */
export function resolveTokenSymbol(environment: Environment, input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const { tokensReferenceData } = getRefData(environment)

  // Exact match first (fast path)
  if (trimmed in tokensReferenceData) return trimmed

  // Case-insensitive fallback
  const lowerInput = trimmed.toLowerCase()
  for (const symbol of Object.keys(tokensReferenceData)) {
    if (symbol.toLowerCase() === lowerInput) return symbol
  }

  return null
}

/**
 * Returns all token symbols from the reference data.
 */
export function getAllTokenSymbols(environment: Environment): string[] {
  const { tokensReferenceData } = getRefData(environment)
  return Object.keys(tokensReferenceData)
}

/**
 * Resolves a directory key to its chain family (evm, solana, aptos, etc.).
 * Used for address display normalization.
 * @returns Chain family or null if resolution fails (address should be returned as-is)
 */
export function getChainFamilyForDirectoryKey(directoryKey: string): ChainFamily | null {
  const supportedChain = directoryToSupportedChain(directoryKey)
  if (!supportedChain) return null
  const { chainFamily } = getChainTypeAndFamily(supportedChain)
  return chainFamily as ChainFamily
}
