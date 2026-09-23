import { describe, it, expect } from "@jest/globals"
import { formatCcvThreshold } from "../ccv-formatter.ts"

describe("formatCcvThreshold", () => {
  it("returns '0' for null/undefined/empty/'0' inputs", () => {
    expect(formatCcvThreshold(null, 18)).toBe("0")
    expect(formatCcvThreshold(undefined, 18)).toBe("0")
    expect(formatCcvThreshold("", 18)).toBe("0")
    expect(formatCcvThreshold("0", 18)).toBe("0")
  })

  it("formats an 18-decimal value as a whole token amount", () => {
    // 1 token = 1e18 smallest units
    expect(formatCcvThreshold("1000000000000000000", 18)).toBe("1")
    // 1,000 tokens
    expect(formatCcvThreshold("1000000000000000000000", 18)).toBe("1,000")
  })

  it("formats a 6-decimal (USDC-style) value correctly", () => {
    // 1 USDC = 1e6
    expect(formatCcvThreshold("1000000", 6)).toBe("1")
    // 1,000 USDC
    expect(formatCcvThreshold("1000000000", 6)).toBe("1,000")
  })

  it("formats an 8-decimal (BTC-style) value correctly", () => {
    // 1 BTC = 1e8
    expect(formatCcvThreshold("100000000", 8)).toBe("1")
  })

  it("trims trailing zeros after the decimal point (max 2 decimal places)", () => {
    // 1.5 tokens with 18 decimals = 1500000000000000000
    expect(formatCcvThreshold("1500000000000000000", 18)).toBe("1.5")
    // 1.25 tokens
    expect(formatCcvThreshold("1250000000000000000", 18)).toBe("1.25")
    // 1.256 tokens → capped to 1.26 (2 decimal places)
    expect(formatCcvThreshold("1256000000000000000", 18)).toBe("1.26")
  })

  it("shows '0' for dust values below 2 decimal places", () => {
    // 10 wei with 18 decimals = 0.00000000000000001 → shows as "0"
    expect(formatCcvThreshold("10", 18)).toBe("0")
    // 999 wei with 18 decimals = 0.000000000000000999 → shows as "0"
    expect(formatCcvThreshold("999", 18)).toBe("0")
  })

  it("applies thousand separators to the whole-number part", () => {
    // 1,234,567.89 tokens with 18 decimals = 1234567890000000000000000 (24 digits)
    expect(formatCcvThreshold("1234567890000000000000000", 18)).toBe("1,234,567.89")
  })

  it("defaults to 18 decimals when decimals is omitted", () => {
    expect(formatCcvThreshold("1000000000000000000")).toBe("1")
  })

  it("falls back to the raw value if it cannot be parsed as an integer", () => {
    // Non-numeric / decimal input — formatUnits would throw, so we return raw.
    expect(formatCcvThreshold("not-a-number", 18)).toBe("not-a-number")
    expect(formatCcvThreshold("1.5e18", 18)).toBe("1.5e18")
  })
})
