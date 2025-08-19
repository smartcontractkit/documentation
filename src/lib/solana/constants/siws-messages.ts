/**
 * Centralized constants for Sign-In-With-Solana (SIWS) message generation and validation
 * Prevents hardcoded string mismatches across the application
 */

export const SIWS_MESSAGES = {
  /**
   * Main challenge prefix used in SIWS message generation and validation
   */
  CHALLENGE_PREFIX: "wants you to sign a faucet request with your Solana account:",

  /**
   * Token information line prefix
   */
  TOKEN_LINE_PREFIX: "🪙 Token:",

  /**
   * Faucet request description
   */
  FAUCET_REQUEST_PREFIX: "⛽ You are requesting test tokens from the",

  /**
   * URI field label
   */
  URI_LABEL: "URI:",

  /**
   * Version field label and value
   */
  VERSION_LABEL: "Version:",
  VERSION_VALUE: "1",

  /**
   * Chain ID field label
   */
  CHAIN_ID_LABEL: "Chain ID:",

  /**
   * Nonce field label
   */
  NONCE_LABEL: "Nonce:",

  /**
   * Issued At field label
   */
  ISSUED_AT_LABEL: "Issued At:",

  /**
   * Expiration Time field label
   */
  EXPIRATION_TIME_LABEL: "Expiration Time:",
} as const

/**
 * SIWS challenge template for consistent message generation
 */
export const SIWS_TEMPLATE = {
  /**
   * Generates the main challenge text structure
   */
  buildChallengeText: (params: {
    domain: string
    receiver: string
    tokenSymbol: string
    tokenAddress: string
    chainDisplay: string
    host: string
    nonce: string
    issuedAt: string
    expirationTime: string
  }) => `${params.domain} ${SIWS_MESSAGES.CHALLENGE_PREFIX}
${params.receiver}

${SIWS_MESSAGES.FAUCET_REQUEST_PREFIX} ${params.tokenSymbol} faucet on ${params.chainDisplay}.
${SIWS_MESSAGES.TOKEN_LINE_PREFIX} ${params.tokenSymbol} (${params.tokenAddress})

${SIWS_MESSAGES.URI_LABEL} ${params.host}
${SIWS_MESSAGES.VERSION_LABEL} ${SIWS_MESSAGES.VERSION_VALUE}
${SIWS_MESSAGES.NONCE_LABEL} ${params.nonce}
${SIWS_MESSAGES.ISSUED_AT_LABEL} ${params.issuedAt}
${SIWS_MESSAGES.EXPIRATION_TIME_LABEL} ${params.expirationTime}`,

  /**
   * Validation patterns for SIWS challenge parsing
   */
  VALIDATION_PATTERNS: {
    CHALLENGE_PREFIX: SIWS_MESSAGES.CHALLENGE_PREFIX,
    TOKEN_LINE: SIWS_MESSAGES.TOKEN_LINE_PREFIX,
    URI_LINE: SIWS_MESSAGES.URI_LABEL,
    EXPIRATION_LINE: SIWS_MESSAGES.EXPIRATION_TIME_LABEL,
  },
} as const
