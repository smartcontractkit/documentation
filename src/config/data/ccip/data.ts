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
  LaneConfig,
  Network,
} from "."
import { ExplorerInfo, SupportedChain } from "@config/types"
import {
  directoryToSupportedChain,
  getChainIcon,
  getExplorer,
  getExplorerAddressUrl,
  getTitle,
  supportedChainToChainInRdd,
} from "@features/utils"

// For mainnet
import chainsMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/chains.json"
import lanesMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/lanes.json"
import tokensMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/tokens.json"

// For testnet

import chainsTestnetv120 from "@config/data/ccip/v1_2_0/testnet/chains.json"
import lanesTestnetv120 from "@config/data/ccip/v1_2_0/testnet/lanes.json"
import tokensTestnetv120 from "@config/data/ccip/v1_2_0/testnet/tokens.json"

// Import errors by version
// eslint-disable-next-line camelcase
import * as errors_v1_5_0 from "./errors/v1_5_0"
// eslint-disable-next-line camelcase
import * as errors_v1_5_1 from "./errors/v1_5_1"

export const getAllEnvironments = () => [Environment.Mainnet, Environment.Testnet]
export const getAllVersions = () => [Version.V1_2_0]

// Type for v1.5.0 errors
type ErrorTypesV150 = {
  erc20CCIPSendErrors: CCIPSendErrorEntry[]
  routerCCIPSendErrors: CCIPSendErrorEntry[]
  onrampCCIPSendErrors: CCIPSendErrorEntry[]
  ratelimiterCCIPSendErrors: CCIPSendErrorEntry[]
  priceregistryCCIPSendErrors: CCIPSendErrorEntry[]
}

// Type for v1.5.1 errors
type ErrorTypesV151 = ErrorTypesV150 & {
  poolCCIPSendErrors: CCIPSendErrorEntry[]
  burnMintERC20CCIPSendErrors: CCIPSendErrorEntry[]
}

type VersionedErrors = {
  v1_5_0: ErrorTypesV150
  v1_5_1: ErrorTypesV151
}

