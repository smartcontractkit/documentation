import { ChainFamily } from "@config/types.ts"
import { FamilyAdapter } from "../../types/faucet.ts"
import { SvmAdapter } from "./svm.ts"

/**
 * Factory for creating family-specific adapters
 * Currently only supports SVM (Solana) chains
 */
export class FaucetAdapterFactory {
  static getAdapter(family: ChainFamily): FamilyAdapter {
    switch (family) {
      case "svm":
        return new SvmAdapter()
      default:
        throw new Error(`Faucet not available for chain family: ${family}`)
    }
  }
}

// Re-export types and adapters
export type { FamilyAdapter } from "../../types/faucet.ts"
export { SvmAdapter } from "./svm.ts"
