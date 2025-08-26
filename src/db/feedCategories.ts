import { supabase } from "./supabase.js"

/* ===========================
   Types
   =========================== */

type FeedRiskRow = {
  proxy_address: string
  network: string
  risk_status: string | null
}

type FeedRiskData = {
  proxy_address: string
  network: string
  risk_status: string
}

export type FeedTierResult = { final: string | null }

/* ===========================
   Category Config
   =========================== */

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

export type CategoryKey = keyof typeof FEED_CATEGORY_CONFIG

/* ===========================
   Small helpers
   =========================== */

const TABLE = "docs_feeds_risk"

const normalizeKey = (v?: string | null): CategoryKey | undefined => {
  if (!v) return undefined
  const key = v.toLowerCase() as CategoryKey
  return key in FEED_CATEGORY_CONFIG ? key : undefined
}

const chooseTier = (dbTier: string | null | undefined, fallback?: string): string | null => dbTier ?? fallback ?? null

const defaultCategoryList = () => Object.values(FEED_CATEGORY_CONFIG).map(({ key, name }) => ({ key, name }))

/** Optional convenience for consumers */
export function getCategoryMeta(category?: string | null) {
  const key = normalizeKey(category)
  return key ? FEED_CATEGORY_CONFIG[key] : undefined
}

/* ===========================
   Public API
   =========================== */

export const getDefaultCategories = defaultCategoryList

/** Fetch rows (optionally filtered by network). Returns [] on any error. */
export async function getFeedRiskData(network?: string): Promise<FeedRiskData[]> {
  if (!supabase) return []

  try {
    let query = supabase.from(TABLE).select("*")
    if (network) query = query.eq("network", network)

    const { data, error } = await query.limit(1000)
    if (error || !data) return []

    // Narrow to non-null risk_status to match FeedRiskData type
    return (data as FeedRiskRow[]).filter((r): r is FeedRiskData => !!r.risk_status)
  } catch {
    return []
  }
}

/** Single lookup with fallback-first behavior. */
export async function getFeedRiskTier(
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): Promise<string | null> {
  try {
    if (!supabase) return chooseTier(null, fallbackCategory)

    const { data, error } = await supabase
      .from(TABLE)
      .select("risk_status")
      .eq("proxy_address", contractAddress)
      .eq("network", network)
      .limit(1)

    if (error || !data?.length) return chooseTier(null, fallbackCategory)
    return chooseTier(data[0]?.risk_status, fallbackCategory)
  } catch {
    return chooseTier(null, fallbackCategory)
  }
}

/** Merge static categories with those dynamically present in the table. */
export async function getFeedCategories() {
  try {
    if (!supabase) return defaultCategoryList()

    const { data, error } = await supabase
      .from(TABLE)
      .select("risk_status")
      .not("risk_status", "is", null)
      .neq("risk_status", "hidden")

    if (error || !data) return defaultCategoryList()

    const dynamic = Array.from(
      new Set(data.map((d) => normalizeKey(d.risk_status)).filter(Boolean) as CategoryKey[])
    ).map((key) => ({ key, name: FEED_CATEGORY_CONFIG[key].name }))

    // Dedup by key while keeping all defaults first
    const byKey = new Map<string, { key: string; name: string }>()
    defaultCategoryList().forEach((c) => byKey.set(c.key, c))
    dynamic.forEach((c) => byKey.set(c.key, c))

    return Array.from(byKey.values())
  } catch {
    return defaultCategoryList()
  }
}

/**
 * Batch lookup: returns a Map of `${address}-${network}` → { final }.
 * Uses DB value when present; otherwise uses per-item fallback.
 */
export async function getFeedRiskTiersBatch(
  feedRequests: Array<{
    contractAddress: string
    network: string
    fallbackCategory?: string
  }>
): Promise<Map<string, FeedTierResult>> {
  const out = new Map<string, FeedTierResult>()
  const keyFor = (addr: string, net: string) => `${addr}-${net}`

  if (!supabase) {
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) =>
      out.set(keyFor(contractAddress, network), { final: chooseTier(null, fallbackCategory) })
    )
    return out
  }

  const networks = Array.from(new Set(feedRequests.map((r) => r.network)))
  const addresses = Array.from(new Set(feedRequests.map((r) => r.contractAddress)))

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("proxy_address, network, risk_status")
      .in("proxy_address", addresses)
      .in("network", networks)
      .limit(1000)

    if (error) {
      feedRequests.forEach(({ contractAddress, network, fallbackCategory }) =>
        out.set(keyFor(contractAddress, network), { final: chooseTier(null, fallbackCategory) })
      )
      return out
    }

    const lookup = new Map<string, string | null>()
    ;(data as FeedRiskRow[] | null)?.forEach((row) =>
      lookup.set(keyFor(row.proxy_address, row.network), row.risk_status ?? null)
    )

    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
      const key = keyFor(contractAddress, network)
      out.set(key, { final: chooseTier(lookup.get(key), fallbackCategory) })
    })

    return out
  } catch {
    feedRequests.forEach(({ contractAddress, network, fallbackCategory }) =>
      out.set(keyFor(contractAddress, network), { final: chooseTier(null, fallbackCategory) })
    )
    return out
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
    }
    return fallbackCategory
  } catch {
    return fallbackCategory
  }
}

/** Lightweight connectivity check. */
export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return { success: false, data: null, error: "Supabase client not available" }
    }
    const { data, error } = await supabase.from(TABLE).select("*").limit(1)
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
