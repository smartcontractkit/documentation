export type NetworkDetails = {
  verifierProxy?: string
  verifierProgramId?: string
  accessController?: string
  explorerUrl: string
  label: string
}

export type NetworkData = {
  network: string
  logoUrl: string
  networkStatus?: string
  mainnet?: NetworkDetails
  testnet?: NetworkDetails
  message?: string
  isSolana?: boolean
}

export const StreamsNetworksData: NetworkData[] = [
  {
    network: "Arbitrum",
    logoUrl: "/assets/chains/arbitrum.svg",
    networkStatus: "https://arbiscan.freshstatus.io/",
    mainnet: {
      label: "Arbitrum Mainnet",
      verifierProxy: "0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C",
      explorerUrl: "https://arbiscan.io/address/%s",
    },
    testnet: {
      label: "Arbitrum Sepolia",
      verifierProxy: "0x2ff010DEbC1297f19579B4246cad07bd24F2488A",
      explorerUrl: "https://sepolia.arbiscan.io/address/%s",
    },
  },
  {
    network: "Avalanche",
    logoUrl: "/assets/chains/avalanche.svg",
    networkStatus: "https://status.avax.network/",
    mainnet: {
      label: "Avalanche Mainnet",
      verifierProxy: "0x79BAa65505C6682F16F9b2C7F8afEBb1821BE3f6",
      explorerUrl: "https://snowtrace.io/address/%s",
    },
    testnet: {
      label: "Avalanche Fuji Testnet",
      verifierProxy: "0x2bf612C65f5a4d388E687948bb2CF842FFb8aBB3",
      explorerUrl: "https://testnet.snowtrace.io/address/%s",
    },
  },
  {
    network: "Base",
    logoUrl: "/assets/chains/base.svg",
    networkStatus: "https://basescan.statuspage.io/",
    mainnet: {
      label: "Base Mainnet",
      verifierProxy: "0xDE1A28D87Afd0f546505B28AB50410A5c3a7387a",
      explorerUrl: "https://basescan.org/address/%s",
    },
    testnet: {
      label: "Base Sepolia",
      verifierProxy: "0x8Ac491b7c118a0cdcF048e0f707247fD8C9575f9",
      explorerUrl: "https://sepolia.basescan.org/address/%s",
    },
  },
  {
    network: "Berachain",
    logoUrl: "/assets/chains/berachain.svg",
    networkStatus: "https://status.berachain.com/",
    mainnet: {
      label: "Berachain Mainnet",
      verifierProxy: "0xC539169910DE08D237Df0d73BcDa9074c787A4a1",
      explorerUrl: "https://berascan.com/address/%s",
    },
    testnet: {
      label: "Berachain bArtio Testnet",
      verifierProxy: "0x5A1634A86e9b7BfEf33F0f3f3EA3b1aBBc4CC85F",
      explorerUrl: "https://bartio.beratrail.io/address/%s",
    },
  },
  {
    network: "Blast",
    logoUrl: "/assets/chains/blast.svg",
    networkStatus: "https://status.blast.io/",
    mainnet: {
      label: "Blast Mainnet",
      verifierProxy: "0xaB93491064aEE774BE4b8a1cFFe4421F5B124F4e",
      explorerUrl: "https://blastscan.io/address/%s",
    },
    testnet: {
      label: "Blast Sepolia Testnet",
      verifierProxy: "0x141f4278A5D71070Dc09CA276b72809b80F20eF0",
      explorerUrl: "https://sepolia.blastscan.io/address/%s",
    },
  },
  {
    network: "BNB Chain",
    logoUrl: "/assets/chains/bnb-chain.svg",
    networkStatus: "https://bscscan.freshstatus.io",
    mainnet: {
      label: "BNB Chain Mainnet",
      verifierProxy: "0xF276a4BC8Da323EA3E8c3c195a4E2E7615a898d1",
      explorerUrl: "https://bscscan.com/address/%s",
    },
    testnet: {
      label: "BNB Chain Testnet",
      verifierProxy: "0xF45D6dba93d0dB2C849C280F45e60D6e11b3C4DD",
      explorerUrl: "https://testnet.bscscan.com/address/%s",
    },
  },
  {
    network: "Bob",
    logoUrl: "/assets/chains/bob.svg",
    mainnet: {
      label: "Bob Mainnet",
      verifierProxy: "0xF45D6dba93d0dB2C849C280F45e60D6e11b3C4DD",
      explorerUrl: "https://explorer.gobob.xyz/address/%s",
    },
    testnet: {
      label: "Bob Sepolia Testnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://bob-sepolia.explorer.gobob.xyz/address/%s",
    },
  },
  {
    network: "Botanix",
    logoUrl: "/assets/chains/botanix.svg",
    testnet: {
      label: "Botanix Testnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://testnet.botanixscan.io/address/%s",
    },
  },
  {
    network: "Ethereum",
    logoUrl: "/assets/chains/ethereum.svg",
    mainnet: {
      label: "Ethereum Mainnet",
      verifierProxy: "0x5A1634A86e9b7BfEf33F0f3f3EA3b1aBBc4CC85F",
      explorerUrl: "https://etherscan.io/address/%s",
    },
    testnet: {
      label: "Sepolia Testnet",
      verifierProxy: "0x4e9935be37302B9C97Ff4ae6868F1b566ade26d2",
      explorerUrl: "https://sepolia.etherscan.io/address/%s",
    },
  },
  {
    network: "HashKey Chain",
    logoUrl: "/assets/chains/hashkey.svg",
    mainnet: {
      label: "HashKey Chain Mainnet",
      verifierProxy: "0x3278e7a582B94d82487d4B99b31A511CbAe2Cd54",
      explorerUrl: "https://hashkey.blockscout.com/address/%s",
    },
    testnet: {
      label: "HashKey Chain Testnet",
      verifierProxy: "0xE02A72Be64DA496797821f1c4BB500851C286C6c",
      explorerUrl: "https://hashkeychain-testnet-explorer.alt.technology/address/%s",
    },
  },
  {
    network: "Hyperliquid",
    logoUrl: "/assets/chains/hyperliquid.svg",
    mainnet: {
      label: "Hyperliquid Mainnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://hyperliquid.cloud.blockscout.com/address/%s",
    },
    testnet: {
      label: "Hyperliquid Testnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://evm.hyperstats.xyz/address/%s",
    },
  },
  {
    network: "Ink",
    logoUrl: "/assets/chains/ink.svg",
    networkStatus: "https://status.inkonchain.com/",
    mainnet: {
      label: "Ink Mainnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://explorer.inkonchain.com/address/%s",
    },
    testnet: {
      label: "Ink Sepolia Testnet",
      verifierProxy: "0x1f27392cC2394d54fFBA83B89C881200b5d5632C",
      explorerUrl: "https://explorer-sepolia.inkonchain.com/address/%s",
    },
  },
  {
    network: "Linea",
    logoUrl: "/assets/chains/linea.svg",
    networkStatus: "https://linea.statuspage.io/",
    mainnet: {
      label: "Linea Mainnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://lineascan.build/address/%s",
    },
    testnet: {
      label: "Linea Sepolia Testnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://sepolia.lineascan.build/address/%s",
    },
  },
  {
    network: "Mantle",
    logoUrl: "/assets/chains/mantle.svg",
    networkStatus: "https://0xmantle.instatus.com",
    mainnet: {
      label: "Mantle Mainnet",
      verifierProxy: "0x223752Eb475098e79d10937480DF93864D7EfB83",
      explorerUrl: "https://mantlescan.xyz/address/%s",
    },
    testnet: {
      label: "Mantle Sepolia Testnet",
      verifierProxy: "0xdc458847982C496E1a5E25D005A332D5a838302B",
      explorerUrl: "https://sepolia.mantlescan.xyz/address/%s",
    },
  },
  {
    network: "MegaETH",
    logoUrl: "/assets/chains/megaeth.svg",
    networkStatus: "https://uptime.megaeth.com",
    testnet: {
      label: "MegaETH Testnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://www.megaexplorer.xyz/address/%s",
    },
  },
  {
    network: "Monad",
    logoUrl: "/assets/chains/monad.svg",
    testnet: {
      label: "Monad Testnet",
      verifierProxy: "0xC539169910DE08D237Df0d73BcDa9074c787A4a1",
      explorerUrl: "https://testnet.monadexplorer.com/address/%s",
    },
  },
  {
    network: "opBNB",
    logoUrl: "/assets/chains/opbnb.svg",
    networkStatus: "https://opbnb-status.bnbchain.org/",
    mainnet: {
      label: "opBNB Mainnet",
      verifierProxy: "0x7D543D1a715ED544f7e3Ae9e3b1777BCdA56bF8e",
      explorerUrl: "https://opbnb.bscscan.com/address/%s",
    },
    testnet: {
      label: "opBNB Testnet",
      verifierProxy: "0x001225Aca0efe49Dbb48233aB83a9b4d177b581A",
      explorerUrl: "https://opbnb-testnet.bscscan.com/address/%s",
    },
  },
  {
    network: "OP",
    logoUrl: "/assets/chains/optimism.svg",
    networkStatus: "https://status.optimism.io/",
    mainnet: {
      label: "OP Mainnet",
      verifierProxy: "0xEBA4789A88C89C18f4657ffBF47B13A3abC7EB8D",
      explorerUrl: "https://optimistic.etherscan.io/address/%s",
    },
    testnet: {
      label: "OP Sepolia",
      verifierProxy: "0x5f64394a2Ab3AcE9eCC071568Fc552489a8de7AF",
      explorerUrl: "https://sepolia-optimism.etherscan.io/address/%s",
    },
  },
  {
    network: "Ronin",
    logoUrl: "/assets/chains/ronin.svg",
    mainnet: {
      label: "Ronin Mainnet",
      verifierProxy: "0x499Ce6718a50e154B0C69905eEE8D307e5B003cc",
      explorerUrl: "https://app.roninchain.com/address/%s",
    },
    testnet: {
      label: "Ronin Saigon Testnet",
      verifierProxy: "0xE02A72Be64DA496797821f1c4BB500851C286C6c",
      explorerUrl: "https://saigon-app.roninchain.com/address/%s",
    },
  },
  {
    network: "Scroll",
    logoUrl: "/assets/chains/scroll.svg",
    mainnet: {
      label: "Scroll Mainnet",
      verifierProxy: "0x37e550C9b35DB56F9c943126F1c2642fcbDF7B51",
      explorerUrl: "https://scrollscan.com/address/%s",
    },
    testnet: {
      label: "Scroll Sepolia Testnet",
      verifierProxy: "0xE17A7C6A7c2eF0Cb859578aa1605f8Bc2434A365",
      explorerUrl: "https://sepolia.scrollscan.com/address/%s",
    },
  },
  {
    network: "Shibarium",
    logoUrl: "/assets/chains/shibarium.svg",
    mainnet: {
      label: "Shibarium Mainnet",
      verifierProxy: "0xBE9f07f73de2412A9d0Ed64C42De7d9A10C9F28C",
      explorerUrl: "https://www.shibariumscan.io/address/%s",
    },
    testnet: {
      label: "Shibarium Puppynet",
      verifierProxy: "0xc44eb6c00A0F89D044279cD91Bdfd5f62f752Da3",
      explorerUrl: "https://puppyscan.shib.io/address/%s",
    },
  },
  {
    network: "Soneium",
    logoUrl: "/assets/chains/soneium.svg",
    mainnet: {
      label: "Soneium Mainnet",
      verifierProxy: "0x8760535A80Ac5908096B57A094266866f4aA1A8c",
      explorerUrl: "https://soneium.blockscout.com/address/%s",
    },
    testnet: {
      label: "Soneium Minato Testnet",
      verifierProxy: "0x26603bAC5CE09DAE5604700B384658AcA13AD6ae",
      explorerUrl: "https://soneium-minato.blockscout.com/address/%s",
    },
  },
  {
    network: "Sonic",
    logoUrl: "/assets/chains/sonic.svg",
    mainnet: {
      label: "Sonic Mainnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://sonicscan.org/address/%s",
    },
    testnet: {
      label: "Sonic Blaze Testnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://testnet.sonicscan.org/address/%s",
    },
  },
  {
    network: "Solana",
    logoUrl: "/assets/chains/solana.svg",
    networkStatus: "https://status.solana.com/",
    isSolana: true,
    mainnet: {
      label: "Solana Mainnet",
      verifierProgramId: "Gt9S41PtjR58CbG9JhJ3J6vxesqrNAswbWYbLNTMZA3c",
      accessController: "7mSn5MoBjyRLKoJShgkep8J17ueGG8rYioVAiSg5YWMF",
      explorerUrl: "https://explorer.solana.com/address/%s",
    },
    testnet: {
      label: "Solana Devnet",
      verifierProgramId: "Gt9S41PtjR58CbG9JhJ3J6vxesqrNAswbWYbLNTMZA3c",
      accessController: "2k3DsgwBoqrnvXKVvd7jX7aptNxdcRBdcd5HkYsGgbrb",
      explorerUrl: "https://explorer.solana.com/address/%s?cluster=devnet",
    },
  },
  {
    network: "Unichain",
    logoUrl: "/assets/chains/unichain.svg",
    mainnet: {
      label: "Unichain Mainnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://uniscan.xyz/address/%s",
    },
    testnet: {
      label: "Unichain Sepolia Testnet",
      verifierProxy: "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB",
      explorerUrl: "https://sepolia.uniscan.xyz/address/%s",
    },
  },
  {
    network: "World Chain",
    logoUrl: "/assets/chains/worldchain.svg",
    mainnet: {
      label: "World Chain Mainnet",
      verifierProxy: "0x6733e9106094b0C794e8E0297c96611fF60460Bf",
      explorerUrl: "https://worldscan.org/address/%s",
    },
    testnet: {
      label: "World Chain Sepolia Testnet",
      verifierProxy: "0xd61ceB4521453F147C58d22879B4ec539331F851",
      explorerUrl: "https://sepolia.worldscan.org/address/%s",
    },
  },
  {
    network: "ZKSync",
    logoUrl: "/assets/chains/zksync.svg",
    networkStatus: "https://uptime.com/statuspage/zkSync",
    mainnet: {
      label: "ZKSync Era Mainnet",
      verifierProxy: "0xcA64d9D1a9AE4C10E94D0D45af9E878fc64dc207",
      explorerUrl: "https://explorer.zksync.io/address/%s",
    },
    testnet: {
      label: "ZKSync Sepolia Testnet",
      verifierProxy: "0xDf37875775d1E777bB413f27de093A62CFF4264b",
      explorerUrl: "https://sepolia.explorer.zksync.io/address/%s",
    },
  },
]
