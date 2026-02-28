import { describe, it, expect, jest, beforeEach } from "@jest/globals"
import { ChainIdentifierService } from "~/lib/ccip/services/chain-identifier.ts"
import { Environment } from "~/lib/ccip/types/index.ts"

// Mock the logger
jest.mock("../lib/logging", () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock the loadReferenceData function
jest.mock("../config/data/ccip", () => ({
  loadReferenceData: jest.fn(() => ({
    chainsReferenceData: {
      mainnet: {
        chainId: 1,
        feeTokens: ["LINK", "WETH"],
      },
      "bsc-mainnet": {
        chainId: 56,
        feeTokens: ["LINK", "WBNB"],
      },
      "matic-mainnet": {
        chainId: 137,
        feeTokens: ["LINK", "WMATIC"],
      },
      // A chain where directory key matches selector name (no mapping needed)
      "avalanche-mainnet": {
        chainId: 43114,
        feeTokens: ["LINK", "WAVAX"],
      },
    },
  })),
  Version: {
    V1_2_0: "1.2.0",
  },
}))

// Mock the chain utilities
jest.mock("../features/utils", () => ({
  directoryToSupportedChain: jest.fn((key: string) => {
    const mapping: Record<string, string> = {
      mainnet: "ETHEREUM_MAINNET",
      "bsc-mainnet": "BSC_MAINNET",
      "matic-mainnet": "POLYGON_MAINNET",
      "avalanche-mainnet": "AVALANCHE_MAINNET",
    }
    return mapping[key] || key.toUpperCase()
  }),
  getChainId: jest.fn((chain: string) => {
    const mapping: Record<string, number> = {
      ETHEREUM_MAINNET: 1,
      BSC_MAINNET: 56,
      POLYGON_MAINNET: 137,
      AVALANCHE_MAINNET: 43114,
    }
    return mapping[chain]
  }),
  getChainTypeAndFamily: jest.fn(() => ({ chainType: "evm", chainFamily: "evm" })),
}))

// Mock the selector entry lookup
jest.mock("../config/data/ccip/selectors", () => ({
  getSelectorEntry: jest.fn((chainId: number) => {
    const mapping: Record<number, { selector: string; name: string }> = {
      1: { selector: "5009297550715157269", name: "ethereum-mainnet" },
      56: { selector: "11344663589394136015", name: "binance_smart_chain-mainnet" },
      137: { selector: "4051577828743386545", name: "polygon-mainnet" },
      43114: { selector: "6433500567565415381", name: "avalanche-mainnet" },
    }
    return mapping[chainId]
  }),
}))

describe("ChainIdentifierService", () => {
  let service: ChainIdentifierService

  beforeEach(() => {
    service = new ChainIdentifierService("mainnet" as Environment, "selector")
  })

  describe("constructor", () => {
    it("should create service with default selector convention", () => {
      const svc = new ChainIdentifierService("mainnet" as Environment)
      expect(svc.getDefaultConvention()).toBe("selector")
    })

    it("should create service with specified directory convention", () => {
      const svc = new ChainIdentifierService("mainnet" as Environment, "directory")
      expect(svc.getDefaultConvention()).toBe("directory")
    })
  })

  describe("isDirectoryKey", () => {
    it("should return true for valid directory keys", () => {
      expect(service.isDirectoryKey("mainnet")).toBe(true)
      expect(service.isDirectoryKey("bsc-mainnet")).toBe(true)
      expect(service.isDirectoryKey("matic-mainnet")).toBe(true)
    })

    it("should return false for selector names that differ from directory keys", () => {
      expect(service.isDirectoryKey("ethereum-mainnet")).toBe(false)
      expect(service.isDirectoryKey("binance_smart_chain-mainnet")).toBe(false)
      expect(service.isDirectoryKey("polygon-mainnet")).toBe(false)
    })

    it("should return false for non-existent chains", () => {
      expect(service.isDirectoryKey("nonexistent-chain")).toBe(false)
    })
  })

  describe("isSelectorName", () => {
    it("should return true for selector names", () => {
      expect(service.isSelectorName("ethereum-mainnet")).toBe(true)
      expect(service.isSelectorName("binance_smart_chain-mainnet")).toBe(true)
    })

    it("should return true for directory keys (they are valid selector names too)", () => {
      // Because avalanche-mainnet has same directory key and selector name
      expect(service.isSelectorName("avalanche-mainnet")).toBe(true)
    })
  })

  describe("resolve", () => {
    it("should resolve directory key to both formats", () => {
      const result = service.resolve("mainnet")
      expect(result).not.toBeNull()
      expect(result!.directoryKey).toBe("mainnet")
      expect(result!.selectorName).toBe("ethereum-mainnet")
      expect(result!.inputConvention).toBe("directory")
    })

    it("should resolve selector name to both formats", () => {
      const result = service.resolve("ethereum-mainnet")
      expect(result).not.toBeNull()
      expect(result!.directoryKey).toBe("mainnet")
      expect(result!.selectorName).toBe("ethereum-mainnet")
      expect(result!.inputConvention).toBe("selector")
    })

    it("should resolve BSC directory key correctly", () => {
      const result = service.resolve("bsc-mainnet")
      expect(result).not.toBeNull()
      expect(result!.directoryKey).toBe("bsc-mainnet")
      expect(result!.selectorName).toBe("binance_smart_chain-mainnet")
      expect(result!.inputConvention).toBe("directory")
    })

    it("should resolve BSC selector name correctly", () => {
      const result = service.resolve("binance_smart_chain-mainnet")
      expect(result).not.toBeNull()
      expect(result!.directoryKey).toBe("bsc-mainnet")
      expect(result!.selectorName).toBe("binance_smart_chain-mainnet")
      expect(result!.inputConvention).toBe("selector")
    })

    it("should handle chains where directory key equals selector name", () => {
      // avalanche-mainnet has same name in both
      const result = service.resolve("avalanche-mainnet")
      expect(result).not.toBeNull()
      expect(result!.directoryKey).toBe("avalanche-mainnet")
      expect(result!.selectorName).toBe("avalanche-mainnet")
      expect(result!.inputConvention).toBe("directory")
    })

    it("should return null for unknown chains", () => {
      const result = service.resolve("unknown-chain")
      expect(result).toBeNull()
    })
  })

  describe("format", () => {
    it("should return directory key when format is directory", () => {
      expect(service.format("mainnet", "directory")).toBe("mainnet")
      expect(service.format("bsc-mainnet", "directory")).toBe("bsc-mainnet")
    })

    it("should return selector name when format is selector", () => {
      expect(service.format("mainnet", "selector")).toBe("ethereum-mainnet")
      expect(service.format("bsc-mainnet", "selector")).toBe("binance_smart_chain-mainnet")
    })

    it("should return directory key for unmapped chains when format is selector", () => {
      // If no mapping exists, should return the directory key as-is
      expect(service.format("avalanche-mainnet", "selector")).toBe("avalanche-mainnet")
    })
  })

  describe("getDirectoryKey", () => {
    it("should return directory key from either format", () => {
      expect(service.getDirectoryKey("mainnet")).toBe("mainnet")
      expect(service.getDirectoryKey("ethereum-mainnet")).toBe("mainnet")
      expect(service.getDirectoryKey("bsc-mainnet")).toBe("bsc-mainnet")
      expect(service.getDirectoryKey("binance_smart_chain-mainnet")).toBe("bsc-mainnet")
    })

    it("should return null for unknown chains", () => {
      expect(service.getDirectoryKey("unknown-chain")).toBeNull()
    })
  })

  describe("getSelectorName", () => {
    it("should return selector name from either format", () => {
      expect(service.getSelectorName("mainnet")).toBe("ethereum-mainnet")
      expect(service.getSelectorName("ethereum-mainnet")).toBe("ethereum-mainnet")
      expect(service.getSelectorName("bsc-mainnet")).toBe("binance_smart_chain-mainnet")
      expect(service.getSelectorName("binance_smart_chain-mainnet")).toBe("binance_smart_chain-mainnet")
    })

    it("should return null for unknown chains", () => {
      expect(service.getSelectorName("unknown-chain")).toBeNull()
    })
  })

  describe("detectConvention", () => {
    it("should detect directory convention from directory key", () => {
      expect(service.detectConvention("mainnet")).toBe("directory")
      expect(service.detectConvention("bsc-mainnet")).toBe("directory")
    })

    it("should detect selector convention from selector name", () => {
      expect(service.detectConvention("ethereum-mainnet")).toBe("selector")
      expect(service.detectConvention("binance_smart_chain-mainnet")).toBe("selector")
    })

    it("should detect convention from first valid identifier", () => {
      expect(service.detectConvention(undefined, "mainnet", "ethereum-mainnet")).toBe("directory")
      expect(service.detectConvention(undefined, "ethereum-mainnet", "mainnet")).toBe("selector")
    })

    it("should return default convention when no valid identifiers", () => {
      expect(service.detectConvention(undefined, undefined)).toBe("selector")
      expect(service.detectConvention("unknown-chain")).toBe("selector")
    })
  })

  describe("bidirectional mapping consistency", () => {
    it("should be able to round-trip from directory to selector and back", () => {
      const directoryKey = "mainnet"
      const resolved = service.resolve(directoryKey)
      expect(resolved).not.toBeNull()

      const selectorName = resolved!.selectorName
      const resolvedBack = service.resolve(selectorName)
      expect(resolvedBack).not.toBeNull()
      expect(resolvedBack!.directoryKey).toBe(directoryKey)
    })

    it("should be able to round-trip from selector to directory and back", () => {
      const selectorName = "binance_smart_chain-mainnet"
      const resolved = service.resolve(selectorName)
      expect(resolved).not.toBeNull()

      const directoryKey = resolved!.directoryKey
      const resolvedBack = service.resolve(directoryKey)
      expect(resolvedBack).not.toBeNull()
      expect(resolvedBack!.selectorName).toBe(selectorName)
    })
  })
})
