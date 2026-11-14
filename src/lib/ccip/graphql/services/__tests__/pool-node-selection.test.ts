import { describe, it, expect, jest, beforeEach } from "@jest/globals"

/**
 * Tests for the registered-pool lookup in enrichment-data-service.ts.
 *
 * A token can have multiple `ccip_token_pools` rows for the same chain —
 * migration history and staging deployments, each indexed with the registry
 * that registered it. The TokenAdminRegistry is the on-chain source of truth
 * for the single current pool, so the service matches Atlas's `registry`
 * column against the curated registry address (chains.json) and falls back to
 * the curated tokens.json pool entry when no row matches.
 *
 * findRegisteredPoolNode is not exported, so we exercise it through
 * fetchPoolDataForToken by mocking the GraphQL client to return controlled
 * node sets.
 */

const mockNodes: Array<Record<string, unknown>> = []

jest.unstable_mockModule("~/lib/ccip/graphql/client.ts", () => ({
  executeGraphQLQuery: jest.fn(async () => ({
    allCcipTokenPools: { nodes: mockNodes, totalCount: mockNodes.length },
  })),
}))

// Mock reference-data-resolver so no tokens.json data is needed.
// resolveTokenAddress returns a unique address per token symbol so each test
// gets a distinct LRU cache key (the service caches pool lookups for 60s).
let currentTokenAddress = "0xToken0"
let addressCounter = 0
let currentRegistry: string | null = null
let curatedPool: { address: string; rawType: string; type: string; version: string } | null = null

jest.unstable_mockModule("~/lib/ccip/graphql/utils/reference-data-resolver.ts", () => ({
  resolveTokenAddress: jest.fn(() => currentTokenAddress),
  resolveAllTokenAddresses: jest.fn(() => ({})),
  resolveCanonicalSymbolByAddress: jest.fn(() => null),
  resolveOnChainSymbol: jest.fn((_e: unknown, s: string) => s),
  resolvePoolType: jest.fn(() => null),
  resolveCuratedPoolInfo: jest.fn(() => curatedPool),
  resolveTokenAdminRegistry: jest.fn(() => currentRegistry),
  toSelectorName: jest.fn(() => "network"),
  getAllTokenSymbols: jest.fn(() => []),
  getChainFamilyForDirectoryKey: jest.fn(() => "evm"),
}))

jest.unstable_mockModule("~/lib/ccip/graphql/utils/address-display.ts", () => ({
  normalizeAddressForDisplay: jest.fn((addr: string) => addr),
}))

jest.unstable_mockModule("~/config/data/ccip/data.ts", () => ({
  getVerifiersByNetwork: jest.fn(() => []),
  getVerifier: jest.fn(() => undefined),
}))

const { fetchPoolDataForToken } = await import("../enrichment-data-service.ts")
const { Environment } = await import("~/config/data/ccip/types.ts")

type NodeFixture = {
  tokenPool: string
  typeAndVersion?: string | null
  registry?: string | null
}

function setNodes(...fixtures: NodeFixture[]) {
  currentTokenAddress = `0xToken${addressCounter++}`
  mockNodes.length = 0
  mockNodes.push(
    ...fixtures.map((f) => ({
      network: "network",
      token: "0xtoken",
      tokenSymbol: "TST",
      typeAndVersion: f.typeAndVersion ?? null,
      registry: f.registry ?? null,
      minBlockConfirmations: null,
      info: null,
      tokenPool: f.tokenPool,
    }))
  )
}

async function selectedAddress(): Promise<string | null> {
  const pool = await fetchPoolDataForToken(Environment.Mainnet, "TST", "mainnet")
  return pool?.address ?? null
}

describe("registered pool lookup", () => {
  beforeEach(() => {
    currentRegistry = null
    curatedPool = null
  })

  it("picks the pool registered in the official TokenAdminRegistry over other registries", async () => {
    currentRegistry = "0xofficialregistry"
    setNodes(
      { tokenPool: "0xRegistered", typeAndVersion: "BurnMintTokenPool 1.5.0", registry: "0xofficialregistry" },
      { tokenPool: "0xOldRegistry", typeAndVersion: "BurnMintTokenPool 2.0.0", registry: "0xoldregistry" },
      { tokenPool: "0xStaging", typeAndVersion: "BurnMintTokenPool 2.0.0-dev", registry: "0xstagingregistry" }
    )
    expect(await selectedAddress()).toBe("0xRegistered")
  })

  it("is order-independent: the registry match wins regardless of row order", async () => {
    currentRegistry = "0xofficialregistry"
    const nodes: NodeFixture[] = [
      { tokenPool: "0xStaging", typeAndVersion: "BurnMintTokenPool 2.0.0-dev", registry: "0xstagingregistry" },
      { tokenPool: "0xRegistered", typeAndVersion: "BurnMintTokenPool 1.5.0", registry: "0xofficialregistry" },
      { tokenPool: "0xOldRegistry", typeAndVersion: "BurnMintTokenPool 2.0.0", registry: "0xoldregistry" },
    ]
    for (const permutation of [nodes, [nodes[1], nodes[0], nodes[2]], [nodes[2], nodes[1], nodes[0]]]) {
      setNodes(...permutation)
      expect(await selectedAddress()).toBe("0xRegistered")
    }
  })

  it("falls back to the curated tokens.json pool when no node matches the registry", async () => {
    currentRegistry = "0xofficialregistry"
    curatedPool = { address: "0xCurated", rawType: "BurnMintTokenPool", type: "burnMint", version: "1.6.0" }
    setNodes(
      { tokenPool: "0xOldRegistry", typeAndVersion: "BurnMintTokenPool 2.0.0", registry: "0xoldregistry" },
      { tokenPool: "0xStaging", typeAndVersion: "BurnMintTokenPool 2.0.0-dev", registry: "0xstagingregistry" }
    )
    expect(await selectedAddress()).toBe("0xCurated")
  })

  it("falls back to the curated pool when the chain has no curated registry (e.g. solana, canton)", async () => {
    currentRegistry = null
    curatedPool = { address: "0xCurated", rawType: "BurnMintTokenPool", type: "burnMint", version: "1.6.0" }
    setNodes({ tokenPool: "0xSomePool", typeAndVersion: "BurnMintTokenPool 2.0.0", registry: "0xunknownregistry" })
    expect(await selectedAddress()).toBe("0xCurated")
  })

  it("returns null when no node matches and no curated pool exists", async () => {
    currentRegistry = "0xofficialregistry"
    setNodes({ tokenPool: "0xOldRegistry", typeAndVersion: "BurnMintTokenPool 2.0.0", registry: "0xoldregistry" })
    expect(await selectedAddress()).toBeNull()
  })

  it("skips rows without a pool address", async () => {
    currentRegistry = "0xofficialregistry"
    setNodes(
      { tokenPool: "", typeAndVersion: "BurnMintTokenPool 1.5.0", registry: "0xofficialregistry" },
      { tokenPool: "0xRegistered", typeAndVersion: "BurnMintTokenPool 1.5.0", registry: "0xofficialregistry" }
    )
    expect(await selectedAddress()).toBe("0xRegistered")
  })
})
