import {
  ChainsConfig,
  LanesConfig,
  TokensConfig,
  Environment,
  Version,
  CCIPSendErrorEntry,
  SupportedTokenConfig,
  TokenMechanism,
  NetworkFees,
  LaneConfig,
  Network,
  DecomConfig,
  DecommissionedNetwork,
} from "./types.ts"
import { determineTokenMechanism } from "./utils.ts"
import { ExplorerInfo, SupportedChain, ChainType } from "@config/types.ts"
import {
  directoryToSupportedChain,
  getChainIcon,
  getExplorer,
  getExplorerAddressUrl,
  getTitle,
  getChainTypeAndFamily,
  supportedChainToChainInRdd,
  getTokenIconUrl,
  getNativeCurrency,
} from "@features/utils/index.ts"

// For mainnet
import chainsMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/chains.json" with { type: "json" }
import lanesMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/lanes.json" with { type: "json" }
import tokensMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/tokens.json" with { type: "json" }

// For testnet
import chainsTestnetv120 from "@config/data/ccip/v1_2_0/testnet/chains.json" with { type: "json" }
import lanesTestnetv120 from "@config/data/ccip/v1_2_0/testnet/lanes.json" with { type: "json" }
import tokensTestnetv120 from "@config/data/ccip/v1_2_0/testnet/tokens.json" with { type: "json" }

// For decommissioned chains
import decomMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/decom.json" with { type: "json" }
import decomTestnetv120 from "@config/data/ccip/v1_2_0/testnet/decom.json" with { type: "json" }

// Import errors by version
// eslint-disable-next-line camelcase
import * as errors_v1_5_0 from "./errors/v1_5_0/index.ts"
// eslint-disable-next-line camelcase
import * as errors_v1_5_1 from "./errors/v1_5_1/index.ts"
// eslint-disable-next-line camelcase
import * as errors_v1_6_0 from "./errors/v1_6_0/index.ts"
// eslint-disable-next-line camelcase
import * as errors_v1_6_1 from "./errors/v1_6_1/index.ts"
// eslint-disable-next-line camelcase
import * as errors_v1_6_2 from "./errors/v1_6_2/index.ts"
// eslint-disable-next-line camelcase
import * as errors_v1_6_3 from "./errors/v1_6_3/index.ts"

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

type ErrorTypesV160 = ErrorTypesV151 & {
  feequoterCCIPSendErrors: CCIPSendErrorEntry[]
}

type ErrorTypesV161 = ErrorTypesV160
type ErrorTypesV162 = ErrorTypesV161
type ErrorTypesV163 = ErrorTypesV162

type VersionedErrors = {
  v1_5_0: ErrorTypesV150
  v1_5_1: ErrorTypesV151
  v1_6_0: ErrorTypesV160
  v1_6_1: ErrorTypesV161
  v1_6_2: ErrorTypesV162
  v1_6_3: ErrorTypesV163
}

