/**
 * @file detect-new-data.ts
 * @description Script to detect newly added feeds, smartData, or streams by comparing against a baseline.
 * This script fetches feed data from various blockchain networks and identifies new feeds that weren't
 * previously documented in the baseline file.
 *
 * Usage examples:
 *   npx tsx src/scripts/data/detect-new-data.ts
 */

import fs from "fs"
import path from "path"
import fetch from "node-fetch"

// Network endpoints mapping for different blockchain networks
// Each endpoint provides a JSON file containing feed definitions for that network
const NETWORK_ENDPOINTS: Record<string, string> = {
  ethereum: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
  "bnb-chain": "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
  polygon: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
  "gnosis-chain": "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
  avalanche: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
  fantom: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
  arbitrum: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
  optimism: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
  moonriver: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
  moonbeam: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
  metis: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
  base: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json",
  celo: "https://reference-data-directory.vercel.app/feeds-celo-mainnet.json",
  scroll: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-scroll-1.json",
  linea: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-linea-1.json",
  zksync: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-zksync-1.json",
  polygonzkevm: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-polygon-zkevm-1.json",
  soneium: "https://reference-data-directory.vercel.app/feeds-soneium-mainnet.json",
  starknet: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-starknet-1.json",
  solana: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
  hedera: "https://reference-data-directory.vercel.app/feeds-hedera-mainnet.json",
  aptos: "https://docs.chain.link/files/json/feeds-aptos-mainnet.json",
  sonic: "https://reference-data-directory.vercel.app/feeds-sonic-mainnet.json",
  mantle: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-mantle-1.json",
  xlayer: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-xlayer-1.json",
  ronin: "https://reference-data-directory.vercel.app/feeds-ronin-mainnet.json",
  tron: "https://docs.chain.link/files/json/feeds-tron-mainnet.json",
}

// Path to the baseline JSON file that contains known feed IDs
// This file serves as our reference point for what feeds already exist
const BASELINE_PATH = ".github/scripts/data/baseline.json"

// Output file path where newly discovered feeds will be written
const OUTPUT_PATH = "temp/NEW_DATA_FOUND.json"

/**
 * Interface defining the structure of a feed/stream/smartData item
 * This represents the standardized format we use internally for all data types
 */
interface DataItem {
  feedID: string
  hidden?: boolean
  productTypeCode?: string
  deliveryChannelCode?: string
  network: string
  assetName?: string
  baseAsset?: string
  quoteAsset?: string
}

/**
 * Builds the URL for an asset's icon based on its base asset name
 * @param baseAsset - The base asset symbol (e.g., "BTC", "ETH")
 * @returns URL to the asset's icon image
 */
function buildIconUrl(baseAsset: string): string {
  return `https://d2f70xi62kby8n.cloudfront.net/tokens/${baseAsset.toLowerCase()}.webp`
}

/**
 * Constructs the appropriate URL for a feed based on its type and network
 * @param item - The data item containing feed information
 * @returns URL to the feed's data page
 */
function buildFeedUrl(item: DataItem): string {
  if (item.deliveryChannelCode === "DS") {
    const base = (item.baseAsset || "BASE").toLowerCase()
    const quote = (item.quoteAsset || "QUOTE").toLowerCase()
    return `https://data.chain.link/streams/${base}-${quote}`
  }
  // otherwise, it's "https://data.chain.link/feeds/<network>/mainnet/<suffix>"
  const feedSuffix = item.feedID.split("-").slice(1).join("-")
  const safeSuffix = feedSuffix.replace(/\s/g, "%20")
  return `https://data.chain.link/feeds/${item.network}/mainnet/${safeSuffix}`
}

/**
 * Main function to detect new data feeds across all configured networks
 * This function:
 * 1. Loads the baseline of known feeds
 * 2. Fetches current feed data from all networks
 * 3. Identifies new feeds not in the baseline
 * 4. Generates a report of new feeds
 */
