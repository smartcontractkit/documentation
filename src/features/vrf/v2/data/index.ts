export interface network {
  name: string
  type: "mainnet" | "testnet"
  baseApiUrl: string
}

export interface vrfChain {
  name: string
  nets?: network[]
}

export interface vrfNetsByMethod {
  subscription: vrfChain[]
  directFunding: vrfChain[]
}

export const supportedNetworks: vrfNetsByMethod = {
  subscription: [
    {
      name: "ethereum",
      nets: [
        { name: "ethereum", type: "mainnet", baseApiUrl: "https://api.etherscan.io/" },
        { name: "goerli", type: "testnet", baseApiUrl: "https://api-goerli.etherscan.io/" },
        { name: "sepolia", type: "testnet", baseApiUrl: "https://api-sepolia.etherscan.io/" },
      ],
    },
    {
      name: "BNB Chain",
      nets: [
        { name: "BNB Chain", type: "mainnet", baseApiUrl: "https://api.bscscan.com/" },
        { name: "BNB Chain", type: "testnet", baseApiUrl: "https://api-testnet.bscscan.com/" },
      ],
    },
    {
      name: "Polygon (MATIC)",
      nets: [
        { name: "Polygon", type: "mainnet", baseApiUrl: "https://api.polygonscan.com/" },
        { name: "mumbai", type: "testnet", baseApiUrl: "https://api-testnet.polygonscan.com/" },
      ],
    },
    {
      name: "Avalanche",
      nets: [
        { name: "Avalanche", type: "mainnet", baseApiUrl: "https://api.snowtrace.io/" },
        { name: "fuji", type: "testnet", baseApiUrl: "https://api-testnet.snowtrace.io/" },
      ],
    },
    {
      name: "Fantom",
      nets: [
        { name: "Fantom", type: "mainnet", baseApiUrl: "https://api.ftmscan.com/" },
        { name: "Fantom", type: "testnet", baseApiUrl: "https://api-testnet.ftmscan.com/" },
      ],
    },
    {
      name: "Arbitrum",
      nets: [
        { name: "Arbitrum", type: "mainnet", baseApiUrl: "https://arb-mainnet.g.alchemy.com/v2/" },
        { name: "goerli", type: "testnet", baseApiUrl: "https://arb-testnet.g.alchemy.com/v2/" },
      ],
    },
  ],
  directFunding: [
    {
      name: "ethereum",
      nets: [
        { name: "ethereum", type: "mainnet", baseApiUrl: "https://api.etherscan.io/" },
        { name: "goerli", type: "testnet", baseApiUrl: "https://api-goerli.etherscan.io/" },
        { name: "sepolia", type: "testnet", baseApiUrl: "https://api-sepolia.etherscan.io/" },
      ],
    },
    {
      name: "BNB Chain",
      nets: [
        { name: "BNB Chain", type: "mainnet", baseApiUrl: "https://api.bscscan.com/" },
        { name: "BNB Chain", type: "testnet", baseApiUrl: "https://api-testnet.bscscan.com/" },
      ],
    },
    {
      name: "Polygon (MATIC)",
      nets: [
        { name: "Polygon", type: "mainnet", baseApiUrl: "https://api.polygonscan.com/" },
        { name: "mumbai", type: "testnet", baseApiUrl: "https://api-testnet.polygonscan.com/" },
      ],
    },
    {
      name: "Avalanche",
      nets: [
        { name: "Avalanche", type: "mainnet", baseApiUrl: "https://api.snowtrace.io/" },
        { name: "fuji", type: "testnet", baseApiUrl: "https://api-testnet.snowtrace.io/" },
      ],
    },
    {
      name: "Fantom",
      nets: [
        { name: "Fantom", type: "mainnet", baseApiUrl: "https://api.ftmscan.com/" },
        { name: "Fantom", type: "testnet", baseApiUrl: "https://api-testnet.ftmscan.com/" },
      ],
    },
  ],
}