// Export errors by version with type safety
export const errors: VersionedErrors = {
  // eslint-disable-next-line camelcase
  v1_5_0: errors_v1_5_0 as ErrorTypesV150,
  // eslint-disable-next-line camelcase
  v1_5_1: errors_v1_5_1 as ErrorTypesV151,
  // eslint-disable-next-line camelcase
  v1_6_0: errors_v1_6_0 as ErrorTypesV160,
  // eslint-disable-next-line camelcase
  v1_6_1: errors_v1_6_1 as ErrorTypesV161,
  // eslint-disable-next-line camelcase
  v1_6_2: errors_v1_6_2 as ErrorTypesV162,
  // eslint-disable-next-line camelcase
  v1_6_3: errors_v1_6_3 as ErrorTypesV163,
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

  const allChains: Network[] = []

  for (const chain of chains) {
    const supportedChain = directoryToSupportedChain(chain)
    const title = getTitle(supportedChain)
    if (!title) throw Error(`Title not found for ${supportedChain}`)

    const lanes = Environment.Mainnet === filter ? lanesMainnetv120 : lanesTestnetv120
    const chains = Environment.Mainnet === filter ? chainsMainnetv120 : chainsTestnetv120
    const logo = getChainIcon(supportedChain)
    if (!logo) throw Error(`Logo not found for ${supportedChain}`)
    const token = getTokensOfChain({ chain, filter })
    const explorer = getExplorer(supportedChain)
    const router = chains[chain].router
    if (!explorer) throw Error(`Explorer not found for ${supportedChain}`)

    // Determine chain type based on chain name
    const { chainType } = getChainTypeAndFamily(supportedChain)

    const routerExplorerUrl = getExplorerAddressUrl(explorer, chainType)(router.address)
    const nativeToken = getNativeCurrency(supportedChain)
    if (!nativeToken) throw Error(`Native token not found for ${supportedChain}`)

    allChains.push({
      name: title,
      logo,
      totalLanes: lanes[chain] ? Object.keys(lanes[chain]).length : 0,
      totalTokens: token.length,
      chain,
      key: chain,
      explorer,
      chainType,
      tokenAdminRegistry: chains[chain]?.tokenAdminRegistry?.address,
      registryModule: chains[chain]?.registryModule?.address,
      router,
      routerExplorerUrl,
      chainSelector: chains[chain].chainSelector,
      nativeToken: {
        name: nativeToken.name,
        symbol: nativeToken.symbol,
        logo: getTokenIconUrl(nativeToken.symbol),
      },
      feeTokens: chains[chain].feeTokens?.map((tokenName: string) => ({
        name: tokenName,
        logo: getTokenIconUrl(tokenName),
      })),
      armProxy: chains[chain].armProxy,
      feeQuoter: chainType === "solana" ? chains[chain]?.feeQuoter : undefined,
      rmnPermeable: chains[chain]?.rmnPermeable,
      mcms: chainType === "aptos" ? chains[chain]?.mcms?.address : undefined,
      poolPrograms: chainType === "solana" ? chains[chain]?.poolPrograms : undefined,
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
          throw new Error(`Invalid environment: ${filter}`)
      }

      const chainDetails = chainsReferenceData[chain]

      return {
        name: network.name,
        logo: network.logo,
        explorer: network.explorer,
        chainType: network.chainType,
        rmnPermeable: chainDetails?.rmnPermeable,
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
}: {
  chain: string
  environment: Environment
  version: Version
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
      chainType: ChainType
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
      chainType: ChainType
    }
    lane: LaneConfig
  }[] = []

  for (const sourceChain in lanes) {
    const sourceSupportedChain = directoryToSupportedChain(sourceChain)
    const sourceChainTitle = getTitle(sourceSupportedChain)
    const sourceChainLogo = getChainIcon(sourceSupportedChain)
    const { chainType: sourceChainType } = getChainTypeAndFamily(sourceSupportedChain)

    for (const destinationChain in lanes[sourceChain]) {
      const destinationSupportedChain = directoryToSupportedChain(destinationChain)
      const destinationChainTitle = getTitle(destinationSupportedChain)
      const destinationChainLogo = getChainIcon(destinationSupportedChain)
      const { chainType: destinationChainType } = getChainTypeAndFamily(destinationSupportedChain)
      const lane = lanes[sourceChain][destinationChain]
      const destinationExplorer = getExplorer(destinationSupportedChain)
      if (!destinationExplorer) throw Error(`Explorer not found for ${destinationSupportedChain}`)
      allLanes.push({
        sourceNetwork: {
          name: sourceChainTitle || "",
          logo: sourceChainLogo || "",
          key: sourceChain,
          chainType: sourceChainType,
        },
        destinationNetwork: {
          name: destinationChainTitle || "",
          logo: destinationChainLogo || "",
          key: destinationChain,
          explorer: destinationExplorer,
          chainType: destinationChainType,
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

export const loadDecommissionedData = ({ environment, version }: { environment: Environment; version: Version }) => {
  let decomReferenceData: DecomConfig

  if (environment === Environment.Mainnet && version === Version.V1_2_0) {
    decomReferenceData = decomMainnetv120 as unknown as DecomConfig
  } else if (environment === Environment.Testnet && version === Version.V1_2_0) {
    decomReferenceData = decomTestnetv120 as unknown as DecomConfig
  } else {
    throw new Error(`Invalid environment/version combination for decommissioned chains: ${environment}/${version}`)
  }

  return { decomReferenceData }
}

export const getAllDecommissionedNetworks = ({ filter }: { filter: Environment }): DecommissionedNetwork[] => {
  const { decomReferenceData } = loadDecommissionedData({
    environment: filter,
    version: Version.V1_2_0,
  })

  const decommissionedChains: DecommissionedNetwork[] = []

  for (const chain in decomReferenceData) {
    const supportedChain = directoryToSupportedChain(chain)
    const title = getTitle(supportedChain)
    if (!title) throw Error(`Title not found for decommissioned chain ${supportedChain}`)

    const logo = getChainIcon(supportedChain)
    if (!logo) throw Error(`Logo not found for decommissioned chain ${supportedChain}`)

    const explorer = getExplorer(supportedChain)
    if (!explorer) throw Error(`Explorer not found for decommissioned chain ${supportedChain}`)

    const { chainType } = getChainTypeAndFamily(supportedChain)

    decommissionedChains.push({
      name: title,
      chain,
      chainSelector: decomReferenceData[chain].chainSelector,
      logo,
      explorer,
      chainType,
    })
  }

  return decommissionedChains.sort((a, b) => a.name.localeCompare(b.name))
}

export const getDecommissionedNetwork = ({ chain, filter }: { chain: string; filter: Environment }) => {
  const decommissionedChains = getAllDecommissionedNetworks({ filter })
  return decommissionedChains.find((network) => network.chain === chain)
}
