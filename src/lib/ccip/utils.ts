import { CCIPArmABI, CCIPRouterABI } from "@features/abi/index.ts"
import { JsonRpcProvider, Contract } from "ethers"
import { ChainsConfig, Environment, loadReferenceData, Version } from "@config/data/ccip/index.ts"
import { SupportedChain } from "@config/index.ts"
import { directoryToSupportedChain } from "@features/utils/index.ts"
import type {
  TokenMetadata,
  ChainType,
  OutputKeyType,
  ChainFamily,
  SearchType,
  ChainMetadata,
  ChainConfigError,
  FilterType,
} from "./types/index.ts"
import { jsonHeaders, commonHeaders as sharedCommonHeaders } from "@lib/api/cacheHeaders.js"
import { logger } from "@lib/logging/index.js"

export const prerender = false

// Re-export types from CCIP config
export type { ChainsConfig, Version }
export { Environment }
export type { SelectorsConfig } from "@config/data/ccip/selectors.ts"

/**
 * Common HTTP headers used across all API responses
 * @deprecated Use sharedCommonHeaders from @lib/api/cacheHeaders.js instead
 */
export const commonHeaders = sharedCommonHeaders

/**
 * Extended headers for successful responses with caching directives
 * @deprecated Use jsonHeaders from @lib/api/cacheHeaders.js instead
 */
export const successHeaders = jsonHeaders

/**
 * Custom error class for CCIP-specific errors
 */
export class CCIPError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = "CCIPError"
  }
}

// Re-export types from types/index.ts for backwards compatibility
export type { ChainMetadata, ChainConfigError, FilterType }

/**
 * Arguments required for ARM proxy contract interactions
 */
export type ArmProxyArgs = {
  provider: JsonRpcProvider
  routerAddress: string
}

/**
 * Retrieves the ARM contract instance for a given router
 * @param provider - Ethereum provider instance
 * @param routerAddress - Address of the CCIP router contract
 * @returns Promise resolving to the ARM contract instance
 */
export const getArmContract = async ({ provider, routerAddress }: ArmProxyArgs) => {
  const routerContract = new Contract(routerAddress, CCIPRouterABI, provider)
  const armProxyAddress: string = await routerContract.getArmProxy()
  return new Contract(armProxyAddress, CCIPArmABI, provider)
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
  provider: JsonRpcProvider,
  chain: SupportedChain,
  routerAddress: string
): Promise<boolean> => {
  try {
    return await getArmIsCursed({ provider, routerAddress })
  } catch (error) {
    logger.error({
      message: "Error checking if chain is cursed",
      chain,
      error: error instanceof Error ? error.message : "Unknown error",
    })
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
 * @param requestId - Optional request ID for correlation (generates new UUID if not provided)
 * @returns Metadata object with timestamp and request tracking
 */
export const createMetadata = (environment: Environment, requestId?: string): ChainMetadata => ({
  environment,
  timestamp: new Date().toISOString(),
  requestId: requestId ?? crypto.randomUUID(),
  ignoredChainCount: 0,
  validChainCount: 0,
})

/**
 * Creates token-specific metadata object
 * @param environment - Current network environment
 * @returns Metadata object with environment, timestamp, and requestId
 */
export const createTokenMetadata = (environment: Environment): TokenMetadata => {
  return {
    environment,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    ignoredTokenCount: 0,
    validTokenCount: 0,
  }
}

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
    throw new CCIPError(400, "outputKey must be one of: chainId, selector, or internalId.")
  }
  return outputKey as "chainId" | "selector" | "internalId"
}

/**
 * Validates the enrichFeeTokens parameter
 * @param enrichFeeTokens - String value to validate
 * @returns Boolean indicating whether to enrich fee tokens with addresses and metadata
 * @throws CCIPError if enrichFeeTokens value is invalid
 */
export const validateEnrichFeeTokens = (enrichFeeTokens?: string): boolean => {
  if (!enrichFeeTokens) return false
  const normalizedValue = enrichFeeTokens.toLowerCase()
  if (!["true", "false"].includes(normalizedValue)) {
    throw new CCIPError(400, 'enrichFeeTokens must be "true" or "false".')
  }
  return normalizedValue === "true"
}

