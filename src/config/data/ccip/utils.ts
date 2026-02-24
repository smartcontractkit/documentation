import { SupportedChain } from "~/config/types.ts"
import { chainToTechnology } from "~/config/chains.ts"
import { NetworkFeeStructure, PoolType, TokenMechanism, LaneSpecificFeeKey, RateLimiterConfig } from "./types.ts"
import { networkFees } from "./data.ts"
import { commify } from "~/utils/number.ts"
import { formatUnits } from "ethers"

// Define valid pool type combinations and their corresponding mechanisms
const POOL_MECHANISM_MAP: Record<string, TokenMechanism> = {
  "lockRelease:burnMint": TokenMechanism.LockAndMint,
  "burnMint:lockRelease": TokenMechanism.BurnAndUnlock,
  "lockRelease:lockRelease": TokenMechanism.LockAndUnlock,
  "burnMint:burnMint": TokenMechanism.BurnAndMint,
  "usdc:usdc": TokenMechanism.BurnAndMint,
  "usdc:burnMint": TokenMechanism.BurnAndMint,
  "burnMint:usdc": TokenMechanism.BurnAndMint,
} as const

export const determineTokenMechanism = (
  sourcePoolType: PoolType | undefined,
  destinationPoolType: PoolType | undefined
): TokenMechanism => {
  // Early return for undefined pool cases
  if (!sourcePoolType || !destinationPoolType) {
    if (!sourcePoolType && !destinationPoolType) return TokenMechanism.NoPoolsOnBothChains
    return !sourcePoolType ? TokenMechanism.NoPoolSourceChain : TokenMechanism.NoPoolDestinationChain
  }

  // Look up the mechanism based on pool type combination
  const key = `${sourcePoolType}:${destinationPoolType}`
  return POOL_MECHANISM_MAP[key] ?? TokenMechanism.Unsupported
}

export const tokenPoolDisplay = (poolType?: PoolType) => {
  const poolTypeMapping: Record<PoolType, string> = {
    lockRelease: "LockRelease",
    burnMint: "BurnMint",
    usdc: "BurnMint",
    feeTokenOnly: "Fee Token Only",
  }

  return poolType ? (poolTypeMapping[poolType] ?? "Unsupported") : "Unsupported"
}

export const calculateNetworkFeesForTokenMechanismDirect = (
  mechanism: TokenMechanism,
  laneSpecificFeeKey: LaneSpecificFeeKey
): NetworkFeeStructure => {
  const feesForMechanism = networkFees.tokenTransfers[mechanism]
  const specificFee = feesForMechanism ? feesForMechanism[laneSpecificFeeKey] : null

  if (specificFee) {
    return specificFee
  } else {
    console.error(`No fees defined for mechanism: ${mechanism} and lane key: ${laneSpecificFeeKey}`)
    return { gasTokenFee: "0", linkFee: "0" }
  }
}

export const calculateNetworkFeesForTokenMechanism = (
  mechanism: TokenMechanism,
  sourceChain: SupportedChain,
  destinationChain: SupportedChain
): NetworkFeeStructure => {
  const feesForMechanism = networkFees.tokenTransfers[mechanism]

  if (feesForMechanism && feesForMechanism.allLanes) {
    return feesForMechanism.allLanes
  }

  // If 'allLanes' is not available, determine the fee type based on the technology of source and destination chains
  const sourceTechno = chainToTechnology[sourceChain]
  const destinationTechno = chainToTechnology[destinationChain]

  const isSourceEthereum = sourceTechno === "ETHEREUM"
  const isDestinationEthereum = destinationTechno === "ETHEREUM"

  let laneSpecificFeeKey: LaneSpecificFeeKey
  if ((isSourceEthereum || isDestinationEthereum) && feesForMechanism.fromToEthereum) {
    laneSpecificFeeKey = "fromToEthereum"
  } else if (isSourceEthereum && feesForMechanism.fromEthereum) {
    laneSpecificFeeKey = "fromEthereum"
  } else if (isDestinationEthereum && feesForMechanism.toEthereum) {
    laneSpecificFeeKey = "toEthereum"
  } else {
    laneSpecificFeeKey = "nonEthereum"
  }

  return calculateNetworkFeesForTokenMechanismDirect(mechanism, laneSpecificFeeKey)
}

export const calculateMessagingNetworkFeesDirect = (laneSpecificFeeKey: LaneSpecificFeeKey): NetworkFeeStructure => {
  const messagingFees = networkFees.messaging[laneSpecificFeeKey]
  if (messagingFees) {
    return messagingFees
  } else {
    console.error(`No fees defined for lane key: ${laneSpecificFeeKey}`)
    return { gasTokenFee: "0", linkFee: "0" }
  }
}

export const calculateMessaingNetworkFees = (sourceChain: SupportedChain, destinationChain: SupportedChain) => {
  const sourceTechno = chainToTechnology[sourceChain]
  const destinationTechno = chainToTechnology[destinationChain]

  const isSourceEthereum = sourceTechno === "ETHEREUM"
  const isDestinationEthereum = destinationTechno === "ETHEREUM"

  let laneSpecificFeeKey: LaneSpecificFeeKey
  if (isSourceEthereum || isDestinationEthereum) {
    laneSpecificFeeKey = "fromToEthereum"
  } else {
    laneSpecificFeeKey = "nonEthereum"
  }

  return calculateMessagingNetworkFeesDirect(laneSpecificFeeKey)
}

