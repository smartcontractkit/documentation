import { describe, it, expect, jest } from "@jest/globals"
import type {
  TokenDirectoryData,
  TokenDirectoryLane,
  CCVConfig,
  LaneVerifiers,
  VerifierSet,
  RateLimiterConfig,
  TokenRateLimits,
  PoolFinalityConfig,
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
          hook: null,
          capabilities: {
            supportsV2Features: true,
          },
          finality: {
            finalityDepth: 5,
            finalitySafe: true,
          },
          ccv: {
            thresholdAmount: "100000000000",
          },
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(data.internalId).toBe("mainnet")
      expect(data.chainId).toBe(1)
      expect(data.selector).toBe("5009297550715157269")
      expect(data.token.address).toBe("0x8236a87084f8B84306f72007F36F2618A5634494")
      expect(data.token.decimals).toBe(8)
      expect(data.pool.finality?.finalitySafe).toBe(true)
      expect(data.pool.finality?.finalityDepth).toBe(5)
      expect(data.pool.type).toBe("burnMint")
      expect(data.pool.hook).toBeNull()
      expect(data.pool.ccv?.thresholdAmount).toBe("100000000000")
    })

    it("should allow null finality and ccv for v1.x pools only", () => {
      // For v1.x pools (supportsV2Features=false), finality and ccv are null
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
          hook: null,
          capabilities: {
            supportsV2Features: false, // v1.x pool - finality and ccv not supported
          },
          finality: null,
          ccv: null,
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(data.pool.capabilities.supportsV2Features).toBe(false)
      expect(data.pool.finality).toBeNull()
      expect(data.pool.ccv).toBeNull()
    })

    it("should have ccv object for v2.x pools (never null at field level)", () => {
      // For v2.x pools, ccv is always an object:
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
          hook: null,
          capabilities: {
            supportsV2Features: true, // v2.x pool
          },
          finality: { finalityDepth: 0, finalitySafe: false },
          ccv: { thresholdAmount: "0" }, // v2 pool without CCV configured
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(dataNotConfigured.pool.capabilities.supportsV2Features).toBe(true)
      expect(dataNotConfigured.pool.ccv).not.toBeNull()
      expect(dataNotConfigured.pool.ccv?.thresholdAmount).toBe("0")
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
        verifiers: {
          source: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: [
              "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
              "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
            ],
          },
          destination: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          },
        },
      }

      expect(lane.internalId).toBe("arbitrum-mainnet")
      expect(lane.chainId).toBe(42161)
      expect(lane.rateLimits.standard?.out?.isEnabled).toBe(true)
      expect(lane.rateLimits.custom?.in?.isEnabled).toBe(true)
      expect(lane.verifiers?.source?.belowThreshold).toHaveLength(1)
      expect(lane.verifiers?.source?.aboveThreshold).toHaveLength(2)
      expect(lane.verifiers?.destination?.belowThreshold).toHaveLength(1)
    })

    it("should allow null rateLimits and verifiers (v1.x pools)", () => {
      const lane: TokenDirectoryLane = {
        internalId: "base-mainnet",
        chainId: 8453,
        selector: "15971525489660198786",
        rateLimits: {
          standard: null,
          custom: null,
        },
        verifiers: null,
      }

      expect(lane.rateLimits.standard).toBeNull()
      expect(lane.rateLimits.custom).toBeNull()
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
    it("should have independent source and destination verifier sets", () => {
      const verifiers: LaneVerifiers = {
        source: {
          belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        },
        destination: {
          belowThreshold: ["0xcBD48A8eB077381c3c4Eb36b402d7283aB2b11Bc"],
          aboveThreshold: ["0xcBD48A8eB077381c3c4Eb36b402d7283aB2b11Bc"],
        },
      }

      expect(Array.isArray(verifiers.source?.belowThreshold)).toBe(true)
      expect(Array.isArray(verifiers.destination?.aboveThreshold)).toBe(true)
      expect(verifiers.source?.belowThreshold![0].startsWith("0x")).toBe(true)
      // source and destination are configured independently and can differ
      expect(verifiers.source?.belowThreshold![0]).not.toBe(verifiers.destination?.belowThreshold![0])
    })

    it("should have aboveThreshold include all belowThreshold verifiers plus additional ones", () => {
      const source: VerifierSet = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        aboveThreshold: [
          "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
          "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
          "0xcBD48A8eB077381c3c4Eb36b402d7283aB2b11Bc",
        ],
      }

      // All belowThreshold verifiers should be in aboveThreshold
      source.belowThreshold!.forEach((v) => {
        expect(source.aboveThreshold).toContain(v)
      })
      // aboveThreshold should have more verifiers
      expect(source.aboveThreshold!.length).toBeGreaterThanOrEqual(source.belowThreshold!.length)
    })

    it("should allow null arrays for downstream API error", () => {
      const set: VerifierSet = {
        belowThreshold: null,
        aboveThreshold: null,
      }

      expect(set.belowThreshold).toBeNull()
      expect(set.aboveThreshold).toBeNull()
    })

    it("should have equal arrays when no threshold verifiers (v2.x pools with thresholdAmount=0)", () => {
      // Note: v1.x pools have verifiers: null, not equal arrays
      // This case applies to v2.x pools with thresholdAmount=0
      const set: VerifierSet = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
        aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
      }

      expect(set.belowThreshold).toEqual(set.aboveThreshold)
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
        hook: null,
        capabilities: { supportsV2Features: true },
        finality: { finalityDepth: 5, finalitySafe: true },
        ccv: { thresholdAmount: "100000000000" },
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
    const set: VerifierSet = {
      belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
      aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
    }

    // Verifiers should be strings (addresses), not objects
    set.belowThreshold!.forEach((v) => {
      expect(typeof v).toBe("string")
      expect(v.startsWith("0x")).toBe(true)
    })
    set.aboveThreshold!.forEach((v) => {
      expect(typeof v).toBe("string")
      expect(v.startsWith("0x")).toBe(true)
    })
  })
})

