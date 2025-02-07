import { CCIPArmABI, CCIPRouterABI } from "@features/abi"
import { ethers } from "ethers"
import { ChainsConfig, Environment, loadReferenceData, Version } from "@config/data/ccip"
import { SupportedChain } from "@config"
import { directoryToSupportedChain } from "@features/utils"
import { v4 as uuidv4 } from "uuid"
import { SelectorsConfig, selectorsConfig } from "../../../config/data/ccip/selectors"

export const prerender = false

// Re-export types from CCIP config
export type { ChainsConfig, Version, Environment }
export type { SelectorsConfig } from "../../../config/data/ccip/selectors"

/**
 * Common HTTP headers used across all API responses
 */
export const commonHeaders = {
  "Content-Type": "application/json",
}

/**
 * Extended headers for successful responses with caching directives
 */
export const successHeaders = {
  ...commonHeaders,
  "Cache-Control": "s-max-age=300, stale-while-revalidate",
  "CDN-Cache-Control": "max-age=300",
  "Vercel-CDN-Cache-Control": "max-age=300",
}

/**
 * Custom error class for CCIP-specific errors
 */
export class CCIPError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = "CCIPError"
  }
}

/**
 * Metadata structure for chain API responses
 */
export type ChainMetadata = {
  environment: Environment
  timestamp: string
  requestId: string
  ignoredChainCount: number
  validChainCount: number
}

/**
 * Error structure for chain configuration issues
 */
export type ChainConfigError = {
  chainId: number
  networkId: string
  reason: string
  missingFields: string[]
}

/**
 * Filter parameters for chain queries
 */
export type FilterType = {
  chainId?: string
  selector?: string
  internalId?: string
}

/**
 * Arguments required for ARM proxy contract interactions
 */
export type ArmProxyArgs = {
  provider: ethers.providers.JsonRpcProvider
  routerAddress: string
}

/**
 * Retrieves the ARM contract instance for a given router
 * @param provider - Ethereum provider instance
 * @param routerAddress - Address of the CCIP router contract
 * @returns Promise resolving to the ARM contract instance
 */
export const getArmContract = async ({ provider, routerAddress }: ArmProxyArgs) => {
  const routerContract = new ethers.Contract(routerAddress, CCIPRouterABI, provider)
  const armProxyAddress: string = await routerContract.getArmProxy()
  return new ethers.Contract(armProxyAddress, CCIPArmABI, provider)
}

/**
 * Checks if a chain is cursed by querying its ARM contract
 * @param provider - Ethereum provider instance
 * @param routerAddress - Address of the CCIP router contract
 * @returns Promise resolving to the curse status
 */
export const getArmIsCursed = async ({ provider, routerAddress }: ArmProxyArgs): Promise<boolean> => {
  const armContract = await getArmContract({ provider, routerAddress })
  return armContract.isCursed()
}

/**
 * Retrieves environment configuration and chain data for a given network
 * @param sourceNetworkId - Network identifier to get configuration for
 * @returns Configuration object containing environment, chain data, and router information
 * @throws Returns null if network is not found in either mainnet or testnet
 */
export const getEnvironmentAndConfig = (
  sourceNetworkId: string
): {
  environment: Environment
  chainsConfig: ChainsConfig
  sourceRouterAddress: string
  destinationNetworkIds: string[]
} | null => {
  const { chainsReferenceData, lanesReferenceData } = loadReferenceData({
    environment: Environment.Mainnet,
    version: Version.V1_2_0,
  })

  if (chainsReferenceData[sourceNetworkId] === undefined) {
    const { chainsReferenceData: testnetChainsReferenceData, lanesReferenceData: testnetLanesReferenceData } =
      loadReferenceData({
        environment: Environment.Testnet,
        version: Version.V1_2_0,
      })

    if (testnetChainsReferenceData[sourceNetworkId] === undefined) {
      return null
    }

    return {
      environment: Environment.Testnet,
      chainsConfig: testnetChainsReferenceData,
      sourceRouterAddress: testnetChainsReferenceData[sourceNetworkId].router.address,
      destinationNetworkIds: Object.keys(testnetLanesReferenceData[sourceNetworkId]),
    }
  }

  return {
    environment: Environment.Mainnet,
    chainsConfig: chainsReferenceData,
    sourceRouterAddress: chainsReferenceData[sourceNetworkId].router.address,
    destinationNetworkIds: Object.keys(lanesReferenceData[sourceNetworkId]),
  }
}

