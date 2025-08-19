/** @jsxImportSource preact */
import { ChainFamily } from "@config/types.ts"
import { MintTokenButton } from "./MintTokenButton.tsx"
import { SVMTestTokens } from "./faucet/SVMTestTokens.tsx"

export interface TestTokenInterfaceProps {
  family: ChainFamily
}

/**
 * Smart dispatcher component for family-specific test token interfaces
 * EVM uses existing MetaMask flow, SVM uses new signature-based faucet
 */
export function TestTokenInterface({ family }: TestTokenInterfaceProps) {
  switch (family) {
    case "evm":
      return <MintTokenButton /> // Existing EVM functionality (MetaMask + block explorer)
    case "svm":
      return <SVMTestTokens /> // New Solana faucet functionality
    default:
      throw new Error(`Unsupported chain family: ${family}`)
  }
}
