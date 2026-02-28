import { describe, it, expect, jest } from "@jest/globals"
import {
  validateEnvironment,
  validateFilters,
  validateOutputKey,
  validateEnrichFeeTokens,
  validateInternalIdFormat,
  createMetadata,
  CCIPError,
  handleApiError,
} from "~/lib/ccip/utils.ts"
import type { Environment } from "../config/data/ccip/types.ts"
import { ChainDataService } from "~/lib/ccip/services/chain-data.ts"
import { mockReferenceData } from "../__mocks__/chainMock.ts"

// Mock the Environment enum
jest.mock("../config/data/ccip/types", () => ({
  Environment: {
    Mainnet: "mainnet",
    Testnet: "testnet",
  },
}))

// Mock the loadReferenceData function
jest.mock("../config/data/ccip", () => ({
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

// Mock the logger
jest.mock("../lib/logging", () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock selectors
jest.mock("../config/data/ccip/selectors", () => ({
  getSelectorEntry: jest.fn(() => ({
    selector: "5009297550715157269",
    name: "ethereum-mainnet",
  })),
}))

// Mock the token data
jest.mock("../config/data/ccip/data", () => ({
  getTokenData: jest.fn((params: { tokenId: string; environment: string; version: string }) => {
    const { tokenId } = params
    return {
      "ethereum-mainnet": {
        symbol: tokenId,
        name: tokenId === "LINK" ? "Chainlink" : tokenId === "WETH" ? "Wrapped Ether" : "GHO",
        tokenAddress:
          tokenId === "LINK"
            ? "0x514910771AF9Ca656af840dff83E8264EcF986CA"
            : tokenId === "WETH"
              ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
              : "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
        decimals: 18,
        poolAddress: "0x1234567890123456789012345678901234567890",
      },
    }
  }),
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

  describe("validateEnrichFeeTokens", () => {
    it("should accept true", () => {
      expect(validateEnrichFeeTokens("true")).toBe(true)
      expect(validateEnrichFeeTokens("TRUE")).toBe(true)
      expect(validateEnrichFeeTokens("True")).toBe(true)
    })

    it("should accept false", () => {
      expect(validateEnrichFeeTokens("false")).toBe(false)
      expect(validateEnrichFeeTokens("FALSE")).toBe(false)
      expect(validateEnrichFeeTokens("False")).toBe(false)
    })

    it("should default to false when undefined", () => {
      expect(validateEnrichFeeTokens(undefined)).toBe(false)
    })

    it("should throw error for invalid values", () => {
      expect(() => validateEnrichFeeTokens("yes")).toThrow(CCIPError)
      expect(() => validateEnrichFeeTokens("no")).toThrow(CCIPError)
      expect(() => validateEnrichFeeTokens("1")).toThrow(CCIPError)
      expect(() => validateEnrichFeeTokens("0")).toThrow(CCIPError)
    })
  })

  describe("validateInternalIdFormat", () => {
    it("should accept 'selector' format", () => {
      expect(validateInternalIdFormat("selector")).toBe("selector")
    })

    it("should accept 'directory' format", () => {
      expect(validateInternalIdFormat("directory")).toBe("directory")
    })

    it("should default to 'selector' when undefined", () => {
      expect(validateInternalIdFormat(undefined)).toBe("selector")
    })

    it("should throw error for invalid values", () => {
      expect(() => validateInternalIdFormat("invalid")).toThrow(CCIPError)
      expect(() => validateInternalIdFormat("chainId")).toThrow(CCIPError)
      expect(() => validateInternalIdFormat("selectorName")).toThrow(CCIPError)
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
      const response = handleApiError(error, "test-request-id")
      expect(response).toBeInstanceOf(Response)
      const data = await response.json()
      expect(data).toEqual({
        error: "VALIDATION_ERROR",
        message: "Bad Request",
        requestId: "test-request-id",
        details: {},
      })
      expect(response.status).toBe(400)
    })

    it("should handle unknown errors", async () => {
      const error = new Error("Unknown")
      const response = handleApiError(error, "test-request-id")
      expect(response).toBeInstanceOf(Response)
      const data = await response.json()
      expect(data).toEqual({
        error: "UNKNOWN_ERROR",
        message: "Unknown",
        requestId: "test-request-id",
        details: {},
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

    describe("with enrichFeeTokens parameter", () => {
      it("should return fee tokens as string array when enrichFeeTokens is false (default)", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, {}, false)
        expect(result.data.evm.length).toBe(1)
        const chain = result.data.evm[0]
        expect(Array.isArray(chain.feeTokens)).toBe(true)
        expect(chain.feeTokens).toEqual(["GHO", "LINK", "WETH"])
        // Verify they are strings
        chain.feeTokens.forEach((token) => {
          expect(typeof token).toBe("string")
        })
      })

      it("should return fee tokens as string array when enrichFeeTokens is not provided", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, {})
        expect(result.data.evm.length).toBe(1)
        const chain = result.data.evm[0]
        expect(Array.isArray(chain.feeTokens)).toBe(true)
        expect(chain.feeTokens).toEqual(["GHO", "LINK", "WETH"])
        // Verify they are strings
        chain.feeTokens.forEach((token) => {
          expect(typeof token).toBe("string")
        })
      })

      it("should return enriched fee tokens when enrichFeeTokens is true", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, {}, true)
        expect(result.data.evm.length).toBe(1)
        const chain = result.data.evm[0]
        expect(Array.isArray(chain.feeTokens)).toBe(true)
        expect(chain.feeTokens.length).toBeGreaterThan(0)

        // Verify they are enriched objects
        chain.feeTokens.forEach((token) => {
          expect(typeof token).toBe("object")
          expect(token).toHaveProperty("symbol")
          expect(token).toHaveProperty("name")
          expect(token).toHaveProperty("address")
          expect(token).toHaveProperty("decimals")
          // Ensure no logo property
          expect(token).not.toHaveProperty("logo")
        })
      })

      it("should have correct structure for enriched LINK token", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, {}, true)
        const chain = result.data.evm[0]
        const linkToken = chain.feeTokens.find((t) => typeof t === "object" && t.symbol === "LINK")

        expect(linkToken).toBeDefined()
        expect(linkToken).toEqual({
          symbol: "LINK",
          name: "Chainlink",
          address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          decimals: 18,
        })
      })

      it("should have correct structure for enriched WETH token", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, {}, true)
        const chain = result.data.evm[0]
        const wethToken = chain.feeTokens.find((t) => typeof t === "object" && t.symbol === "WETH")

        expect(wethToken).toBeDefined()
        expect(wethToken).toEqual({
          symbol: "WETH",
          name: "Wrapped Ether",
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: 18,
        })
      })

      it("should maintain backward compatibility with existing filters when enriching", async () => {
        const result = await service.getFilteredChains(ENV.Mainnet, { chainId: "1" }, true)
        expect(result.data.evm.length).toBe(1)
        const chain = result.data.evm[0]
        expect(chain.chainId).toBe(1)
        expect(Array.isArray(chain.feeTokens)).toBe(true)
        expect(chain.feeTokens.length).toBeGreaterThan(0)
        // Verify enriched
        chain.feeTokens.forEach((token) => {
          expect(typeof token).toBe("object")
          expect(token).toHaveProperty("address")
        })
      })
    })
  })
})
