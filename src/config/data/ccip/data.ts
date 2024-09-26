import {
  ChainsConfig,
  LanesConfig,
  TokensConfig,
  Environment,
  Version,
  CCIPSendErrorEntry,
  SupportedTokenConfig,
  determineTokenMechanism,
  TokenMechanism,
  NetworkFees,
} from "."

// For mainnet
import chainsMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/chains.json"
import lanesMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/lanes.json"
import tokensMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/tokens.json"

// For testnet

import chainsTestnetv120 from "@config/data/ccip/v1_2_0/testnet/chains.json"
import lanesTestnetv120 from "@config/data/ccip/v1_2_0/testnet/lanes.json"
import tokensTestnetv120 from "@config/data/ccip/v1_2_0/testnet/tokens.json"

// errors

import erc20CCIPSendErrors from "@config/data/ccip/errors/erc20.json"
import routerCCIPSendErrors from "@config/data/ccip/errors/router.json"
import onrampCCIPSendErrors from "@config/data/ccip/errors/onramp.json"
import ratelimiterCCIPSendErrors from "@config/data/ccip/errors/ratelimiter.json"
import priceregistryCCIPSendErrors from "@config/data/ccip/errors/priceregistry.json"

import { SupportedChain } from "@config/types"
import { directoryToSupportedChain, getChainIcon, getTitle, supportedChainToChainInRdd } from "@features/utils"

export const getAllEnvironments = () => [Environment.Mainnet, Environment.Testnet]
export const getAllVersions = () => [Version.V1_2_0]

export const erc20Errors: CCIPSendErrorEntry[] = erc20CCIPSendErrors
export const routerErrors: CCIPSendErrorEntry[] = routerCCIPSendErrors
export const onrampErrors: CCIPSendErrorEntry[] = onrampCCIPSendErrors
export const ratelimiterErrors: CCIPSendErrorEntry[] = ratelimiterCCIPSendErrors
export const priceRegistryErrors: CCIPSendErrorEntry[] = priceregistryCCIPSendErrors

export const networkFees: NetworkFees = {
  tokenTransfers: {
    [TokenMechanism.LockAndUnlock]: {
      allLanes: { gasTokenFee: "0.07 %", linkFee: "0.063 %" },
    },
    [TokenMechanism.LockAndMint]: {
      fromEthereum: { gasTokenFee: "0.50 USD", linkFee: "0.45 USD" },
      toEthereum: { gasTokenFee: "1.50 USD", linkFee: "1.35 USD" },
      nonEthereum: { gasTokenFee: "0.25 USD", linkFee: "0.225 USD" },
    },
    [TokenMechanism.BurnAndMint]: {
      fromEthereum: { gasTokenFee: "0.50 USD", linkFee: "0.45 USD" },
      toEthereum: { gasTokenFee: "1.50 USD", linkFee: "1.35 USD" },
      nonEthereum: { gasTokenFee: "0.25 USD", linkFee: "0.225 USD" },
    },
    [TokenMechanism.BurnAndUnlock]: {
      fromEthereum: { gasTokenFee: "0.50 USD", linkFee: "0.45 USD" },
      toEthereum: { gasTokenFee: "1.50 USD", linkFee: "1.35 USD" },
      nonEthereum: { gasTokenFee: "0.25 USD", linkFee: "0.225 USD" },
    },
    [TokenMechanism.NoPoolDestinationChain]: {
      allLanes: { gasTokenFee: "", linkFee: "" },
    },
    [TokenMechanism.NoPoolSourceChain]: { allLanes: { gasTokenFee: "", linkFee: "" } },
    [TokenMechanism.NoPoolsOnBothChains]: { allLanes: { gasTokenFee: "", linkFee: "" } },
    [TokenMechanism.Unsupported]: { allLanes: { gasTokenFee: "", linkFee: "" } },
  },
  messaging: {
    fromToEthereum: { gasTokenFee: "0.50 USD", linkFee: "0.45 USD" },
    nonEthereum: { gasTokenFee: "0.10 USD", linkFee: "0.09 USD" },
  },
}

