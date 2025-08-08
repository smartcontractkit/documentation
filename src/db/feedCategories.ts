import { supabase } from "./supabase.js"

// Development debug function
function isDevelopmentDebug(): boolean {
  return (
    typeof window !== "undefined" && (window as unknown as { CHAINLINK_DEV_MODE?: boolean }).CHAINLINK_DEV_MODE === true
  )
}

// Development flag getter
function getDevTestFlag(): boolean {
  return (
    typeof window !== "undefined" && (window as unknown as { CHAINLINK_DEV_MODE?: boolean }).CHAINLINK_DEV_MODE === true
  )
}

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
  if (!supabase) {
    console.warn("getFeedRiskData: Supabase client not available")
    return []
  }

  try {
    let query = supabase.from("docs_feeds_risk").select("*")

    if (network) {
      query = query.eq("network", network)

      if (isDevelopmentDebug()) {
        console.log(`[DEBUG] getFeedRiskData: Using network: "${network}"`)
      }
    }

    const { data, error } = await query.limit(1000) // Use reasonable limit instead of .single()

    if (error) {
      console.error("Supabase query error:", error)
      return []
    }

    if (isDevelopmentDebug()) {
      console.log(`[DEBUG] getFeedRiskData: Loaded ${data?.length || 0} records for network ${network}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeedRiskData:", error)
    return []
  }
}

export async function getFeedRiskTier(contractAddress: string, network: string, fallbackCategory?: string) {
  try {
    // Always fetch from Supabase if available, even in non-dev mode
    if (!supabase) {
      console.warn("Supabase client not available, using fallback")
      return fallbackCategory || null
    }

    // Map the network identifier to match the database schema
    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("*")
      .eq("proxy_address", contractAddress)
      .eq("network", network)
      .limit(1)

    if (error) {
      console.warn("Error fetching feed risk tier:", error.message)
      return fallbackCategory || null
    }

    // Handle empty results - no matching records found
    if (!data || data.length === 0) {
      const devMode = getDevTestFlag()
      if (devMode) {
        console.log("🔬 DEV MODE: No Supabase data found for:", {
          contractAddress,
          network,
          fallback: fallbackCategory,
        })
      }
      return fallbackCategory || null
    }

    const supabaseRiskTier = data[0]?.risk_status || null
    const finalCategory = supabaseRiskTier || fallbackCategory || null

    // Enhanced logging when dev mode is enabled
    const devMode = getDevTestFlag()
    if (devMode && (supabaseRiskTier || fallbackCategory)) {
      console.log("🔬 DEV MODE: Feed category comparison:", {
        contractAddress,
        network,
        original: fallbackCategory,
        supabase: supabaseRiskTier,
        final: finalCategory,
        changed: supabaseRiskTier && supabaseRiskTier !== fallbackCategory,
      })
    }

    return finalCategory
  } catch (error) {
    console.error("Error in getFeedRiskTier:", error)
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
  } catch (e) {
    console.error("Error fetching feed categories:", e)
    return Object.values(FEED_CATEGORY_CONFIG).map((config) => ({
      key: config.key,
      name: config.name,
    }))
  }
}

// Enhanced function for dev mode that returns comparison data
export async function getFeedRiskTierWithComparison(
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<{
  final: string | null
  original: string | null
  supabase: string | null
  changed: boolean
  devMode: boolean
}> {
  const devMode = getDevTestFlag()
  const original = fallbackCategory || null

  // COMPREHENSIVE DEBUG LOGGING FOR ALL CALLS
  if (devMode) {
    console.group(`🔍 getFeedRiskTierWithComparison DEBUG - ${contractAddress}`)
    console.log("📥 Input Parameters:", {
      contractAddress,
      network,
      fallbackCategory,
    })
    console.log("🏁 Original Value:", original)
    console.log("🎯 Dev Mode Active:", devMode)
    console.log("🔍 Network identifier analysis:", {
      network,
      networkType: typeof network,
      networkLength: network?.length,
    })
  }

  try {
    if (!supabase) {
      const result = {
        final: original,
        original,
        supabase: null,
        changed: false,
        devMode,
      }
      if (devMode) {
        console.log("❌ No Supabase client, returning:", result)
        console.groupEnd()
      }
      return result
    }

    if (devMode) {
      console.log("🔍 Querying Supabase with:", {
        contractAddress,
        network,
      })
    }

    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("*")
      .eq("proxy_address", contractAddress)
      .eq("network", network)
      .limit(1)

    if (devMode) {
      console.log("📡 Supabase Query Result:", { data, error })
    }

    if (error) {
      const result = {
        final: original,
        original,
        supabase: null,
        changed: false,
        devMode,
      }
      if (devMode) {
        console.log("❌ Supabase error, returning:", result)
        console.groupEnd()
      }
      return result
    }

    // Handle empty results - no matching records found
    if (!data || data.length === 0) {
      const result = {
        final: original,
        original,
        supabase: null,
        changed: false,
        devMode,
      }
      if (devMode) {
        console.log("📝 No Supabase data found, returning:", result)
        console.groupEnd()
      }
      return result
    }

    const supabaseRiskTier = data[0]?.risk_status || null
    const final = supabaseRiskTier || original
    const changed = supabaseRiskTier !== null && supabaseRiskTier !== original

    const result = {
      final,
      original,
      supabase: supabaseRiskTier,
      changed,
      devMode,
    }

    if (devMode) {
      console.log("🎯 Final Comparison Result:", result)
      console.log("🔄 Change Detection:", {
        supabaseRiskTier,
        original,
        isNotNull: supabaseRiskTier !== null,
        isDifferent: supabaseRiskTier !== original,
        changed,
      })
      console.groupEnd()
    }

    return result
  } catch (error) {
    console.error("Error in getFeedRiskTierWithComparison:", error)
    const result = {
      final: original,
      original,
      supabase: null,
      changed: false,
      devMode,
    }
    if (devMode) {
      console.log("❌ Exception occurred, returning:", result)
      console.groupEnd()
    }
    return result
  }
}

// Batched version for improved performance
export async function getFeedRiskTiersBatch(
  feedRequests: Array<{
    contractAddress: string
    network: string
    fallbackCategory?: string
  }>
): Promise<
  Map<
    string,
    {
      final: string | null
      original: string | null
      supabase: string | null
      changed: boolean
      devMode: boolean
    }
  >
> {
  const devMode = getDevTestFlag()
  const resultMap = new Map<
    string,
    {
      final: string | null
      original: string | null
      supabase: string | null
      changed: boolean
      devMode: boolean
    }
  >()

  // If no Supabase client, return fallback values for all requests
  if (!supabase) {
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      const key = `${contractAddress}-${network}`
      resultMap.set(key, {
        final: fallbackCategory || null,
        original: fallbackCategory || null,
        supabase: null,
        changed: false,
        devMode,
      })
    })
    return resultMap
  }

  // Get unique networks and contract addresses
  const uniqueNetworks = Array.from(new Set(feedRequests.map((req) => req.network)))
  const uniqueAddresses = Array.from(new Set(feedRequests.map((req) => req.contractAddress)))

  if (devMode) {
    console.group(`🚀 BATCH getFeedRiskTiersBatch - ${feedRequests.length} requests`)
    console.log("📊 Batch Stats:", {
      totalRequests: feedRequests.length,
      uniqueNetworks: uniqueNetworks.length,
      uniqueAddresses: uniqueAddresses.length,
      networks: uniqueNetworks,
    })
  }

  try {
    // Single query for all addresses and networks
    const { data, error } = await supabase
      .from("docs_feeds_risk")
      .select("*")
      .in("proxy_address", uniqueAddresses)
      .in("network", uniqueNetworks)
      .limit(1000) // Reasonable limit for batch operations

    if (error) {
      console.error("Batch Supabase query error:", error)
      // Return fallback values for all requests
      feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
        const key = `${contractAddress}-${network}`
        resultMap.set(key, {
          final: fallbackCategory || null,
          original: fallbackCategory || null,
          supabase: null,
          changed: false,
          devMode,
        })
      })
      return resultMap
    }

    // Create a lookup map from the batch results
    const supabaseData = new Map<string, string>()
    data?.forEach((row) => {
      const key = `${row.proxy_address}-${row.network}`
      supabaseData.set(key, row.risk_status)
    })

    if (devMode) {
      console.log("📡 Batch Query Results:", {
        supabaseRecords: data?.length || 0,
        lookupEntries: supabaseData.size,
      })
    }

    // Process each request using the batch data
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      const key = `${contractAddress}-${network}`
      const original = fallbackCategory || null
      const supabaseRiskTier = supabaseData.get(key) || null
      const final = supabaseRiskTier || original
      const changed = supabaseRiskTier !== null && supabaseRiskTier !== original

      resultMap.set(key, {
        final,
        original,
        supabase: supabaseRiskTier,
        changed,
        devMode,
      })

      // Log individual changes in dev mode
      if (devMode && changed) {
        console.log(`🔄 ${contractAddress}: ${original} → ${supabaseRiskTier}`)
      }
    })

    if (devMode) {
      const changedCount = Array.from(resultMap.values()).filter((result) => result.changed).length
      console.log("🎯 Batch Processing Complete:", {
        totalProcessed: resultMap.size,
        changedFeeds: changedCount,
        unchangedFeeds: resultMap.size - changedCount,
      })
      console.groupEnd()
    }
  } catch (error) {
    console.error("Error in getFeedRiskTiersBatch:", error)
    // Return fallback values for all requests on error
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      const key = `${contractAddress}-${network}`
      resultMap.set(key, {
        final: fallbackCategory || null,
        original: fallbackCategory || null,
        supabase: null,
        changed: false,
        devMode,
      })
    })
    if (devMode) {
      console.groupEnd()
    }
  }

  return resultMap
}

export async function getFeedRiskTierWithFallback(
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<string | undefined> {
  try {
    if (typeof window === "undefined") {
      const riskTier = await getFeedRiskTier(contractAddress, network, fallbackCategory)
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
