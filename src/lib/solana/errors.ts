import { logger } from "@api/ccip/logger.ts"

export const prerender = false

/**
 * Known faucet program error codes
 */
export enum FaucetErrorCode {
  TooSoon = 6000,
  Unauthorized = 6001,
  InsufficientFaucetFunds = 6002,
  EmergencyPaused = 6003,
  InvalidMint = 6004,
  InvalidAmount = 6005,
  RateLimitExceeded = 6006,
}

/**
 * Structured error for faucet operations
 */
export class FaucetError extends Error {
  constructor(
    message: string,
    public readonly code: FaucetErrorCode | string,
    public readonly httpStatus: number,
    public readonly requestId?: string,
    public readonly signature?: string,
    public readonly slot?: number
  ) {
    super(message)
    this.name = "FaucetError"
  }
}

/**
 * Map known program errors to structured errors with HTTP status codes
 */
export function mapProgramError(error: unknown, requestId?: string, signature?: string, slot?: number): FaucetError {
  const errorMessage = error instanceof Error ? error.message : String(error)

  logger.debug({
    message: "Mapping program error",
    requestId,
    errorMessage,
    signature,
    slot,
    step: "error_mapping",
  })

  // Check for known program error codes
  if (errorMessage.includes("custom program error: 0x1770")) {
    // 6000
    return new FaucetError(
      "Rate limit exceeded. Please wait before requesting another drip.",
      FaucetErrorCode.TooSoon,
      429, // Too Many Requests
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1771")) {
    // 6001
    return new FaucetError(
      "Unauthorized operation. Invalid operator or signature.",
      FaucetErrorCode.Unauthorized,
      403, // Forbidden
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1772")) {
    // 6002
    return new FaucetError(
      "Insufficient faucet funds. Please try again later.",
      FaucetErrorCode.InsufficientFaucetFunds,
      409, // Conflict
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1773")) {
    // 6003
    return new FaucetError(
      "Faucet is temporarily paused for maintenance.",
      FaucetErrorCode.EmergencyPaused,
      503, // Service Unavailable
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1774")) {
    // 6004
    return new FaucetError(
      "Invalid mint address. Token not supported by this faucet.",
      FaucetErrorCode.InvalidMint,
      400, // Bad Request
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1775")) {
    // 6005
    return new FaucetError(
      "Invalid drip amount requested.",
      FaucetErrorCode.InvalidAmount,
      400, // Bad Request
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("custom program error: 0x1776")) {
    // 6006
    return new FaucetError(
      "Rate limit exceeded for this address.",
      FaucetErrorCode.RateLimitExceeded,
      429, // Too Many Requests
      requestId,
      signature,
      slot
    )
  }

  // Check for common RPC/network errors
  if (errorMessage.includes("Mint account not found")) {
    return new FaucetError(
      "Token mint not found. Please verify the token address.",
      "MINT_NOT_FOUND",
      404, // Not Found
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("insufficient funds")) {
    return new FaucetError(
      "Insufficient funds for transaction fees.",
      "INSUFFICIENT_FUNDS",
      409, // Conflict
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("blockhash not found")) {
    return new FaucetError(
      "Transaction expired. Please retry.",
      "BLOCKHASH_EXPIRED",
      408, // Request Timeout
      requestId,
      signature,
      slot
    )
  }

  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return new FaucetError(
      "Transaction timeout. Network may be congested.",
      "TIMEOUT",
      408, // Request Timeout
      requestId,
      signature,
      slot
    )
  }

  // Default to internal server error for unknown errors
  return new FaucetError(
    `Drip operation failed: ${errorMessage}`,
    "UNKNOWN_ERROR",
    500, // Internal Server Error
    requestId,
    signature,
    slot
  )
}

/**
 * Safe error logging that doesn't expose sensitive information
 */
export function logError(
  error: unknown,
  context: {
    requestId?: string
    operation?: string
    chainName?: string
    mintPrefix?: string
    receiverPrefix?: string
  }
): void {
  const mappedError = mapProgramError(error, context.requestId)

  logger.error({
    message: "Operation failed",
    requestId: context.requestId,
    operation: context.operation,
    chainName: context.chainName,
    mintPrefix: context.mintPrefix,
    receiverPrefix: context.receiverPrefix,
    errorCode: mappedError.code,
    errorMessage: mappedError.message,
    httpStatus: mappedError.httpStatus,
    signature: mappedError.signature,
    slot: mappedError.slot,
    step: "error_logged",
  })
}
