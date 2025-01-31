/* eslint-disable no-unused-vars */

import { providers } from "ethers"
import { SupportedChain } from "."

export const chainToProvider: Record<SupportedChain, () => providers.Provider> = {
  ETHEREUM_MAINNET: () => new providers.InfuraProvider("homestead", "fe6db57057904042b7fed23ff54c643d"),
  ETHEREUM_SEPOLIA: () => new providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia"),
  BNB_MAINNET: () => new providers.JsonRpcProvider("https://bsc.nodereal.io/"),
  BNB_TESTNET: () => new providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"),
  POLYGON_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/polygon"),
  POLYGON_AMOY: () => new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_amoy"),
  GNOSIS_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/gnosis"),
  GNOSIS_CHIADO: () => new providers.JsonRpcProvider("https://rpc.chiadochain.net"),
  AVALANCHE_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/avalanche"),
  AVALANCHE_FUJI: () => new providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji"),
  FANTOM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/fantom"),
  FANTOM_TESTNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet"),
  ARBITRUM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/arbitrum"),
  ARBITRUM_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc"),
  OPTIMISM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/optimism"),
  OPTIMISM_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia.optimism.io/"),
  MOONRIVER_MAINNET: () => new providers.JsonRpcProvider("https://rpc.api.moonriver.moonbeam.network"),
  MOONBEAM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/moonbeam"),
  METIS_MAINNET: () => new providers.JsonRpcProvider("https://andromeda.metis.io/?owner=1088"),
  METIS_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia.metisdevops.link"),
  BASE_MAINNET: () => new providers.JsonRpcProvider("https://mainnet.base.org"),
  BASE_SEPOLIA: () => new providers.JsonRpcProvider("https://base-sepolia-rpc.publicnode.com"),
  SCROLL_MAINNET: () => new providers.JsonRpcProvider("https://rpc.scroll.io"),
  SCROLL_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia-rpc.scroll.io"),
  CELO_MAINNET: () => new providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org"),
  CELO_ALFAJORES: () => new providers.JsonRpcProvider("https://forno.celo.org"),
  LINEA_MAINNET: () => new providers.JsonRpcProvider("https://rpc.linea.build"),
  LINEA_SEPOLIA: () => new providers.JsonRpcProvider("https://linea-sepolia-rpc.publicnode.com"),
  POLYGON_ZKEVM_MAINNET: () => new providers.JsonRpcProvider("https://zkevm-rpc.com"),
  POLYGON_ZKEVM_CARDONA: () => new providers.JsonRpcProvider("https://rpc.cardona.zkevm-rpc.com"),
  ZKSYNC_MAINNET: () => new providers.JsonRpcProvider("https://mainnet.era.zksync.io"),
  ZKSYNC_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia.era.zksync.dev"),
  KROMA_MAINNET: () => new providers.JsonRpcProvider("https://1rpc.io/kroma"),
  KROMA_SEPOLIA: () => new providers.JsonRpcProvider("https://api.sepolia.kroma.network"),
  WEMIX_MAINNET: () => new providers.JsonRpcProvider("https://api.wemix.com"),
  WEMIX_TESTNET: () => new providers.JsonRpcProvider("https://api.test.wemix.com"),
  MODE_MAINNET: () => new providers.JsonRpcProvider("https://mainnet.mode.network"),
  MODE_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia.mode.network"),
  BLAST_MAINNET: () => new providers.JsonRpcProvider("https://rpc.blast.io"),
  BLAST_SEPOLIA: () => new providers.JsonRpcProvider("https://sepolia.blast.io"),
  SONEIUM_MAINNET: () => new providers.JsonRpcProvider("https://rpc.soneium.org"),
  SONEIUM_MINATO: () => new providers.JsonRpcProvider("https://rpc.minato.soneium.org"),
  ETHEREUM_HOLESKY: () => new providers.JsonRpcProvider("https://ethereum-holesky-rpc.publicnode.com"),
  ASTAR_MAINNET: () => new providers.JsonRpcProvider("https://rpc.astar.network"),
  ASTAR_SHIBUYA: () => new providers.JsonRpcProvider("https://evm.shibuya.astar.network/"),
  ZIRCUIT_MAINNET: () => new providers.JsonRpcProvider("https://zircuit1-mainnet.liquify.com"),
  ZIRCUIT_TESTNET: () => new providers.JsonRpcProvider("https://zircuit1-testnet.p2pify.com"),
  MANTLE_MAINNET: () => new providers.JsonRpcProvider("https://rpc.mantle.xyz"),
  MANTLE_SEPOLIA: () => new providers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz"),
  RONIN_MAINNET: () => new providers.JsonRpcProvider("https://ronin.lgns.net/rpc"),
  RONIN_SAIGON: () => new providers.JsonRpcProvider("https://saigon-testnet.roninchain.com/rpc"),
  BSQUARED_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/b2"),
  BSQUARED_TESTNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/b2_testnet"),
  SHIBARIUM_MAINNET: () => new providers.JsonRpcProvider("https://www.shibrpc.com"),
  SHIBARIUM_PUPPYNET: () => new providers.JsonRpcProvider("https://puppynet.shibrpc.com"),
  SONIC_MAINNET: () => new providers.JsonRpcProvider("https://rpc.ankr.com/sonic_mainnet"),
  SONIC_BLAZE: () => new providers.JsonRpcProvider("https://rpc.ankr.com/sonic_blaze_testnet"),
  BOB_MAINNET: () => new providers.JsonRpcProvider("https://rpc.gobob.xyz"),
  BOB_SEPOLIA: () => new providers.JsonRpcProvider("https://bob-sepolia.rpc.gobob.xyz"),
  WORLD_MAINNET: () => new providers.JsonRpcProvider("https://worldchain.drpc.org"),
  WORLD_SEPOLIA: () => new providers.JsonRpcProvider("https://worldchain-sepolia.gateway.tenderly.co"),
  XLAYER_MAINNET: () => new providers.JsonRpcProvider("https://rpc.xlayer.tech"),
  XLAYER_TESTNET: () => new providers.JsonRpcProvider("https://testrpc.xlayer.tech"),
  BITLAYER_MAINNET: () => new providers.JsonRpcProvider("https://rpc.bitlayer.org"),
  BITLAYER_TESTNET: () => new providers.JsonRpcProvider("https://testnet-rpc.bitlayer-rpc.com"),
  INK_MAINNET: () => new providers.JsonRpcProvider("https://rpc-qnd.inkonchain.com"),
  INK_SEPOLIA: () => new providers.JsonRpcProvider("https://ink-sepolia.drpc.org"),
  HASHKEY_MAINNET: () => new providers.JsonRpcProvider("https://mainnet.hsk.xyz"),
  HASHKEY_TESTNET: () => new providers.JsonRpcProvider("https://hashkeychain-testnet.alt.technology"),
  CORN_MAINNET: () => new providers.JsonRpcProvider("https://mainnet.corn-rpc.com"),
  CORN_TESTNET: () => new providers.JsonRpcProvider("https://testnet.corn-rpc.com"),
  BOTANIX_TESTNET: () => new providers.JsonRpcProvider("https://node.botanixlabs.dev"),
  SEI_MAINNET: () => new providers.JsonRpcProvider("https://evm-rpc.sei-apis.com"),
  SEI_TESTNET: () => new providers.JsonRpcProvider("https://evm-rpc-testnet.sei-apis.com"),
}

export const getRpcUrlForChain = (chain: SupportedChain): string => {
  const envVarName = `${chain}_RPC_URL`
  const rpcUrl = process.env[envVarName]

  if (!rpcUrl) {
    console.warn(`Environment variable ${envVarName} is not set for chain ${chain}`)
    return ""
  }

  return rpcUrl
}

export const getProviderForChain = (chain: SupportedChain): providers.JsonRpcProvider => {
  const rpcUrl = getRpcUrlForChain(chain)
  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chain ${chain}`)
  }
  return new providers.JsonRpcProvider(rpcUrl)
}
