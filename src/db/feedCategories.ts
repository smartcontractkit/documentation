import {
  getMarketPricingRiskTerms,
  tierAnchor,
  type MarketPricingRiskProduct,
} from "../features/feeds/content/marketPricingRiskTerms.ts"
import { supabase } from "./supabase.js"

/* ===========================
   Types
   =========================== */

type FeedRiskRow = {
  proxy_address: string
  network: string
  risk_status: string | null
}

type FeedRequest = {
  contractAddress: string
  network: string
  shutdownDate?: string
  fallbackCategory?: string
}

export type FeedTierResult = { final: string | null }

/* ===========================
   Category Config
   =========================== */

export const FEED_CATEGORY_CONFIG = {
  low: {
    key: "low",
    name: "Low Market Pricing Risk",
    icon: "🟢",
    title:
      "Low Market Pricing Risk - Feeds that follow a standardized workflow to report market prices for liquid assets with robust market structure.",
    link: "/data-feeds/selecting-data-feeds#-low-market-pricing-risk-feeds",
  },
  medium: {
    key: "medium",
    name: "Medium Market Pricing Risk",
    icon: "🟡",
    title:
      "Medium Market Pricing Risk - Feeds that report market prices for asset pairs that may have features making them more challenging to reliably price, or potentially subject them to volatility.",
    link: "/data-feeds/selecting-data-feeds#-medium-market-pricing-risk-feeds",
  },
  high: {
    key: "high",
    name: "High Market Pricing Risk",
    icon: "🟠",
    title:
      "High Market Pricing Risk - Feeds for pairs that often exhibit a heightened degree of Medium Market Pricing Risk factors, or separate risks that make the market price subject to uncertainty or volatility.",
    link: "/data-feeds/selecting-data-feeds#-high-market-pricing-risk-feeds",
  },
  veryhigh: {
    key: "veryhigh",
    name: "Very High Market Pricing Risk",
    icon: "🔴",
    title:
      "Very High Market Pricing Risk - Feeds that price assets with quotes subject to extreme levels of risk, greater than those outlined for High Market Pricing Risk feeds.",
    link: "/data-feeds/selecting-data-feeds#-very-high-market-pricing-risk-feeds",
  },
  new: {
    key: "new",
    name: "New Token Feeds",
    icon: "🆕",
    title:
      "New Token Feeds - Tokens without the historical data required to implement a risk assessment framework may be launched in this category. Users must understand the additional market and volatility risks inherent with such assets.",
    link: "/data-feeds/selecting-data-feeds#-new-token-feeds",
  },
  custom: {
    key: "custom",
    name: "Custom Feeds",
    icon: "🔵",
    title:
      "Custom Feeds - Feeds built to serve a specific use case and might not be suitable for general use or your use case's risk parameters.",
    link: "/data-feeds/selecting-data-feeds#-custom-feeds",
  },
  deprecating: {
    key: "deprecating",
    name: "Deprecating",
    icon: "⭕",
    title: "Deprecating - These feeds are scheduled for deprecation.",
    link: "/data-feeds/selecting-data-feeds#-deprecating",
  },
} as const

export type CategoryKey = keyof typeof FEED_CATEGORY_CONFIG

const TIER_ANCHOR_KEY: Record<CategoryKey, string> = {
  low: "low",
  medium: "medium",
  high: "high",
  veryhigh: "very-high",
  new: "new-token",
  custom: "custom",
  deprecating: "deprecating",
}

const RISK_DOC_BASE_PATH: Record<MarketPricingRiskProduct, string> = {
  feeds: "/data-feeds/selecting-data-feeds",
  streams: "/data-streams/selecting-data-streams",
}

export function getRiskCategoryLink(key: CategoryKey, product: MarketPricingRiskProduct = "feeds"): string {
  const base = RISK_DOC_BASE_PATH[product]

  if (key === "deprecating") {
    return `${base}#-deprecating`
  }

  return `${base}${tierAnchor(TIER_ANCHOR_KEY[key], getMarketPricingRiskTerms(product))}`
}