async function detectNewData(): Promise<void> {
  try {
    // 1) Read baseline
    const baseline = loadBaseline(BASELINE_PATH)
    const knownIds = new Set(baseline.knownIds)

    // 2) Fetch and parse each network's JSON
    const allItems: DataItem[] = []
    for (const [networkSlug, url] of Object.entries(NETWORK_ENDPOINTS)) {
      const rawJson = await fetchNetworkJson(url)
      // rawJson is presumably an array of feed definitions
      // Convert them into our DataItem structure
      for (const obj of rawJson) {
        const item = convertToDataItem(obj, networkSlug)
        if (item && !item.hidden) {
          allItems.push(item)
        }
      }
    }

    // 3) Identify newly added items (not in baseline)
    const newlyFound: DataItem[] = []
    for (const item of allItems) {
      if (!knownIds.has(item.feedID)) {
        newlyFound.push(item)
      }
    }

    if (newlyFound.length === 0) {
      // No new items, clean up any leftover file and exit
      if (fs.existsSync(OUTPUT_PATH)) {
        fs.unlinkSync(OUTPUT_PATH)
      }
      console.log("No new data items found.")
      process.exit(0)
    }

    // 4) Build the object describing newly found items
    const output = {
      newDataFound: true,
      timestamp: new Date().toISOString(),
      newlyFoundItems: newlyFound.map((item) => {
        const iconUrl = buildIconUrl(item.baseAsset || "")
        const feedUrl = buildFeedUrl(item)
        return {
          feedID: item.feedID,
          network: item.network,
          productTypeCode: item.productTypeCode,
          deliveryChannelCode: item.deliveryChannelCode,
          assetName: item.assetName,
          baseAsset: item.baseAsset,
          quoteAsset: item.quoteAsset,
          iconUrl,
          url: feedUrl,
        }
      }),
    }

    // 5) Write to temp/NEW_DATA_FOUND.json
    ensureDirectoryExists(path.dirname(OUTPUT_PATH))
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8")

    console.log(`Found ${newlyFound.length} new items. Results written to ${OUTPUT_PATH}.`)
    process.exit(0)
  } catch (err) {
    console.error("Error detecting new data:", err)
    process.exit(1)
  }
}

/**
 * Loads the baseline JSON file containing known feed IDs
 * If the file doesn't exist or is empty, returns an empty baseline
 * @param filePath - Path to the baseline JSON file
 * @returns Object containing timestamp and array of known feed IDs
 */
function loadBaseline(filePath: string): { timestamp: string; knownIds: string[] } {
  if (!fs.existsSync(filePath)) {
    return { timestamp: "", knownIds: [] }
  }
  const text = fs.readFileSync(filePath, "utf8")

  // If file is present but empty
  if (!text.trim()) {
    return { timestamp: "", knownIds: [] }
  }

  return JSON.parse(text)
}

/**
 * Fetches and parses JSON data from a network endpoint
 * @param url - The URL to fetch the feed data from
 * @returns Parsed JSON array of feed definitions
 * @throws Error if the fetch request fails
 */
async function fetchNetworkJson(url: string): Promise<any[]> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return (await res.json()) as any[]
}

/**
 * Converts a raw feed object from the network JSON into our standardized DataItem format
 * This function implements validation rules:
 * 1. Must have a path
 * 2. Must have an assetName
 * 3. Must have a baseAsset
 * 4. For non-SmartData feeds, must have a quoteAsset
 *
 * @param obj - Raw feed object from network JSON
 * @param network - Network identifier (e.g., "ethereum", "bnb-chain")
 * @returns Standardized DataItem or null if validation fails
 */
function convertToDataItem(obj: any, network: string): DataItem | null {
  // 1) Must have a `path`
  if (!obj?.path) {
    return null
  }

  // 2) Must have a top-level assetName
  const topLevelAssetName = obj.assetName

  // 3) Must have baseAsset in docs for all products
  const baseAsset = obj.docs?.baseAsset

  // 4) Check hidden
  const hidden = obj.docs?.hidden === true

  // 5) We'll get productTypeCode and deliveryChannel
  const productTypeCode = obj.docs?.productTypeCode || ""
  const deliveryChannel = obj.docs?.deliveryChannelCode || ""

  // 6) If missing assetName or baseAsset, skip
  if (!topLevelAssetName || !baseAsset) {
    return null
  }

  if (hidden) {
    return null
  }

  // 7) Now handle quoteAsset logic:
  //    For streams or normal feeds, we require quoteAsset
  //    For SmartData feeds (PoR, NAV, AUM), we do NOT require it
  const codeUpper = productTypeCode.toUpperCase().trim()
  const quoteAsset = obj.docs?.quoteAsset || ""

  // If it's not one of the SmartData codes, we require a quoteAsset
  // (i.e. data-feeds or data-streams)
  if (!["POR", "NAV", "AUM"].includes(codeUpper)) {
    // If quoteAsset is missing, skip
    if (!quoteAsset) {
      return null
    }
  }

  // 8) Build and return the item
  return {
    feedID: `${network}-${obj.path}`, // combine for uniqueness across networks
    hidden: false,
    productTypeCode,
    deliveryChannelCode: deliveryChannel,
    network,
    assetName: topLevelAssetName,
    baseAsset,
    quoteAsset,
  }
}

/**
 * Ensures a directory exists by creating it recursively if necessary
 * @param dirPath - Path to the directory that should exist
 */
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Execute the main function and handle any errors
detectNewData().catch((err) => {
  console.error(err)
  process.exit(1)
})