/**
 * Validates search parameter
 * @param search - Search query string to validate
 * @returns Trimmed search string or null if empty
 * @throws CCIPError if search query is invalid
 */
export const validateSearch = (search: string | null): string | null => {
  if (!search) return null

  const trimmed = search.trim()

  if (trimmed.length === 0) return null

  if (trimmed.length > 100) {
    throw new CCIPError(400, "Search query must not exceed 100 characters.")
  }

  // Allow alphanumeric, spaces, hyphens, and underscores (explicit ASCII to prevent Unicode issues)
  if (!/^[a-zA-Z0-9_\s-]+$/.test(trimmed)) {
    throw new CCIPError(400, "Search query contains invalid characters.")
  }

  return trimmed
}

/**
 * Validates family parameter
 * @param family - Family string to validate
 * @returns Normalized ChainFamily or null if empty
 * @throws CCIPError if family value is invalid
 */
export const validateFamily = (family: string | null): ChainFamily | null => {
  if (!family) return null

  const trimmed = family.trim()
  if (trimmed.length === 0) return null

  const normalized = trimmed.toLowerCase()

  const familyMap: Record<string, ChainFamily> = {
    evm: "evm",
    solana: "solana",
    aptos: "aptos",
    sui: "sui",
    tron: "tron",
    canton: "canton",
    ton: "ton",
    stellar: "stellar",
    starknet: "starknet",
  }

  const mapped = familyMap[normalized]
  if (!mapped) {
    throw new CCIPError(400, "family must be one of: evm, solana, aptos, sui, tron, canton, ton, stellar, starknet.")
  }

  return mapped
}

/**
 * Validates that search and legacy filters are not combined
 * @param search - Search query string
 * @param filters - Legacy filter parameters
 * @throws CCIPError if search is combined with legacy filters
 */
export const validateSearchParams = (search: string | null, filters: FilterType): void => {
  const hasLegacyFilter = filters.chainId || filters.selector || filters.internalId

  if (search && hasLegacyFilter) {
    throw new CCIPError(400, "Cannot combine search with chainId, selector, or internalId filters.")
  }
}

export const generateChainKey = (chainId: number | string, chainType: ChainType, outputKey: OutputKeyType): string => {
  const chainIdStr = chainId.toString()

  if (outputKey === "chainId" && chainType !== "evm" && chainType !== "solana") {
    return `${chainType}-${chainIdStr}`
  }

  return chainIdStr
}

/**
 * Normalizes version strings to consistent semantic versioning format
 * @param version - Version string to normalize
 * @returns Normalized version in x.y.z format
 */
export const normalizeVersion = (version: string): string => {
  // Handle "OnRamp 1.6.0" or "OffRamp 1.6.0" formats
  const contractVersionMatch = version.match(/(?:OnRamp|OffRamp)\s+(\d+\.\d+\.\d+)/i)
  if (contractVersionMatch) {
    return contractVersionMatch[1] // Extract "1.6.0"
  }

  // Handle "V1" format (typically for Solana)
  if (version.toUpperCase() === "V1") {
    return "1.6.0" // Map V1 to 1.6.0 for Solana
  }

  // Handle already correct semver format
  const semverMatch = version.match(/^(\d+\.\d+\.\d+)$/)
  if (semverMatch) {
    return semverMatch[1]
  }

  // Fallback for unknown formats
  logger.warn({
    message: "Unknown version format, using default",
    version,
    defaultVersion: "1.0.0",
  })
  return "1.0.0"
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
      destinationNetworkIds,
      sourceRouterAddress,
    }
  } catch (error) {
    logger.error({
      message: "Error loading chain configuration",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw new CCIPError(500, "Failed to load chain configuration")
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
  requestId?: string
  details?: unknown
}

/**
 * Creates a standardized API error response
 * @param error - Error type
 * @param message - Error message
 * @param status - HTTP status code
 * @param details - Additional error details
 * @param requestId - Optional request ID for correlation
 * @returns Response object with error details
 */
export function createErrorResponse(
  error: APIErrorType,
  message: string,
  status: number,
  details?: unknown,
  requestId?: string
): Response {
  const errorResponse: APIError = {
    error,
    message,
    ...(requestId ? { requestId } : {}),
    ...(details ? { details } : {}),
  }

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: commonHeaders,
  })
}