export function getRiskCategoryTitle(key: CategoryKey, product: MarketPricingRiskProduct = "feeds"): string {
  const title = FEED_CATEGORY_CONFIG[key].title

  if (product === "feeds") {
    return title
  }

  return title
    .replace(/\bFeeds\b/g, "Streams")
    .replace(/\bFeed\b/g, "Stream")
    .replace(/\bfeed\b/g, "stream")
    .replace(/\bfeeds\b/g, "streams")
}

/* ===========================
   Small helpers
   =========================== */

const TABLE = "prod_feeds_risk_docs"

const normalizeKey = (v?: string | null): CategoryKey | undefined => {
  if (!v) return undefined
  // Handle "very high" from DB → "veryhigh" config key
  const key = v.toLowerCase().replace(/\s+/g, "") as CategoryKey
  return key in FEED_CATEGORY_CONFIG ? key : undefined
}

const FALLBACK_ONLY_CATEGORIES = new Set(["new", "custom"])

const resolveRiskStatus = (
  dbTier: string | null | undefined,
  shutdownDate?: string,
  fallbackCategory?: string
): string | null => {
  // Deprecating feeds always show the deprecating icon, even when a DB risk tier exists.
  if (shutdownDate) return "deprecating"
  if (dbTier != null) return dbTier
  if (fallbackCategory && FALLBACK_ONLY_CATEGORIES.has(fallbackCategory.toLowerCase()))
    return fallbackCategory.toLowerCase()
  return null
}

/** Client-side helper for resolving the displayed feed category. */
export function resolveFeedCategory(
  dbTier: string | null | undefined,
  shutdownDate?: string,
  fallbackCategory?: string
): string | null {
  return resolveRiskStatus(dbTier, shutdownDate, fallbackCategory)
}

const defaultCategoryList = () => Object.values(FEED_CATEGORY_CONFIG).map(({ key, name }) => ({ key, name }))

/* ===========================
   Public API
   =========================== */

export const getDefaultCategories = defaultCategoryList

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
 * Uses DB risk_status when present, unless the feed has a shutdownDate (deprecating).
 * If absent, infers "deprecating" from shutdownDate.
 * Returns null when neither is available.
 */
export async function getFeedRiskTiersBatch(feedRequests: FeedRequest[]): Promise<Map<string, FeedTierResult>> {
  const out = new Map<string, FeedTierResult>()
  const keyFor = (addr: string, net: string) => `${addr}-${net}`

  if (!supabase) {
    feedRequests.forEach(({ contractAddress, network, shutdownDate, fallbackCategory }) =>
      out.set(keyFor(contractAddress, network), { final: resolveRiskStatus(null, shutdownDate, fallbackCategory) })
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
      feedRequests.forEach(({ contractAddress, network, shutdownDate, fallbackCategory }) =>
        out.set(keyFor(contractAddress, network), { final: resolveRiskStatus(null, shutdownDate, fallbackCategory) })
      )
      return out
    }

    const lookup = new Map<string, string | null>()
    ;(data as FeedRiskRow[] | null)?.forEach((row) =>
      lookup.set(keyFor(row.proxy_address, row.network), row.risk_status ?? null)
    )

    feedRequests.forEach(({ contractAddress, network, shutdownDate, fallbackCategory }) => {
      const key = keyFor(contractAddress, network)
      out.set(key, { final: resolveRiskStatus(lookup.get(key), shutdownDate, fallbackCategory) })
    })

    return out
  } catch (error) {
    feedRequests.forEach(({ contractAddress, network, shutdownDate, fallbackCategory }) =>
      out.set(keyFor(contractAddress, network), { final: resolveRiskStatus(null, shutdownDate, fallbackCategory) })
    )
    return out
  }
}
