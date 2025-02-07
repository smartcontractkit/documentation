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

// Common response headers (used for all responses including errors)
export const commonHeaders = {
  "Content-Type": "application/json",
}

// Extended headers for successful responses that can be cached
export const successHeaders = {
  ...commonHeaders,
  "Cache-Control": "s-max-age=300, stale-while-revalidate",
  "CDN-Cache-Control": "max-age=300",
  "Vercel-CDN-Cache-Control": "max-age=300",
}

// Error types
export class CCIPError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = "CCIPError"
  }
}

// Chain API types
export type ChainMetadata = {
  environment: Environment
  timestamp: string
  requestId: string
  ignoredChainCount: number
  validChainCount: number
}

export type ChainConfigError = {
  chainId: number
  networkId: string
  reason: string
  missingFields: string[]
}

export type FilterType = {
  chainId?: string
  selector?: string
  internalId?: string
}

export type ArmProxyArgs = {
  provider: ethers.providers.JsonRpcProvider
  routerAddress: string
}

export const getArmContract = async ({ provider, routerAddress }: ArmProxyArgs) => {
  const routerContract = new ethers.Contract(routerAddress, CCIPRouterABI, provider)
  const armProxyAddress: string = await routerContract.getArmProxy()
  return new ethers.Contract(armProxyAddress, CCIPArmABI, provider)
}

export const getArmIsCursed = async ({ provider, routerAddress }: ArmProxyArgs): Promise<boolean> => {
  const armContract = await getArmContract({ provider, routerAddress })
  return armContract.isCursed()
}

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

export const resolveChainOrThrow = (networkId: string): SupportedChain => {
  try {
    return directoryToSupportedChain(networkId)
  } catch {
    throw new Error(`Invalid network ID: ${networkId}`)
  }
}

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

export const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutErrorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((resolve, reject) => setTimeout(() => reject(new Error(timeoutErrorMessage)), ms))
  return Promise.race([promise, timeout])
}

// Chain API utilities
export const createMetadata = (environment: Environment): ChainMetadata => ({
  environment,
  timestamp: new Date().toISOString(),
  requestId: uuidv4(),
  ignoredChainCount: 0,
  validChainCount: 0,
})

export const validateEnvironment = (environment?: string): Environment => {
  const validEnvironments = ["mainnet", "testnet"]
  if (!environment || !validEnvironments.includes(environment)) {
    throw new CCIPError(400, 'Environment parameter is required and must be "mainnet" or "testnet".')
  }
  return environment as Environment
}

export const validateFilters = (filters: FilterType): void => {
  const filterKeys = Object.keys(filters).filter((key) => filters[key as keyof FilterType])
  if (filterKeys.length > 1) {
    throw new CCIPError(400, "Only one filter parameter (chainId, selector, or internalId) can be used.")
  }
}

export const validateOutputKey = (outputKey?: string): "chainId" | "selector" | "internalId" => {
  if (!outputKey) return "chainId"
  if (!["chainId", "selector", "internalId"].includes(outputKey)) {
    throw new CCIPError(400, "outputKey must be one of: chainId, selector, or internalId")
  }
  return outputKey as "chainId" | "selector" | "internalId"
}

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

export type ChainConfigurationResult = {
  environment: Environment
  chainsConfig: ChainsConfig
  selectorConfig: SelectorsConfig
  destinationNetworkIds: string[]
  sourceRouterAddress?: string
}

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
