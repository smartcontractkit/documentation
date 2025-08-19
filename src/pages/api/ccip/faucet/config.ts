/**
 * Faucet configuration constants and environment variable helpers
 */

export const FAUCET_CONFIG = {
  /**
   * How long challenges remain valid before expiring
   * Shorter TTL = better security, but less user-friendly if wallet signing is slow
   * Recommended: 300 seconds (5 minutes) for good UX while maintaining security
   */
  TTL_SECONDS: parseInt(process.env.FAUCET_TTL_SECONDS || "300", 10),

  /**
   * Maximum allowed difference between server time and challenge issued time
   * Protects against clock synchronization issues between client and server
   * Recommended: 60 seconds to handle normal clock drift
   */
  MAX_CLOCK_SKEW: parseInt(process.env.FAUCET_MAX_CLOCK_SKEW || "60", 10),

  /**
   * Secret key used for HMAC challenge sealing
   * CRITICAL: Use a strong 256-bit secret in production
   * This prevents clients from tampering with challenge content
   */
  CHALLENGE_SECRET: process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key",

  /**
   * Key ID for secret rotation support
   * Allows rolling secrets without breaking existing challenges
   * Increment when rotating the CHALLENGE_SECRET
   */
  CHALLENGE_SECRET_KID: process.env.FAUCET_CHALLENGE_SECRET_KID || "v1",
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
