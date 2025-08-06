import { supabase } from "./supabase.js"

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

export async function getFeedRiskData(proxyAddress?: string, network?: string) {
  try {
    if (!supabase) {
      console.warn("Supabase client not available")
      return null
    }

    let query = supabase.from("docs_feeds_risk").select("*")

    if (proxyAddress) {
      query = query.eq("proxy_address", proxyAddress)
    }

    if (network) {
      query = query.eq("network", network)
    }

    const { data, error } = await query

    if (error) {
      console.warn("Error fetching feed risk data:", error.message)
      return null
    }

    return data
  } catch (e) {
    console.error("Error fetching feed risk data:", e)
    return null
  }
}

export async function getFeedRiskTier(proxyAddress: string, network: string, fallbackCategory?: string) {
  try {
    if (!supabase) {
      console.warn("Supabase client not available, using fallback")
      return fallbackCategory || null
    }

    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("*")
      .eq("proxy_address", proxyAddress)
      .eq("network", network)
      .single()

    if (error) {
      console.warn("Error fetching feed risk tier:", error.message)
      return fallbackCategory || null
    }

    return data?.risk_status || fallbackCategory || null
  } catch (e) {
    console.error("Error fetching feed risk tier:", e)
    return fallbackCategory || null
  }
}

export async function getFeedCategories() {
  try {
    if (!supabase) {
      console.warn("Supabase client not available, using fallback categories")
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
      console.warn("Error fetching feed categories:", error.message)
      return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
        key: config.key,
        name: config.name,
      }))
    }

    const uniqueStatuses = Array.from(new Set(data.map((item) => item.risk_status).filter(Boolean))).filter(
      (status) => status.toLowerCase() !== "hidden"
    )

    const dynamicCategories = uniqueStatuses.map((status) => {
      const config = FEED_CATEGORY_CONFIG[status.toLowerCase()]
      return {
        key: status.toLowerCase(),
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
        allCategories.push(dynCat)
      }
    })

    return allCategories
  } catch (e) {
    console.error("Error fetching feed categories:", e)
    return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
      key: config.key,
      name: config.name,
    }))
  }
}

export async function getFeedRiskTierWithFallback(
  proxyAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<string | undefined> {
  try {
    if (typeof window === "undefined") {
      const riskTier = await getFeedRiskTier(proxyAddress, network, fallbackCategory)
      return riskTier || fallbackCategory
    } else {
      console.log("Client-side context: using fallback category instead of Supabase")
      return fallbackCategory
    }
  } catch (error) {
    console.warn("Failed to fetch risk tier from Supabase, using fallback:", error)
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
      success: !error || error.code === "PGRST116",
      data,
      error: error?.message,
    }
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}
