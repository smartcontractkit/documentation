import { address, type Address } from "@solana/addresses"

export const prerender = false

/**
 * Typed configuration for SVM drip operations
 */
export interface SvmConfig {
  rpcUrl: string
  wsUrl?: string
  faucetProgram: Address
  payerPrivateKey: string
  commitment: "processed" | "confirmed" | "finalized"
}

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/**
 * Load configuration for Solana devnet
 * Environment variables required:
 * - SOLANA_DEVNET_RPC_URL
 * - SOLANA_DEVNET_FAUCET_PROGRAM_ADDRESS
 * - SOLANA_DEVNET_PAYER_PRIVATE_KEY
 * Optional:
 * - SOLANA_DEVNET_WS_URL
 * - SOLANA_DEVNET_COMMITMENT
 */
export function loadSolanaDevnetConfig(): SvmConfig {
  const rpcUrl = required("SOLANA_DEVNET_RPC_URL")
  const wsUrl = process.env.SOLANA_DEVNET_WS_URL
  const faucetProgramStr = required("SOLANA_DEVNET_FAUCET_PROGRAM_ADDRESS")
  const payerPrivateKey = required("SOLANA_DEVNET_PAYER_PRIVATE_KEY")
  const commitmentStr = process.env.SOLANA_DEVNET_COMMITMENT || "confirmed"

  // Validate faucet program address using Kit's address function
  let faucetProgram: Address
  try {
    faucetProgram = address(faucetProgramStr)
  } catch (error) {
    throw new Error(`Invalid SOLANA_DEVNET_FAUCET_PROGRAM_ADDRESS: ${faucetProgramStr}`)
  }

  // Validate commitment
  const commitment = commitmentStr as "processed" | "confirmed" | "finalized"
  if (!["processed", "confirmed", "finalized"].includes(commitment)) {
    throw new Error(`Invalid SOLANA_DEVNET_COMMITMENT: ${commitmentStr}. Must be processed, confirmed, or finalized`)
  }

  return {
    rpcUrl,
    wsUrl,
    faucetProgram,
    payerPrivateKey,
    commitment,
  }
}

/**
 * Get default RPC URL for Solana devnet if not provided in env
 */
export function getDefaultDevnetConfig(): Partial<SvmConfig> {
  return {
    rpcUrl: "https://api.devnet.solana.com",
    wsUrl: "wss://api.devnet.solana.com",
    commitment: "confirmed",
  }
}