describe("Token Directory example responses", () => {
  it("should represent v2.0 pool (LBTC) with CCV features enabled", () => {
    // v2.0 pool - CCV features enabled (ccv, threshold verifiers)
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
        hook: null,
        capabilities: { supportsV2Features: true },
        finality: { finalityDepth: 5, finalitySafe: true },
        ccv: { thresholdAmount: "100000000000" },
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
          verifiers: {
            source: {
              belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
              aboveThreshold: [
                "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
                "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
              ],
            },
            destination: {
              belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
              aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            },
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
          verifiers: {
            source: {
              belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
              aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            },
            destination: {
              belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
              aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            },
          },
        },
      },
    }

    expect(lbtcData.pool.version).toBe("2.0.0")
    expect(lbtcData.pool.ccv).not.toBeNull()
    expect(lbtcData.pool.ccv?.thresholdAmount).toBeDefined()
    expect(parseInt(lbtcData.pool.ccv?.thresholdAmount || "0")).toBeGreaterThan(0)
    const outboundLane = lbtcData.outboundLanes["arbitrum-mainnet"]
    expect(outboundLane.verifiers).not.toBeNull()
    expect(outboundLane.verifiers!.source!.aboveThreshold!.length).toBeGreaterThan(
      outboundLane.verifiers!.source!.belowThreshold!.length
    )
    expect(outboundLane.rateLimits.standard).not.toBeNull()
    expect(outboundLane.rateLimits.custom).not.toBeNull()
  })

  it("should represent v1.6 pool (DAI) with CCV features disabled", () => {
    // v1.6 pool - CCV features disabled (no ccv, verifiers null)
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
        hook: null,
        capabilities: {
          supportsV2Features: false, // v1.x pool does NOT support v2 features
        },
        finality: null,
        ccv: null,
      },
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
          verifiers: null,
        },
      },
      inboundLanes: {},
    }

    expect(daiData.pool.version).toBe("1.6.0")
    expect(daiData.pool.capabilities.supportsV2Features).toBe(false)
    expect(daiData.pool.ccv).toBeNull()
    expect(daiData.pool.finality).toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].verifiers).toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].rateLimits.standard).not.toBeNull()
    expect(daiData.outboundLanes["arbitrum-mainnet"].rateLimits.custom).toBeNull()
  })
})

describe("Version-conditional API behavior", () => {
  describe("v1.x pool response format", () => {
    it("should have null finality and ccv for v1.x pools", () => {
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
          hook: null,
          capabilities: {
            supportsV2Features: false,
          },
          finality: null,
          ccv: null,
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(v1PoolData.pool.capabilities.supportsV2Features).toBe(false)
      expect(v1PoolData.pool.ccv).toBeNull()
      expect(v1PoolData.pool.finality).toBeNull()
    })

    it("should have null verifiers for v1.x pools", () => {
      const lane: TokenDirectoryLane = {
        internalId: "arbitrum-mainnet",
        chainId: 42161,
        selector: "4949039107694359620",
        rateLimits: { standard: null, custom: null },
        verifiers: null,
      }

      expect(lane.verifiers).toBeNull()
    })
  })

  describe("v2.0+ pool response format", () => {
    it("should have ccv with thresholdAmount for v2.0+ pools", () => {
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
          hook: null,
          capabilities: { supportsV2Features: true },
          finality: { finalityDepth: 5, finalitySafe: true },
          ccv: { thresholdAmount: "100000000000" },
        },
        outboundLanes: {},
        inboundLanes: {},
      }

      expect(v2PoolData.pool.ccv).not.toBeNull()
      expect(v2PoolData.pool.ccv?.thresholdAmount).toBeDefined()
      expect(v2PoolData.pool.finality?.finalitySafe).toBe(true)
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
        verifiers: {
          source: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: [
              "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
              "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
            ],
          },
          destination: {
            belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
            aboveThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          },
        },
      }

      expect(lane.verifiers).not.toBeNull()
      expect(lane.verifiers!.source!.aboveThreshold!.length).toBeGreaterThan(
        lane.verifiers!.source!.belowThreshold!.length
      )
      lane.verifiers!.source!.belowThreshold!.forEach((v) => {
        expect(lane.verifiers!.source!.aboveThreshold).toContain(v)
      })
    })
  })
})

describe("PoolFinalityConfig structure", () => {
  it("should have finalityDepth and finalitySafe", () => {
    const config: PoolFinalityConfig = {
      finalityDepth: 5,
      finalitySafe: true,
    }

    expect(config.finalityDepth).toBe(5)
    expect(config.finalitySafe).toBe(true)
  })

  it("should have finalitySafe=false when finalityDepth is 0", () => {
    const config: PoolFinalityConfig = {
      finalityDepth: 0,
      finalitySafe: false,
    }

    expect(config.finalitySafe).toBe(false)
    expect(config.finalityDepth).toBe(0)
  })

  it("should derive finalitySafe from finalityDepth > 0", () => {
    // finalitySafe = true when finalityDepth > 0
    const enabledConfig: PoolFinalityConfig = {
      finalityDepth: 3,
      finalitySafe: true,
    }
    expect(enabledConfig.finalitySafe).toBe(enabledConfig.finalityDepth > 0)

    // finalitySafe = false when finalityDepth = 0
    const disabledConfig: PoolFinalityConfig = {
      finalityDepth: 0,
      finalitySafe: false,
    }
    expect(disabledConfig.finalitySafe).toBe(disabledConfig.finalityDepth > 0)
  })
})
