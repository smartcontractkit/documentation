/**
 * Base error classes for Solana operations
 */

import type { ErrorContext } from "../types.ts"

/**
 * Base error class for all Solana-related errors
 */
export class SolanaError extends Error {
  public readonly code: string
  public readonly context: ErrorContext

  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype)
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Address validation errors
 */
export class AddressError extends SolanaError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, "ADDRESS_ERROR", context)
  }
}

/**
 * Validation errors
 */
export class ValidationError extends SolanaError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, "VALIDATION_ERROR", context)
  }
}

/**
 * Transaction simulation errors
 */
export class SimulationError extends SolanaError {
  public readonly simulationLogs?: string[]
  public readonly simulationError?: string | { [key: string]: unknown }

  constructor(
    message: string,
    context: ErrorContext = {},
    simulationLogs?: string[],
    simulationError?: string | { [key: string]: unknown }
  ) {
    super(message, "SIMULATION_ERROR", context)
    this.simulationLogs = simulationLogs
    this.simulationError = simulationError
  }

  /**
   * Convert simulation error to JSON with additional simulation data
   */
  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      simulationLogs: this.simulationLogs,
      simulationError: this.simulationError,
    }
  }
}
