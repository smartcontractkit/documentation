/**
 * Comprehensive error handling for Solana BnM Faucet operations
 * Maps Solana program errors, SPL token errors, network errors, and wallet errors
 * to appropriate HTTP status codes following RESTful principles
 */

import { APIErrorType, createErrorResponse } from "~/lib/ccip/utils.ts"
import { FaucetStateService } from "@lib/solana/domain/services/faucet-state.ts"
import { address } from "@lib/solana/index.js"
import { logger } from "@lib/logging/index.js"
import type { IRpcContext } from "@lib/solana/infrastructure/rpc/types.ts"

export const prerender = false

/**
 * Solana faucet program error codes (6000-6008)
 * These are anchor program errors specific to the BnM faucet contract
 */
export enum FaucetProgramError {
  UNAUTHORIZED = 6000,
  INVALID_TOKEN_PROGRAM = 6001,
  TOO_SOON = 6002,
  INSUFFICIENT_FAUCET_FUNDS = 6003,
  MATH_OVERFLOW = 6004,
  EMERGENCY_PAUSED = 6005,
  INVALID_CONFIG = 6006,
  INVALID_AMOUNT = 6007,
  RELAYER_NOT_ALLOWED = 6008,
}

/**
 * HTTP status code mapping for different error categories
 */
interface ErrorMapping {
  httpStatus: number
  errorType: APIErrorType
  userMessage: string
  code: string
  retryAfter?: number // For 503 responses
}

/**
 * Comprehensive error mapping for all Solana faucet error scenarios
 */
const ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  // Faucet Program Errors (6000-6008)
  "custom program error: 0x1770": {
    // 6000 - UNAUTHORIZED
    httpStatus: 403,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "This operation requires administrative privileges.",
    code: "UNAUTHORIZED_ACCESS",
  },
  "custom program error: 0x1771": {
    // 6001 - INVALID_TOKEN_PROGRAM
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "This token type is not supported by the faucet.",
    code: "INVALID_TOKEN_PROGRAM",
  },
  "custom program error: 0x1772": {
    // 6002 - TOO_SOON (Rate limit)
    httpStatus: 429,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Please wait 6 hours between token requests.",
    code: "RATE_LIMIT_ACTIVE",
  },
  "custom program error: 0x1773": {
    // 6003 - INSUFFICIENT_FAUCET_FUNDS
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "The faucet is temporarily empty. Our team has been notified and will refill it shortly.",
    code: "FAUCET_INSUFFICIENT_FUNDS",
    retryAfter: 300,
  },
  "custom program error: 0x1774": {
    // 6004 - MATH_OVERFLOW
    httpStatus: 500,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "A calculation error occurred. Please try again.",
    code: "MATH_OVERFLOW_ERROR",
  },
  "custom program error: 0x1775": {
    // 6005 - EMERGENCY_PAUSED
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Token distribution is temporarily paused for maintenance. Please check back in a few minutes.",
    code: "FAUCET_PAUSED",
    retryAfter: 300,
  },
  "custom program error: 0x1776": {
    // 6006 - INVALID_CONFIG
    httpStatus: 500,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Faucet configuration error. Please contact support if this persists.",
    code: "FAUCET_CONFIG_ERROR",
  },
  "custom program error: 0x1777": {
    // 6007 - INVALID_AMOUNT
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "The requested amount is not valid.",
    code: "INVALID_DRIP_AMOUNT",
  },
  "custom program error: 0x1778": {
    // 6008 - RELAYER_NOT_ALLOWED
    httpStatus: 403,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Service configuration issue. Please contact support.",
    code: "RELAYER_NOT_ALLOWED",
  },

  // SPL Token Program Errors
  "insufficient funds": {
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Faucet vault has insufficient token balance. Service temporarily unavailable.",
    code: "INSUFFICIENT_VAULT_BALANCE",
    retryAfter: 300,
  },
  "invalid mint": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Token mint address is invalid or not recognized by the SPL Token program.",
    code: "INVALID_MINT_ADDRESS",
  },
  "mint mismatch": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Token mint does not match the expected faucet token configuration.",
    code: "TOKEN_MINT_MISMATCH",
  },
  "account not found": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Receiver token account not found. Ensure the account exists and is properly initialized.",
    code: "RECEIVER_ACCOUNT_NOT_FOUND",
  },
  "invalid account owner": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Token account owner does not match the expected receiver address.",
    code: "INVALID_ACCOUNT_OWNER",
  },

  // Network and RPC Errors
  "rpc request failed": {
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Solana network temporarily unavailable. Please try again in a few minutes.",
    code: "NETWORK_UNAVAILABLE",
    retryAfter: 180,
  },
  "timeout exceeded": {
    httpStatus: 504,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Transaction processing timeout. Network congestion detected.",
    code: "TRANSACTION_TIMEOUT",
  },
  "blockhash not found": {
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Network synchronization issue. Please retry your request.",
    code: "BLOCKHASH_EXPIRED",
    retryAfter: 30,
  },
  "program not found": {
    httpStatus: 503,
    errorType: APIErrorType.SERVER_ERROR,
    userMessage: "Faucet program temporarily inaccessible. Service may be updating.",
    code: "PROGRAM_UNAVAILABLE",
    retryAfter: 300,
  },

  // Transaction and Simulation Errors
  "simulation failed": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Transaction validation failed. Please verify all parameters and try again.",
    code: "TRANSACTION_SIMULATION_FAILED",
  },
  "invalid transaction": {
    httpStatus: 422,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Transaction structure is invalid. Please check input parameters.",
    code: "INVALID_TRANSACTION_STRUCTURE",
  },
  "signature verification failed": {
    httpStatus: 400,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Transaction signature is invalid or corrupted.",
    code: "INVALID_SIGNATURE",
  },
  "account in use": {
    httpStatus: 409,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Account is currently being modified by another transaction. Please retry shortly.",
    code: "ACCOUNT_BUSY",
  },

  // Wallet and Address Errors
  "invalid address": {
    httpStatus: 400,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Wallet address format is invalid. Please verify the address.",
    code: "INVALID_WALLET_ADDRESS",
  },
  "invalid public key": {
    httpStatus: 400,
    errorType: APIErrorType.VALIDATION_ERROR,
    userMessage: "Public key format is invalid or corrupted.",
    code: "INVALID_PUBLIC_KEY",
  },
}

