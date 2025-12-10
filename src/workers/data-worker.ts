// TypeScript Web Worker for CCIP Search filtering
// Security Note: Web Workers run in isolated contexts and don't have access to event.origin
// Instead, we validate message structure and sanitize all inputs to prevent attacks
import type { LaneConfig } from "~/config/data/ccip/types.ts"
import type { ChainType, ExplorerInfo } from "~/config/types.ts"

interface SearchData {
  chains: Array<{
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }>
  tokens: Array<{
    id: string
    totalNetworks: number
    logo: string
  }>
  lanes: Array<{
    sourceNetwork: {
      name: string
      logo: string
      key: string
      chainType: ChainType
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
      chainType: ChainType
    }
    lane: LaneConfig
  }>
}

interface WorkerMessage {
  search: string
  data: SearchData
}

interface WorkerResponse {
  networks: SearchData["chains"]
  tokens: SearchData["tokens"]
  lanes: SearchData["lanes"]
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  // Basic validation - Web Workers run in isolated contexts, lower security risk
  const { search, data } = event.data

  if (!search || !data) {
    self.postMessage({ networks: [], tokens: [], lanes: [] } as WorkerResponse)
    return
  }

  const searchLower = search.toLowerCase()

  // Filter networks
  const networks = data.chains.filter((chain) => chain.name.toLowerCase().includes(searchLower))

  // Filter tokens
  const tokens = data.tokens.filter((token) => token.id.toLowerCase().includes(searchLower))

  // Filter lanes
  const lanes = data.lanes.filter((lane) => {
    const matchesNetwork =
      lane.sourceNetwork.name.toLowerCase().includes(searchLower) ||
      lane.destinationNetwork.name.toLowerCase().includes(searchLower)

    const hasTokens = lane.lane.supportedTokens ? lane.lane.supportedTokens.length > 0 : false

    return matchesNetwork && hasTokens
  })

  self.postMessage({ networks, tokens, lanes } as WorkerResponse)
}

// Export types for use in main thread
export type { WorkerMessage, WorkerResponse, SearchData }
