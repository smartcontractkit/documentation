/**
 * API endpoint configurations
 * Centralized API path management following existing config patterns
 */

export const API_ENDPOINTS = {
  CCIP: {
    BASE: "/api/ccip/v1",
    CHAINS: "/api/ccip/v1/chains",
    TOKENS: "/api/ccip/v1/tokens",
    FAUCET: {
      BASE: "/api/ccip/v1/drips",
      CHALLENGE: (chainName: string) => `/api/ccip/v1/drips/${chainName}/challenge`,
      EXECUTE: (chainName: string) => `/api/ccip/v1/drips/${chainName}/execute`,
    },
  },
} as const

/**
 * API configuration constants
 */
export const API_CONFIG = {
  VERSION: "v1",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const
