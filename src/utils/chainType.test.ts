import { expect, test, describe } from "@jest/globals"
import { propagateChainTypes } from "./chainType.ts"
import type { SectionContent } from "~/config/sidebar.ts"

describe("propagateChainTypes", () => {
  test("children without chainTypes inherit from parent", () => {
    const input: SectionContent[] = [
      {
        title: "API Reference",
        url: "ccip/api-reference/evm",
        chainTypes: ["evm"],
        children: [
          { title: "Messages", url: "ccip/api-reference/evm/messages" },
          { title: "Router", url: "ccip/api-reference/evm/router" },
        ],
      },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].children![0].chainTypes).toEqual(["evm"])
    expect(result[0].children![1].chainTypes).toEqual(["evm"])
  })

  test("children with explicit chainTypes are not overridden", () => {
    const input: SectionContent[] = [
      {
        title: "Parent",
        url: "parent",
        chainTypes: ["evm"],
        children: [
          { title: "Child1", url: "child1" }, // Should inherit
          { title: "Child2", url: "child2", chainTypes: ["solana", "aptos"] }, // Should keep its own
        ],
      },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].children![0].chainTypes).toEqual(["evm"])
    expect(result[0].children![1].chainTypes).toEqual(["solana", "aptos"])
  })

  test("nested children (grandchildren) inherit correctly", () => {
    const input: SectionContent[] = [
      {
        title: "Grandparent",
        url: "grandparent",
        chainTypes: ["evm"],
        children: [
          {
            title: "Parent",
            url: "parent",
            children: [
              { title: "Child", url: "child" },
              { title: "AnotherChild", url: "another-child" },
            ],
          },
        ],
      },
    ]

    const result = propagateChainTypes(input)

    // Parent inherits from grandparent
    expect(result[0].children![0].chainTypes).toEqual(["evm"])
    // Children inherit from parent (which inherited from grandparent)
    expect(result[0].children![0].children![0].chainTypes).toEqual(["evm"])
    expect(result[0].children![0].children![1].chainTypes).toEqual(["evm"])
  })

  test("parent with chainTypes, intermediate child without, grandchild should inherit from parent", () => {
    const input: SectionContent[] = [
      {
        title: "API Reference",
        url: "api",
        chainTypes: ["solana"],
        children: [
          {
            title: "v1.6.0",
            url: "v1.6.0",
            // No chainTypes - should inherit solana
            children: [
              { title: "Messages", url: "messages" }, // Should inherit solana
            ],
          },
        ],
      },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].children![0].chainTypes).toEqual(["solana"])
    expect(result[0].children![0].children![0].chainTypes).toEqual(["solana"])
  })

  test("universal items (no chainTypes) remain universal", () => {
    const input: SectionContent[] = [
      {
        title: "Overview",
        url: "overview",
        // No chainTypes - should remain undefined (universal)
      },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].chainTypes).toBeUndefined()
  })

  test("universal parent with chain-specific children", () => {
    const input: SectionContent[] = [
      {
        title: "Universal Parent",
        url: "parent",
        // No chainTypes
        children: [
          { title: "EVM Child", url: "evm-child", chainTypes: ["evm"] },
          { title: "Solana Child", url: "solana-child", chainTypes: ["solana"] },
        ],
      },
    ]

    const result = propagateChainTypes(input)

    // Parent remains universal
    expect(result[0].chainTypes).toBeUndefined()
    // Children keep their explicit chainTypes
    expect(result[0].children![0].chainTypes).toEqual(["evm"])
    expect(result[0].children![1].chainTypes).toEqual(["solana"])
  })

  test("empty array of contents returns empty array", () => {
    const input: SectionContent[] = []
    const result = propagateChainTypes(input)
    expect(result).toEqual([])
  })

  test("items without children are handled correctly", () => {
    const input: SectionContent[] = [
      { title: "Item1", url: "item1", chainTypes: ["evm"] },
      { title: "Item2", url: "item2", chainTypes: ["solana"] },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].chainTypes).toEqual(["evm"])
    expect(result[1].chainTypes).toEqual(["solana"])
  })

  test("multiple chain types are preserved", () => {
    const input: SectionContent[] = [
      {
        title: "Multi-chain Parent",
        url: "parent",
        chainTypes: ["evm", "solana", "aptos"],
        children: [{ title: "Child", url: "child" }],
      },
    ]

    const result = propagateChainTypes(input)

    expect(result[0].children![0].chainTypes).toEqual(["evm", "solana", "aptos"])
  })

  test("does not mutate original input", () => {
    const input: SectionContent[] = [
      {
        title: "Parent",
        url: "parent",
        chainTypes: ["evm"],
        children: [{ title: "Child", url: "child" }],
      },
    ]

    const originalChildChainTypes = input[0].children![0].chainTypes

    propagateChainTypes(input)

    // Original should not have been mutated
    expect(input[0].children![0].chainTypes).toBe(originalChildChainTypes)
  })

  test("real-world scenario: CCIP API Reference structure", () => {
    // Simulates the actual CCIP sidebar structure
    const input: SectionContent[] = [
      {
        title: "Tools and Resources",
        url: "ccip/tools-resources",
        children: [
          {
            title: "API Reference",
            url: "ccip/api-reference/svm",
            chainTypes: ["solana"],
            children: [
              {
                title: "v1.6.0",
                url: "ccip/api-reference/svm/v1.6.0",
                isCollapsible: true,
                children: [
                  { title: "Messages", url: "ccip/api-reference/svm/v1.6.0/messages" },
                  { title: "Router", url: "ccip/api-reference/svm/v1.6.0/router" },
                  { title: "Receiver", url: "ccip/api-reference/svm/v1.6.0/receiver" },
                ],
              },
            ],
          },
        ],
      },
    ]

    const result = propagateChainTypes(input)

    // Top-level has no chainTypes (universal)
    expect(result[0].chainTypes).toBeUndefined()

    // API Reference has solana
    expect(result[0].children![0].chainTypes).toEqual(["solana"])

    // v1.6.0 inherits solana
    expect(result[0].children![0].children![0].chainTypes).toEqual(["solana"])

    // All API endpoints inherit solana
    const endpoints = result[0].children![0].children![0].children!
    expect(endpoints[0].chainTypes).toEqual(["solana"]) // Messages
    expect(endpoints[1].chainTypes).toEqual(["solana"]) // Router
    expect(endpoints[2].chainTypes).toEqual(["solana"]) // Receiver
  })
})
