/**
 * Faucet configuration using simplified Solana devnet configuration
 * Clean, focused API with proper TypeScript typing
 */

import { getFaucetConfig } from "@lib/core/config/index.ts"

/**
 * Optimized faucet configuration with O(1) cached access
 * Pre-computed at module load for maximum performance
 */
export const FAUCET_CONFIG = getFaucetConfig()

/**
 * Legacy compatibility interface - maintains same property names
 * @deprecated Use FAUCET_CONFIG properties directly for better type safety
 */
export const LEGACY_FAUCET_CONFIG = {
  TTL_SECONDS: FAUCET_CONFIG.ttlSeconds,
  MAX_CLOCK_SKEW: FAUCET_CONFIG.maxClockSkew,
  CHALLENGE_SECRET: FAUCET_CONFIG.challengeSecret,
  CHALLENGE_SECRET_KID: FAUCET_CONFIG.challengeSecretKid,
} as const

/**
 * Required environment variables for production deployment:
 *
 * FAUCET_CHALLENGE_SECRET=your-256-bit-secret-key-here
 * FAUCET_CHALLENGE_SECRET_KID=v1
 * FAUCET_TTL_SECONDS=300
 * FAUCET_MAX_CLOCK_SKEW=60
 *
 * Chain-specific faucet addresses:
 * SOLANA_DEVNET_FAUCET=your-solana-devnet-faucet-program-address
 * ETHEREUM_SEPOLIA_FAUCET=your-ethereum-sepolia-faucet-contract-address
 *
 * Solana RPC Configuration:
 * PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
 *
 * Optional WalletConnect for mobile support:
 * PUBLIC_WC_PROJECT_ID=your-walletconnect-project-id
 */
