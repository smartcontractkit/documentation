import pino from "pino"

export const prerender = false

/**
 * Centralized logger using Pino
 * Replaces custom structuredLog implementation
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
})

/**
 * Creates a child logger with request context
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId })
}

/**
 * Log levels enum for backward compatibility
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Structured logging function for backward compatibility
 * @deprecated Use logger.info(), logger.error(), etc. directly
 */
export function structuredLog(level: LogLevel, entry: { message: string; [key: string]: unknown }) {
  logger[level](entry)
}
