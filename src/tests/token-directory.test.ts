import { describe, it, expect, jest } from "@jest/globals"
import type {
  TokenDirectoryData,
  TokenDirectoryLane,
  CCVConfig,
  LaneVerifiers,
  RateLimiterConfig,
  TokenRateLimits,
  TokenFees,
  CustomFinalityConfig,
} from "~/lib/ccip/types/index.ts"

// Mock the logger
jest.mock("../lib/logging", () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe("Token Directory Types", () => {
  describe("TokenDirectoryData structure", () => {
    it("should have correct structure with required fields", () => {
      const data: TokenDirectoryData = {
        internalId: "mainnet",
        chainId: 1,
        selector: "5009297550715157269",
        token: {
          address: "0x8236a87084f8B84306f72007F36F2618A5634494",
          decimals: 8,
        },
        pool: {
          address: "0x65756C6976c5dC9a546b455b8A6E9c2dC91E1b31",
          rawType: "BurnMintTokenPool",
          type: "burnMint",
          version: "1.6.0",
          advancedPoolHooks: null,
          supportsV2Features: true,
        },
        ccvConfig: {
          thresholdAmount: "100000000000",
        },
        customFinality: {
          hasCustomFinality: true,
          minBlockConfirmation: 5,
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(data.internalId).toBe("mainnet")
      expect(data.chainId).toBe(1)
      expect(data.selector).toBe("5009297550715157269")
      expect(data.token.address).toBe("0x8236a87084f8B84306f72007F36F2618A5634494")
      expect(data.token.decimals).toBe(8)
      expect(data.customFinality?.hasCustomFinality).toBe(true)
      expect(data.customFinality?.minBlockConfirmation).toBe(5)
      expect(data.pool.type).toBe("burnMint")
      expect(data.pool.advancedPoolHooks).toBeNull()
      expect(data.ccvConfig?.thresholdAmount).toBe("100000000000")
    })

    it("should allow null ccvConfig and customFinality for v1.x pools only", () => {
      // For v1.x pools (supportsV2Features=false), ccvConfig and customFinality are null
      const data: TokenDirectoryData = {
        internalId: "mainnet",
        chainId: 1,
        selector: "5009297550715157269",
        token: {
          address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          decimals: 18,
        },
        pool: {
          address: "0xLinkPool",
          rawType: "LockReleaseTokenPool",
          type: "lockRelease",
          version: "1.6.0",
          advancedPoolHooks: null,
          supportsV2Features: false, // v1.x pool - ccvConfig and customFinality not supported
        },
        ccvConfig: null, // null only valid for v1.x pools
        customFinality: null, // null only valid for v1.x pools
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(data.pool.supportsV2Features).toBe(false)
      expect(data.ccvConfig).toBeNull()
      expect(data.customFinality).toBeNull()
    })

    it("should have ccvConfig object for v2.x pools (never null at field level)", () => {
      // For v2.x pools, ccvConfig is always an object:
      // - {thresholdAmount: "0"} = not configured
      // - {thresholdAmount: "value"} = configured
      // - {thresholdAmount: null} = downstream API error
      const dataNotConfigured: TokenDirectoryData = {
        internalId: "mainnet",
        chainId: 1,
        selector: "5009297550715157269",
        token: {
          address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          decimals: 18,
        },
        pool: {
          address: "0xLinkPool",
          rawType: "LockReleaseTokenPool",
          type: "lockRelease",
          version: "2.0.0",
          advancedPoolHooks: null,
          supportsV2Features: true, // v2.x pool
        },
        ccvConfig: { thresholdAmount: "0" }, // v2 pool without CCV configured
        customFinality: { hasCustomFinality: false, minBlockConfirmation: 0 },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(dataNotConfigured.pool.supportsV2Features).toBe(true)
      expect(dataNotConfigured.ccvConfig).not.toBeNull()
      expect(dataNotConfigured.ccvConfig?.thresholdAmount).toBe("0")
    })
  })

  describe("TokenDirectoryLane structure", () => {
    it("should have correct structure for outbound lane with both rate limits", () => {
      const lane: TokenDirectoryLane = {
        internalId: "arbitrum-mainnet",
        chainId: 42161,
        selector: "4949039107694359620",
        rateLimits: {
          standard: {
            in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
            out: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
          },
          custom: {
            in: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
            out: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
          },
        },
        fees: {
          standardTransferFeeBps: 10,
          customTransferFeeBps: 25,
        },
        verifiers: {
          belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        },
      }

      expect(lane.internalId).toBe("arbitrum-mainnet")
      expect(lane.chainId).toBe(42161)
      expect(lane.rateLimits.standard?.out?.isEnabled).toBe(true)
      expect(lane.rateLimits.custom?.in?.isEnabled).toBe(true)
      expect(lane.fees?.standardTransferFeeBps).toBe(10)
      expect(lane.fees?.customTransferFeeBps).toBe(25)
      expect(lane.verifiers?.belowThreshold).toHaveLength(1)
      expect(lane.verifiers?.aboveThreshold).toHaveLength(2)
    })

    it("should allow null rateLimits, fees, and verifiers (v1.x pools)", () => {
      const lane: TokenDirectoryLane = {
        internalId: "base-mainnet",
        chainId: 8453,
        selector: "15971525489660198786",
        rateLimits: {
          standard: null,
          custom: null,
        },
        fees: null,
        verifiers: null,
      }

      expect(lane.rateLimits.standard).toBeNull()
      expect(lane.rateLimits.custom).toBeNull()
      expect(lane.fees).toBeNull()
      expect(lane.verifiers).toBeNull()
    })
  })

  describe("CCVConfig structure", () => {
    it("should have thresholdAmount as string when CCV configured", () => {
      const config: CCVConfig = {
        thresholdAmount: "100000000000",
      }

      expect(config.thresholdAmount).toBe("100000000000")
      expect(typeof config.thresholdAmount).toBe("string")
    })

    it("should have thresholdAmount as '0' when CCV not configured (v2 pool)", () => {
      // For v2 pools without CCV configured, thresholdAmount is "0"
      const config: CCVConfig = {
        thresholdAmount: "0",
      }

      expect(config.thresholdAmount).toBe("0")
    })

    it("should have thresholdAmount as null for downstream API error (v2 pool)", () => {
      // For v2 pools with downstream API error, thresholdAmount is null
      const config: CCVConfig = {
        thresholdAmount: null,
      }

      expect(config.thresholdAmount).toBeNull()
    })
  })

  describe("LaneVerifiers structure", () => {
    it("should have belowThreshold and aboveThreshold arrays", () => {
      const verifiers: LaneVerifiers = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
        aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
      }

      expect(Array.isArray(verifiers.belowThreshold)).toBe(true)
      expect(Array.isArray(verifiers.aboveThreshold)).toBe(true)
      expect(verifiers.belowThreshold![0].startsWith("0x")).toBe(true)
    })

    it("should have aboveThreshold include all belowThreshold verifiers plus additional ones", () => {
      const verifiers: LaneVerifiers = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        aboveThreshold: [
          "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
          "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
          "0xcBD48A8eB077381c3c4Eb36b402d7283aB2b11Bc",
        ],
      }

      // All belowThreshold verifiers should be in aboveThreshold
      verifiers.belowThreshold!.forEach((v) => {
        expect(verifiers.aboveThreshold).toContain(v)
      })
      // aboveThreshold should have more verifiers
      expect(verifiers.aboveThreshold!.length).toBeGreaterThanOrEqual(verifiers.belowThreshold!.length)
    })

    it("should allow null arrays for downstream API error", () => {
      const verifiers: LaneVerifiers = {
        belowThreshold: null,
        aboveThreshold: null,
      }

      expect(verifiers.belowThreshold).toBeNull()
      expect(verifiers.aboveThreshold).toBeNull()
    })

    it("should have equal arrays when no threshold verifiers (v2.x pools with thresholdAmount=0)", () => {
      // Note: v1.x pools have verifiers: null, not equal arrays
      // This case applies to v2.x pools with thresholdAmount=0
      const verifiers: LaneVerifiers = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
        aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
      }

      expect(verifiers.belowThreshold).toEqual(verifiers.aboveThreshold)
    })
  })

  describe("RateLimiterConfig structure", () => {
    it("should have capacity, rate, and isEnabled", () => {
      const rateLimit: RateLimiterConfig = {
        capacity: "12000000000000",
        rate: "3330000000",
        isEnabled: true,
      }

      expect(typeof rateLimit.capacity).toBe("string")
      expect(typeof rateLimit.rate).toBe("string")
      expect(typeof rateLimit.isEnabled).toBe("boolean")
    })

    it("should allow disabled rate limits", () => {
      const rateLimit: RateLimiterConfig = {
        capacity: "0",
        rate: "0",
        isEnabled: false,
      }

      expect(rateLimit.isEnabled).toBe(false)
    })
  })

  describe("TokenRateLimits structure", () => {
    it("should have both standard and custom rate limits with in/out directions", () => {
      const rateLimits: TokenRateLimits = {
        standard: {
          in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
          out: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
        },
        custom: {
          in: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
          out: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
        },
      }

      expect(rateLimits.standard).not.toBeNull()
      expect(rateLimits.custom).not.toBeNull()
      expect(rateLimits.standard?.out?.capacity).toBe("12000000000000")
      expect(rateLimits.custom?.in?.capacity).toBe("24000000000000")
    })

    it("should allow null for individual rate limits", () => {
      const rateLimits: TokenRateLimits = {
        standard: {
          in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
          out: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
        },
        custom: null,
      }

      expect(rateLimits.standard).not.toBeNull()
      expect(rateLimits.custom).toBeNull()
    })
  })

  describe("TokenFees structure", () => {
    it("should have standardTransferFeeBps and customTransferFeeBps", () => {
      const fees: TokenFees = {
        standardTransferFeeBps: 10,
        customTransferFeeBps: 25,
      }

      expect(fees.standardTransferFeeBps).toBe(10)
      expect(fees.customTransferFeeBps).toBe(25)
    })
  })
})

describe("Token Directory API response validation", () => {
  it("should not include display names in response (lean API)", () => {
    const data: TokenDirectoryData = {
      internalId: "mainnet",
      chainId: 1,
      selector: "5009297550715157269",
      token: {
        address: "0x8236a87084f8B84306f72007F36F2618A5634494",
        decimals: 8,
      },
      pool: {
        address: "0x65756C6976c5dC9a546b455b8A6E9c2dC91E1b31",
        rawType: "BurnMintTokenPool",
        type: "burnMint",
        version: "1.6.0",
        advancedPoolHooks: null,
        supportsV2Features: true,
      },
      ccvConfig: {
        thresholdAmount: "100000000000",
      },
      customFinality: {
        hasCustomFinality: true,
        minBlockConfirmation: 5,
      },
      outboundLanes: {},
      inboundLanes: {},
    }

    // Should NOT have name/displayName fields
    expect(data).not.toHaveProperty("name")
    expect(data).not.toHaveProperty("displayName")
    expect(data.token).not.toHaveProperty("name")
    expect(data.token).not.toHaveProperty("symbol")
  })

  it("should not include formatted amounts", () => {
    const config: CCVConfig = {
      thresholdAmount: "100000000000",
    }

    // Should NOT have formatted amount
    expect(config).not.toHaveProperty("thresholdAmountFormatted")
  })

  it("should have verifiers as plain address arrays (not enriched objects)", () => {
    const verifiers: LaneVerifiers = {
      belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
      aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
    }

    // Verifiers should be strings (addresses), not objects
    verifiers.belowThreshold!.forEach((v) => {
      expect(typeof v).toBe("string")
      expect(v.startsWith("0x")).toBe(true)
    })
    verifiers.aboveThreshold!.forEach((v) => {
      expect(typeof v).toBe("string")
      expect(v.startsWith("0x")).toBe(true)
    })
  })
})

describe("Token Directory example responses", () => {
  it("should represent v2.0 pool (LBTC) with CCV features enabled", () => {
    // v2.0 pool - CCV features enabled (ccvConfig, threshold verifiers)
    const lbtcData: TokenDirectoryData = {
      internalId: "mainnet",
      chainId: 1,
      selector: "5009297550715157269",
      token: {
        address: "0x8236a87084f8B84306f72007F36F2618A5634494",
        decimals: 8,
      },
      pool: {
        address: "0x65756C6976c5dC9a546b455b8A6E9c2dC91E1b31",
        rawType: "BurnMintTokenPool",
        type: "burnMint",
        version: "2.0.0", // v2.0 pool
        advancedPoolHooks: null,
        supportsV2Features: true,
      },
      ccvConfig: {
        thresholdAmount: "100000000000", // CCV config present for v2.0+
      },
      customFinality: {
        hasCustomFinality: true,
        minBlockConfirmation: 5,
      },
      outboundLanes: {
        "arbitrum-mainnet": {
          internalId: "arbitrum-mainnet",
          chainId: 42161,
          selector: "4949039107694359620",
          rateLimits: {
            standard: {
              in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
              out: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
            },
            custom: {
              in: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
              out: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
            },
          },
          fees: {
            standardTransferFeeBps: 10,
            customTransferFeeBps: 25,
          },
          verifiers: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: [
              "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
              "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
            ],
          },
        },
      },
      inboundLanes: {
        "arbitrum-mainnet": {
          internalId: "arbitrum-mainnet",
          chainId: 42161,
          selector: "4949039107694359620",
          rateLimits: {
            standard: {
              in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
              out: null,
            },
            custom: null,
          },
          fees: null,
          verifiers: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          },
        },
      },
    }

    expect(lbtcData.pool.version).toBe("2.0.0")
    expect(lbtcData.ccvConfig).not.toBeNull()
    expect(lbtcData.ccvConfig?.thresholdAmount).toBeDefined()
    expect(parseInt(lbtcData.ccvConfig?.thresholdAmount || "0")).toBeGreaterThan(0)
    const outboundLane = lbtcData.outboundLanes["arbitrum-mainnet"]
    expect(outboundLane.verifiers).not.toBeNull()
    expect(outboundLane.verifiers!.aboveThreshold!.length).toBeGreaterThan(
      outboundLane.verifiers!.belowThreshold!.length
    )
    expect(outboundLane.rateLimits.standard).not.toBeNull()
    expect(outboundLane.rateLimits.custom).not.toBeNull()
    expect(outboundLane.fees).not.toBeNull()
  })

  it("should represent v1.6 pool (DAI) with CCV features disabled", () => {
    // v1.6 pool - CCV features disabled (no ccvConfig, verifiers null)
    const daiData: TokenDirectoryData = {
      internalId: "mainnet",
      chainId: 1,
      selector: "5009297550715157269",
      token: {
        address: "0x6B175474E89094C44Da98b954EesddFfcd2bE3F5",
        decimals: 18,
      },
      pool: {
        address: "0xDaiPool",
        rawType: "LockReleaseTokenPool",
        type: "lockRelease",
        version: "1.6.0", // v1.6 pool
        advancedPoolHooks: null,
        supportsV2Features: false, // v1.x pool does NOT support v2 features
      },
      ccvConfig: null, // No CCV config for v1.x pools
      customFinality: null, // v1.x pool - feature not supported
      outboundLanes: {
        "arbitrum-mainnet": {
          internalId: "arbitrum-mainnet",
          chainId: 42161,
          selector: "4949039107694359620",
          rateLimits: {
            standard: {
              in: { capacity: "5000000000000000000000", rate: "1670000000000000000", isEnabled: true },
              out: { capacity: "5000000000000000000000", rate: "1670000000000000000", isEnabled: true },
            },
            custom: null,
          },
          fees: null,
          verifiers: null,
        },
      },
      inboundLanes: {},
    }

    expect(daiData.pool.version).toBe("1.6.0")
    expect(daiData.pool.supportsV2Features).toBe(false)
    expect(daiData.ccvConfig).toBeNull()
    expect(daiData.customFinality).toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].verifiers).toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].rateLimits.standard).not.toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].rateLimits.custom).toBeNull()
  })
})

