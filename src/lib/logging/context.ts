/**
 * Context-aware logging utilities for request tracing and domain-specific operations.
 * Provides structured logging with consistent context propagation across the application.
 */

import { randomUUID } from "node:crypto"
import type { Logger } from "pino"
import { logger } from "./logger.ts"

/**
 * Base context interface containing common fields for all logging operations.
 * Provides foundation for request tracing and operation tracking.
 */
export interface BaseContext {
  requestId?: string
  operation?: string
  startTime?: number
}

/**
 * Solana blockchain-specific logging context.
 * Extends base context with Solana network and transaction information.
 */
export interface SolanaContext extends BaseContext {
  chainName?: string
  rpcUrl?: string
  commitment?: "processed" | "confirmed" | "finalized"
  signature?: string
  slot?: number
}

/**
 * Creates a Solana-specific logger with blockchain domain context.
 * Includes Solana network information for transaction and RPC operation tracking.
 *
 * @param context - Solana-specific context information
 * @returns Logger instance configured for Solana operations
 */
export function createSolanaLogger(context: SolanaContext = {}): Logger {
  const requestId = context.requestId || randomUUID()
  return logger.child({
    requestId,
    domain: "solana",
    ...context,
  })
}
