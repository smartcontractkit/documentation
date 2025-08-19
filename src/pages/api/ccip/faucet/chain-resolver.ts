import { getSelectorEntry } from "@config/data/ccip/selectors.ts"
import { resolveChainOrThrow } from "../utils.ts"
import { getChainTypeAndFamily, getChainId } from "@features/utils/index.ts"
import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { SupportedChain } from "~/config/types.ts"
import { FaucetChainConfig } from "../types/faucet.ts"

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

    // 4. Get faucet config from environment variables and CCIP-BnM token
    const faucetAddress = getFaucetAddress(chainName)
    const allowedTokens = getCcipBnmTokenAddress(supportedChain)

    return {
      chainName,
      selector,
      family: chainFamily,
      chainType,
      faucetAddress,
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
 * Gets faucet address from environment variables
 */
function getFaucetAddress(chainName: string): string | undefined {
  const envKey = `${chainName.toUpperCase().replace("-", "_")}_FAUCET`
  return process.env[envKey]
}

/**
 * Gets CCIP-BnM token address for the faucet (only supported token)
 */
function getCcipBnmTokenAddress(supportedChain: SupportedChain): string[] {
  // Only CCIP-BnM is supported for faucet operations
  const bnmParams = getBnMParams({
    supportedChain, // Type conversion needed for existing API
    version: Version.V1_2_0,
  })

  return bnmParams?.options.address ? [bnmParams.options.address] : []
}
