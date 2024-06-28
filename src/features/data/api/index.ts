import { Chain } from "../chains"

interface Docs {
  assetName?: string
  feedCategory?: string
  feedType?: string
  hidden?: boolean
  porAuditor?: string
  porSource?: string
  porType?: string
  productSubType?: string
  productType?: string
  shutdownDate?: string
}
export interface ChainMetadata {
  compareOffchain: string
  contractAddress: string
  contractType: string
  contractVersion: number
  decimalPlaces: number | null
  ens: null | string
  feedId: null | string
  formatDecimalPlaces: number | null
  healthPrice: string
  heartbeat: number
  history: boolean
  multiply: string
  name: string
  pair: string[]
  path: string
  proxyAddress: null | string
  threshold: number
  valuePrefix: string
  assetName: string
  feedCategory: string
  feedType: string
  docs: Docs
  transmissionsAccount: null | string
}

export const getFeedsMetadata = (url: string): Promise<ChainMetadata[]> => {
  return fetch(url).then((res) => res.json())
}

export const getChainMetadata = async (chain: Chain): Promise<ChainMetadata | any> => {
  const requests = chain.networks.map((network) =>
    network?.rddUrl
      ? getFeedsMetadata(network?.rddUrl).then((metadata) => ({
          ...network,
          metadata: metadata.filter(
            (meta) => meta.docs?.hidden !== true && (meta.proxyAddress || meta.transmissionsAccount || meta.feedId)
          ),
        }))
      : undefined
  )
  const networks = await Promise.all(requests)

  return { ...chain, networks }
}
