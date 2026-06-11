import { resolveFeedCategory, type FeedTierResult } from "./feedCategories.js"
import { supabase } from "./supabase.js"

const TABLE = "prod_streams_risk_docs"
const ADDRESS_BATCH_SIZE = 100

type StreamRiskRow = {
  stream_proxy_address: string
  risk_status: string | null
}

export type StreamRiskRequest = {
  streamProxyAddress: string
  shutdownDate?: string
}

const normalizeAddress = (value: string) => value.toLowerCase()

async function queryStreamRiskByAddresses(addresses: string[]): Promise<Map<string, string | null>> {
  const lookup = new Map<string, string | null>()

  if (!supabase || addresses.length === 0) return lookup

  for (let i = 0; i < addresses.length; i += ADDRESS_BATCH_SIZE) {
    const chunk = addresses.slice(i, i + ADDRESS_BATCH_SIZE)

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("stream_proxy_address, risk_status")
        .in("stream_proxy_address", chunk)
        .limit(1000)

      if (error) continue
      ;(data as StreamRiskRow[] | null)?.forEach((row) => {
        lookup.set(normalizeAddress(row.stream_proxy_address), row.risk_status ?? null)
      })
    } catch {
      continue
    }
  }

  return lookup
}

/**
 * Batch lookup: returns Map of normalized stream_proxy_address → { final }.
 * All stream risk docs are keyed by address; network is not used for matching.
 */
export async function getStreamRiskTiersBatch(requests: StreamRiskRequest[]): Promise<Map<string, FeedTierResult>> {
  const out = new Map<string, FeedTierResult>()

  if (requests.length === 0) return out

  const finish = (lookup: Map<string, string | null>) => {
    requests.forEach(({ streamProxyAddress, shutdownDate }) => {
      const normalizedAddress = normalizeAddress(streamProxyAddress)
      const dbTier = lookup.get(normalizedAddress) ?? null
      out.set(normalizedAddress, { final: resolveFeedCategory(dbTier, shutdownDate) })
    })
  }

  if (!supabase) {
    finish(new Map())
    return out
  }

  const addresses = Array.from(new Set(requests.map((r) => normalizeAddress(r.streamProxyAddress))))

  try {
    const lookup = await queryStreamRiskByAddresses(addresses)
    finish(lookup)
    return out
  } catch {
    finish(new Map())
    return out
  }
}
