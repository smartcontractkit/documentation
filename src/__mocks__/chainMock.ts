// Mock chain data for tests
export const mockChainConfig = {
  "ethereum-mainnet": {
    armProxy: {
      address: "0x411dE17f12D1A34ecC7F45f49844626267c75e81",
      version: "1.0.0",
    },
    chainSelector: "5009297550715157269",
    feeTokens: ["GHO", "LINK", "WETH"],
    registryModule: {
      address: "0x13022e3e6C77524308BD56AEd716E88311b2E533",
      version: "1.5.0",
    },
    router: {
      address: "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
      version: "1.2.0",
    },
    tokenAdminRegistry: {
      address: "0xb22764f98dD05c789929716D677382Df22C05Cb6",
      version: "1.5.0",
    },
  },
}

export const mockSelectorConfig = {
  selectors: {
    "1": {
      selector: "5009297550715157269",
      name: "ethereum-mainnet",
    },
  },
}

export const mockReferenceData = {
  chainsReferenceData: {
    "ethereum-mainnet": {
      armProxy: {
        address: "0x411dE17f12D1A34ecC7F45f49844626267c75e81",
        version: "1.0.0",
      },
      chainSelector: "5009297550715157269",
      feeTokens: ["GHO", "LINK", "WETH"],
      registryModule: {
        address: "0x13022e3e6C77524308BD56AEd716E88311b2E533",
        version: "1.5.0",
      },
      router: {
        address: "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
        version: "1.2.0",
      },
      tokenAdminRegistry: {
        address: "0xb22764f98dD05c789929716D677382Df22C05Cb6",
        version: "1.5.0",
      },
    },
  },
  lanesReferenceData: {
    "ethereum-mainnet": {
      "ethereum-mainnet-optimism-1": {
        status: "live",
      },
    },
  },
}
