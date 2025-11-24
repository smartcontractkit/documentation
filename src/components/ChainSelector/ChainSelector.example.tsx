/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { ChainSelector } from "./ChainSelector.tsx"
import type { Chain } from "~/features/data/chains.ts"

/**
 * ChainSelectorExample - Minimal usage example for the ChainSelector component
 */
export function ChainSelectorExample() {
  // Sample chain data - demonstrates different network availability scenarios
  const sampleChains: Chain[] = [
    {
      page: "ethereum",
      title: "Ethereum",
      label: "Ethereum",
      img: "/assets/chains/ethereum.svg",
      networkStatusUrl: "https://status.chain.link/",
      supportedFeatures: ["feeds"],
      tags: ["default"],
      networks: [
        {
          name: "Ethereum Mainnet",
          explorerUrl: "https://etherscan.io/",
          networkType: "mainnet",
          queryString: "ethereum-mainnet",
        },
        {
          name: "Ethereum Sepolia",
          explorerUrl: "https://sepolia.etherscan.io/",
          networkType: "testnet",
          queryString: "ethereum-testnet-sepolia",
        },
      ],
    },
    {
      page: "polygon",
      title: "Polygon (Mainnet Only)",
      label: "Polygon",
      img: "/assets/chains/polygon.svg",
      networkStatusUrl: "https://status.chain.link/",
      supportedFeatures: ["feeds"],
      tags: ["default"],
      networks: [
        {
          name: "Polygon Mainnet",
          explorerUrl: "https://polygonscan.com/",
          networkType: "mainnet",
          queryString: "polygon-mainnet",
        },
      ],
    },
    {
      page: "base",
      title: "Base (Testnet Only)",
      label: "Base",
      img: "/assets/chains/base.svg",
      networkStatusUrl: "https://status.chain.link/",
      supportedFeatures: ["feeds"],
      tags: ["default"],
      networks: [
        {
          name: "Base Sepolia",
          explorerUrl: "https://sepolia.basescan.org/",
          networkType: "testnet",
          queryString: "base-testnet-sepolia",
        },
      ],
    },
  ]

  // Component state
  const [selectedChain, setSelectedChain] = useState<Chain>(sampleChains[0])
  const [selectedNetworkType, setSelectedNetworkType] = useState<"mainnet" | "testnet">("mainnet")

  // Event handlers
  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain)

    // Auto-correct network type if not available on new chain
    const newAvailableTypes = {
      mainnet: chain.networks?.some((network) => network.networkType === "mainnet") ?? false,
      testnet: chain.networks?.some((network) => network.networkType === "testnet") ?? false,
    }

    if (selectedNetworkType === "mainnet" && !newAvailableTypes.mainnet && newAvailableTypes.testnet) {
      setSelectedNetworkType("testnet")
    } else if (selectedNetworkType === "testnet" && !newAvailableTypes.testnet && newAvailableTypes.mainnet) {
      setSelectedNetworkType("mainnet")
    }

    console.log("Chain selected:", chain.title)
  }

  const handleNetworkTypeChange = (networkType: "mainnet" | "testnet") => {
    setSelectedNetworkType(networkType)
    console.log("Network type changed:", networkType)
  }

  // Calculate available network types based on the selected chain's actual networks
  const availableNetworkTypes = {
    mainnet: selectedChain.networks?.some((network) => network.networkType === "mainnet") ?? false,
    testnet: selectedChain.networks?.some((network) => network.networkType === "testnet") ?? false,
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>ChainSelector Example</h2>

      <ChainSelector
        chains={sampleChains}
        selectedChain={selectedChain}
        onChainSelect={handleChainSelect}
        onNetworkTypeChange={handleNetworkTypeChange}
        selectedNetworkType={selectedNetworkType}
        availableNetworkTypes={availableNetworkTypes}
        dataFeedType="default"
      />

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        <p>
          <strong>Selected:</strong> {selectedChain.title}
        </p>
        <p>
          <strong>Network Type:</strong> {selectedNetworkType}
        </p>
        <p>
          <strong>Available:</strong>
        </p>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Mainnet: {availableNetworkTypes.mainnet ? "✅" : "❌"}</li>
          <li>Testnet: {availableNetworkTypes.testnet ? "✅" : "❌"}</li>
        </ul>
      </div>
    </div>
  )
}
