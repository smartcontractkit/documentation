import { ChainFamily } from "@config/types.ts"
import { FamilyAdapter } from "~/lib/ccip/types/faucet.ts"
import { SvmAdapter } from "./svm.ts"

export const prerender = false

/**
 * Factory for creating family-specific adapters
 * Currently only supports SVM (Solana) chains
 */
export class FaucetAdapterFactory {
  static getAdapter(family: ChainFamily): FamilyAdapter {
    switch (family) {
      case "solana":
        return new SvmAdapter()
      default:
        throw new Error(`Faucet not available for chain family: ${family}`)
    }
  }
}

// Re-export types and adapters
export type { FamilyAdapter } from "~/lib/ccip/types/faucet.ts"
export { SvmAdapter } from "./svm.ts"
export { SvmDripAdapter } from "./svm-drip.ts"
