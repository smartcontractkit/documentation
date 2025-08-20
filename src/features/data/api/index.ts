import { Chain } from "../chains.ts"

// Interface for decoding variables in MVR feeds
export interface DecodingVariable {
  name: string
  type: string
  decimals: number
}

export interface Docs {
  assetName?: string
  feedCategory?: string
  feedType?: string
  hidden?: boolean
  porAuditor?: string
  porSource?: string
  porType?: string
  porSourceType?: string
  productSubType?: string
  productType?: string
  shutdownDate?: string
  isMVR?: boolean
  decoding?: DecodingVariable[]
  issuer?: string
  deliveryChannelCode?: string
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
  secondaryProxyAddress?: string
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

// Interface for MVR feed data
export interface MVRFeedData {
  status: string
  feedId: string
  name: string
  docs: {
    assetClass: string
    assetSubClass?: string
    assetName: string
    decoding: DecodingVariable[]
    feedCategory?: string
    feedType?: string
    issuer?: string
    porAuditor?: string
    porAuditorType?: string
    porSource?: string
    porSourceType?: string
    porType?: string
    productSubType?: string
    productType?: string
    productTypeCode?: string
    reserveAsset?: string
    [key: string]: any
  }
  threshold: number
  heartbeat: number
  environment: string
  path: string
  supportedChains: string[]
  valuePrefix?: string
  valueSuffix?: string
  [key: string]: any
}

export interface BundleProxyData {
  contractAddress: string
  aggregator: string
  name: string
  status: string
  typeAndVersion: string
  feedId: string
}

// Function to fetch MVR feeds from por-data-feeds.json
export const getMVRFeedsMetadata = async (url: string): Promise<MVRFeedData[]> => {
  try {
    // Use window.location.origin to ensure we're using the correct base URL
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`

    const response = await fetch(fullUrl)

    if (!response.ok) {
      console.error(`Failed to fetch MVR feeds: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch MVR feeds: ${response.statusText}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("MVR feeds data is not an array:", data)
      throw new Error("MVR feeds data is not an array")
    }

    // Validate each feed has the required fields
    data.forEach((feed, index) => {
      if (!feed.name || !feed.feedId || !feed.docs || !feed.supportedChains) {
        console.warn(`MVR feed at index ${index} is missing required fields:`, feed)
      }
    })

    return data
  } catch (error) {
    console.error("Error fetching MVR feeds:", error)
    throw error
  }
}

export const getBundleProxyData = async (url: string): Promise<BundleProxyData[]> => {
  try {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`

    const response = await fetch(fullUrl)

    if (!response.ok) {
      console.error(`Failed to fetch bundle proxies: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch bundle proxies: ${response.statusText}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("Bundle proxy data is not an array:", data)
      throw new Error("Bundle proxy data is not an array")
    }

    // Validate each bundle proxy has the required fields
    data.forEach((proxy, index) => {
      if (!proxy.contractAddress || !proxy.feedId || !proxy.name) {
        console.warn(`Bundle proxy at index ${index} is missing required fields:`, proxy)
      }
    })

    return data
  } catch (error) {
    console.error("Error fetching bundle proxy data:", error)
    throw error
  }
}