/**
 * Resolves a network ID to a supported chain identifier
 * @param networkId - Network identifier to resolve
 * @returns Resolved supported chain identifier
 * @throws Error if network ID is invalid
 */
export const resolveChainOrThrow = (networkId: string): SupportedChain => {
  try {
    return directoryToSupportedChain(networkId)
  } catch {
    throw new Error(`Invalid network ID: ${networkId}`)
  }
}

/**
 * Checks if a chain is cursed with timeout handling
 * @param provider - Ethereum provider instance
 * @param chain - Supported chain identifier
 * @param routerAddress - Address of the CCIP router contract
 * @returns Promise resolving to the curse status
 */
export const checkIfChainIsCursed = async (
  provider: ethers.providers.JsonRpcProvider,
  chain: SupportedChain,
  routerAddress: string
): Promise<boolean> => {
  try {
    return await getArmIsCursed({ provider, routerAddress })
  } catch (error) {
    console.error(`Error checking if chain ${chain} is cursed: ${error}`)
    return false
  }
}

/**
 * Wraps a promise with a timeout
 * @param promise - Promise to wrap with timeout
 * @param ms - Timeout duration in milliseconds
 * @param timeoutErrorMessage - Error message to use when timeout occurs
 * @returns Promise that rejects if timeout occurs before completion
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutErrorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((resolve, reject) => setTimeout(() => reject(new Error(timeoutErrorMessage)), ms))
  return Promise.race([promise, timeout])
}

/**
 * Creates metadata object for chain API responses
 * @param environment - Current environment (mainnet/testnet)
 * @returns Metadata object with timestamp and request tracking
 */
export const createMetadata = (environment: Environment): ChainMetadata => ({
  environment,
  timestamp: new Date().toISOString(),
  requestId: uuidv4(),
  ignoredChainCount: 0,
  validChainCount: 0,
})

/**
 * Validates the environment parameter
 * @param environment - Environment string to validate
 * @returns Validated Environment enum value
 * @throws CCIPError if environment is invalid
 */
export const validateEnvironment = (environment?: string): Environment => {
  const validEnvironments = ["mainnet", "testnet"]
  if (!environment || !validEnvironments.includes(environment)) {
    throw new CCIPError(400, 'Environment parameter is required and must be "mainnet" or "testnet".')
  }
  return environment as Environment
}

/**
 * Validates filter parameters ensuring only one filter is used
 * @param filters - Filter parameters to validate
 * @throws CCIPError if multiple filters are provided
 */
export const validateFilters = (filters: FilterType): void => {
  const filterKeys = Object.keys(filters).filter((key) => filters[key as keyof FilterType])
  if (filterKeys.length > 1) {
    throw new CCIPError(400, "Only one filter parameter (chainId, selector, or internalId) can be used.")
  }
}

/**
 * Validates and normalizes the outputKey parameter
 * @param outputKey - Output key to validate
 * @returns Validated output key
 * @throws CCIPError if output key is invalid
 */
export const validateOutputKey = (outputKey?: string): "chainId" | "selector" | "internalId" => {
  if (!outputKey) return "chainId"
  if (!["chainId", "selector", "internalId"].includes(outputKey)) {
    throw new CCIPError(400, "outputKey must be one of: chainId, selector, or internalId")
  }
  return outputKey as "chainId" | "selector" | "internalId"
}

