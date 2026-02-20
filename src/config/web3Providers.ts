/* eslint-disable no-unused-vars */

import { InfuraProvider, JsonRpcProvider, Provider, Network } from "ethers"
import { SupportedChain } from "./types.ts"
import { getChainId } from "~/features/utils/index.ts"

export const chainToProvider: Record<SupportedChain, () => Provider> = {
  ETHEREUM_MAINNET: () => new InfuraProvider("homestead", "fe6db57057904042b7fed23ff54c643d"),
  ETHEREUM_SEPOLIA: () => new JsonRpcProvider("https://rpc.ankr.com/eth_sepolia"),
  BNB_MAINNET: () => new JsonRpcProvider("https://bsc.nodereal.io/"),
  BNB_TESTNET: () => new JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"),
  POLYGON_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/polygon"),
  POLYGON_AMOY: () => new JsonRpcProvider("https://rpc.ankr.com/polygon_amoy"),
  GNOSIS_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/gnosis"),
  GNOSIS_CHIADO: () => new JsonRpcProvider("https://rpc.chiadochain.net"),
  AVALANCHE_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/avalanche"),
  AVALANCHE_FUJI: () => new JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji"),
  FANTOM_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/fantom"),
  FANTOM_TESTNET: () => new JsonRpcProvider("https://rpc.ankr.com/fantom_testnet"),
  ARBITRUM_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/arbitrum"),
  ARBITRUM_SEPOLIA: () => new JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc"),
  OPTIMISM_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/optimism"),
  OPTIMISM_SEPOLIA: () => new JsonRpcProvider("https://sepolia.optimism.io/"),
  MOONRIVER_MAINNET: () => new JsonRpcProvider("https://rpc.api.moonriver.moonbeam.network"),
  MOONBEAM_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/moonbeam"),
  METIS_MAINNET: () => new JsonRpcProvider("https://andromeda.metis.io/?owner=1088"),
  METIS_SEPOLIA: () => new JsonRpcProvider("https://sepolia.metisdevops.link"),
  BASE_MAINNET: () => new JsonRpcProvider("https://mainnet.base.org"),
  BASE_SEPOLIA: () => new JsonRpcProvider("https://base-sepolia-rpc.publicnode.com"),
  SCROLL_MAINNET: () => new JsonRpcProvider("https://rpc.scroll.io"),
  SCROLL_SEPOLIA: () => new JsonRpcProvider("https://sepolia-rpc.scroll.io"),
  CELO_MAINNET: () => new JsonRpcProvider("https://alfajores-forno.celo-testnet.org"),
  CELO_ALFAJORES: () => new JsonRpcProvider("https://forno.celo.org"),
  LINEA_MAINNET: () => new JsonRpcProvider("https://rpc.linea.build"),
  LINEA_SEPOLIA: () => new JsonRpcProvider("https://linea-sepolia-rpc.publicnode.com"),
  POLYGON_ZKEVM_MAINNET: () => new JsonRpcProvider("https://zkevm-rpc.com"),
  POLYGON_ZKEVM_CARDONA: () => new JsonRpcProvider("https://rpc.cardona.zkevm-rpc.com"),
  ZKSYNC_MAINNET: () => new JsonRpcProvider("https://mainnet.era.zksync.io"),
  ZKSYNC_SEPOLIA: () => new JsonRpcProvider("https://sepolia.era.zksync.dev"),
  KROMA_MAINNET: () => new JsonRpcProvider("https://1rpc.io/kroma"),
  KROMA_SEPOLIA: () => new JsonRpcProvider("https://api.sepolia.kroma.network"),
  WEMIX_MAINNET: () => new JsonRpcProvider("https://api.wemix.com"),
  WEMIX_TESTNET: () => new JsonRpcProvider("https://api.test.wemix.com"),
  MODE_MAINNET: () => new JsonRpcProvider("https://mainnet.mode.network"),
  MODE_SEPOLIA: () => new JsonRpcProvider("https://sepolia.mode.network"),
  BLAST_MAINNET: () => new JsonRpcProvider("https://rpc.blast.io"),
  BLAST_SEPOLIA: () => new JsonRpcProvider("https://sepolia.blast.io"),
  SONEIUM_MAINNET: () => new JsonRpcProvider("https://rpc.soneium.org"),
  SONEIUM_MINATO: () => new JsonRpcProvider("https://rpc.minato.soneium.org"),
  ETHEREUM_HOLESKY: () => new JsonRpcProvider("https://ethereum-holesky-rpc.publicnode.com"),
  ETHEREUM_HOODI: () => new JsonRpcProvider("https://rpc.hoodi.ethpandaops.io"),
  ASTAR_MAINNET: () => new JsonRpcProvider("https://rpc.astar.network"),
  ASTAR_SHIBUYA: () => new JsonRpcProvider("https://evm.shibuya.astar.network/"),
  ZIRCUIT_MAINNET: () => new JsonRpcProvider("https://zircuit1-mainnet.liquify.com"),
  ZIRCUIT_TESTNET: () => new JsonRpcProvider("https://zircuit1-testnet.p2pify.com"),
  MANTLE_MAINNET: () => new JsonRpcProvider("https://rpc.mantle.xyz"),
  MANTLE_SEPOLIA: () => new JsonRpcProvider("https://rpc.sepolia.mantle.xyz"),
  RONIN_MAINNET: () => new JsonRpcProvider("https://ronin.lgns.net/rpc"),
  RONIN_SAIGON: () => new JsonRpcProvider("https://saigon-testnet.roninchain.com/rpc"),
  BSQUARED_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/b2"),
  BSQUARED_TESTNET: () => new JsonRpcProvider("https://rpc.ankr.com/b2_testnet"),
  SHIBARIUM_MAINNET: () => new JsonRpcProvider("https://www.shibrpc.com"),
  SHIBARIUM_PUPPYNET: () => new JsonRpcProvider("https://puppynet.shibrpc.com"),
  SONIC_MAINNET: () => new JsonRpcProvider("https://rpc.ankr.com/sonic_mainnet"),
  SONIC_TESTNET: () => new JsonRpcProvider("https://rpc.testnet.soniclabs.com"),
  SONIC_TESTNET_BLAZE: () => new JsonRpcProvider("https://rpc.blaze.soniclabs.com"),
  BOB_MAINNET: () => new JsonRpcProvider("https://rpc.gobob.xyz"),
  BOB_SEPOLIA: () => new JsonRpcProvider("https://bob-sepolia.rpc.gobob.xyz"),
  WORLD_MAINNET: () => new JsonRpcProvider("https://worldchain.drpc.org"),
  WORLD_SEPOLIA: () => new JsonRpcProvider("https://worldchain-sepolia.gateway.tenderly.co"),
  XLAYER_MAINNET: () => new JsonRpcProvider("https://rpc.xlayer.tech"),
  XLAYER_TESTNET: () => new JsonRpcProvider("https://testrpc.xlayer.tech/terigon"),
  BITLAYER_MAINNET: () => new JsonRpcProvider("https://rpc.bitlayer.org"),
  BITLAYER_TESTNET: () => new JsonRpcProvider("https://testnet-rpc.bitlayer-rpc.com"),
  INK_MAINNET: () => new JsonRpcProvider("https://rpc-qnd.inkonchain.com"),
  INK_SEPOLIA: () => new JsonRpcProvider("https://ink-sepolia.drpc.org"),
  HASHKEY_MAINNET: () => new JsonRpcProvider("https://mainnet.hsk.xyz"),
  HASHKEY_TESTNET: () => new JsonRpcProvider("https://hashkeychain-testnet.alt.technology"),
  CORN_MAINNET: () => new JsonRpcProvider("https://mainnet.corn-rpc.com"),
  CORN_TESTNET: () => new JsonRpcProvider("https://testnet.corn-rpc.com"),
  BOTANIX_TESTNET: () => new JsonRpcProvider("https://node.botanixlabs.dev"),
  SEI_MAINNET: () => new JsonRpcProvider("https://evm-rpc.sei-apis.com"),
  SEI_TESTNET: () => new JsonRpcProvider("https://evm-rpc-testnet.sei-apis.com"),
  CORE_TESTNET: () => new JsonRpcProvider("https://rpc.test2.btcs.network/"),
  CORE_MAINNET: () => new JsonRpcProvider("https://scan.coredao.org"),
  MONAD_TESTNET: () => new JsonRpcProvider("https://monad.xyz"),
  TREASURE_MAINNET: () => new JsonRpcProvider("https://rpc.treasure.lol"),
  TREASURE_TOPAZ: () => new JsonRpcProvider("https://rpc.topaz.treasure.lol"),
  LENS_SEPOLIA: () => new JsonRpcProvider("https://rpc.testnet.lens.xyz"),
  LENS_MAINNET: () => new JsonRpcProvider("https://rpc.lens.xyz"),
  BERACHAIN_MAINNET: () => new JsonRpcProvider("https://rpc.berachain.com"),
  BERACHAIN_BARTIO: () => new JsonRpcProvider("https://bartio.rpc.berachain.com"),
  HYPEREVM_MAINNET: () => new JsonRpcProvider("https://hyperevmscan.io/"),
  HYPEREVM_TESTNET: () => new JsonRpcProvider("https://hyperevmscan.io/"),
  MERLIN_TESTNET: () => new JsonRpcProvider("https://testnet-rpc.merlinchain.io/"),
  MERLIN_MAINNET: () => new JsonRpcProvider("https://rpc.merlinchain.io"),
  FRAXTAL_TESTNET: () => new JsonRpcProvider("https://rpc.testnet.frax.com"),
  FRAXTAL_MAINNET: () => new JsonRpcProvider("https://rpc.frax.com"),
  HEDERA_TESTNET: () => new JsonRpcProvider("https://testnet.hashio.io/api"),
  HEDERA_MAINNET: () => new JsonRpcProvider("https://mainnet.hashio.io/api"),
  UNICHAIN_SEPOLIA: () => new JsonRpcProvider("https://sepolia.unichain.org"),
  UNICHAIN_MAINNET: () => new JsonRpcProvider("https://mainnet.unichain.org/"),
  APECHAIN_CURTIS: () => new JsonRpcProvider("https://curtis.hub.caldera.xyz"),
  APECHAIN_MAINNET: () => new JsonRpcProvider("https://rpc.apechain.com"),
  CRONOS_TESTNET: () => new JsonRpcProvider("https://cronos.org"),
  CRONOS_MAINNET: () => new JsonRpcProvider("https://evm.cronos.org"),
  CRONOS_ZKEVM_TESTNET: () => new JsonRpcProvider("https://testnet.zkevm.cronos.org"),
  CRONOS_ZKEVM_MAINNET: () => new JsonRpcProvider("https://mainnet.zkevm.cronos.org"),
  HEMI_SEPOLIA: () => new JsonRpcProvider("https://testnet.rpc.hemi.network/rpc"),
  HEMI_MAINNET: () => new JsonRpcProvider("https://rpc.hemi.network/rpc"),
  MIND_NETWORK_TESTNET: () => new JsonRpcProvider("https://rpc-testnet.mindnetwork.xyz"),
  MIND_NETWORK_MAINNET: () => new JsonRpcProvider("https://rpc-mainnet.mindnetwork.xyz"),
  MEGAETH_TESTNET: () => new JsonRpcProvider("https://carrot.megaeth.com/rpc"),
  MEGAETH_MAINNET: () => new JsonRpcProvider("https://timothy.megaeth.com/rpc"),
  "0G_GALILEO_TESTNET": () => new JsonRpcProvider("https://evmrpc-testnet.0g.ai/"),
  "0G_MAINNET": () => new JsonRpcProvider("https://evmrpc.0g.ai/"),
  TAIKO_MAINNET: () => new JsonRpcProvider("https://rpc.mainnet.taiko.xyz"),
  TAIKO_HEKLA: () => new JsonRpcProvider("https://rpc.hekla.taiko.xyz"),
  PLUME_SEPOLIA: () => new JsonRpcProvider("https://testnet-rpc.plumenetwork.xyz"),
  PLUME_MAINNET: () => new JsonRpcProvider("https://phoenix-rpc.plumenetwork.xyz"),
  SOLANA_DEVNET: () => new JsonRpcProvider("https://api.devnet.solana.com"),
  SOLANA_MAINNET: () => new JsonRpcProvider("https://api.mainnet-beta.solana.com"),
  TRON_MAINNET: () => new JsonRpcProvider("https://api.trongrid.io/jsonrpc"),
  TRON_SHASTA: () => new JsonRpcProvider("https://api.shasta.trongrid.io/jsonrpc"),
  ABSTRACT_MAINNET: () => new JsonRpcProvider("https://api.mainnet.abs.xyz"),
  ABSTRACT_TESTNET: () => new JsonRpcProvider("https://api.testnet.abs.xyz"),
  LISK_MAINNET: () => new JsonRpcProvider("https://rpc.api.lisk.com"),
  LISK_TESTNET: () => new JsonRpcProvider("https://rpc.sepolia-api.lisk.com"),
  ZORA_MAINNET: () => new JsonRpcProvider("https://rpc.zora.energy/"),
  ZORA_TESTNET: () => new JsonRpcProvider("https://sepolia.rpc.zora.energy"),
  MINT_MAINNET: () => new JsonRpcProvider("https://rpc.mintchain.io"),
  MINT_TESTNET: () => new JsonRpcProvider("https://sepolia-testnet-rpc.mintchain.io"),
  SUPERSEED_MAINNET: () => new JsonRpcProvider("https://mainnet.superseed.xyz"),
  SUPERSEED_TESTNET: () => new JsonRpcProvider("https://sepolia.superseed.xyz"),
  METAL_MAINNET: () => new JsonRpcProvider("https://rpc.metall2.com"),
  METAL_TESTNET: () => new JsonRpcProvider("https://testnet.rpc.metall2.com"),
  ROOTSTOCK_MAINNET: () => new JsonRpcProvider("https://public-node.rsk.co"),
  ROOTSTOCK_TESTNET: () => new JsonRpcProvider("https://public-node.testnet.rsk.co"),
  GRAVITY_MAINNET: () => new JsonRpcProvider("https://rpc.gravity.xyz"),
  GRAVITY_TESTNET: () => new JsonRpcProvider("https://rpc-sepolia.gravity.xyz"),
  ETHERLINK_MAINNET: () => new JsonRpcProvider("https://node.mainnet.etherlink.com"),
  ETHERLINK_TESTNET: () => new JsonRpcProvider("https://node.ghostnet.etherlink.com"),
  OPBNB_MAINNET: () => new JsonRpcProvider("https://opbnb-mainnet-rpc.bnbchain.org"),
  OPBNB_TESTNET: () => new JsonRpcProvider("https://opbnb-testnet-rpc.bnbchain.org"),
  JANCTION_MAINNET: () => new JsonRpcProvider("https://rpc.janction.io"),
  JANCTION_TESTNET: () => new JsonRpcProvider("https://rpc_testnet.janction.io"),
  NEO_X_MAINNET: () => new JsonRpcProvider("https://mainnet-1.rpc.banelabs.org"),
  NEO_X_TESTNET: () => new JsonRpcProvider("https://testnet.rpc.banelabs.org"),
  KATANA_TATARA: () => new JsonRpcProvider("https://rpc.tatara.katanarpc.com"),
  KATANA_MAINNET: () => new JsonRpcProvider("https://rpc.katanarpc.com"),
  BOTANIX_MAINNET: () => new JsonRpcProvider("https://rpc.botanix.org"),
  APTOS_MAINNET: () => new JsonRpcProvider("https://fullnode.mainnet.aptoslabs.com/v1"),
  APTOS_TESTNET: () => new JsonRpcProvider("https://fullnode.testnet.aptoslabs.com/v1"),
  KAIA_MAINNET: () => new JsonRpcProvider("https://public-en.node.kaia.io"),
  KAIA_TESTNET_KAIROS: () => new JsonRpcProvider("https://public-en-kairos.node.kaia.io"),
  TAC_MAINNET: () => new JsonRpcProvider("https://rpc.tac.build"),
  TAC_TESTNET: () => new JsonRpcProvider("https://spb.rpc.tac.build"),
  PLASMA_MAINNET: () => new JsonRpcProvider("https://rpc.plasma.to"),
  PLASMA_TESTNET: () => new JsonRpcProvider("https://testnet-rpc.plasma.to"),
  MEMENTO_MAINNET: () => new JsonRpcProvider("https://rpc.mementoblockchain.com"),
  MEMENTO_TESTNET: () => new JsonRpcProvider("https://testnet-rpc.mementoblockchain.com"),
  XDC_MAINNET: () => new JsonRpcProvider("https://erpc.xinfin.network"),
  XDC_TESTNET: () => new JsonRpcProvider("https://rpc.apothem.network/"),
  BITTENSOR_MAINNET: () => new JsonRpcProvider("https://lite.chain.opentensor.ai"),
  EVERCLEAR_MAINNET: () => new JsonRpcProvider("https://rpc.everclear.raas.gelato.cloud"),
  AB_CHAIN_MAINNET: () => new JsonRpcProvider("https://rpc.core.ab.org"),
  MONAD_MAINNET: () => new JsonRpcProvider("https://rpc3.monad.xyz"),
  NEXON_HENESYS_MAINNET: () => new JsonRpcProvider("https://henesys-rpc.msu.io/"),
  PHAROS_ATLANTIC_TESTNET: () => new JsonRpcProvider("https://atlantic.dplabs-internal.com/"),
  PHAROS_MAINNET: () => new JsonRpcProvider(),
  MORPH_MAINNET: () => new JsonRpcProvider("https://rpc.morphl2.io"),
  MORPH_HOODI_TESTNET: () => new JsonRpcProvider("https://rpc-hoodi.morphl2.io/"),
  JOVAY_MAINNET: () => new JsonRpcProvider("https://rpc.jovay.io"),
  JOVAY_TESTNET: () => new JsonRpcProvider("https://api.zan.top/public/jovay-testnet"),
  STABLE_MAINNET: () => new JsonRpcProvider("https://rpc.stable.xyz"),
  TEMPO_TESTNET: () => new JsonRpcProvider("https://rpc.testnet.tempo.xyz"),
  ARC_NETWORK_TESTNET: () => new JsonRpcProvider("https://rpc.testnet.arc.network"),
  DOGE_OS_CHIKYU_TESTNET: () => new JsonRpcProvider("https://rpc.testnet.dogeos.com/"),
  ADI_NETWORK_AB_TESTNET: () => new JsonRpcProvider("https://rpc.ab.testnet.adifoundation.ai/"),
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

// TODO: This is a temporary function to get a provider for a chain depending on chainType
// Supports only evm chains for now
export const getProviderForChain = (chain: SupportedChain): JsonRpcProvider => {
  const rpcUrl = getRpcUrlForChain(chain)
  const chainId = getChainId(chain)

  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chain ${chain} - ${chainId}`)
  }

  if (!chainId) {
    throw new Error(`No chain ID found for chain ${chain}`)
  }

  // Create a Network instance for static configuration
  const network = Network.from({
    chainId: chainId as number,
    name: chain.toLowerCase(),
  })

  // Create provider with static network to prevent auto-detection
  const provider = new JsonRpcProvider(rpcUrl, network, {
    staticNetwork: network,
    polling: false,
  })

  return provider
}