describe("Version-conditional API behavior", () => {
  describe("v1.x pool response format", () => {
    it("should have null ccvConfig and customFinality for v1.x pools", () => {
      const v1PoolData: TokenDirectoryData = {
        internalId: "mainnet",
        chainId: 1,
        selector: "5009297550715157269",
        token: { address: "0x...", decimals: 18 },
        pool: {
          address: "0x...",
          rawType: "LockReleaseTokenPool",
          type: "lockRelease",
          version: "1.6.0",
          advancedPoolHooks: null,
          supportsV2Features: false, // v1.x pool does NOT support v2 features
        },
        ccvConfig: null, // Must be null for v1.x (feature not supported)
        customFinality: null, // Must be null for v1.x (feature not supported)
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(v1PoolData.pool.supportsV2Features).toBe(false)
      expect(v1PoolData.ccvConfig).toBeNull()
      expect(v1PoolData.customFinality).toBeNull()
    })

    it("should have null verifiers for v1.x pools", () => {
      const lane: TokenDirectoryLane = {
        internalId: "arbitrum-mainnet",
        chainId: 42161,
        selector: "4949039107694359620",
        rateLimits: { standard: null, custom: null },
        fees: null,
        verifiers: null,
      }

      expect(lane.verifiers).toBeNull()
    })
  })

  describe("v2.0+ pool response format", () => {
    it("should have ccvConfig with thresholdAmount for v2.0+ pools", () => {
      const v2PoolData: TokenDirectoryData = {
        internalId: "mainnet",
        chainId: 1,
        selector: "5009297550715157269",
        token: { address: "0x...", decimals: 8 },
        pool: {
          address: "0x...",
          rawType: "BurnMintTokenPool",
          type: "burnMint",
          version: "2.0.0",
          advancedPoolHooks: null,
          supportsV2Features: true,
        },
        ccvConfig: { thresholdAmount: "100000000000" }, // Present for v2.0+
        customFinality: {
          hasCustomFinality: true,
          minBlockConfirmation: 5,
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(v2PoolData.ccvConfig).not.toBeNull()
      expect(v2PoolData.ccvConfig?.thresholdAmount).toBeDefined()
      expect(v2PoolData.customFinality?.hasCustomFinality).toBe(true)
    })

    it("should have aboveThreshold include additional verifiers for v2.0+ pools", () => {
      const lane: TokenDirectoryLane = {
        internalId: "arbitrum-mainnet",
        chainId: 42161,
        selector: "4949039107694359620",
        rateLimits: {
          standard: {
            in: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
            out: { capacity: "12000000000000", rate: "3330000000", isEnabled: true },
          },
          custom: {
            in: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
            out: { capacity: "24000000000000", rate: "6660000000", isEnabled: true },
          },
        },
        fees: { standardTransferFeeBps: 10, customTransferFeeBps: 25 },
        verifiers: {
          belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        },
      }

      expect(lane.verifiers).not.toBeNull()
      expect(lane.verifiers!.aboveThreshold!.length).toBeGreaterThan(lane.verifiers!.belowThreshold!.length)
      lane.verifiers!.belowThreshold!.forEach((v) => {
        expect(lane.verifiers!.aboveThreshold).toContain(v)
      })
    })
  })
})

describe("CustomFinalityConfig structure", () => {
  it("should have hasCustomFinality and minBlockConfirmation", () => {
    const config: CustomFinalityConfig = {
      hasCustomFinality: true,
      minBlockConfirmation: 5,
    }

    expect(config.hasCustomFinality).toBe(true)
    expect(config.minBlockConfirmation).toBe(5)
  })

  it("should allow null values when data is unavailable", () => {
    const config: CustomFinalityConfig = {
      hasCustomFinality: null,
      minBlockConfirmation: null,
    }

    expect(config.hasCustomFinality).toBeNull()
    expect(config.minBlockConfirmation).toBeNull()
  })

  it("should have hasCustomFinality=false when minBlockConfirmation is 0", () => {
    const config: CustomFinalityConfig = {
      hasCustomFinality: false,
      minBlockConfirmation: 0,
    }

    expect(config.hasCustomFinality).toBe(false)
    expect(config.minBlockConfirmation).toBe(0)
  })

  it("should derive hasCustomFinality from minBlockConfirmation > 0", () => {
    // hasCustomFinality = true when minBlockConfirmation > 0
    const enabledConfig: CustomFinalityConfig = {
      hasCustomFinality: true,
      minBlockConfirmation: 3,
    }
    expect(enabledConfig.hasCustomFinality).toBe(enabledConfig.minBlockConfirmation! > 0)

    // hasCustomFinality = false when minBlockConfirmation = 0
    const disabledConfig: CustomFinalityConfig = {
      hasCustomFinality: false,
      minBlockConfirmation: 0,
    }
    expect(disabledConfig.hasCustomFinality).toBe(disabledConfig.minBlockConfirmation! > 0)
  })
})
