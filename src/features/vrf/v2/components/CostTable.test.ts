import { getGasCalculatorUrl } from "./CostTable"
import { expect, test } from "@jest/globals"
import { ChainNetwork } from "~/features/data/chains"

describe("getGasCalculatorUrl", () => {
  test("works with testnet", () => {
    const mainChainName = "ethereum"
    const networkName = "sepolia"
    const chainNetwork: ChainNetwork = {
      name: "Sepolia Testnet",
      explorerUrl: "https://sepolia.etherscan.io/address/%s",
      networkType: "testnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-sepolia.json",
      queryString: "ethereum-sepolia",
      tags: ["smartData"],
    }
    const method = "vrfSubscription"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chainNetwork, method })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=ethereum&networkType=sepolia&method=subscription"
    )
  })

  test("works with mainnet", () => {
    const mainChainName = "polygon"
    const networkName = "mainnet"
    const chainNetwork: ChainNetwork = {
      name: "Polygon Mainnet",
      explorerUrl: "https://polygonscan.com/address/%s",
      networkType: "mainnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      queryString: "polygon-mainnet",
      tags: ["smartData"],
    }
    const method = "vrfDirectFunding"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chainNetwork, method })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=polygon&networkType=mainnet&method=directFunding"
    )
  })
})
