import { getNetworkFromQueryString, CHAINS } from "./chains"
import { expect, test } from "@jest/globals"

describe("getNetworkFromQueryString", () => {
  test("works with testnet", () => {
    const queryString = "ethereum-sepolia"
    const chain = CHAINS.filter((chain) => chain.label === "Ethereum")[0]
    const chainNetwork = chain.networks.filter((network) => network.name === "Sepolia Testnet")[0]
    expect(getNetworkFromQueryString(queryString)).toEqual({ chain, chainNetwork })
  })

  test("works with mainnet", () => {
    const queryString = "polygon-mainnet"
    const chain = CHAINS.filter((chain) => chain.label === "Polygon (Matic)")[0]
    const chainNetwork = chain.networks.filter((network) => network.name === "Polygon Mainnet")[0]
    expect(getNetworkFromQueryString(queryString)).toEqual({ chain, chainNetwork })
  })
  test("return null when invalid queryString", () => {
    const queryString = "falsy-string"
    expect(getNetworkFromQueryString(queryString)).toEqual({ chain: null, chainNetwork: null })
  })
})