const formatTime = (seconds: number) => {
  const minute = 60
  const hour = 3600 // 60*60

  if (seconds < minute) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`
  } else if (seconds < hour && hour - seconds > 300) {
    // if the difference less than 5 minutes(300 seconds), round to hours
    const minutes = Math.round(seconds / minute)
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  } else {
    let hours = Math.floor(seconds / hour)
    const remainingSeconds = seconds % hour

    // Determine the nearest 5-minute interval
    let minutes = Math.round(remainingSeconds / minute / 5) * 5

    // Round up to the next hour if minutes are 60
    if (minutes === 60) {
      hours += 1
      minutes = 0
    }

    return `${hours}${
      minutes > 0
        ? ` hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes > 1 ? "s" : ""}`
        : ` hour${hours > 1 ? "s" : ""}`
    }`
  }
}

/**
 * Modern capacity display using ethers.js v6 formatUnits
 */
export const displayCapacity = (decimals = 18, token: string, rateLimiterConfig?: RateLimiterConfig) => {
  if (!rateLimiterConfig?.isEnabled) {
    return "N/A"
  }

  const capacity = rateLimiterConfig?.capacity || "0"
  // Use ethers.js formatUnits for precise decimal conversion
  const formattedCapacity = formatUnits(capacity, decimals)

  // Remove trailing zeros and unnecessary decimal point
  const cleanedCapacity = formattedCapacity.replace(/\.?0+$/, "")

  return `${commify(cleanedCapacity)} ${token}`
}

/**
 * Modern rate display using ethers.js v6 formatUnits
 */
export const displayRate = (capacity: string, rate: string, symbol: string, decimals = 18) => {
  // Use ethers.js formatUnits for precise decimal conversion
  const capacityFormatted = formatUnits(capacity, decimals)
  const rateFormatted = formatUnits(rate, decimals)

  // Convert to numbers for time calculation
  const capacityNum = parseFloat(capacityFormatted)
  const rateNum = parseFloat(rateFormatted)

  const totalRefillTime = capacityNum / rateNum // in seconds
  const displayTime = `${formatTime(totalRefillTime)}`

  // Clean up formatting
  const cleanedRate = rateFormatted.replace(/\.?0+$/, "")
  const cleanedCapacity = capacityFormatted.replace(/\.?0+$/, "")

  return {
    rateSecond: `${commify(cleanedRate)} ${symbol}/second`,
    maxThroughput: `Refills from 0 to ${commify(cleanedCapacity)} ${symbol} in ${displayTime}`,
  }
}

// ==============================
// UTILITY FUNCTIONS FOR TOKEN STATUS
// ==============================

/**
 * Determines if a token is paused based on its rate limiter configuration
 * A token is considered paused if its capacity is <= 1
 *
 */
export const isTokenPaused = (decimals = 18, rateLimiterConfig?: RateLimiterConfig): boolean => {
  if (!rateLimiterConfig?.isEnabled) {
    return false // N/A tokens are not considered paused
  }

  const capacity = rateLimiterConfig?.capacity || "0"

  try {
    // Convert to BigInt for precise comparison
    const capacityBigInt = BigInt(capacity)
    // Calculate threshold: 1 token in smallest units = 10^decimals
    const oneTokenInSmallestUnits = BigInt(10) ** BigInt(decimals)

    // Direct BigInt comparison - no floating point risks
    return capacityBigInt <= oneTokenInSmallestUnits
  } catch (error) {
    // If capacity is not a valid number, treat as paused for safety
    console.warn(`Invalid capacity value for rate limiter: ${capacity}`, error)
    return true
  }
}

/**
 * Determines if all outbound lanes for a token from a specific network are paused
 * Used to grey out network rows in the token view when all destination lanes are paused
 *
 * @example
 * // Example: LBTC (8 decimals) on Ink with only one destination lane that has capacity "2"
 * const destinationLanes = {
 *   "ethereum-mainnet-ink-1": {
 *     rateLimiterConfig: {
 *       out: {
 *         capacity: "2",
 *         isEnabled: true,
 *         rate: "1"
 *       }
 *     }
 *   }
 * }
 * areAllLanesPaused(8, destinationLanes) // returns true (2 ≤ 10^8)
 */
export const areAllLanesPaused = (
  decimals = 18,
  destinationLanes: { [destinationChain: string]: { rateLimiterConfig?: { out?: RateLimiterConfig } } }
): boolean => {
  const laneKeys = Object.keys(destinationLanes)

  // If no lanes exist, don't consider it paused
  if (laneKeys.length === 0) {
    return false
  }

  // Check if ALL outbound lanes are paused
  return laneKeys.every((destinationChain) => {
    const outboundConfig = destinationLanes[destinationChain]?.rateLimiterConfig?.out
    return isTokenPaused(decimals, outboundConfig)
  })
}