/**
 * Handles API errors and converts them to standardized responses
 * @param error - Error to handle
 * @returns Standardized error response
 */
export const handleApiError = (error: unknown): Response => {
  let errorType = "UNKNOWN_ERROR"
  let message = "An unexpected error occurred"
  let statusCode = 500

  if (error instanceof CCIPError) {
    errorType = "VALIDATION_ERROR"
    message = error.message
    statusCode = error.statusCode
  } else if (error instanceof Error) {
    message = error.message
    if (error.name === "ValidationError") {
      errorType = "VALIDATION_ERROR"
      statusCode = 400
    }
  }

  return new Response(
    JSON.stringify({
      error: errorType,
      message,
    }),
    {
      status: statusCode,
      headers: commonHeaders,
    }
  )
}

/**
 * Result type for chain configuration loading
 */
export type ChainConfigurationResult = {
  environment: Environment
  chainsConfig: ChainsConfig
  selectorConfig: SelectorsConfig
  destinationNetworkIds: string[]
  sourceRouterAddress?: string
}

/**
 * Loads chain configuration for a given environment and optional source network
 * @param environment - Environment to load configuration for
 * @param sourceNetworkId - Optional source network ID to get specific configuration
 * @returns Promise resolving to chain configuration
 * @throws CCIPError if configuration loading fails
 */
export const loadChainConfiguration = async (
  environment: Environment,
  sourceNetworkId?: string
): Promise<ChainConfigurationResult> => {
  try {
    // Load reference data for the specified environment
    const { chainsReferenceData, lanesReferenceData } = loadReferenceData({
      environment,
      version: Version.V1_2_0,
    })

    // If sourceNetworkId is provided, validate and get destination networks
    let destinationNetworkIds: string[] = []
    let sourceRouterAddress: string | undefined

    if (sourceNetworkId) {
      const chainConfig = chainsReferenceData[sourceNetworkId]
      if (chainConfig) {
        destinationNetworkIds = Object.keys(lanesReferenceData[sourceNetworkId] || {})
        sourceRouterAddress = chainConfig.router?.address
      }
    }

    return {
      environment,
      chainsConfig: chainsReferenceData,
      selectorConfig: selectorsConfig,
      destinationNetworkIds,
      sourceRouterAddress,
    }
  } catch (error) {
    console.error("Error loading chain configuration:", error)
    throw new CCIPError(500, "Failed to load chain configuration")
  }
}

/**
 * Log levels for structured logging
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Base interface for structured log entries
 */
interface BaseLogEntry {
  message: string
  timestamp: string
  requestId?: string
  level: LogLevel
  [key: string]: unknown
}

/**
 * Structured logging utility for consistent log format across the API
 * @param level - Log level (debug, info, warn, error)
 * @param entry - Log entry data
 */
export function structuredLog(level: LogLevel, entry: { message: string } & Omit<BaseLogEntry, "timestamp" | "level">) {
  const logEntry: BaseLogEntry = {
    ...entry,
    level,
    timestamp: new Date().toISOString(),
  }

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logEntry)
      break
    case LogLevel.INFO:
      console.info(logEntry)
      break
    case LogLevel.WARN:
      console.warn(logEntry)
      break
    case LogLevel.ERROR:
      console.error(logEntry)
      break
  }
}

/**
 * Error types for API responses
 */
export enum APIErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  INVALID_PARAMETER = "INVALID_PARAMETER",
}

/**
 * Standard API error response format
 */
export interface APIError {
  error: APIErrorType
  message: string
  details?: unknown
}

/**
 * Creates a standardized API error response
 * @param error - Error type
 * @param message - Error message
 * @param status - HTTP status code
 * @param details - Additional error details
 * @returns Response object with error details
 */
export function createErrorResponse(error: APIErrorType, message: string, status: number, details?: unknown): Response {
  const errorResponse: APIError = {
    error,
    message,
    ...(details ? { details } : {}),
  }

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: commonHeaders,
  })
}
