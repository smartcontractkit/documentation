import { getGasCalculatorUrl } from "./CostTable"
import { expect, test } from "@jest/globals"
import { ChainNetwork } from "~/features/data/chains"

describe("getGasCalculatorUrl", () => {
  test("works with testnet", () => {
    const mainChainName = "ethereum"
    const networkName = "goerli"
    const chain: ChainNetwork = {
      name: "Goerli Testnet",
      explorerUrl: "https://goerli.etherscan.io/address/%s",
      networkType: "testnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
      tags: ["proofOfReserve", "nftFloorPrice"],
    }
    const method = "vrfSubscription"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chain, method })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=ethereum&networkType=goerli&method=subscription"
    )
  })

  test("works with mainnet", () => {
    const mainChainName = "polygon"
    const networkName = "mainnet"
    const chain: ChainNetwork = {
      name: "Polygon Mainnet",
      explorerUrl: "https://polygonscan.com/address/%s",
      networkType: "mainnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      tags: ["proofOfReserve"],
    }
    const method = "directFunding"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chain, method })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=polygon&networkType=mainnet&method=directFunding"
    )
  })
})
