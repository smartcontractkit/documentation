/* eslint-disable no-unused-vars */

import { providers } from "ethers"
import { SupportedChain } from "."

export const chainToProvider: Record<SupportedChain, () => providers.Provider> = {
  ETHEREUM_MAINNET: () => new providers.InfuraProvider("homestead", "fe6db57057904042b7fed23ff54c643d"),
  ETHEREUM_GOERLI: () => new providers.InfuraProvider("goerli", "fe6db57057904042b7fed23ff54c643d"),
  BNB_MAINNET: () => new providers.JsonRpcProvider("https://bsc.nodereal.io/"),
  BNB_TESTNET: () => new providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"),
  POLYGON_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/polygon"),
  POLYGON_MUMBAI: () => new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai"),
  RSK_MAINNET: () => new providers.JsonRpcProvider("https://public-node.rsk.co"),
  GNOSIS_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/gnosis"),
  AVALANCHE_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/avalanche"),
  AVALANCHE_FUJI: () => new providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji"),
  FANTOM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/fantom"),
  FANTOM_TESTNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet"),
  ARBITRUM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/arbitrum"),
  ARBITRUM_GOERLI: () =>
    new providers.JsonRpcProvider("https://arb-goerli.g.alchemy.com/v2/AwZE27jvfRidiu-6FFunBzP3Bff0XFNx"),
  HECO_MAINNET: () => new providers.JsonRpcProvider("https://http-mainnet.hecochain.com"),
  OPTIMISM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/optimism"),
  OPTIMISM_GOERLI: () =>
    new providers.JsonRpcProvider("https://opt-goerli.g.alchemy.com/v2/5lHtpzqF7gxVKsSfpyoUbisei8OwoIRS"),
  HARMONY_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/harmony"),
  MOONRIVER_MAINNET: () => new providers.JsonRpcProvider("https://rpc.api.moonriver.moonbeam.network"),
  MOONBEAM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/moonbeam"),
  METIS_MAINNET: () => new providers.JsonRpcProvider("https://andromeda.metis.io/?owner=1088"),
  KLAYTN_BAOBAB: () => new providers.JsonRpcProvider("https://api.baobab.klaytn.net:8651"),
}
