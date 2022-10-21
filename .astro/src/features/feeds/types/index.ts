import { BigNumber } from "ethers"

export interface ROUND_DATA_RESPONSE {
  roundId: BigNumber
  answer: BigNumber
  startedAt: BigNumber
  updatedAt: BigNumber
  answeredInRound: BigNumber
}

export interface Addresses {
  title: string
  networkStatusURL: string
  networks: Network[]
}

export interface Network {
  name: string
  url: string
  networkType: NetworkType
  proxies: Proxy[]
}

enum NetworkType {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

interface Proxy {
  pair: string
  assetName: string
  deviationThreshold: number | null
  heartbeat: string
  decimals: number
  proxy: string
  feedCategory: FeedCategory
  feedType: ProxyFeedType
  shutdownDate?: string
}

enum FeedCategory {
  Custom = "custom",
  Deprecating = "deprecating",
  Empty = "",
  Monitored = "monitored",
  Specialized = "specialized",
  Verified = "verified",
}

enum ProxyFeedType {
  Commodities = "Commodities",
  Crypto = "Crypto",
  Empty = "-",
  Equities = "Equities",
  Forex = "Forex",
}
