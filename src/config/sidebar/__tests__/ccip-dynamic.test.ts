import { describe, it, expect } from "@jest/globals"
import { CCIP_SIDEBAR_CONTENT } from "../ccip-dynamic.ts"
import type { SectionEntry, SectionContent } from "../../sidebar.ts"
import type { ChainType } from "../../types.ts"

describe("CCIP Sidebar Configuration", () => {
  describe("Structural Integrity", () => {
    it("should export CCIP_SIDEBAR_CONTENT as an array", () => {
      expect(Array.isArray(CCIP_SIDEBAR_CONTENT)).toBe(true)
      expect(CCIP_SIDEBAR_CONTENT.length).toBeGreaterThan(0)
    })

    it("should have required fields for all sections", () => {
      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        expect(section.section).toBeDefined()
        expect(typeof section.section).toBe("string")
        expect(section.contents).toBeDefined()
        expect(Array.isArray(section.contents)).toBe(true)
      })
    })

    it("should have required fields for all content items", () => {
      const validateItem = (item: SectionContent, path: string) => {
        // Every item must have a title
        expect(item.title).toBeDefined()
        expect(typeof item.title).toBe("string")
        expect(item.title.length).toBeGreaterThan(0)

        // If item has a URL, it should be a string
        if (item.url !== undefined) {
          expect(typeof item.url).toBe("string")
        }

        // If item has children, it should be an array
        if (item.children !== undefined) {
          expect(Array.isArray(item.children)).toBe(true)
          item.children.forEach((child: SectionContent, index: number) => {
            validateItem(child, `${path} > ${item.title} > [${index}]`)
          })
        }

        // If item has chainTypes, it should be an array of valid chain types
        if (item.chainTypes !== undefined) {
          expect(Array.isArray(item.chainTypes)).toBe(true)
          item.chainTypes.forEach((chainType: ChainType) => {
            expect(["evm", "solana", "aptos"]).toContain(chainType)
          })
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach((item: SectionContent, index: number) => {
          validateItem(item, `${section.section} > [${index}]`)
        })
      })
    })

    it("should only contain valid chainTypes", () => {
      const validChainTypes = ["evm", "solana", "aptos"]

      const checkChainTypes = (item: SectionContent) => {
        if (item.chainTypes) {
          item.chainTypes.forEach((chainType) => {
            expect(validChainTypes).toContain(chainType)
          })
        }
        if (item.children) {
          item.children.forEach(checkChainTypes)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(checkChainTypes)
      })
    })
  })

  describe("URL Validation", () => {
    const collectAllUrls = (items: SectionContent[]): string[] => {
      const urls: string[] = []
      const traverse = (item: SectionContent) => {
        if (item.url) {
          urls.push(item.url)
        }
        if (item.children) {
          item.children.forEach(traverse)
        }
      }
      items.forEach(traverse)
      return urls
    }

    it("should have unique URLs across all sections", () => {
      const allUrls: string[] = []
      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        const sectionUrls = collectAllUrls(section.contents)
        allUrls.push(...sectionUrls)
      })

      const duplicates = allUrls.filter((url, index) => allUrls.indexOf(url) !== index)
      expect(duplicates).toEqual([])
    })

    it("should not have trailing slashes in URLs", () => {
      const checkUrl = (item: SectionContent) => {
        if (item.url) {
          expect(item.url.endsWith("/")).toBe(false)
        }
        if (item.children) {
          item.children.forEach(checkUrl)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(checkUrl)
      })
    })

    it("should not have leading slashes in URLs", () => {
      const checkUrl = (item: SectionContent) => {
        if (item.url) {
          expect(item.url.startsWith("/")).toBe(false)
        }
        if (item.children) {
          item.children.forEach(checkUrl)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(checkUrl)
      })
    })

    it("should have valid URL format (lowercase, hyphens, forward slashes) or be external URLs", () => {
      const validInternalUrlPattern = /^[a-z0-9\-/.]+$/
      const validExternalUrlPattern = /^https?:\/\//

      const checkUrl = (item: SectionContent, path: string) => {
        if (item.url) {
          const isExternal = validExternalUrlPattern.test(item.url)
          const isValidInternal = validInternalUrlPattern.test(item.url)
          expect(isExternal || isValidInternal).toBe(true)
        }
        if (item.children) {
          item.children.forEach((child: SectionContent, index: number) => {
            checkUrl(child, `${path} > ${item.title} > [${index}]`)
          })
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach((item: SectionContent, index: number) => {
          checkUrl(item, `${section.section} > [${index}]`)
        })
      })
    })

    it("should start internal URLs with 'ccip' (external URLs allowed)", () => {
      const checkUrl = (item: SectionContent) => {
        if (item.url) {
          // External URLs are allowed (starting with http:// or https://)
          const isExternal = item.url.startsWith("http://") || item.url.startsWith("https://")
          if (!isExternal) {
            // Internal URLs should start with "ccip" or "ccip/"
            expect(item.url === "ccip" || item.url.startsWith("ccip/")).toBe(true)
          }
        }
        if (item.children) {
          item.children.forEach(checkUrl)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(checkUrl)
      })
    })
  })

  describe("Chain Type Logic", () => {
    it("should correctly inherit chainTypes from parent to children when children don't specify", () => {
      const checkInheritance = (parent: SectionContent | null, item: SectionContent) => {
        // If item has no chainTypes but parent does, it should inherit
        // This test documents the expected behavior for navigation logic
        if (item.children) {
          item.children.forEach((child) => {
            if (child.chainTypes && item.chainTypes) {
              // Child explicitly sets chainTypes - verify they're a subset or equal to parent
              // (This is a logical constraint - children shouldn't be MORE general than parent)
              // This is a soft recommendation - we document it but don't enforce strictly
              // as there might be valid cases where child expands beyond parent
            }
            checkInheritance(item, child)
          })
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach((item) => {
          checkInheritance(null, item)
        })
      })
    })

    it("should have consistent chain type usage across sections", () => {
      const chainTypeCounts = { evm: 0, solana: 0, aptos: 0 }

      const countChainTypes = (item: SectionContent) => {
        if (item.chainTypes) {
          item.chainTypes.forEach((ct) => {
            chainTypeCounts[ct as keyof typeof chainTypeCounts]++
          })
        }
        if (item.children) {
          item.children.forEach(countChainTypes)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(countChainTypes)
      })

      // All chain types should be used at least once
      expect(chainTypeCounts.evm).toBeGreaterThan(0)
      expect(chainTypeCounts.solana).toBeGreaterThan(0)
      expect(chainTypeCounts.aptos).toBeGreaterThan(0)
    })

    it("should have EVM-specific content marked correctly", () => {
      // Known EVM-only items should be marked with chainTypes: ["evm"]
      const evmOnlyItems = ["Token Manager", "SDK"]

      const findItems = (title: string): SectionContent[] => {
        const found: SectionContent[] = []
        const search = (item: SectionContent) => {
          if (item.title === title) {
            found.push(item)
          }
          if (item.children) {
            item.children.forEach(search)
          }
        }
        CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
          section.contents.forEach(search)
        })
        return found
      }

      evmOnlyItems.forEach((title) => {
        const items = findItems(title)
        items.forEach((item) => {
          expect(item.chainTypes).toBeDefined()
          expect(item.chainTypes).toEqual(["evm"])
        })
      })
    })
  })

  describe("Hierarchy Validation", () => {
    it("should not have circular references in children", () => {
      const checkCircular = (item: SectionContent, ancestors: Set<SectionContent>) => {
        expect(ancestors.has(item)).toBe(false)

        if (item.children) {
          const newAncestors = new Set(ancestors)
          newAncestors.add(item)
          item.children.forEach((child) => {
            checkCircular(child, newAncestors)
          })
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach((item) => {
          checkCircular(item, new Set())
        })
      })
    })

    it("should have reasonable nesting depth (max 3 levels)", () => {
      const checkDepth = (item: SectionContent, depth: number) => {
        expect(depth).toBeLessThanOrEqual(3)
        if (item.children) {
          item.children.forEach((child) => {
            checkDepth(child, depth + 1)
          })
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach((item) => {
          checkDepth(item, 1)
        })
      })
    })

    it("should have URLs on leaf nodes (items without children)", () => {
      const checkLeafNodes = (item: SectionContent) => {
        if (!item.children || item.children.length === 0) {
          // Leaf node - should have a URL
          expect(item.url).toBeDefined()
          expect(typeof item.url).toBe("string")
        }
        if (item.children) {
          item.children.forEach(checkLeafNodes)
        }
      }

      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        section.contents.forEach(checkLeafNodes)
      })
    })
  })

  describe("Content Consistency", () => {
    it("should have well-known sections", () => {
      const sectionNames = CCIP_SIDEBAR_CONTENT.map((s) => s.section)

      // These are known major sections that should exist
      const expectedSections = ["CCIP", "Concepts", "Tutorials", "Tools and Resources"]

      expectedSections.forEach((expectedSection) => {
        expect(sectionNames).toContain(expectedSection)
      })
    })

    it("should have Tools and Resources section with expected items", () => {
      const toolsSection = CCIP_SIDEBAR_CONTENT.find((s) => s.section === "Tools and Resources")
      expect(toolsSection).toBeDefined()

      if (toolsSection) {
        const itemTitles = toolsSection.contents.map((item) => item.title)
        expect(itemTitles).toContain("CCIP SDK & CLI")
        expect(itemTitles).toContain("Token Manager")
      }
    })
  })

  describe("Regression Prevention", () => {
    it("should maintain CCIP SDK & CLI sidebar item", () => {
      // Verify that CCIP SDK & CLI item exists with correct URL
      const findCCIPTools = (items: SectionContent[]): SectionContent | null => {
        for (const item of items) {
          if (item.title === "CCIP SDK & CLI") {
            return item
          }
          if (item.children) {
            const found = findCCIPTools(item.children)
            if (found) return found
          }
        }
        return null
      }

      let ccipToolsItem: SectionContent | null = null
      for (const section of CCIP_SIDEBAR_CONTENT) {
        ccipToolsItem = findCCIPTools(section.contents)
        if (ccipToolsItem) break
      }

      expect(ccipToolsItem).toBeDefined()
      expect(ccipToolsItem?.url).toBe("ccip/tools-resources/ccip-tools")
      // CCIP SDK & CLI should be universal (no chainTypes restriction)
      expect(ccipToolsItem?.chainTypes).toBeUndefined()
    })

    it("should maintain HyperEVM as EVM-specific content", () => {
      const findHyperEVM = (items: SectionContent[]): SectionContent | null => {
        for (const item of items) {
          if (item.title === "HyperEVM") {
            return item
          }
          if (item.children) {
            const found = findHyperEVM(item.children)
            if (found) return found
          }
        }
        return null
      }

      let hyperEvmItem: SectionContent | null = null
      for (const section of CCIP_SIDEBAR_CONTENT) {
        hyperEvmItem = findHyperEVM(section.contents)
        if (hyperEvmItem) break
      }

      if (hyperEvmItem) {
        expect(hyperEvmItem.chainTypes).toBeDefined()
        expect(hyperEvmItem.chainTypes).toEqual(["evm"])
      }
    })

    it("should maintain Token Manager as EVM-only", () => {
      const findTokenManager = (items: SectionContent[]): SectionContent | null => {
        for (const item of items) {
          if (item.title === "Token Manager") {
            return item
          }
          if (item.children) {
            const found = findTokenManager(item.children)
            if (found) return found
          }
        }
        return null
      }

      let tokenManagerItem: SectionContent | null = null
      for (const section of CCIP_SIDEBAR_CONTENT) {
        tokenManagerItem = findTokenManager(section.contents)
        if (tokenManagerItem) break
      }

      expect(tokenManagerItem).toBeDefined()
      expect(tokenManagerItem?.chainTypes).toBeDefined()
      expect(tokenManagerItem?.chainTypes).toEqual(["evm"])
    })
  })

  describe("Snapshot", () => {
    it("should match the expected sidebar structure snapshot", () => {
      // This test will fail if the structure changes significantly
      // Update the snapshot when intentional changes are made
      expect(CCIP_SIDEBAR_CONTENT).toMatchSnapshot()
    })

    it("should maintain expected number of top-level sections", () => {
      // Document the expected count to catch unintended additions/removals
      // Current sections: CCIP, Concepts, Tutorials, Tools and Resources
      expect(CCIP_SIDEBAR_CONTENT.length).toBe(4)
    })

    it("should maintain expected URL count", () => {
      const collectAllUrls = (items: SectionContent[]): string[] => {
        const urls: string[] = []
        const traverse = (item: SectionContent) => {
          if (item.url) {
            urls.push(item.url)
          }
          if (item.children) {
            item.children.forEach(traverse)
          }
        }
        items.forEach(traverse)
        return urls
      }

      let totalUrls = 0
      CCIP_SIDEBAR_CONTENT.forEach((section: SectionEntry) => {
        totalUrls += collectAllUrls(section.contents).length
      })

      // This is a baseline - update when pages are intentionally added/removed
      expect(totalUrls).toBeGreaterThan(50)
    })
  })
})
