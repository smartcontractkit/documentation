/**
 * BnM token address resolution using CCIP registry data
 */

import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { address, type Address } from "@solana/kit"
import type { SupportedChain } from "@config/types.ts"

/**
 * Pre-computed BnM token addresses
 */
const COMPUTED_ADDRESSES: Pick<Record<SupportedChain, Address | null>, "SOLANA_DEVNET"> = {
  SOLANA_DEVNET: (() => {
    try {
      const bnmParams = getBnMParams({
        supportedChain: "SOLANA_DEVNET",
        version: Version.V1_2_0,
      })

      if (bnmParams?.options?.address) {
        return address(bnmParams.options.address)
      }

      console.warn("No BnM token address found for SOLANA_DEVNET")
      return null
    } catch (error) {
      console.error("Failed to resolve BnM token address for SOLANA_DEVNET during module load:", error)
      return null
    }
  })(),
}

/**
 * BnM token addresses for supported chains
 */
export const BNM_MINT_ADDRESSES: Partial<Record<SupportedChain, Address | null>> = {
  SOLANA_DEVNET: COMPUTED_ADDRESSES.SOLANA_DEVNET,
  // Future: SOLANA_MAINNET, SOLANA_TESTNET, etc.
} as const
