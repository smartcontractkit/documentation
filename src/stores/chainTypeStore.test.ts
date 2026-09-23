import { beforeEach, describe, expect, test } from "@jest/globals"
import { initializeChainType, selectedChainType } from "./chainType.js"

class LocalStorageMock {
  private store = new Map<string, string>()

  clear() {
    this.store.clear()
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
}

const CHAIN_TYPE_KEY = "chainlink-docs-chain-type"

function setPathname(pathname: string) {
  ;(globalThis as any).window = { location: { pathname } }
}

describe("initializeChainType", () => {
  beforeEach(() => {
    ;(globalThis as any).localStorage = new LocalStorageMock()
    selectedChainType.set("evm")
  })

  test("/ccip preserves the stored chain (production parity)", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "canton")
    setPathname("/ccip")

    initializeChainType()

    expect(selectedChainType.get()).toBe("canton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("canton")
  })

  test("chainless canonical v2 routes preserve the stored chain", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "ton")
    setPathname("/ccip/concepts/architecture/overview")

    initializeChainType()

    expect(selectedChainType.get()).toBe("ton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("ton")
  })

  test("chainless v2 hub pages keep canton selected", () => {
    for (const pathname of ["/ccip/tutorials", "/ccip/concepts", "/ccip/concepts/fees-and-billing"]) {
      localStorage.setItem(CHAIN_TYPE_KEY, "canton")
      selectedChainType.set("evm")
      setPathname(pathname)

      initializeChainType()

      expect(selectedChainType.get()).toBe("canton")
      expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("canton")
    }
  })

  test("chainless routes default to evm when nothing is stored", () => {
    setPathname("/ccip/tutorials")

    initializeChainType()

    expect(selectedChainType.get()).toBe("evm")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBeNull()
  })

  test("explicit canton segment is URL-driven", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "evm")
    setPathname("/ccip/canton/getting-started")

    initializeChainType()

    expect(selectedChainType.get()).toBe("canton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("canton")
  })

  test("v1 ton routes initialize to ton and write localStorage", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "evm")
    setPathname("/ccip/v1/ton/tutorials")

    initializeChainType()

    expect(selectedChainType.get()).toBe("ton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("ton")
  })

  test("directory routes remain localStorage-driven", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "ton")
    setPathname("/ccip/directory/mainnet")

    initializeChainType()

    expect(selectedChainType.get()).toBe("ton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("ton")
  })

  test("/ccip/api-reference remains localStorage-driven", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "ton")
    setPathname("/ccip/api-reference")

    initializeChainType()

    expect(selectedChainType.get()).toBe("ton")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("ton")
  })

  test("explicit chain segments are URL-driven (v2 evm)", () => {
    localStorage.setItem(CHAIN_TYPE_KEY, "ton")
    setPathname("/ccip/evm/api-reference/v2.0.0/overview")

    initializeChainType()

    expect(selectedChainType.get()).toBe("evm")
    expect(localStorage.getItem(CHAIN_TYPE_KEY)).toBe("evm")
  })
})
