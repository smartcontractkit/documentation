export interface network {
  name: string
  type: "mainnet" | "testnet"
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
        {
          name: "ethereum",
          type: "mainnet",
        },
        { name: "goerli", type: "testnet" },
        { name: "sepolia", type: "testnet" },
      ],
    },
    {
      name: "BNB",
      nets: [
        { name: "BNB", type: "mainnet" },
        { name: "BNB", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      nets: [
        { name: "Polygon", type: "mainnet" },
        { name: "mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      nets: [
        { name: "Avalanche", type: "mainnet" },
        { name: "fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      nets: [
        { name: "Fantom", type: "mainnet" },
        { name: "Fantom", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      nets: [
        { name: "Arbitrum", type: "mainnet" },
        { name: "goerli", type: "testnet" },
      ],
    },
  ],
  directFunding: [
    {
      name: "ethereum",
      nets: [
        {
          name: "ethereum",
          type: "mainnet",
        },
        { name: "goerli", type: "testnet" },
        { name: "sepolia", type: "testnet" },
      ],
    },
    {
      name: "BNB",
      nets: [
        { name: "BNB", type: "mainnet" },
        { name: "BNB", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      nets: [
        { name: "Polygon", type: "mainnet" },
        { name: "mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      nets: [
        { name: "Avalanche", type: "mainnet" },
        { name: "fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      nets: [
        { name: "Fantom", type: "mainnet" },
        { name: "Fantom", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      nets: [
        { name: "Arbitrum", type: "mainnet" },
        { name: "goerli", type: "testnet" },
      ],
    },
  ],
}
