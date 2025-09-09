import { TIME_INTERVALS } from "@lib/solana/core/constants/time.ts"

export interface ErrorState {
  code?: string
  message: string
  details?: {
    displayTime?: string
    nextAvailable?: string
    remainingSeconds?: number
    lastDripTime?: string
  }
}

export interface ErrorHandlerResult {
  title: string
  message: string
  subtext?: string
  action: "retry" | "none" | "refresh"
  css: string
  timer?: {
    show: boolean
    message: string
  }
}

/**
 * Format remaining time for user-friendly display
 */
export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return "Available now"

  const hours = Math.floor(seconds / TIME_INTERVALS.HOUR)
  const minutes = Math.floor((seconds % TIME_INTERVALS.HOUR) / TIME_INTERVALS.MINUTE)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Generate progressive timing messages based on remaining time
 */
export function getProgressiveTimingMessage(displayTime: string, remainingSeconds?: number): string {
  if (!remainingSeconds) return `You can request tokens again in ${displayTime}`

  if (remainingSeconds < TIME_INTERVALS.HOUR) {
    return `You can request tokens again in ${displayTime}`
  } else if (remainingSeconds < TIME_INTERVALS.SIX_HOURS) {
    return `You can request tokens again in ${displayTime}`
  } else {
    return `Please wait ${TIME_INTERVALS.SIX_HOURS / TIME_INTERVALS.HOUR} hours between token requests`
  }
}

/**
 * Comprehensive error handling system matching original UX
 * Maps all 13 error types to proper user messaging
 */
const ERROR_HANDLERS: Record<string, (error: ErrorState) => ErrorHandlerResult> = {
  RATE_LIMIT_ACTIVE: (error) => {
    const remainingSeconds = error.details?.remainingSeconds || 0
    const displayTime = formatRemainingTime(remainingSeconds)

    return {
      title: "Please wait before requesting again",
      message: getProgressiveTimingMessage(displayTime, remainingSeconds),
      subtext: "Rate limits help ensure fair access to test tokens for all developers.",
      action: "none",
      css: "errorMessage",
      timer:
        remainingSeconds > 0
          ? {
              show: true,
              message: `Next request available in: ${displayTime}`,
            }
          : undefined,
    }
  },

  FAUCET_INSUFFICIENT_FUNDS: () => ({
    title: "Faucet temporarily unavailable",
    message: "The faucet is currently low on funds. Please try again later.",
    subtext: "Our team has been notified and is working to refill the faucet.",
    action: "retry",
    css: "errorMessage",
  }),

  FAUCET_PAUSED: () => ({
    title: "Faucet maintenance in progress",
    message: "The faucet is temporarily paused for maintenance.",
    subtext: "Please check our status page for updates or try again in a few minutes.",
    action: "refresh",
    css: "errorMessage",
  }),

  TRANSACTION_SIMULATION_FAILED: () => ({
    title: "Transaction simulation failed",
    message: "Unable to simulate the token transfer. This might be a temporary network issue.",
    subtext: "Please ensure you have enough SOL for transaction fees and try again.",
    action: "retry",
    css: "errorMessage",
  }),

  NETWORK_UNAVAILABLE: () => ({
    title: "Network connectivity issue",
    message: "Unable to connect to the Solana network. Please check your connection.",
    subtext: "If the problem persists, the network might be experiencing high traffic.",
    action: "retry",
    css: "errorMessage",
  }),

  INVALID_TOKEN_PROGRAM: () => ({
    title: "Token configuration error",
    message: "There's an issue with the token program configuration.",
    subtext: "This is likely a temporary issue. Please contact support if it continues.",
    action: "refresh",
    css: "errorMessage",
  }),

  challenge_expired: () => ({
    title: "Session expired",
    message: "Your authentication session has expired. Please try again.",
    subtext: "For security, sessions expire after a few minutes of inactivity.",
    action: "retry",
    css: "errorMessage",
  }),

  invalid_signature: () => ({
    title: "Signature verification failed",
    message: "Make sure you signed with the correct wallet.",
    subtext: "The signature doesn't match the expected wallet address.",
    action: "retry",
    css: "errorMessage",
  }),

  challenge_tampered: () => ({
    title: "Security verification failed",
    message: "The authentication challenge was modified. Please try again.",
    subtext: "This protects against tampering attempts.",
    action: "retry",
    css: "errorMessage",
  }),

  unsupported_chain: () => ({
    title: "Unsupported network",
    message: "This faucet only supports Solana Devnet.",
    subtext: "Please switch to Solana Devnet in your wallet settings.",
    action: "refresh",
    css: "errorMessage",
  }),

  unsupported_token: () => ({
    title: "Token not supported",
    message: "The requested token is not available on this faucet.",
    subtext: "Only CCIP-BnM test tokens are available.",
    action: "refresh",
    css: "errorMessage",
  }),

  "6002": (error) => {
    // Special handling for Solana program error 6002 (TOO_SOON)
    const remainingSeconds = error.details?.remainingSeconds || 0
    const displayTime = formatRemainingTime(remainingSeconds)

    return {
      title: "Please wait before requesting again",
      message: `You can request tokens again in ${displayTime}`,
      subtext: "Rate limits help ensure fair access to test tokens for all developers.",
      action: "none",
      css: "errorMessage",
      timer:
        remainingSeconds > 0
          ? {
              show: true,
              message: `Next request available in: ${displayTime}`,
            }
          : undefined,
    }
  },
}

/**
 * Handle unknown/generic errors with fallback messaging
 */
export function handleUnknownError(error: ErrorState): ErrorHandlerResult {
  return {
    title: "Something went wrong",
    message: error.message || "We encountered an issue processing your request.",
    subtext: "Please try again or contact support if this continues.",
    action: "retry",
    css: "errorMessage",
  }
}

/**
 * Main error processor - maps errors to UX-appropriate responses
 */
export function processError(error: ErrorState): ErrorHandlerResult {
  if (!error.code) {
    return handleUnknownError(error)
  }

  const handler = ERROR_HANDLERS[error.code]
  if (!handler) {
    return handleUnknownError(error)
  }

  return handler(error)
}
