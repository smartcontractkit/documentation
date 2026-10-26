import { describe, it, expect } from "@jest/globals"
import { validateInternalIdFormat, CCIPError } from "~/lib/ccip/utils.ts"

describe("validateInternalIdFormat", () => {
  describe("valid inputs", () => {
    it("should accept 'selector' format", () => {
      expect(validateInternalIdFormat("selector")).toBe("selector")
    })

    it("should accept 'directory' format", () => {
      expect(validateInternalIdFormat("directory")).toBe("directory")
    })
  })

  describe("default behavior", () => {
    it("should default to 'selector' when undefined", () => {
      expect(validateInternalIdFormat(undefined)).toBe("selector")
    })

    it("should default to 'selector' for empty string", () => {
      // Empty string is falsy, should trigger default
      expect(validateInternalIdFormat("")).toBe("selector")
    })
  })

  describe("invalid inputs", () => {
    it("should throw CCIPError for 'invalid'", () => {
      expect(() => validateInternalIdFormat("invalid")).toThrow(CCIPError)
    })

    it("should throw CCIPError for 'chainId'", () => {
      expect(() => validateInternalIdFormat("chainId")).toThrow(CCIPError)
    })

    it("should throw CCIPError for 'selectorName'", () => {
      expect(() => validateInternalIdFormat("selectorName")).toThrow(CCIPError)
    })

    it("should throw CCIPError for 'internal'", () => {
      expect(() => validateInternalIdFormat("internal")).toThrow(CCIPError)
    })

    it("should throw CCIPError for 'SELECTOR' (case-sensitive)", () => {
      expect(() => validateInternalIdFormat("SELECTOR")).toThrow(CCIPError)
    })

    it("should throw CCIPError for 'DIRECTORY' (case-sensitive)", () => {
      expect(() => validateInternalIdFormat("DIRECTORY")).toThrow(CCIPError)
    })
  })

  describe("error details", () => {
    it("should throw CCIPError with correct message", () => {
      try {
        validateInternalIdFormat("invalid")
        fail("Expected CCIPError to be thrown")
      } catch (error) {
        expect(error).toBeInstanceOf(CCIPError)
        const ccipError = error as CCIPError
        expect(ccipError.message).toBe('internalIdFormat must be "directory" or "selector".')
        expect(ccipError.statusCode).toBe(400)
      }
    })
  })
})
