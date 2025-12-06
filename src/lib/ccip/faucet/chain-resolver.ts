import { getSelectorEntry } from "@config/data/ccip/selectors.ts"
import { resolveChainOrThrow } from "~/lib/ccip/utils.ts"
import { getChainTypeAndFamily, getChainId, directoryToSupportedChain } from "@features/utils/index.ts"
import { FaucetChainConfig } from "~/lib/ccip/types/faucet.ts"
import { getFaucetAddress, getSolanaDevnetConfig } from "@lib/core/config/index.ts"
import { BNM_MINT_ADDRESSES } from "@lib/solana/core/constants/token-resolver.ts"

export const prerender = false

/**
 * Resolves a chain name to faucet configuration
 * @param chainName - Chain name (e.g., 'solana-devnet', 'ethereum-sepolia')
 * @returns FaucetChainConfig or null if not supported
 */
export function resolveFaucetChain(chainName: string): FaucetChainConfig | null {
  try {
    // 1. Use existing resolveChainOrThrow() from CCIP utils
    const supportedChain = resolveChainOrThrow(chainName)

    // 2. Get family/type from existing getChainTypeAndFamily()
    const { chainType, chainFamily } = getChainTypeAndFamily(supportedChain)

    // 3. Get selector from existing getSelectorEntry()
    let selector: string
    try {
      const chainId = getChainId(supportedChain)
      if (!chainId) {
        return null
      }
      const selectorEntry = getSelectorEntry(chainId, chainType)
      if (!selectorEntry) {
        return null
      }
      selector = selectorEntry.selector
    } catch {
      return null
    }

    // 4. Get faucet config from simplified configuration and CCIP-BnM token using centralized resolver
    const faucetAddress = chainName === "solana-devnet" ? getFaucetAddress() : undefined
    const allowedTokens = getBnMTokensForChain(chainName)
    const rpcUrl = getRpcUrlFromCoreConfig(chainName)

    return {
      chainName,
      selector,
      family: chainFamily,
      chainType,
      faucetAddress: faucetAddress || "",
      rpcUrl,
      enabled: !!faucetAddress && allowedTokens.length > 0,
      allowedTokens,
      cooldownSeconds: 3600, // 1 hour default
    }
  } catch (error) {
    console.warn(`Failed to resolve faucet chain: ${chainName}`, error)
    return null
  }
}

/**
 * Gets BnM token addresses for the given chain using centralized resolver
 * Uses existing directoryToSupportedChain utility for consistent mapping
 */
function getBnMTokensForChain(chainName: string): string[] {
  try {
    const supportedChain = directoryToSupportedChain(chainName)
    const bnmAddress = BNM_MINT_ADDRESSES[supportedChain]
    return bnmAddress ? [bnmAddress.toString()] : []
  } catch {
    // Chain not supported for BnM tokens
    return []
  }
}

/**
 * Gets RPC URL from core library configuration
 * Uses centralized configuration management instead of duplicating logic
 */
function getRpcUrlFromCoreConfig(chainName: string): string {
  switch (chainName) {
    case "solana-devnet":
      try {
        const config = getSolanaDevnetConfig()
        return config.rpcUrl
      } catch (error) {
        console.warn(`Failed to get RPC URL for ${chainName}:`, error)
        return ""
      }
    default:
      return ""
  }
}
