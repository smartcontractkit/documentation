export interface network {
  name: string
  type: "mainnet" | "testnet"
}

export interface vrfChain {
  name: string
  img?: string
  nets: network[]
}

export interface vrfNetsByMethod {
  subscription: vrfChain[]
  directFunding: vrfChain[]
}

export const supportedNetworks: vrfNetsByMethod = {
  subscription: [
    {
      name: "ethereum",
      img: "/assets/chains/ethereum.svg",
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
      img: "/assets/chains/bnb-chain.svg",
      nets: [
        { name: "BNB", type: "mainnet" },
        { name: "BNB", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      img: "/assets/chains/polygon.svg",
      nets: [
        { name: "Polygon", type: "mainnet" },
        { name: "mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      img: "/assets/chains/avalanche.svg",
      nets: [
        { name: "Avalanche", type: "mainnet" },
        { name: "fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      img: "/assets/chains/fantom.svg",
      nets: [
        { name: "Fantom", type: "mainnet" },
        { name: "Fantom", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      img: "/assets/chains/arbitrum.svg",
      nets: [
        { name: "Arbitrum", type: "mainnet" },
        { name: "goerli", type: "testnet" },
      ],
    },
  ],
  directFunding: [
    {
      name: "ethereum",
      img: "/assets/chains/ethereum.svg",
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
      img: "/assets/chains/bnb-chain.svg",
      nets: [
        { name: "BNB", type: "mainnet" },
        { name: "BNB", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      img: "/assets/chains/polygon.svg",
      nets: [
        { name: "Polygon", type: "mainnet" },
        { name: "mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      img: "/assets/chains/avalanche.svg",
      nets: [
        { name: "Avalanche", type: "mainnet" },
        { name: "fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      img: "/assets/chains/fantom.svg",
      nets: [
        { name: "Fantom", type: "mainnet" },
        { name: "Fantom", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      img: "/assets/chains/arbitrum.svg",
      nets: [
        { name: "Arbitrum", type: "mainnet" },
        { name: "goerli", type: "testnet" },
      ],
    },
  ],
}
