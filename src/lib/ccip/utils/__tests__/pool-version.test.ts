import { describe, it, expect } from "@jest/globals"
import { parseMajorVersion, isV2Pool, shouldEnableCCVFeatures, getEffectivePoolVersion } from "../pool-version.ts"
import { Environment } from "~/lib/ccip/types/index.ts"

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
    it("should return override version when available", () => {
      // LBTC on mainnet has an override to 2.0.0
      const result = getEffectivePoolVersion(Environment.Mainnet, "LBTC", "mainnet", "1.6.0")
      expect(result).toBe("2.0.0")
    })

    it("should return actual version when no override exists", () => {
      // DAI on mainnet has no override (not in our mock data)
      const result = getEffectivePoolVersion(Environment.Mainnet, "DAI", "mainnet", "1.6.0")
      expect(result).toBe("1.6.0")
    })

    it("should handle testnet overrides", () => {
      // CCIP-BnM on sepolia has an override to 2.0.0
      const result = getEffectivePoolVersion(Environment.Testnet, "CCIP-BnM", "ethereum-testnet-sepolia", "1.6.0")
      expect(result).toBe("2.0.0")
    })

    it("should return actual version for non-overridden testnet tokens", () => {
      // GHO has no override in our mock data
      const result = getEffectivePoolVersion(Environment.Testnet, "GHO", "ethereum-testnet-sepolia", "1.5.0")
      expect(result).toBe("1.5.0")
    })

    it("should return override for LINK (now v2.0)", () => {
      // LINK on mainnet is now overridden to 2.0.0
      const result = getEffectivePoolVersion(Environment.Mainnet, "LINK", "mainnet", "1.6.0")
      expect(result).toBe("2.0.0")
    })

    it("should return override for USDC (now v2.0)", () => {
      // USDC on mainnet is now overridden to 2.0.0
      const result = getEffectivePoolVersion(Environment.Mainnet, "USDC", "mainnet", "1.6.0")
      expect(result).toBe("2.0.0")
    })
  })

  describe("shouldEnableCCVFeatures", () => {
    it("should return true for v2.0+ pools", () => {
      // LBTC on mainnet is overridden to 2.0.0
      expect(shouldEnableCCVFeatures(Environment.Mainnet, "LBTC", "mainnet", "1.6.0")).toBe(true)
    })

    it("should return false for v1.x pools without override", () => {
      // DAI on mainnet is not overridden (not in mock data)
      expect(shouldEnableCCVFeatures(Environment.Mainnet, "DAI", "mainnet", "1.6.0")).toBe(false)
    })

    it("should return true if actual version is 2.0+ even without override", () => {
      expect(shouldEnableCCVFeatures(Environment.Mainnet, "UNKNOWN", "mainnet", "2.0.0")).toBe(true)
    })

    it("should handle testnet correctly", () => {
      // CCIP-BnM on sepolia is overridden to 2.0.0
      expect(shouldEnableCCVFeatures(Environment.Testnet, "CCIP-BnM", "ethereum-testnet-sepolia", "1.6.0")).toBe(true)
      // GHO has no override (not in mock data)
      expect(shouldEnableCCVFeatures(Environment.Testnet, "GHO", "ethereum-testnet-sepolia", "1.5.0")).toBe(false)
    })

    it("should return true for LINK (now v2.0)", () => {
      // LINK on mainnet is now overridden to 2.0.0
      expect(shouldEnableCCVFeatures(Environment.Mainnet, "LINK", "mainnet", "1.6.0")).toBe(true)
    })

    it("should return true for USDC (now v2.0)", () => {
      // USDC on mainnet is now overridden to 2.0.0
      expect(shouldEnableCCVFeatures(Environment.Mainnet, "USDC", "mainnet", "1.6.0")).toBe(true)
    })
  })
})

describe("Version-conditional API behavior", () => {
  describe("v1.x pools", () => {
    it("should have CCV features disabled", () => {
      // DAI is not in our mock overrides, so it stays v1.x
      const isCCVEnabled = shouldEnableCCVFeatures(Environment.Mainnet, "DAI", "mainnet", "1.6.0")
      expect(isCCVEnabled).toBe(false)
    })
  })

  describe("v2.0+ pools", () => {
    it("should have CCV features enabled for LBTC", () => {
      const isCCVEnabled = shouldEnableCCVFeatures(Environment.Mainnet, "LBTC", "mainnet", "1.6.0")
      expect(isCCVEnabled).toBe(true)
    })

    it("should have CCV features enabled for LINK", () => {
      const isCCVEnabled = shouldEnableCCVFeatures(Environment.Mainnet, "LINK", "mainnet", "1.6.0")
      expect(isCCVEnabled).toBe(true)
    })

    it("should have CCV features enabled for USDC", () => {
      const isCCVEnabled = shouldEnableCCVFeatures(Environment.Mainnet, "USDC", "mainnet", "1.6.0")
      expect(isCCVEnabled).toBe(true)
    })
  })
})