// Export errors by version with type safety
export const errors: VersionedErrors = {
  // eslint-disable-next-line camelcase
  v1_5_0: errors_v1_5_0 as ErrorTypesV150,
  // eslint-disable-next-line camelcase
  v1_5_1: errors_v1_5_1 as ErrorTypesV151,
}

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
  environment,
}: {
  mainnetVersion: Version
  testnetVersion: Version
  environment?: Environment
}) => {
  let chainsMainnetKeys: string[] = []
  let chainsTestnetKeys: string[] = []

  if (!environment || environment === Environment.Mainnet) {
    switch (mainnetVersion) {
      case Version.V1_2_0:
        chainsMainnetKeys = Object.keys(chainsMainnetv120)
        break
      default:
        throw new Error(`Invalid mainnet version: ${mainnetVersion}`)
    }
  }

  if (!environment || environment === Environment.Testnet) {
    switch (testnetVersion) {
      case Version.V1_2_0:
        chainsTestnetKeys = Object.keys(chainsTestnetv120)
        break
      default:
        throw new Error(`Invalid testnet version: ${testnetVersion}`)
    }
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

export const getTokenData = (params: { tokenId: string; environment: Environment; version: Version }) => {
  const { tokensReferenceData } = loadReferenceData(params)
  const tokenConfig = tokensReferenceData[params.tokenId]

  if (tokenConfig) {
    return tokenConfig // Assuming the token configuration has a 'name' property
  } else {
    console.warn(`No token data found for ${params.tokenId}`)
    return {}
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

export const getTokensOfChain = ({ chain, filter }: { chain: string; filter: Environment }): string[] => {
  // Create a mapping object to avoid the switch statement
  const tokensDataMap: { [key in Environment]?: TokensConfig } = {
    [Environment.Mainnet]: tokensMainnetv120 as TokensConfig,
    [Environment.Testnet]: tokensTestnetv120 as TokensConfig,
  }

  // Get tokensData from the map, or throw an error if not found
  const tokensData = tokensDataMap[filter]
  if (!tokensData) {
    throw new Error(`Invalid environment: ${filter}`)
  }

  // Filter tokens that satisfy the conditions
  return Object.keys(tokensData).filter((token) => {
    const tokenData = tokensData[token]
    // Check if tokenData for the given chain exists and isn't 'feeTokenOnly'
    if (tokenData[chain] && tokenData[chain].poolType !== "feeTokenOnly") {
      const lanes = getAllTokenLanes({ token, environment: filter })
      // Ensure there is at least one lane and that the lane exists for the given chain
      return Object.keys(lanes).length > 0 && lanes[chain] && Object.keys(lanes[chain]).length > 0
    }
    return false
  })
}

export const getAllNetworks = ({ filter }: { filter: Environment }): Network[] => {
  const chains = getAllChains({
    mainnetVersion: Version.V1_2_0,
    testnetVersion: Version.V1_2_0,
    environment: filter,
  })

  const allChains: {
    name: string
    logo: string
    totalLanes: number
    totalTokens: number
    chain: string
    key: string
    chainSelector: string
    tokenAdminRegistry?: string
    explorer: ExplorerInfo
    registryModule?: string
    router?: {
      address: string
      version: string
    }
    feeTokens?: {
      name: string
      logo: string
    }[]
    nativeToken?: {
      name: string
      symbol: string
      logo: string
    }
    armProxy: {
      address: string
      version: string
    }
    routerExplorerUrl: string
  }[] = []

  for (const chain of chains) {
    const directory = directoryToSupportedChain(chain)
    const title = getTitle(directory)
    if (!title) throw Error(`Title not found for ${directory}`)

    const lanes = Environment.Mainnet === filter ? lanesMainnetv120 : lanesTestnetv120
    const chains = Environment.Mainnet === filter ? chainsMainnetv120 : chainsTestnetv120
    const logo = getChainIcon(directory)
    if (!logo) throw Error(`Logo not found for ${directory}`)
    const token = getTokensOfChain({ chain, filter })
    const explorer = getExplorer(directory)
    const router = chains[chain].router
    if (!explorer) throw Error(`Explorer not found for ${directory}`)
    const routerExplorerUrl = getExplorerAddressUrl(explorer)(router.address)
    allChains.push({
      name: title,
      logo,
      totalLanes: Object.keys(lanes[chain]).length,
      totalTokens: token.length,
      chain,
      key: chain,
      explorer,
      tokenAdminRegistry: chains[chain]?.tokenAdminRegistry?.address,
      registryModule: chains[chain]?.registryModule?.address,
      router,
      routerExplorerUrl,
      chainSelector: chains[chain].chainSelector,
      nativeToken: {
        name: chains[chain]?.nativeToken?.name || "",
        symbol: chains[chain]?.nativeToken?.symbol || "",
        logo: chains[chain]?.nativeToken?.logo || "",
      },
      feeTokens: chains[chain].feeTokens,
      armProxy: chains[chain].armProxy,
    })
  }

  return allChains.sort((a, b) => a.name.localeCompare(b.name))
}

export const getNetwork = ({ chain, filter }: { chain: string; filter: Environment }) => {
  const chains = getAllNetworks({ filter })

  for (const network of chains) {
    if (network.chain === chain) {
      let chainsReferenceData: ChainsConfig
      switch (filter) {
        case "mainnet":
          chainsReferenceData = chainsMainnetv120 as unknown as ChainsConfig
          break
        case "testnet":
          chainsReferenceData = chainsTestnetv120 as unknown as ChainsConfig
          break
        default:
          throw new Error(`Invalid testnet version: ${filter}`)
      }

      const chainDetails = chainsReferenceData[chain]
      return {
        name: network.name,
        logo: network.logo,
        explorer: network.explorer,
        ...chainDetails,
      }
    }
  }

  return undefined
}

export const getChainsOfToken = ({ token, filter }: { token: string; filter: Environment }): string[] => {
  // Get the tokens data based on the filter
  const tokensData = (() => {
    switch (filter) {
      case Environment.Mainnet:
        return tokensMainnetv120 as TokensConfig
      case Environment.Testnet:
        return tokensTestnetv120 as TokensConfig
      default:
        throw new Error(`Invalid environment: ${filter}`)
    }
  })()

  // Get all valid chains for the given token
  return Object.entries(tokensData[token])
    .filter(([, tokenData]) => tokenData.poolType !== "feeTokenOnly")
    .filter(([chain]) => {
      const lanes = getAllTokenLanes({ token, environment: filter })
      return Object.keys(lanes).length > 0 && lanes[chain] && Object.keys(lanes[chain]).length > 0
    })
    .map(([chain]) => chain)
}

export const getAllNetworkLanes = async ({
  chain,
  environment,
  version,
  site,
}: {
  chain: string
  environment: Environment
  version: Version
  site: string
}) => {
  const { lanesReferenceData } = loadReferenceData({
    environment,
    version,
  })

  const allLanes = lanesReferenceData[chain]

  const lanesData: {
    name: string
    logo: string
    key: string
    directory: SupportedChain
    onRamp: {
      address: string
      version: string
    }
    offRamp: {
      address: string
      version: string
    }
  }[] = Object.keys(allLanes).map((lane) => {
    const laneData = allLanes[lane]

    const directory = directoryToSupportedChain(lane || "")
    const title = getTitle(directory)
    const networkLogo = getChainIcon(directory)

    return {
      name: title || "",
      logo: networkLogo || "",
      onRamp: laneData.onRamp,
      offRamp: laneData.offRamp,
      key: lane,
      directory,
    }
  })

  return lanesData.sort((a, b) => a.name.localeCompare(b.name))
}

export function getAllTokenLanes({
  token,
  environment,
  version = Version.V1_2_0,
}: {
  token: string
  environment: Environment
  version?: Version
}) {
  const { lanesReferenceData } = loadReferenceData({
    environment,
    version,
  })

  // Define the resulting object
  const allDestinationLanes: {
    [sourceChain: string]: {
      [destinationChain: string]: SupportedTokenConfig
    }
  } = {}

  // Iterate over the source chains
  for (const sourceChain in lanesReferenceData) {
    const sourceData = lanesReferenceData[sourceChain]
    for (const destinationChain in sourceData) {
      const destinationData = sourceData[destinationChain]

      // Check if the token is supported
      if (destinationData?.supportedTokens?.[token]) {
        allDestinationLanes[sourceChain] = {
          ...allDestinationLanes[sourceChain],
          [destinationChain]: destinationData.supportedTokens[token],
        }
      }
    }
  }

  return allDestinationLanes
}

export function getLane({
  sourceChain,
  destinationChain,
  environment,
  version,
}: {
  sourceChain: SupportedChain
  destinationChain: SupportedChain
  environment: Environment
  version: Version
}) {
  const { lanesReferenceData } = loadReferenceData({
    environment,
    version,
  })

  return lanesReferenceData[sourceChain][destinationChain]
}

export function getSearchLanes({ environment }: { environment: Environment }) {
  const lanes = environment === Environment.Mainnet ? lanesMainnetv120 : lanesTestnetv120
  const allLanes: {
    sourceNetwork: {
      name: string
      logo: string
      key: string
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
    }
    lane: LaneConfig
  }[] = []

  for (const sourceChain in lanes) {
    const sourceChainDirectory = directoryToSupportedChain(sourceChain)
    const sourceChainTitle = getTitle(sourceChainDirectory)
    const sourceChainLogo = getChainIcon(sourceChainDirectory)

    for (const destinationChain in lanes[sourceChain]) {
      const destinationChainDirectory = directoryToSupportedChain(destinationChain)
      const destinationChainTitle = getTitle(destinationChainDirectory)
      const destinationChainLogo = getChainIcon(destinationChainDirectory)

      const lane = lanes[sourceChain][destinationChain]
      const explorer = getExplorer(destinationChainDirectory)
      if (!explorer) throw Error(`Explorer not found for ${destinationChainDirectory}`)
      allLanes.push({
        sourceNetwork: {
          name: sourceChainTitle || "",
          logo: sourceChainLogo || "",
          key: sourceChain,
        },
        destinationNetwork: {
          name: destinationChainTitle || "",
          logo: destinationChainLogo || "",
          key: destinationChain,
          explorer,
        },
        lane,
      })
    }
  }

  // sorting lanes by source chain name and destination chain name
  return allLanes.sort((a, b) => {
    if (a.sourceNetwork.name > b.sourceNetwork.name) return 1
    if (a.sourceNetwork.name < b.sourceNetwork.name) return -1
    if (a.destinationNetwork.name > b.destinationNetwork.name) return 1
    if (a.destinationNetwork.name < b.destinationNetwork.name) return -1
    return 0
  })
}

export async function getOperationalState(chain: string) {
  const url = `/api/ccip/lane-statuses?sourceNetworkId=${chain}`
  const response = await fetch(url)
  if (response.status !== 200) {
    return {}
  }
  return response.json()
}
