import { describe, expect, it } from "@jest/globals"
import type {
  LaneVerifiers,
  TokenDirectoryData,
  TokenDirectoryLane,
  TokenFees,
  TokenRateLimits,
} from "~/lib/ccip/types/index.ts"

describe("Token Directory Types", () => {
  describe("TokenDirectoryData", () => {
    it("uses pool as the single finality and CCV source", () => {
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
          version: "2.0.0",
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
      }

      expect(data.pool.capabilities.supportsV2Features).toBe(true)
      expect(data.pool.finality.finalityDepth).toBe(5)
      expect(data.pool.finality.finalitySafe).toBe(true)
      expect(data.pool.ccv.thresholdAmount).toBe("100000000000")
      expect(data.pool.hook).toBeNull()
    })

    it("supports v1 pools with null finality and null threshold", () => {
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
            supportsV2Features: false,
          },
          finality: {
            finalityDepth: null,
            finalitySafe: null,
          },
          ccv: {
            thresholdAmount: null,
          },
        },
      }

      expect(data.pool.capabilities.supportsV2Features).toBe(false)
      expect(data.pool.finality.finalityDepth).toBeNull()
      expect(data.pool.ccv.thresholdAmount).toBeNull()
    })
  })

  describe("TokenDirectoryLane", () => {
    it("supports full lane data with fees and verifiers", () => {
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

      expect(lane.rateLimits.standard?.out?.isEnabled).toBe(true)
      expect(lane.rateLimits.custom?.in?.isEnabled).toBe(true)
      expect(lane.fees?.standardTransferFeeBps).toBe(10)
      expect(lane.verifiers?.belowThreshold).toHaveLength(1)
      expect(lane.verifiers?.aboveThreshold).toHaveLength(2)
    })

    it("supports unavailable lane data shape", () => {
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

  describe("Shared lane helper types", () => {
    it("validates verifier set behavior", () => {
      const verifiers: LaneVerifiers = {
        belowThreshold: ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"],
        aboveThreshold: [
          "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
          "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
          "0xcBD48A8eB077381c3c4Eb36b402d7283aB2b11Bc",
        ],
      }

      verifiers.belowThreshold?.forEach((verifier) => {
        expect(verifiers.aboveThreshold).toContain(verifier)
      })
    })

    it("allows null verifiers for downstream errors", () => {
      const verifiers: LaneVerifiers = {
        belowThreshold: null,
        aboveThreshold: null,
      }

      expect(verifiers.belowThreshold).toBeNull()
      expect(verifiers.aboveThreshold).toBeNull()
    })

    it("supports shared rate limit and fee types", () => {
      const rateLimits: TokenRateLimits = {
        standard: {
          in: { capacity: "1000", rate: "10", isEnabled: true },
          out: { capacity: "2000", rate: "20", isEnabled: true },
        },
        custom: null,
      }

      const fees: TokenFees = {
        standardTransferFeeBps: 5,
        customTransferFeeBps: 15,
      }

      expect(rateLimits.standard?.in?.capacity).toBe("1000")
      expect(rateLimits.custom).toBeNull()
      expect(fees.customTransferFeeBps).toBe(15)
    })
  })
})
