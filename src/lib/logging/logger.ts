/**
 * Core logging infrastructure using Pino for structured application logging.
 * Provides environment-aware configuration with development-friendly formatting
 * and production-optimized JSON structured output.
 */

import pino from "pino"

/**
 * Creates a configured Pino logger instance with environment-aware settings.
 *
 * In development:
 * - Uses pretty-printed output with colors and timestamps
 * - Default log level: debug
 *
 * In production:
 * - Uses structured JSON output for log aggregation
 * - Default log level: info
 *
 * @returns Configured Pino logger instance
 */
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info")

  return pino({
    level: logLevel,
    // Pretty printing in development, structured JSON in production
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
    // Base fields for all logs
    base: {
      service: "chainlink-docs",
      version: process.env.npm_package_version,
    },
    // Timestamp format
    timestamp: pino.stdTimeFunctions.isoTime,
  })
}

/**
 * Pre-configured application logger instance.
 * Ready to use throughout the application with consistent formatting and configuration.
 */
export const logger = createLogger()
