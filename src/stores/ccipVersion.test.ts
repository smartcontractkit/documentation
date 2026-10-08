import { beforeEach, describe, expect, test } from "@jest/globals"
import { initializeCcipVersion, selectedCcipVersion } from "./ccipVersion.js"

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

const CCIP_VERSION_KEY = "chainlink-docs-ccip-version"

function setPathname(pathname: string) {
  ;(globalThis as any).window = { location: { pathname } }
}

describe("initializeCcipVersion", () => {
  beforeEach(() => {
    ;(globalThis as any).localStorage = new LocalStorageMock()
    selectedCcipVersion.set("v2.0")
  })

  test("/ccip overwrites localStorage to latest", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v1.6")
    setPathname("/ccip")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v2.0")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v2.0")
  })

  test("canonical v2 routes overwrite localStorage to latest", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v1.6")
    setPathname("/ccip/concepts/architecture/overview")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v2.0")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v2.0")
  })

  test("v1 routes initialize to v1 and write localStorage", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v2.0")
    setPathname("/ccip/v1/ton/tutorials")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v1.6")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v1.6")
  })

  test("directory routes remain localStorage-driven", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v1.6")
    setPathname("/ccip/directory/mainnet")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v1.6")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v1.6")
  })

  test("/ccip/api-reference remains localStorage-driven", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v1.6")
    setPathname("/ccip/api-reference")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v1.6")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v1.6")
  })

  test("versioned api-reference URLs are URL-driven (v2)", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v1.6")
    setPathname("/ccip/evm/api-reference/v2.0.0/overview")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v2.0")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v2.0")
  })

  test("versioned api-reference URLs are URL-driven (v1)", () => {
    localStorage.setItem(CCIP_VERSION_KEY, "v2.0")
    setPathname("/ccip/v1/ton/api-reference/v1.6.0/messages")

    initializeCcipVersion()

    expect(selectedCcipVersion.get()).toBe("v1.6")
    expect(localStorage.getItem(CCIP_VERSION_KEY)).toBe("v1.6")
  })
})
