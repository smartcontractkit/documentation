import { describe, it, expect, jest } from "@jest/globals"

// Mock data: tokenSymbol → directoryKey → version
const mockVersions: Record<string, Record<string, string>> = {
  mainnet: {
    "LBTC::mainnet": "2.0.0",
    "LINK::mainnet": "2.0.0",
    "USDC::mainnet": "2.0.0",
  },
  testnet: {
    "CCIP-BnM::ethereum-testnet-sepolia": "2.0.0",
    "USDC::ethereum-testnet-sepolia": "2.0.0",
    "LINK::ethereum-testnet-sepolia": "2.0.0",
  },
}

// Mock the enrichment data service before importing pool-version
jest.unstable_mockModule("~/lib/ccip/graphql/services/enrichment-data-service.ts", () => ({
  fetchPoolVersion: jest.fn(async (environment: string, tokenSymbol: string, directoryKey: string) => {
    const envData = mockVersions[environment]
    if (!envData) return null
    return envData[`${tokenSymbol}::${directoryKey}`] ?? null
  }),
}))

// Dynamic imports after mock setup (required for ESM)
const { parseMajorVersion, isV2Pool, shouldEnableCCVFeatures, getEffectivePoolVersion } =
  await import("../pool-version.ts")
const { Environment } = await import("~/lib/ccip/types/index.ts")

describe("Pool Version Utilities", () => {
  describe("parseMajorVersion", () => {
    it("should parse standard semver versions", () => {
      expect(parseMajorVersion("1.0.0")).toBe(1)
      expect(parseMajorVersion("2.0.0")).toBe(2)
      expect(parseMajorVersion("1.5.1")).toBe(1)
      expect(parseMajorVersion("2.1.3")).toBe(2)
      expect(parseMajorVersion("10.0.0")).toBe(10)
    })

    it("should handle versions with v prefix", () => {
      expect(parseMajorVersion("v1.0.0")).toBe(1)
      expect(parseMajorVersion("v2.0.0")).toBe(2)
      expect(parseMajorVersion("V1.5.0")).toBe(1)
    })

    it("should return 0 for invalid versions", () => {
      expect(parseMajorVersion("")).toBe(0)
      expect(parseMajorVersion("invalid")).toBe(0)
    })

    it("should handle edge cases", () => {
      expect(parseMajorVersion("0.1.0")).toBe(0)
      expect(parseMajorVersion("1")).toBe(1)
      expect(parseMajorVersion("2.0")).toBe(2)
    })
  })

  describe("isV2Pool", () => {
    it("should return true for v2.0+ versions", () => {
      expect(isV2Pool("2.0.0")).toBe(true)
      expect(isV2Pool("2.1.0")).toBe(true)
      expect(isV2Pool("3.0.0")).toBe(true)
      expect(isV2Pool("v2.0.0")).toBe(true)
    })

    it("should return false for v1.x versions", () => {
      expect(isV2Pool("1.0.0")).toBe(false)
      expect(isV2Pool("1.5.0")).toBe(false)
      expect(isV2Pool("1.6.0")).toBe(false)
      expect(isV2Pool("1.6.3")).toBe(false)
      expect(isV2Pool("v1.6.0")).toBe(false)
    })

    it("should return false for invalid versions", () => {
      expect(isV2Pool("")).toBe(false)
      expect(isV2Pool("invalid")).toBe(false)
    })
  })

  describe("getEffectivePoolVersion", () => {
    it("should return GraphQL version when available", async () => {
      const result = await getEffectivePoolVersion(Environment.Mainnet, "LBTC", "mainnet", "1.6.0")
      expect(result).toBe("2.0.0")
    })

    it("should return actual version when no GraphQL data", async () => {
      const result = await getEffectivePoolVersion(Environment.Mainnet, "DAI", "mainnet", "1.6.0")
      expect(result).toBe("1.6.0")
    })

    it("should handle testnet", async () => {
      const result = await getEffectivePoolVersion(Environment.Testnet, "CCIP-BnM", "ethereum-testnet-sepolia", "1.6.0")
      expect(result).toBe("2.0.0")
    })

    it("should return actual version for non-overridden testnet tokens", async () => {
      const result = await getEffectivePoolVersion(Environment.Testnet, "GHO", "ethereum-testnet-sepolia", "1.5.0")
      expect(result).toBe("1.5.0")
    })
  })

  describe("shouldEnableCCVFeatures", () => {
    it("should return true for v2.0+ pools", async () => {
      expect(await shouldEnableCCVFeatures(Environment.Mainnet, "LBTC", "mainnet", "1.6.0")).toBe(true)
    })

    it("should return false for v1.x pools without override", async () => {
      expect(await shouldEnableCCVFeatures(Environment.Mainnet, "DAI", "mainnet", "1.6.0")).toBe(false)
    })

    it("should return true if actual version is 2.0+ even without GraphQL data", async () => {
      expect(await shouldEnableCCVFeatures(Environment.Mainnet, "UNKNOWN", "mainnet", "2.0.0")).toBe(true)
    })

    it("should handle testnet correctly", async () => {
      expect(await shouldEnableCCVFeatures(Environment.Testnet, "CCIP-BnM", "ethereum-testnet-sepolia", "1.6.0")).toBe(
        true
      )
      expect(await shouldEnableCCVFeatures(Environment.Testnet, "GHO", "ethereum-testnet-sepolia", "1.5.0")).toBe(false)
    })
  })
})
