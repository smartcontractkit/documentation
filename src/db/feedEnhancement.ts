import { getFeedRiskTier } from "./feedCategories.js"

interface FeedData {
  name: string
  contractAddress?: string
  proxyAddress?: string
  feedCategory?: string
  [key: string]: unknown
}

/**
 * Enhanced feed processing function for Supabase risk tier data
 */
export async function enhanceFeedWithRiskTier(feed: FeedData, network: string): Promise<FeedData> {
  try {
    const feedRiskTier = await getFeedRiskTier(
      feed.contractAddress || feed.proxyAddress || "",
      network,
      feed.feedCategory
    )

    // Return the enhanced feed object with risk tier from Supabase
    const feedWithRiskTier = {
      ...feed,
      feedCategory: feedRiskTier ?? undefined,
    }

    return feedWithRiskTier
  } catch (error) {
    console.warn(`Failed to enhance feed ${feed.name}:`, error)
    // Return original feed if lookup fails
    return feed
  }
}

/**
 * Process multiple feeds with Supabase enhancement
 */
export async function enhanceFeedsWithRiskTiers(feeds: FeedData[], network: string): Promise<FeedData[]> {
  const enhancedFeeds = await Promise.allSettled(feeds.map((feed) => enhanceFeedWithRiskTier(feed, network)))

  return enhancedFeeds.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value
    } else {
      console.warn(`Failed to enhance feed at index ${index}:`, result.reason)
      return feeds[index] // return original feed if enhancement fails
    }
  })
}
