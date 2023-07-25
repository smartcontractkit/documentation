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
      name: "Ethereum",
      img: "/assets/chains/ethereum.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Goerli", type: "testnet" },
        { name: "Sepolia", type: "testnet" },
      ],
    },
    {
      name: "BNB Chain",
      img: "/assets/chains/bnb-chain.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Testnet", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      img: "/assets/chains/polygon.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      img: "/assets/chains/avalanche.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      img: "/assets/chains/fantom.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Testnet", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      img: "/assets/chains/arbitrum.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Goerli", type: "testnet" },
      ],
    },
  ],
  directFunding: [
    {
      name: "Ethereum",
      img: "/assets/chains/ethereum.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Goerli", type: "testnet" },
        { name: "Sepolia", type: "testnet" },
      ],
    },
    {
      name: "BNB Chain",
      img: "/assets/chains/bnb-chain.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Testnet", type: "testnet" },
      ],
    },
    {
      name: "Polygon",
      img: "/assets/chains/polygon.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Mumbai", type: "testnet" },
      ],
    },
    {
      name: "Avalanche",
      img: "/assets/chains/avalanche.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Fuji", type: "testnet" },
      ],
    },
    {
      name: "Fantom",
      img: "/assets/chains/fantom.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Testnet", type: "testnet" },
      ],
    },
    {
      name: "Arbitrum",
      img: "/assets/chains/arbitrum.svg",
      nets: [
        { name: "Mainnet", type: "mainnet" },
        { name: "Goerli", type: "testnet" },
      ],
    },
  ],
}