/**
 * Enhanced faucet error handler with comprehensive error mapping and rate limit timing
 * Analyzes error messages and maps them to appropriate HTTP responses
 *
 * @param error - The error object to analyze and map
 * @param requestId - Request identifier for tracing
 * @param rpcContext - Optional RPC context for fetching rate limit information
 * @param params - Optional parameters including mint and receiver addresses
 * @returns Properly formatted error response with appropriate HTTP status
 */
export async function handleFaucetError(
  error: unknown,
  requestId: string,
  rpcContext?: IRpcContext,
  params?: { mint: string; receiver: string; faucetProgram?: string }
): Promise<Response> {
  const originalErrorMessage = error instanceof Error ? error.message : String(error)
  const errorMessage = originalErrorMessage.toLowerCase()

  // Special handling for rate limit errors with timing calculation
  const programError = extractFaucetProgramError(errorMessage)

  if (programError === FaucetProgramError.TOO_SOON && rpcContext && params?.faucetProgram) {
    try {
      const faucetProgramAddress = address(params.faucetProgram)
      const stateService = new FaucetStateService(rpcContext, faucetProgramAddress, requestId)
      const mintAddress = address(params.mint)
      const receiverAddress = address(params.receiver)

      const [userState, settings] = await Promise.all([
        stateService.getUserState(mintAddress, receiverAddress),
        stateService.getSettings(),
      ])

      if (userState && settings) {
        const timeInfo = stateService.calculateRemainingTime(userState, settings)

        return createErrorResponse(
          APIErrorType.VALIDATION_ERROR,
          `You can request tokens again in ${timeInfo.displayTime}`,
          429, // Rate limit status
          requestId,
          {
            code: "RATE_LIMIT_ACTIVE",
            remainingSeconds: timeInfo.remainingSeconds,
            nextAvailable: timeInfo.nextAvailable.toISOString(),
            displayTime: timeInfo.displayTime,
            lastDripTime: timeInfo.lastDripTime.toISOString(),
          }
        )
      }
    } catch (fetchError) {
      logger.warn({
        message: "Failed to fetch rate limit timing, using fallback",
        requestId,
        error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
        step: "rate_limit_timing_fallback",
      })
    }
  }

  // Check for exact error code matches first (most specific)
  for (const [pattern, mapping] of Object.entries(ERROR_MAPPINGS)) {
    if (errorMessage.includes(pattern)) {
      const responseData = {
        code: mapping.code,
        ...(mapping.retryAfter && { retryAfter: mapping.retryAfter }),
      }

      return createErrorResponse(mapping.errorType, mapping.userMessage, mapping.httpStatus, requestId, responseData)
    }
  }

  // Check for partial matches for compound error messages
  if (errorMessage.includes("insufficient") && errorMessage.includes("funds")) {
    const mapping = ERROR_MAPPINGS["insufficient funds"]
    return createErrorResponse(mapping.errorType, mapping.userMessage, mapping.httpStatus, requestId, {
      code: mapping.code,
      retryAfter: mapping.retryAfter,
    })
  }

  if (errorMessage.includes("invalid") && errorMessage.includes("mint")) {
    const mapping = ERROR_MAPPINGS["invalid mint"]
    return createErrorResponse(mapping.errorType, mapping.userMessage, mapping.httpStatus, requestId, {
      code: mapping.code,
    })
  }

  if (errorMessage.includes("timeout") || errorMessage.includes("deadline")) {
    const mapping = ERROR_MAPPINGS["timeout exceeded"]
    return createErrorResponse(mapping.errorType, mapping.userMessage, mapping.httpStatus, requestId, {
      code: mapping.code,
    })
  }

  // Default fallback for unrecognized errors
  return createErrorResponse(
    APIErrorType.SERVER_ERROR,
    "We encountered an issue processing your request. Please try again or contact support if this continues.",
    500,
    requestId,
    {
      code: "UNEXPECTED_FAUCET_ERROR",
    }
  )
}

