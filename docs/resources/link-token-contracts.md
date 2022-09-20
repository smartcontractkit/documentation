---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'LINK Token Contracts'
permalink: 'docs/link-token-contracts/'
metadata:
  title: 'LINK Token Contracts'
  description: 'Addresses for the LINK token on supported networks.'
  linkToWallet: true
  image:
    0: '/files/72d4bd9-link.png'
---

LINK tokens are used to pay node operators for retrieving data for smart contracts and also for deposits placed by node operators as required by contract creators. The smallest denomination of LINK is called a Juel, and 1,000,000,000,000,000,000 (1e18) Juels are equal to 1 LINK. This is similar to Wei, which is the [smallest denomination of ETH](https://ethereum.org/en/developers/docs/intro-to-ether/#denominations).

The LINK token is an ERC677 token that inherits functionality from the ERC20 token standard and allows token transfers to contain a data payload. Read more about the [ERC677 transferAndCall token standard](https://github.com/ethereum/EIPs/issues/677).

**Networks:**

- [Ethereum](#ethereum)
- [BNB Chain](#bnb-chain)
- [Polygon (Matic)](#polygon-matic)
- [RSK](#rsk)
- [Gnosis Chain (xDai)](#gnosis-chain-xdai)
- [Avalanche](#avalanche)
- [Fantom](#fantom)
- [Arbitrum](#arbitrum)
- [HECO Chain](#heco-chain)
- [Optimism](#optimism)
- [Harmony](#harmony)
- [Moonriver](#moonriver)
- [Moonbeam](#moonbeam)
- [Metis](#metis)
- [Klaytn](#klaytn)

## Ethereum

### Ethereum Mainnet

| Parameter      | Value                                                                                                                                                                                                        |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `1`                                                                                                                                                                                                          |
| Address        | <a class="erc-token-address" id="1_0x514910771AF9Ca656af840dff83E8264EcF986CA" href="https://etherscan.io/token/0x514910771AF9Ca656af840dff83E8264EcF986CA">`0x514910771AF9Ca656af840dff83E8264EcF986CA`</a> |
| Name           | Chainlink Token                                                                                                                                                                                              |
| Symbol         | LINK                                                                                                                                                                                                         |
| Decimals       | 18                                                                                                                                                                                                           |
| Network status | [ethstats.net](https://ethstats.net/)                                                                                                                                                                        |

### Goerli testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/goerli). Testnet ETH is available at [goerlifaucet.com](https://goerlifaucet.com/) or the faucets listed at [faucetlink.to/goerli](https://faucetlink.to/goerli).

| Parameter      | Value                                                                                                                                                                                                                 |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `5`                                                                                                                                                                                                                   |
| Address        | <a class="erc-token-address" id="5_0x326C977E6efc84E512bB9C30f76E30c160eD06FB" href="https://goerli.etherscan.io/token/0x326C977E6efc84E512bB9C30f76E30c160eD06FB">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`</a>   |
| Name           | Chainlink Token                                                                                                                                                                                                       |
| Symbol         | LINK                                                                                                                                                                                                                  |
| Decimals       | 18                                                                                                                                                                                                                    |

## BNB Chain

### BNB Chain mainnet

BNB is used to pay for transactions on the BNB Chain mainnet.

> 🚧 ERC-677 LINK on BNB Chain
>
> The LINK provided by the [BNB Chain Bridge](https://www.bnbchain.world/en/bridge) is not ERC-677 compatible, so you cannot use it with Chainlink services or oracle nodes. Use the [**Chainlink PegSwap service**](https://pegswap.chain.link/) to convert bridged LINK to the official ERC-677 LINK token on BNB Chain.

| Parameter      | Value                                                                                                                                                                                                        |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `56`                                                                                                                                                                                                         |
| Address        | <a class="erc-token-address" id="56_0x404460c6a5ede2d891e8297795264fde62adbb75" href="https://bscscan.com/token/0x404460c6a5ede2d891e8297795264fde62adbb75">`0x404460c6a5ede2d891e8297795264fde62adbb75`</a> |
| Name           | Chainlink Token                                                                                                                                                                                              |
| Symbol         | LINK                                                                                                                                                                                                         |
| Decimals       | 18                                                                                                                                                                                                           |
| Network status | [bscscan.freshstatus.io](https://bscscan.freshstatus.io/)                                                                                                                                                    |

### BNB Chain testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/chapel). Testnet BNB is availalbe at [testnet.binance.org/faucet-smart](https://testnet.binance.org/faucet-smart).

| Parameter      | Value                                                                                                                                                                                                                  |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `97`                                                                                                                                                                                                                   |
| Address        | <a class="erc-token-address" id="97_0x84b9b910527ad5c03a9ca831909e21e236ea7b06" href="https://testnet.bscscan.com/address/0x84b9b910527ad5c03a9ca831909e21e236ea7b06">`0x84b9b910527ad5c03a9ca831909e21e236ea7b06`</a> |
| Name           | Chainlink Token                                                                                                                                                                                                        |
| Symbol         | LINK                                                                                                                                                                                                                   |
| Decimals       | 18                                                                                                                                                                                                                     |

## Polygon (Matic)

### Polygon mainnet

MATIC is used to pay for transactions on Polygon. You can use the [Polygon Bridge](https://wallet.polygon.technology/bridge) to transfer tokens to Polygon mainnet and then use [Polygon Gas Swap](https://wallet.polygon.technology/gas-swap/) to swap supported tokens to MATIC.

> 🚧 ERC-677 LINK on Polygon
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so you cannot use it with Chainlink services or oracle nodes. Use the [**Chainlink PegSwap service**](https://pegswap.chain.link/) to convert bridged LINK to the official ERC-677 LINK token on Polygon.
>
> Watch the [Moving Chainlink Cross-Chains](https://www.youtube.com/watch?v=WKvIGkBWRUA) video to learn more.

| Parameter      | Value                                                                                                                                                                                                               |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ETH_CHAIN_ID` | `137`                                                                                                                                                                                                               |
| Address        | <a class="erc-token-address" id="137_0xb0897686c545045afc77cf20ec7a532e3120e0f1" href="https://polygonscan.com/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1">`0xb0897686c545045afc77cf20ec7a532e3120e0f1`</a> |
| Name           | Chainlink Token                                                                                                                                                                                                     |
| Symbol         | LINK                                                                                                                                                                                                                |
| Decimals       | 18                                                                                                                                                                                                                  |
| Network status | [polygon.io/system](https://polygon.io/system)                                                                                                                                                                      |

### Mumbai testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/mumbai). Testnet MATIC is available at the [Polygon faucet](https://faucet.polygon.technology/).

| Parameter      | Value                                                                                                                                                                                                                         |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `80001`                                                                                                                                                                                                                       |
| Address        | <a class="erc-token-address" id="80001_0x326C977E6efc84E512bB9C30f76E30c160eD06FB" href="https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB `</a> |
| Name           | Chainlink Token                                                                                                                                                                                                               |
| Symbol         | LINK                                                                                                                                                                                                                          |
| Decimals       | 18                                                                                                                                                                                                                            |

## RSK

### RSK mainnet

RBTC is used to pay for transactions on RSK mainnet. Use [RSK’s built in PowPeg](https://developers.rsk.co/guides/get-crypto-on-rsk/powpeg-btc-rbtc/) to transfer BTC to RSK mainnet as RBTC. You can use the [RSK bridge](https://tokenbridge.rsk.co/) to send LINK from Ethereum Mainnet to RSK.

| Parameter      | Value                                                                                                                                                                                                              |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `30`                                                                                                                                                                                                               |
| Address        | <a class="erc-token-address" id="30_0x14adae34bef7ca957ce2dde5add97ea050123827" href="https://explorer.rsk.co/address/0x14adae34bef7ca957ce2dde5add97ea050123827">`0x14adae34bef7ca957ce2dde5add97ea050123827`</a> |
| Name           | rLINK                                                                                                                                                                                                              |
| Symbol         | rLINK                                                                                                                                                                                                              |
| Decimals       | 18                                                                                                                                                                                                                 |

## Gnosis Chain (xDai)

### Gnosis Chain mainnet

xDAI is used to pay for transactions on Gnosis Chain mainnet. Use the [xDai Bridge](https://bridge.gnosischain.com/) to send DAI from Ethereum Mainnet to Gnosis Chain and convert it to xDAI. Use [OmniBridge](https://omni.gnosischain.com/bridge) to send LINK from Ethereum Mainnet to Gnosis Chain.

| Parameter      | Value                                                                                                                                                                                                                       |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `100`                                                                                                                                                                                                                       |
| Address        | <a class="erc-token-address" id="100_0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2" href="https://blockscout.com/poa/xdai/address/0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2">`0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2`</a> |
| Name           | Chainlink Token on Gnosis Chain (xDai)                                                                                                                                                                                      |
| Symbol         | LINK                                                                                                                                                                                                                        |
| Decimals       | 18                                                                                                                                                                                                                          |
| Network status | [blockscout.com/xdai/mainnet](https://blockscout.com/xdai/mainnet/)                                                                                                                                                         |

## Avalanche

### Avalanche mainnet

AVAX is the token you use to pay for transactions on Avalanche mainnet. Use the [Avalanche Bridge](https://bridge.avax.network/) to transfer LINK from Ethereum Mainnet to Avalanche.

| Parameter      | Value                                                                                                                                                                                                              |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `43114`                                                                                                                                                                                                            |
| Address        | <a class="erc-token-address" id="43114_0x5947BB275c521040051D82396192181b413227A3" href="https://snowtrace.io/address/0x5947BB275c521040051D82396192181b413227A3">`0x5947BB275c521040051D82396192181b413227A3`</a> |
| Name           | Chainlink Token on Avalanche                                                                                                                                                                                       |
| Symbol         | LINK                                                                                                                                                                                                               |
| Decimals       | 18                                                                                                                                                                                                                 |
| Network status | [status.avax.network](https://status.avax.network/)                                                                                                                                                                |

### Fuji testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/fuji). Testnet AVAX is available at [faucet.avax.network](https://faucet.avax.network/).

| Parameter      | Value                                                                                                                                                                                                                      |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `43113`                                                                                                                                                                                                                    |
| Address        | <a class="erc-token-address" id="43113_0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846" href="https://testnet.snowtrace.io/address/0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846">`0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`</a> |
| Name           | Chainlink Token on Avalanche                                                                                                                                                                                               |
| Symbol         | LINK                                                                                                                                                                                                                       |
| Decimals       | 18                                                                                                                                                                                                                         |

## Fantom

### Fantom mainnet

FTM is used to pay for transactions on Fantom Mainnet. Use [bridge.multichain.org](https://bridge.multichain.org/#/router) to transfer FTM and LINK to Fantom mainnet.

> 🚧 ERC-677 LINK on Fantom
>
> You must use ERC-677 LINK on Fantom. ERC-20 LINK will not work with Chainlink services.
> When you use [bridge.multichain.org](https://bridge.multichain.org/#/router) to send LINK to the Fantom network, be sure to select LINK-ERC677 as the token you will receive on Fantom mainnet.

| Parameter      | Value                                                                                                                                                                                                           |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `250`                                                                                                                                                                                                           |
| Address        | <a class="erc-token-address" id="250_0x6F43FF82CCA38001B6699a8AC47A2d0E66939407" href="https://ftmscan.com/address/0x6F43FF82CCA38001B6699a8AC47A2d0E66939407">`0x6F43FF82CCA38001B6699a8AC47A2d0E66939407`</a> |
| Name           | Chainlink Token on Fantom                                                                                                                                                                                       |
| Symbol         | LINK                                                                                                                                                                                                            |
| Decimals       | 18                                                                                                                                                                                                              |
| Network status | [ftmscan.com](https://ftmscan.com/)                                                                                                                                                                             |

### Fantom testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/fantom-testnet). Testnet FTM is available at [faucet.fantom.network](https://faucet.fantom.network/).

| Parameter      | Value                                                                                                                                                                                                                    |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `4002`                                                                                                                                                                                                                   |
| Address        | <a class="erc-token-address" id="4002_0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F" href="https://testnet.ftmscan.com/address/0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F">`0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F`</a> |
| Name           | Chainlink Token on Fantom                                                                                                                                                                                                |
| Symbol         | LINK                                                                                                                                                                                                                     |
| Decimals       | 18                                                                                                                                                                                                                       |

## Arbitrum

### Arbitrum mainnet

ETH is used to pay for transactions on the Arbitrum mainnet. You can use the [Arbitrum Bridge](https://bridge.arbitrum.io/) to transfer ETH and LINK to from Ethereum Mainnet to Arbitrum.

| Parameter      | Value                                                                                                                                                                                                                      |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `42161`                                                                                                                                                                                                                    |
| Address        | <a class="erc-token-address" id="42161_0xf97f4df75117a78c1A5a0DBb814Af92458539FB4" href="https://explorer.arbitrum.io/address/0xf97f4df75117a78c1A5a0DBb814Af92458539FB4">`0xf97f4df75117a78c1A5a0DBb814Af92458539FB4`</a> |
| Name           | Chainlink Token on Arbitrum Mainnet                                                                                                                                                                                        |
| Symbol         | LINK                                                                                                                                                                                                                       |
| Decimals       | 18                                                                                                                                                                                                                         |
| Network status | [arbiscan.freshstatus.io](https://arbiscan.freshstatus.io/)                                                                                                                                                                |

### Arbitrum Rinkeby testnet

Testnet LINK is available at [faucets.chain.link](https://faucets.chain.link/arbitrum-rinkeby). Testnet ETH is available at [faucet.rinkeby.io](https://faucet.rinkeby.io/).

| Parameter      | Value                                                                                                                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `421611`                                                                                                                                                                                                                            |
| Address        | <a class="erc-token-address" id="421611_0x615fBe6372676474d9e6933d310469c9b68e9726" href="https://rinkeby-explorer.arbitrum.io/address/0x615fBe6372676474d9e6933d310469c9b68e9726">`0x615fBe6372676474d9e6933d310469c9b68e9726`</a> |
| Name           | Chainlink Token on Arbitrum Rinkeby                                                                                                                                                                                                 |
| Symbol         | LINK                                                                                                                                                                                                                                |
| Decimals       | 18                                                                                                                                                                                                                                  |

## HECO Chain

### HECO Chain mainnet

| Parameter      | Value                                                                                                                                                                                                            |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `128`                                                                                                                                                                                                            |
| Address        | <a class="erc-token-address" id="128_0x9e004545c59D359F6B7BFB06a26390b087717b42" href="https://hecoinfo.com/address/0x9e004545c59D359F6B7BFB06a26390b087717b42">`0x9e004545c59D359F6B7BFB06a26390b087717b42`</a> |
| Name           | Heco-Peg LINK Token                                                                                                                                                                                              |
| Symbol         | LINK                                                                                                                                                                                                             |
| Decimals       | 18                                                                                                                                                                                                               |
| Network status | [hecoinfo.com](https://hecoinfo.com/)                                                                                                                                                                            |

## Optimism

### Optimism mainnet

ETH is used to pay for transactions on Optimism. Use the [Optimism Bridge](https://app.optimism.io/bridge) to transfer ETH and LINK from Ethereum Mainnet to Optimism mainnet.

| Parameter      | Value                                                                                                                                                                                                                      |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `10`                                                                                                                                                                                                                       |
| Address        | <a class="erc-token-address" id="10_0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6" href="https://optimistic.etherscan.io/address/0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6">`0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6`</a> |
| Name           | Chainlink Token on Optimism Mainnet                                                                                                                                                                                        |
| Symbol         | LINK                                                                                                                                                                                                                       |
| Decimals       | 18                                                                                                                                                                                                                         |
| Network status | [status.optimism.io](https://status.optimism.io/)                                                                                                                                                                          |

### Optimism Goerli testnet

Testnet ETH is used to pay for transactions on Optimism. Use the [Optimism Bridge](https://app.optimism.io/bridge) to transfer testnet ETH and LINK from Ethereum Goerli to Optimistim Goerli. Select Optimism Goerli in your wallet to access the Optimism Goerli bridge.

| Parameter      | Value                                                                                                                                                                                                                            |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `420`                                                                                                                                                                                                                             |
| Address        | <a class="erc-token-address" id="420_0xdc2cc710e42857672e7907cf474a69b63b93089f" href="https://goerli-optimism.etherscan.io/token/0xdc2cc710e42857672e7907cf474a69b63b93089f">`0xdc2cc710e42857672e7907cf474a69b63b93089f`</a> |
| Name           | Chainlink Token on Optimism Goerli                                                                                                                                                                                                |
| Symbol         | LINK                                                                                                                                                                                                                             |
| Decimals       | 18                                                                                                                                                                                                                               |

## Harmony

### Harmony mainnet

ONE is used to pay for transactions on Harmony mainnet. You can use the [Harmony Bridge](https://bridge.harmony.one/) to transfer ONE and LINK token from Ethereum Mainnet to Harmony mainnet.

| Parameter      | Value                                                                                                                                                                                                                           |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ETH_CHAIN_ID` | `1666600000`                                                                                                                                                                                                                    |
| Address        | <a class="erc-token-address" id="1666600000_0x218532a12a389a4a92fC0C5Fb22901D1c19198aA" href="https://explorer.harmony.one/address/0x218532a12a389a4a92fC0C5Fb22901D1c19198aA">`0x218532a12a389a4a92fC0C5Fb22901D1c19198aA`</a> |
| Name           | Chainlink Token on Harmony Mainnet                                                                                                                                                                                              |
| Symbol         | LINK                                                                                                                                                                                                                            |
| Decimals       | 18                                                                                                                                                                                                                              |
| Network status | [status.harmony.one](https://status.harmony.one/)                                                                                                                                                                               |

## Moonriver

### Moonriver mainnet

MOVR is used to pay transaction fees on Moonriver mainnet. You can use [bridge.multichain.org](https://bridge.multichain.org/#/router) to transfer LINK to Moonriver mainnet.

| Parameter      | Value                                                                                                                                                                                                                      |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `1285`                                                                                                                                                                                                                     |
| Address        | <a class="erc-token-address" id="1285_0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e" href="https://moonriver.moonscan.io/address/0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e">`0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e`</a> |
| Name           | Chainlink Token on Moonriver Mainnet                                                                                                                                                                                       |
| Symbol         | LINK                                                                                                                                                                                                                       |
| Decimals       | 18                                                                                                                                                                                                                         |
| Network status | [moonscan.freshstatus.io](https://moonscan.freshstatus.io/)                                                                                                                                                                |

## Moonbeam

### Moonbeam mainnet

GLMR is used to pay transaction fees on Moonbeam mainnet.

| Parameter      | Value                                                                                                                                                                                                            |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `1284`                                                                                                                                                                                                           |
| Address        | <a class="erc-token-address" id="1284_0x012414A392F9FA442a3109f1320c439C45518aC3" href="https://moonscan.io/address/0x012414A392F9FA442a3109f1320c439C45518aC3">`0x012414A392F9FA442a3109f1320c439C45518aC3`</a> |
| Name           | Chainlink Token on Moonbeam Mainnet                                                                                                                                                                              |
| Symbol         | LINK                                                                                                                                                                                                             |
| Decimals       | 18                                                                                                                                                                                                               |
| Network status | [moonscan.freshstatus.io](https://moonscan.freshstatus.io/)                                                                                                                                                      |

## Metis

### Andromeda mainnet

METIS is the currency that you use to pay for transactions on Metis mainnet. You can use the [Metis Bridge](https://bridge.metis.io/) to transfer METIS and LINK from Ethereum Mainnet to Metis mainnet.

| Parameter      | Value                                                                                                                                                                                                                             |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `1088`                                                                                                                                                                                                                            |
| Address        | <a class="erc-token-address" id="1088_0x79892E8A3Aea66C8F6893fa49eC6208ef07EC046"  href="https://andromeda-explorer.metis.io/address/0x79892E8A3Aea66C8F6893fa49eC6208ef07EC046">`0x79892E8A3Aea66C8F6893fa49eC6208ef07EC046`</a> |
| Name           | Chainlink Token on Metis Mainnet                                                                                                                                                                                                  |
| Symbol         | LINK                                                                                                                                                                                                                              |
| Decimals       | 18                                                                                                                                                                                                                                |
| Network status | [andromeda-explorer.metis.io](https://andromeda-explorer.metis.io/)                                                                                                                                                               |

## Klaytn

### Baobab testnet

KLAY is the currency that you use to pay for transactions on Klaytn testnet. Testnet LINK is available from [facuets.chain.link](https://faucets.chain.link/klaytn-testnet). Use the [KLAY Faucet](https://baobab.wallet.klaytn.foundation/faucet) to obtain testnet KLAY.

| Parameter      | Value                                                                                                                                                                                                                             |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETH_CHAIN_ID` | `1001`                                                                                                                                                                                                                            |
| Address        | <a class="erc-token-address" id="1001_0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18"  href="https://baobab.scope.klaytn.com/token/0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18">`0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18`</a>       |
| Name           | Chainlink Token on the Klaytn testnet                                                                                                                                                                                             |
| Symbol         | LINK                                                                                                                                                                                                                              |
| Decimals       | 18                                                                                                                                                                                                                                |
| Network status | [status.klaytnapi.com](https://status.klaytnapi.com/)                                                                                                                                                                             |
