import evmConfig from "./selectors.yml"
import solanaConfig from "./selectors_solana.yml"
import aptosConfig from "./selectors_aptos.yml"
import suiConfig from "./selectors_sui.yml"
import cantonConfig from "./selectors_canton.yml"
import tonConfig from "./selectors_ton.yml"
import tronConfig from "./selectors_tron.yml"
import stellarConfig from "./selectors_stellar.yml"
import starknetConfig from "./selectors_starknet.yml"
import { ChainType } from "@config/types.ts"

export interface Selector {
  selector: string
  name: string
  network_type?: "mainnet" | "testnet"
}

export interface SelectorsConfig {
  selectors: Record<string, Selector>
}

export interface SelectorWithMeta {
  chainId: string
  selector: string
  name: string
  networkType: "mainnet" | "testnet"
  chainType: ChainType
}

// Chain-specific configs
export type EvmSelectorsConfig = SelectorsConfig
export type SolanaSelectorsConfig = SelectorsConfig
export type AptosSelectorsConfig = SelectorsConfig
export type SuiSelectorsConfig = SelectorsConfig
export type CantonSelectorsConfig = SelectorsConfig
export type TonSelectorsConfig = SelectorsConfig
export type TronSelectorsConfig = SelectorsConfig
export type StellarSelectorsConfig = SelectorsConfig
export type StarknetSelectorsConfig = SelectorsConfig

// Cast configs to appropriate types
const evmSelectorsConfig = evmConfig as unknown as EvmSelectorsConfig
const solanaSelectorsConfig = solanaConfig as unknown as SolanaSelectorsConfig
const aptosSelectorsConfig = aptosConfig as unknown as AptosSelectorsConfig
const suiSelectorsConfig = suiConfig as unknown as SuiSelectorsConfig
const cantonSelectorsConfig = cantonConfig as unknown as CantonSelectorsConfig
const tonSelectorsConfig = tonConfig as unknown as TonSelectorsConfig
const tronSelectorsConfig = tronConfig as unknown as TronSelectorsConfig
const stellarSelectorsConfig = stellarConfig as unknown as StellarSelectorsConfig
const starknetSelectorsConfig = starknetConfig as unknown as StarknetSelectorsConfig

/**
 * Retrieves the selector configuration for the given chainId and chain type.
 * @param chainId The chain ID (string or number) for which to retrieve the selector.
 * @param chainType The chain type to look up in.
 * @returns The selector entry { selector: string; name: string } if found, otherwise undefined.
 */
export function getSelectorEntry(
  chainId: string | number,
  chainType: ChainType
): { selector: string; name: string } | undefined {
  // Convert number to string if needed
  const chainIdStr = String(chainId)

  // Look up in the appropriate config based on chain type
  let result: Selector | null = null

  switch (chainType) {
    case "evm":
      result = evmSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "solana":
      result = solanaSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "aptos":
      result = aptosSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "sui":
      result = suiSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "canton":
      result = cantonSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "ton":
      result = tonSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "tron":
      result = tronSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "stellar":
      result = stellarSelectorsConfig.selectors?.[chainIdStr] || null
      break
    case "starknet":
      result = starknetSelectorsConfig.selectors?.[chainIdStr] || null
      break
  }

  // If found, return as { selector, name } format
  return result ? { selector: result.selector, name: result.name } : undefined
}

/**
 * Retrieves all selectors for a given chain type and network type
 * @param chainType The chain type to get selectors for
 * @param networkType The network type (mainnet/testnet) to filter by
 * @returns Array of selector entries with metadata
 */
export function getAllSelectors(chainType: ChainType, networkType: "mainnet" | "testnet"): SelectorWithMeta[] {
  let config: SelectorsConfig

  switch (chainType) {
    case "evm":
      config = evmSelectorsConfig
      break
    case "solana":
      config = solanaSelectorsConfig
      break
    case "aptos":
      config = aptosSelectorsConfig
      break
    case "sui":
      config = suiSelectorsConfig
      break
    case "canton":
      config = cantonSelectorsConfig
      break
    case "ton":
      config = tonSelectorsConfig
      break
    case "tron":
      config = tronSelectorsConfig
      break
    case "stellar":
      config = stellarSelectorsConfig
      break
    case "starknet":
      config = starknetSelectorsConfig
      break
    default:
      return []
  }

  return Object.entries(config.selectors)
    .filter(([_, data]) => data.network_type === networkType)
    .map(([chainId, data]) => ({
      chainId,
      selector: data.selector,
      name: data.name,
      networkType: data.network_type as "mainnet" | "testnet",
      chainType,
    }))
}
