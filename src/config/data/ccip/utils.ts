import { SupportedChain, chainToTechnology } from "@config"
import { NetworkFeeStructure, PoolType, TokenMechanism, LaneSpecificFeeKey, RateLimiterConfig } from "./types"
import { networkFees } from "./data"
import BigNumber from "bignumber.js"
import { utils } from "ethers"

export const determineTokenMechanism = (
  sourcePoolType: PoolType | undefined,
  destinationPoolType: PoolType | undefined
): TokenMechanism => {
  if (!sourcePoolType && destinationPoolType) {
    return TokenMechanism.NoPoolSourceChain
  } else if (sourcePoolType && !destinationPoolType) {
    return TokenMechanism.NoPoolDestinationChain
  } else if (!sourcePoolType && !destinationPoolType) {
    return TokenMechanism.NoPoolsOnBothChains
  }

  if (sourcePoolType === "lockRelease" && destinationPoolType === "burnMint") {
    return TokenMechanism.LockAndMint
  } else if (sourcePoolType === "burnMint" && destinationPoolType === "lockRelease") {
    return TokenMechanism.BurnAndUnlock
  } else if (sourcePoolType === "lockRelease" && destinationPoolType === "lockRelease") {
    return TokenMechanism.LockAndUnlock
  } else if (
    (sourcePoolType === "burnMint" && destinationPoolType === "burnMint") ||
    (sourcePoolType === "usdc" && destinationPoolType === "usdc")
  ) {
    return TokenMechanism.BurnAndMint
  }

  return TokenMechanism.Unsupported
}

export const tokenPoolDisplay = (poolType?: PoolType) => {
  const poolTypeMapping: Record<PoolType, string> = {
    lockRelease: "Lock/Release",
    burnMint: "Burn/Mint",
    usdc: "Burn/Mint",
    feeTokenOnly: "Fee Token Only",
  }

  return poolType ? poolTypeMapping[poolType] ?? "Unsupported" : "Unsupported"
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

const normalizeNumber = (bigNum: BigNumber, decimals = 18) => {
  const divisor = new BigNumber(10).pow(decimals)
  const normalized = bigNum.dividedBy(divisor)

  return normalized.toNumber()
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

export const displayCapacity = (decimals = 18, token: string, rateLimiterConfig?: RateLimiterConfig) => {
  if (!rateLimiterConfig?.isEnabled) {
    return "N/A"
  }

  const capacity = String(rateLimiterConfig?.capacity || 0)
  const numberWithoutDecimals = normalizeNumber(new BigNumber(capacity), decimals).toString()
  return `${utils.commify(numberWithoutDecimals)} ${token}`
}

export const displayRate = (capacity: string, rate: string, symbol: string, decimals = 18) => {
  const capacityNormalized = normalizeNumber(new BigNumber(capacity), decimals) // normalize capacity
  const rateNormalized = normalizeNumber(new BigNumber(rate), decimals) // normalize capacity

  const totalRefillTime = capacityNormalized / rateNormalized // in seconds
  const displayTime = `${formatTime(totalRefillTime)}`

  return {
    rateSecond: `${utils.commify(rateNormalized)} ${symbol}/second`,
    maxThroughput: `Refills from 0 to ${utils.commify(capacityNormalized)} ${symbol} in ${displayTime}`,
  }
}
