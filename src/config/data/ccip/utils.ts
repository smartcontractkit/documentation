import { SupportedChain, chainToTechnology } from "@config"
import { NetworkFeeStructure, PoolType, TokenMechanism, LaneSpecificFeeKey } from "./types"
import { networkFees } from "./data"

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

export const representMoney = (amount: string): string => {
  const removeLast12Zeros = amount.slice(0, -16)
  const amountString = removeLast12Zeros.toString()
  const amountLength = amountString.length
  const decimalIndex = amountLength - 2
  const integerPart = amountString.slice(0, decimalIndex)
  const decimalPart = amountString.slice(decimalIndex)
  const integerPartWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${integerPartWithCommas}.${decimalPart}`
}
