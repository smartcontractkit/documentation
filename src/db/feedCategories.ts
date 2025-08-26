import { supabase } from "./supabase.js"

// Type for the docs_feeds_risk table
type FeedRiskData = {
  proxy_address: string
  network: string
  risk_status: string
}

// Centralized category configuration
export const FEED_CATEGORY_CONFIG = {
  low: {
    key: "low",
    name: "Low Market Risk",
    icon: "🟢",
    title: "Low Market Risk - Feeds that deliver a market price for liquid assets with robust market structure.",
    link: "/data-feeds/selecting-data-feeds#-low-market-risk-feeds",
  },
  medium: {
    key: "medium",
    name: "Medium Market Risk",
    icon: "🟡",
    title:
      "Medium Market Risk - Feeds that deliver a market price for assets that show signs of liquidity-related risk or other market structure-related risk.",
    link: "/data-feeds/selecting-data-feeds#-medium-market-risk-feeds",
  },
  high: {
    key: "high",
    name: "High Market Risk",
    icon: "🔴",
    title:
      "High Market Risk - Feeds that deliver a heightened degree of some of the risk factors associated with Medium Market Risk Feeds, or a separate risk that makes the market price subject to uncertainty or volatile. In using a high market risk data feed you acknowledge that you understand the risks associated with such a feed and that you are solely responsible for monitoring and mitigating such risks.",
    link: "/data-feeds/selecting-data-feeds#-high-market-risk-feeds",
  },
  new: {
    key: "new",
    name: "New Token",
    icon: "🟠",
    title:
      "New Token - Tokens without the historical data required to implement a risk assessment framework may be launched in this category. Users must understand the additional market and volatility risks inherent with such assets. Users of New Token Feeds are responsible for independently verifying the liquidity and stability of the assets priced by feeds that they use.",
    link: "/data-feeds/selecting-data-feeds#-new-token-feeds",
  },
  custom: {
    key: "custom",
    name: "Custom",
    icon: "🔵",
    title:
      "Custom - Feeds built to serve a specific use case or rely on external contracts or data sources. These might not be suitable for general use or your use case's risk parameters. Users must evaluate the properties of a feed to make sure it aligns with their intended use case.",
    link: "/data-feeds/selecting-data-feeds#-custom-feeds",
  },
  deprecating: {
    key: "deprecating",
    name: "Deprecating",
    icon: "⭕",
    title:
      "Deprecating - These feeds are scheduled for deprecation. See the [Deprecation](/data-feeds/deprecating-feeds) page to learn more.",
    link: "/data-feeds/deprecating-feeds",
  },
} as const

export const getDefaultCategories = () => Object.values(FEED_CATEGORY_CONFIG)

export async function getFeedRiskData(network?: string): Promise<FeedRiskData[]> {
  if (!supabase) return []

  try {
    let query = supabase.from("docs_feeds_risk").select("*")
    if (network) query = query.eq("network", network)

    const { data, error } = await query.limit(1000)
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function getFeedRiskTier(
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<string | null> {
  try {
    if (!supabase) return fallbackCategory || null

    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("risk_status")
      .eq("proxy_address", contractAddress)
      .eq("network", network)
      .limit(1)

    if (error) return fallbackCategory || null
    if (!data || data.length === 0) return fallbackCategory || null

    return data[0]?.risk_status || fallbackCategory || null
  } catch {
    return fallbackCategory || null
  }
}

export async function getFeedCategories() {
  try {
    if (!supabase) {
      return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
        key: config.key,
        name: config.name,
      }))
    }

    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("risk_status")
      .not("risk_status", "is", null)
      .neq("risk_status", "hidden")

    if (error) {
      return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
        key: config.key,
        name: config.name,
      }))
    }

    const uniqueStatuses = Array.from(new Set(data.map((item) => item.risk_status).filter(Boolean))).filter(
      (status: string) => status.toLowerCase() !== "hidden"
    )

    const dynamicCategories = uniqueStatuses.map((status: string) => {
      const config = FEED_CATEGORY_CONFIG[status.toLowerCase() as keyof typeof FEED_CATEGORY_CONFIG]
      return {
        key: status.toLowerCase() as keyof typeof FEED_CATEGORY_CONFIG,
        name: config?.name || status,
      }
    })

    const defaultCategories = Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
      key: config.key,
      name: config.name,
    }))

    const allCategories = [...defaultCategories]
    dynamicCategories.forEach((dynCat) => {
      if (!allCategories.find((cat) => cat.key === dynCat.key)) {
        allCategories.push(dynCat as (typeof allCategories)[0])
      }
    })

    return allCategories
  } catch {
    return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
      key: config.key,
      name: config.name,
    }))
  }
}

// Minimal batch result type
export type FeedTierResult = { final: string | null }

/**
 * Batched lookup that returns the final category per (address, network) wrapped in { final }.
 * Map key format: `${contractAddress}-${network}`
 */
export async function getFeedRiskTiersBatch(
  feedRequests: Array<{
    contractAddress: string
    network: string
    fallbackCategory?: string
  }>
): Promise<Map<string, FeedTierResult>> {
  const resultMap = new Map<string, FeedTierResult>()

  if (!supabase) {
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      resultMap.set(`${contractAddress}-${network}`, { final: fallbackCategory ?? null })
    })
    return resultMap
  }

  const uniqueNetworks = Array.from(new Set(feedRequests.map((r) => r.network)))
  const uniqueAddresses = Array.from(new Set(feedRequests.map((r) => r.contractAddress)))

  try {
    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("proxy_address, network, risk_status")
      .in("proxy_address", uniqueAddresses)
      .in("network", uniqueNetworks)
      .limit(1000)

    if (error) {
      feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
        resultMap.set(`${contractAddress}-${network}`, { final: fallbackCategory ?? null })
      })
      return resultMap
    }

    const supabaseData = new Map<string, string | null>()
    data?.forEach((row: any) => {
      supabaseData.set(`${row.proxy_address}-${row.network}`, row.risk_status ?? null)
    })

    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      const key = `${contractAddress}-${network}`
      const supaTier = supabaseData.get(key)
      resultMap.set(key, { final: supaTier ?? fallbackCategory ?? null })
    })

    return resultMap
  } catch {
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      resultMap.set(`${contractAddress}-${network}`, { final: fallbackCategory ?? null })
    })
    return resultMap
  }
}

/**
 * Server-safe helper: uses Supabase on the server; uses fallback on the client.
 */
export async function getFeedRiskTierWithFallback(
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<string | undefined> {
  try {
    if (typeof window === "undefined") {
      const riskTier = await getFeedRiskTier(contractAddress, network, fallbackCategory)
      return riskTier ?? fallbackCategory
    } else {
      return fallbackCategory
    }
  } catch {
    return fallbackCategory
  }
}

export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return {
        success: false,
        data: null,
        error: "Supabase client not available",
      }
    }

    const { data, error } = await supabase.from("docs_feeds_risk").select("*").limit(1)

    return {
      success: !error || (error as any)?.code === "PGRST116",
      data,
      error: (error as any)?.message,
    }
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}
