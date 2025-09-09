/**
 * Solana Devnet Configuration
 * Simplified, focused configuration for Solana devnet faucet operations
 */
import { config as loadEnv } from "dotenv"

/**
 * Branded type for positive integers to ensure runtime validation
 */
type PositiveInteger = number & { readonly __brand: "PositiveInteger" }

/**
 * Faucet security configuration interface
 */
interface FaucetSecurityConfig {
  readonly challengeSecret: string
  readonly challengeSecretKid: string
  readonly ttlSeconds: PositiveInteger
  readonly maxClockSkew: PositiveInteger
}

/**
 * Solana chain configuration interface
 */
interface SolanaChainConfig {
  readonly rpcUrl: string
  readonly faucetProgram: string
  readonly payerKey: string
}

/**
 * Complete Solana devnet configuration
 */
interface SolanaDevnetConfig {
  readonly faucet: FaucetSecurityConfig
  readonly chain: SolanaChainConfig
}

/**
 * Validates and parses a positive integer from environment variable
 * @param value Environment variable value (can be undefined)
 * @param defaultValue Default value to use if env var is not set
 * @param name Descriptive name for error messages
 * @returns Validated positive integer
 * @throws Error if value is not a positive integer
 */
function validatePositiveInt(value: string | undefined, defaultValue: number, name: string): PositiveInteger {
  const stringValue = value || defaultValue.toString()
  const parsed = parseInt(stringValue, 10)

  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid ${name}: must be a positive integer, got "${stringValue}"\n` +
        `Please provide a valid positive number for this configuration.`
    )
  }

  return parsed as PositiveInteger
}

/**
 * Cached Solana devnet configuration
 * Initialized lazily on first access for optimal performance
 */
let SOLANA_DEVNET_CONFIG: SolanaDevnetConfig | null = null

/**
 * Initialize Solana devnet configuration
 * @returns Initialized configuration object
 */
function initializeSolanaDevnetConfig(): SolanaDevnetConfig {
  // Ensure environment variables are loaded
  try {
    loadEnv()
  } catch {
    // dotenv might not be available in all environments, continue without it
  }

  try {
    return {
      faucet: {
        challengeSecret: process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key",
        challengeSecretKid: process.env.FAUCET_CHALLENGE_SECRET_KID || "v1",
        ttlSeconds: validatePositiveInt(process.env.FAUCET_TTL_SECONDS, 300, "FAUCET_TTL_SECONDS"),
        maxClockSkew: validatePositiveInt(process.env.FAUCET_MAX_CLOCK_SKEW, 60, "FAUCET_MAX_CLOCK_SKEW"),
      },
      chain: {
        rpcUrl: process.env.SOLANA_DEVNET_RPC_URL || "https://api.devnet.solana.com",
        faucetProgram: process.env.SOLANA_DEVNET_FAUCET_PROGRAM || "11111111111111111111111111111111",
        payerKey: process.env.SOLANA_DEVNET_PAYER_KEY || "11111111111111111111111111111111111111111111",
      },
    }
  } catch (error) {
    console.error("Failed to initialize Solana devnet configuration:", error)
    throw new Error(
      "Solana devnet configuration initialization failed. " + "Please check your environment variables and try again."
    )
  }
}

/**
 * Get Solana devnet configuration with lazy initialization
 * @returns Solana devnet configuration
 */
function getSolanaDevnetConfigInternal(): SolanaDevnetConfig {
  if (!SOLANA_DEVNET_CONFIG) {
    SOLANA_DEVNET_CONFIG = initializeSolanaDevnetConfig()
  }
  return SOLANA_DEVNET_CONFIG
}

/**
 * Get faucet security configuration
 * Lazy-loaded access to faucet security settings
 * @returns Faucet security configuration
 */
export function getFaucetConfig(): FaucetSecurityConfig {
  return getSolanaDevnetConfigInternal().faucet
}

/**
 * Get Solana devnet chain configuration
 * Lazy-loaded access to chain settings
 * @returns Solana chain configuration
 */
export function getSolanaDevnetConfig(): SolanaChainConfig {
  return getSolanaDevnetConfigInternal().chain
}

/**
 * Get faucet program address
 * Convenience function for accessing faucet program address
 * @returns Solana faucet program address
 */
export function getFaucetAddress(): string {
  return getSolanaDevnetConfigInternal().chain.faucetProgram
}

/**
 * Type exports for external consumption
 */
export type { FaucetSecurityConfig, SolanaChainConfig, SolanaDevnetConfig, PositiveInteger }
