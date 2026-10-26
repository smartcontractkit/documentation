import { LRUCache } from "lru-cache"

const proxyCache = new LRUCache<string, Record<string, unknown>>({
  max: 200,
  ttl: 60_000,
})

export function getCached(key: string): Record<string, unknown> | undefined {
  return proxyCache.get(key)
}

export function setCache(key: string, data: Record<string, unknown>): void {
  proxyCache.set(key, data)
}

export function buildCacheKey(query: string, variables?: Record<string, unknown>): string {
  const varsStr = variables ? JSON.stringify(variables, Object.keys(variables).sort()) : ""
  return `proxy:${query}:${varsStr}`
}
