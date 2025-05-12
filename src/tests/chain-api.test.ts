import { describe, it, expect, jest } from "@jest/globals"
import {
  validateEnvironment,
  validateFilters,
  validateOutputKey,
  createMetadata,
  CCIPError,
  handleApiError,
} from "../pages/api/ccip/utils.ts"
import type { Environment } from "@config/data/ccip/types.ts"
import { ChainDataService } from "../pages/api/services/chain-data.ts"
import { mockReferenceData } from "../__mocks__/chainMock.ts"

// Mock the Environment enum
jest.mock("@config/data/ccip/types", () => ({
  Environment: {
    Mainnet: "mainnet",
    Testnet: "testnet",
  },
}))

// Mock the loadReferenceData function
jest.mock("@config/data/ccip", () => ({
  loadReferenceData: jest.fn(() => mockReferenceData),
  Environment: {
    Mainnet: "mainnet",
    Testnet: "testnet",
  },
}))

// Mock the chain utilities
jest.mock("../features/utils", () => ({
  getChainId: jest.fn(() => 1),
  getNativeCurrency: jest.fn(() => ({ symbol: "ETH" })),
  getTitle: jest.fn(() => "Ethereum"),
  directoryToSupportedChain: jest.fn(() => "ETHEREUM_MAINNET"),
  getChainTypeAndFamily: jest.fn(() => ({ chainType: "evm", chainFamily: "evm" })),
}))

// Define environment values that match the Environment type
const ENV: Record<string, Environment> = {
  Mainnet: "mainnet" as Environment,
  Testnet: "testnet" as Environment,
}

describe("CCIP Chain API Utils", () => {
  describe("validateEnvironment", () => {
    it("should accept valid environments", () => {
      expect(validateEnvironment(ENV.Mainnet)).toBe(ENV.Mainnet)
      expect(validateEnvironment(ENV.Testnet)).toBe(ENV.Testnet)
    })

    it("should throw error for invalid environment", () => {
      expect(() => validateEnvironment("invalid")).toThrow(CCIPError)
      expect(() => validateEnvironment(undefined)).toThrow(CCIPError)
    })
  })

  describe("validateFilters", () => {
    it("should accept single filter", () => {
      expect(() => validateFilters({ chainId: "1" })).not.toThrow()
      expect(() => validateFilters({ selector: "123" })).not.toThrow()
      expect(() => validateFilters({ internalId: "eth" })).not.toThrow()
    })

    it("should throw error for multiple filters", () => {
      expect(() => validateFilters({ chainId: "1", selector: "123" })).toThrow(CCIPError)
    })
  })

  describe("validateOutputKey", () => {
    it("should accept valid output keys", () => {
      expect(validateOutputKey("chainId")).toBe("chainId")
      expect(validateOutputKey("selector")).toBe("selector")
      expect(validateOutputKey("internalId")).toBe("internalId")
    })

    it("should default to chainId", () => {
      expect(validateOutputKey(undefined)).toBe("chainId")
    })

    it("should throw error for invalid output key", () => {
      expect(() => validateOutputKey("invalid")).toThrow(CCIPError)
    })
  })

  describe("createMetadata", () => {
    it("should create valid metadata", () => {
      const metadata = createMetadata(ENV.Mainnet)
      expect(metadata).toEqual({
        environment: ENV.Mainnet,
        timestamp: expect.any(String),
        requestId: expect.any(String),
        ignoredChainCount: 0,
        validChainCount: 0,
      })
    })
  })

  describe("handleApiError", () => {
    it("should handle CCIPError", async () => {
      const error = new CCIPError(400, "Bad Request")
      const response = handleApiError(error)
      expect(response).toBeInstanceOf(Response)
      const data = await response.json()
      expect(data).toEqual({
        error: "VALIDATION_ERROR",
        message: "Bad Request",
      })
      expect(response.status).toBe(400)
    })

    it("should handle unknown errors", async () => {
      const error = new Error("Unknown")
      const response = handleApiError(error)
      expect(response).toBeInstanceOf(Response)
      const data = await response.json()
      expect(data).toEqual({
        error: "UNKNOWN_ERROR",
        message: "Unknown",
      })
      expect(response.status).toBe(500)
    })
  })
})

describe("ChainDataService", () => {
  const service = new ChainDataService(mockReferenceData.chainsReferenceData)

  describe("getFilteredChains", () => {
    it("should return mainnet chains for mainnet environment", async () => {
      const result = await service.getFilteredChains(ENV.Mainnet, {})
      expect(result.data.evm.length).toBe(1)
      expect(result.data.evm[0].chainId).toBe(1)
    })

    it("should filter by chainId", async () => {
      const result = await service.getFilteredChains(ENV.Mainnet, { chainId: "1" })
      expect(result.data.evm.length).toBe(1)
      expect(result.data.evm[0].chainId).toBe(1)
    })

    it("should filter by selector", async () => {
      const result = await service.getFilteredChains(ENV.Mainnet, { selector: "5009297550715157269" })
      expect(result.data.evm.length).toBe(1)
      expect(result.data.evm[0].selector).toBe("5009297550715157269")
    })

    it("should filter by internalId", async () => {
      const result = await service.getFilteredChains(ENV.Mainnet, { internalId: "ethereum-mainnet" })
      expect(result.data.evm.length).toBe(1)
      expect(result.data.evm[0].internalId).toBe("ethereum-mainnet")
    })
  })
})
