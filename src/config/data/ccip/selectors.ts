import evmConfig from "./selectors.yml"
import solanaConfig from "./selectors_solana.yml"
import aptosConfig from "./selectors_aptos.yml"
import { ChainType } from "@config/types.ts"

export interface Selector {
  selector: string
  name: string
}

export interface SelectorsConfig {
  selectors: Record<string, Selector>
}

// Chain-specific configs
export type EvmSelectorsConfig = SelectorsConfig
export type SolanaSelectorsConfig = SelectorsConfig
export type AptosSelectorsConfig = SelectorsConfig

// Cast configs to appropriate types
const evmSelectorsConfig = evmConfig as unknown as EvmSelectorsConfig
const solanaSelectorsConfig = solanaConfig as unknown as SolanaSelectorsConfig
const aptosSelectorsConfig = aptosConfig as unknown as AptosSelectorsConfig

/**
 * Retrieves the selector configuration for the given chainId and chain type.
 * @param chainId The chain ID (string or number) for which to retrieve the selector.
 * @param chainType The chain type (evm, solana, aptos) to look up in.
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
  }

  // If found, return as { selector, name } format
  return result ? { selector: result.selector, name: result.name } : undefined
}
