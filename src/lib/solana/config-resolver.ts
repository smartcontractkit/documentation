import { address, type Address } from "@solana/addresses"
import type { SvmConfig } from "./config.ts"

export const prerender = false

/**
 * Helper function to validate URL format
 */
function validateUrl(url: string, type: string): void {
  try {
    const parsedUrl = new URL(url)
    // URL is valid if we can create it without throwing
    if (!parsedUrl.protocol) {
      throw new Error(`Invalid ${type} format: ${url}`)
    }
  } catch {
    throw new Error(`Invalid ${type} format: ${url}`)
  }
}

/**
 * Configuration overrides that can come from API layer
 */
export interface ConfigOverrides {
  rpcUrl?: string
  wsUrl?: string
  commitment?: "processed" | "confirmed" | "finalized"
  payerPrivateKey?: string
  faucetProgram?: string | Address
}

/**
 * Resolve configuration from environment and optional overrides
 * Merges env defaults with API-provided overrides
 */
export function resolveConfig(chainName: string, overrides?: ConfigOverrides): SvmConfig {
  // Get environment defaults for the chain
  const envConfig = getEnvConfigForChain(chainName)

  // Apply overrides
  const resolved: SvmConfig = {
    rpcUrl: overrides?.rpcUrl || envConfig.rpcUrl,
    wsUrl: overrides?.wsUrl || envConfig.wsUrl,
    commitment: overrides?.commitment || envConfig.commitment,
    payerPrivateKey: overrides?.payerPrivateKey || envConfig.payerPrivateKey,
    faucetProgram: overrides?.faucetProgram
      ? typeof overrides.faucetProgram === "string"
        ? address(overrides.faucetProgram)
        : overrides.faucetProgram
      : envConfig.faucetProgram,
  }

  // Validate required fields
  validateConfig(resolved, chainName)

  return resolved
}

/**
 * Get environment configuration for a specific chain
 */
function getEnvConfigForChain(chainName: string): SvmConfig {
  const envPrefix = chainName.toUpperCase().replace("-", "_")

  const required = (key: string): string => {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
  }

  const optional = (key: string, defaultValue?: string): string | undefined => {
    return process.env[key] || defaultValue
  }

  const rpcUrl = optional(`${envPrefix}_RPC_URL`) || getDefaultRpcUrl(chainName)
  const wsUrl = optional(`${envPrefix}_WS_URL`) || getDefaultWsUrl(chainName)
  const payerPrivateKey = required(`${envPrefix}_PAYER_KEY`)
  const faucetProgramStr = required(`${envPrefix}_FAUCET_PROGRAM`)
  const faucetProgram = address(faucetProgramStr)

  return {
    rpcUrl,
    wsUrl,
    commitment: "confirmed",
    payerPrivateKey,
    faucetProgram,
  }
}

/**
 * Get default RPC URL for common chains
 */
function getDefaultRpcUrl(chainName: string): string {
  switch (chainName) {
    case "solana-devnet":
      return "https://api.devnet.solana.com"
    case "solana-mainnet":
      return "https://api.mainnet-beta.solana.com"
    case "solana-testnet":
      return "https://api.testnet.solana.com"
    default:
      throw new Error(`No default RPC URL for chain: ${chainName}`)
  }
}

/**
 * Get default WebSocket URL for common chains
 */
function getDefaultWsUrl(chainName: string): string | undefined {
  switch (chainName) {
    case "solana-devnet":
      return "wss://api.devnet.solana.com"
    case "solana-mainnet":
      return "wss://api.mainnet-beta.solana.com"
    case "solana-testnet":
      return "wss://api.testnet.solana.com"
    default:
      return undefined
  }
}

/**
 * Validate that all required configuration is present
 */
function validateConfig(config: SvmConfig, chainName: string): void {
  if (!config.rpcUrl) {
    throw new Error(`Missing RPC URL for chain: ${chainName}`)
  }

  if (!config.payerPrivateKey) {
    throw new Error(`Missing payer private key for chain: ${chainName}`)
  }

  if (!config.faucetProgram) {
    throw new Error(`Missing faucet program address for chain: ${chainName}`)
  }

  // Validate URL format
  validateUrl(config.rpcUrl, "RPC URL")

  if (config.wsUrl) {
    validateUrl(config.wsUrl, "WebSocket URL")
  }
}

/**
 * Check if environment is properly configured for a chain
 */
export function isChainConfigured(chainName: string): boolean {
  try {
    getEnvConfigForChain(chainName)
    return true
  } catch {
    return false
  }
}