export const loadReferenceData = ({ environment, version }: { environment: Environment; version: Version }) => {
  let chainsReferenceData: ChainsConfig
  let lanesReferenceData: LanesConfig
  let tokensReferenceData: TokensConfig

  if (environment === Environment.Mainnet && version === Version.V1_2_0) {
    chainsReferenceData = chainsMainnetv120 as unknown as ChainsConfig
    lanesReferenceData = lanesMainnetv120 as unknown as LanesConfig
    tokensReferenceData = tokensMainnetv120 as unknown as TokensConfig
  } else if (environment === Environment.Testnet && version === Version.V1_2_0) {
    chainsReferenceData = chainsTestnetv120 as unknown as ChainsConfig
    lanesReferenceData = lanesTestnetv120 as unknown as LanesConfig
    tokensReferenceData = tokensTestnetv120 as unknown as TokensConfig
  } else {
    throw new Error(`Invalid environment/version combination: ${environment}/${version}`)
  }

  return { chainsReferenceData, lanesReferenceData, tokensReferenceData }
}

export const getAllChains = ({
  mainnetVersion,
  testnetVersion,
}: {
  mainnetVersion: Version
  testnetVersion: Version
}) => {
  let chainsMainnetKeys: string[] = []
  let chainsTestnetKeys: string[] = []

  switch (mainnetVersion) {
    case Version.V1_2_0:
      chainsMainnetKeys = Object.keys(chainsMainnetv120)
      break
    default:
      throw new Error(`Invalid mainnet version: ${mainnetVersion}`)
  }

  switch (testnetVersion) {
    case Version.V1_2_0:
      chainsTestnetKeys = Object.keys(chainsTestnetv120)
      break
    default:
      throw new Error(`Invalid testnet version: ${testnetVersion}`)
  }

  return [...chainsMainnetKeys, ...chainsTestnetKeys]
}

export const getAllSupportedTokens = (params: { environment: Environment; version: Version }) => {
  const { lanesReferenceData } = loadReferenceData(params)
  const tokens: Record<string, Record<SupportedChain, Record<SupportedChain, SupportedTokenConfig>>> = {}
  Object.entries(lanesReferenceData).forEach(([sourceChainRdd, laneReferenceData]) => {
    const sourceChain = directoryToSupportedChain(sourceChainRdd)

    Object.entries(laneReferenceData).forEach(([destinationChainRdd, destinationLaneReferenceData]) => {
      const supportedTokens = destinationLaneReferenceData.supportedTokens
      if (supportedTokens) {
        Object.entries(supportedTokens).forEach(([token, tokenConfig]) => {
          const destinationChain = directoryToSupportedChain(destinationChainRdd)

          tokens[token] = tokens[token] || {}
          tokens[token][sourceChain] = tokens[token][sourceChain] || {}
          tokens[token][sourceChain][destinationChain] = tokenConfig
        })
      }
    })
  })
  if (Object.keys(tokens).length === 0) {
    console.warn(`No supported tokens found for ${params.environment} ${params.version}`)
    return []
  }
  return tokens
}

export const getTokenData = (params: { tokenSymbol: string; environment: Environment; version: Version }) => {
  const { tokensReferenceData } = loadReferenceData(params)
  const tokenConfig = tokensReferenceData[params.tokenSymbol]

  if (tokenConfig) {
    return tokenConfig // Assuming the token configuration has a 'name' property
  } else {
    throw new Error(`Token with symbol ${params.tokenSymbol} not found`)
  }
}

export const getTokenMechanism = (params: {
  token: string
  sourceChain: SupportedChain
  destinationChain: SupportedChain
  environment: Environment
  version: Version
}) => {
  const { tokensReferenceData } = loadReferenceData(params)
  const sourceChainRdd = supportedChainToChainInRdd(params.sourceChain)
  const destinationChainRdd = supportedChainToChainInRdd(params.destinationChain)

  const tokenConfig = tokensReferenceData[params.token]
  const sourceChainPoolInfo = tokenConfig[sourceChainRdd]
  const destinationChainPoolInfo = tokenConfig[destinationChainRdd]
  const sourceChainPoolType = sourceChainPoolInfo.poolType
  const destinationChainPoolType = destinationChainPoolInfo.poolType
  const tokenMechanism = determineTokenMechanism(sourceChainPoolType, destinationChainPoolType)
  return tokenMechanism
}

const CCIPTokenImage =
  "https://images.prismic.io/data-chain-link/86d5bc29-7511-49f5-bbd8-18a8ebc008b0_ccip-icon-white.png?auto=compress,format"

const isBnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  let tokensTestData

  switch (version) {
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-BnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  return tokensTestData[chainRdd]
}

export const isBnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isBnMRdd({ chainRdd, version })
}

export const isLnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  let tokensTestData
  const supportedChainForLock: SupportedChain = "ETHEREUM_SEPOLIA"
  switch (version) {
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-LnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  return {
    supported: tokensTestData[chainRdd],
    supportedChainForLock,
  }
}

export const isLnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isLnMRdd({ chainRdd, version })
}

export const isBnMOrLnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  return isBnMRdd({ chainRdd, version }) || isLnMRdd({ chainRdd, version }).supported
}

export const isBnMOrLnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  return isBnM({ chain, version }) || isLnM({ chain, version })
}

export const getBnMParams = ({ supportedChain, version }: { supportedChain: SupportedChain; version: Version }) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)

  let chainsTestData
  let tokensTestData
  switch (version) {
    case Version.V1_2_0:
      chainsTestData = chainsTestnetv120
      tokensTestData = tokensTestnetv120["CCIP-BnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  if (!(supportedChainRdd in chainsTestData)) return undefined // No BnM for mainnets
  const token = tokensTestData[supportedChainRdd]
  if (!token || Object.keys(token).length === 0) {
    console.warn(`No BnM found for testnet ${supportedChain}`)
    return undefined
  }

  const {
    tokenAddress: address,
    symbol,
    decimals,
  } = token as { tokenAddress: string; symbol: string; decimals: number }
  console.log({ address, symbol, decimals })
  if (!address || !symbol || !decimals) {
    console.error(`Token data not correct for BnM token on ${supportedChain}`)
    return undefined
  }
  return {
    type: "ERC20",
    options: {
      address,
      symbol,
      decimals,
      image: CCIPTokenImage,
    },
  }
}

export const getLnMParams = ({ supportedChain, version }: { supportedChain: SupportedChain; version: Version }) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)

  if (!isLnMRdd({ chainRdd: supportedChainRdd, version }).supported) return undefined

  let tokensTestData
  switch (version) {
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-LnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  const token = tokensTestData[supportedChainRdd]
  if (!token || Object.keys(token).length === 0) {
    console.warn(`No LnM found for testnet ${supportedChain}`)
    return undefined
  }

  const {
    tokenAddress: address,
    symbol,
    decimals,
  } = token as { tokenAddress: string; symbol: string; decimals: number }

  if (!address || !symbol || !decimals) {
    console.error(`Token data not correct for LnM token on ${supportedChain}`)
    return undefined
  }

  return {
    type: "ERC20",
    options: {
      address,
      symbol,
      decimals,
      image: CCIPTokenImage,
    },
  }
}

export const getTokensOfChain = ({ chain, filter }: { chain: string; filter: "mainnet" | "testnet" }) => {
  let tokensTestData
  switch (filter) {
    case "mainnet":
      tokensTestData = tokensMainnetv120
      break
    case "testnet":
      tokensTestData = tokensTestnetv120
      break
    default:
      throw new Error(`Invalid testnet version: ${filter}`)
  }

  const tokensResult: string[] = []

  for (const token in tokensTestData) {
    const tokenData = tokensTestData[token]
    if (tokenData[chain]) {
      tokensResult.push(token)
    }
  }

  return tokensResult
}

export const getAllNetworks = ({ filter = "mainnet" }: { filter?: "mainnet" | "testnet" }) => {
  const chains = getAllChains({
    mainnetVersion: Version.V1_2_0,
    testnetVersion: Version.V1_2_0,
  })

  const allChains: {
    name: string
    logo: string
    totalLanes: number
    totalTokens: number
    chain: string
  }[] = []

  for (const chain of chains) {
    const directory = directoryToSupportedChain(chain)
    const title = getTitle(directory)
    if (filter) {
      if (!title?.includes(filter)) {
        continue
      }
    }
    const logo = getChainIcon(directory)
    const token = getTokensOfChain({ chain, filter })
    allChains.push({
      name: title?.replace(" mainnet", "").replace(" testnet", "") || "",
      logo: logo || "",
      totalLanes: 0,
      totalTokens: token.length,
      chain,
    })
  }

  return allChains
}