// Function to merge MVR feeds with regular feeds
export const mergeWithMVRFeeds = async (
  chainMetadata: { [key: string]: any },
  mvrFeedsUrl: string | null
): Promise<{ [key: string]: any }> => {
  try {
    // Debug function to check if MVR feeds are in the metadata
    const checkForMVRFeeds = (metadata: any) => {
      let totalMVRFeeds = 0

      Object.keys(metadata).forEach((chainKey) => {
        const chain = metadata[chainKey]
        if (chain.networks) {
          chain.networks.forEach((network) => {
            if (network.metadata) {
              const mvrFeeds = network.metadata.filter((meta) => meta.docs?.isMVR === true)
              if (mvrFeeds.length > 0) {
                totalMVRFeeds += mvrFeeds.length
              }
            }
          })
        }
      })
      return totalMVRFeeds
    }

    // Check if there are any MVR feeds in the initial metadata
    const initialMVRCount = checkForMVRFeeds(chainMetadata)

    // Fetch MVR feeds
    if (!mvrFeedsUrl) {
      console.warn("No MVR feeds URL provided")
      return chainMetadata
    }
    const mvrFeeds = await getMVRFeedsMetadata(mvrFeedsUrl)

    // Create a deep copy of the chainMetadata
    const mergedMetadata = JSON.parse(JSON.stringify(chainMetadata))

    // If no MVR feeds were added, try to add them directly
    if (initialMVRCount === 0 && mvrFeeds.length > 0) {
      // Network mapping for chain identifiers (as defined in features/data/chains.ts)
      const networkMappings = {
        mainnet: ["ethereum-mainnet"],
        "matic-mainnet": ["polygon-mainnet"],
        "polygon-mainnet": ["polygon-mainnet"],
        "polygon-testnet-amoy": ["polygon-amoy"],
        "arbitrum-sepolia": ["arbitrum-sepolia"],
        "ethereum-testnet-sepolia-arbitrum-1": ["arbitrum-sepolia"],
        "ethereum-testnet-sepolia": ["ethereum-sepolia"],
        "avalanche-mainnet": ["avalanche-mainnet"],
      }

      // Process each chain in the metadata
      for (const chain of Object.values(mergedMetadata)) {
        if ((chain as any)?.networks) {
          for (const network of (chain as any).networks) {
            if (!network.metadata) {
              network.metadata = []
            }

            // Fetch bundle proxy data if available for this network
            const bundleProxyLookup: { [feedId: string]: string } = {}
            if (network.rddBundleUrl) {
              try {
                const bundleProxies = await getBundleProxyData(network.rddBundleUrl)
                // Create lookup map: feedId -> contractAddress
                bundleProxies.forEach((proxy) => {
                  bundleProxyLookup[proxy.feedId] = proxy.contractAddress
                })
              } catch (error) {
                // Silently handle bundle proxy fetch errors
              }
            }

            // Add MVR feeds that support this network
            mvrFeeds
              .filter((feed) => !feed.docs.hidden)
              .forEach((feed) => {
                // Check if this feed supports this network
                const isSupported = feed.supportedChains.some((supportedChain) => {
                  const mappedNetworks = networkMappings[supportedChain] || [supportedChain]
                  return mappedNetworks.includes(network.queryString)
                })

                if (isSupported) {
                  // Get network-specific contract address from bundle proxy lookup
                  const contractAddress = bundleProxyLookup[feed.feedId] || feed.feedId || ""

                  const mvrChainMetadata: ChainMetadata = {
                    compareOffchain: "",
                    contractAddress,
                    contractType: "aggregator",
                    contractVersion: 1,
                    decimalPlaces: null,
                    ens: null,
                    feedId: feed.feedId || null,
                    formatDecimalPlaces: null,
                    healthPrice: "",
                    heartbeat: feed.heartbeat || 86400,
                    history: false,
                    multiply: "1",
                    name: feed.name,
                    pair: [feed.docs.assetName],
                    path: feed.path || "",
                    proxyAddress: contractAddress,
                    secondaryProxyAddress: contractAddress || undefined,
                    threshold: feed.threshold || 0,
                    valuePrefix: feed.valuePrefix || "",
                    assetName: feed.docs.assetName,
                    feedCategory: feed.docs.feedCategory || "Custom",
                    feedType: feed.docs.feedType || feed.docs.assetClass,
                    docs: {
                      assetName: feed.docs.assetName,
                      feedCategory: feed.docs.feedCategory || "Custom",
                      feedType: feed.docs.feedType || feed.docs.assetClass,
                      productType: feed.docs.productType || "Proof of Reserve",
                      porType: feed.docs.porType,
                      porAuditor: feed.docs.porAuditor,
                      porSource: feed.docs.porSource,
                      porSourceType: feed.docs.porSourceType,
                      issuer: feed.docs.issuer,
                      decoding: feed.docs.decoding,
                      isMVR: true,
                      hidden: feed.docs.hidden,
                    },
                    transmissionsAccount: null,
                  }

                  network.metadata.push(mvrChainMetadata)
                }
              })
          }
        }
      }
    }

    return mergedMetadata
  } catch (error) {
    console.error("Error merging MVR feeds:", error)
    return chainMetadata
  }
}
