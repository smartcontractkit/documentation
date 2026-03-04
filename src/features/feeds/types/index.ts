import { BigNumberish } from "ethers"

export interface ROUND_DATA_RESPONSE {
  roundId: BigNumberish
  answer: BigNumberish
  startedAt: BigNumberish
  updatedAt: BigNumberish
  answeredInRound: BigNumberish
}

enum NetworkType {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

enum FeedCategory {
  Low = "low",
  Medium = "medium",
  High = "high",
  Custom = "custom",
  New = "new",
  Deprecating = "deprecating",
  Empty = "",
}

enum ProxyFeedType {
  Commodities = "Commodities",
  Crypto = "Crypto",
  Empty = "-",
  Equities = "Equities",
  Forex = "Forex",
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

export interface Network {
  name: string
  url: string
  networkType: NetworkType
  proxies: Proxy[]
}

export interface Addresses {
  title: string
  networkStatusURL: string
  networks: Network[]
}