/**
 * Extracts faucet program error code from various error formats
 * Handles both simulation errors and direct program errors:
 * - Simulation format: {"Custom":"6002"}
 * - Direct format: "custom program error: 0x1772"
 *
 * @param errorMessage - Raw error message from transaction
 * @returns Faucet program error code or null if not a program error
 */
export function extractFaucetProgramError(errorMessage: string): FaucetProgramError | null {
  // Try simulation error format first: {"Custom":"6002"} or {"custom":"6002"}
  const simulationMatch = errorMessage.match(/\{"custom":"(\d+)"\}/i)
  if (simulationMatch) {
    const errorCode = parseInt(simulationMatch[1], 10)
    if (Object.values(FaucetProgramError).includes(errorCode as FaucetProgramError)) {
      return errorCode as FaucetProgramError
    }
  }

  // Try direct anchor error format: "custom program error: 0x1772"
  const directMatch = errorMessage.match(/custom program error: 0x([0-9a-fA-F]+)/)
  if (directMatch) {
    const errorCode = parseInt(directMatch[1], 16)
    if (Object.values(FaucetProgramError).includes(errorCode as FaucetProgramError)) {
      return errorCode as FaucetProgramError
    }
  }

  return null
}

/**
 * Determines if an error is retryable based on its type
 * Network errors and temporary service issues should be retryable
 *
 * @param error - Error object to analyze
 * @returns True if the error condition may resolve on retry
 */
export function isRetryableError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  const retryablePatterns = [
    "rpc request failed",
    "timeout exceeded",
    "blockhash not found",
    "program not found",
    "insufficient funds", // May resolve if faucet is refilled
    "account in use",
    "network unavailable",
    "service unavailable",
  ]

  return retryablePatterns.some((pattern) => errorMessage.includes(pattern))
}
