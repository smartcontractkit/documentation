---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "LINK Token Contracts"
permalink: "docs/link-token-contracts/"
metadata:
  title: "LINK Token Contracts"
  description: "Addresses for the LINK token on supported networks."
  image:
    0: "/files/72d4bd9-link.png"
---
LINK tokens are used to pay node operators for retrieving data for smart contracts and also for deposits placed by node operators as required by contract creators.

The LINK token is an ERC677 token that inherits functionality from the ERC20 token standard and allows token transfers to contain a data payload. Read more about the [ERC677 transferAndCall token standard](https://github.com/ethereum/EIPs/issues/677).

**Table of Contents**

+ [Ethereum](#ethereum)
+ [BNB Chain](#bnb-chain)
+ [Polygon (Matic)](#polygon-matic)
+ [RSK](#rsk)
+ [Gnosis Chain (xDai)](#gnosis-chain-xdai)
+ [Avalanche](#avalanche)
+ [Fantom](#fantom)
+ [Arbitrum](#arbitrum)
+ [HECO Chain](#heco-chain)
+ [Optimism](#optimism)
+ [Harmony](#harmony)
+ [Moonriver](#moonriver)
+ [Moonbeam](#moonbeam)

# Ethereum

## Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1`|
|Address|[0x514910771af9ca656af840dff83e8264ecf986ca](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Kovan

> 🚰 Kovan Faucets
>
> Testnet LINK are available from https://faucets.chain.link/kovan
> Testnet ETH are available from https://faucets.chain.link/kovan

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`42`|
|Address|[0xa36085F69e2889c224210F603D836748e7dC0088](https://kovan.etherscan.io/token/0xa36085F69e2889c224210F603D836748e7dC0088)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Rinkeby

> 🚰 Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from: https://faucets.chain.link/rinkeby
> Backup Testnet ETH Faucets: https://rinkeby-faucet.com/, https://app.mycrypto.com/faucet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`4`|
|Address|[0x01BE23585060835E02B77ef475b0Cc51aA1e0709](https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Goerli

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`5`|
|Address|[0x326c977e6efc84e512bb9c30f76e30c160ed06fb](https://goerli.etherscan.io/address/0x326c977e6efc84e512bb9c30f76e30c160ed06fb)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

--------------------

# Other EVM Chains

LINK is native to Ethereum, so to use LINK on other chains, it must be bridged. <a href="https://www.youtube.com/watch?v=WKvIGkBWRUA" target="_blank">This guide</a> explains how to bridge and swap tokens to other chains.

## BNB Chain

### Mainnet

> 📘 Important
>
> The LINK provided by the [BNB Chain Bridge](https://www.bnbchain.world/en/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on BNB Chain using Chainlink's PegSwap service**](https://pegswap.chain.link/).

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`56`|
|Address|[0x404460c6a5ede2d891e8297795264fde62adbb75](https://bscscan.com/token/0x404460c6a5ede2d891e8297795264fde62adbb75)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

### Testnet

> 🚰 BNB Chain Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`97`|
|Address|[0x84b9b910527ad5c03a9ca831909e21e236ea7b06](https://testnet.bscscan.com/address/0x84b9b910527ad5c03a9ca831909e21e236ea7b06)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Polygon (Matic)

### Mainnet

MATIC is used to pay for transactions on Polygon mainnet. You can use the [Polygon Bridge](https://wallet.polygon.technology/bridge) to transfer tokens to Polygon mainnet and then use [Polygon Gas Swap](https://wallet.polygon.technology/gas-swap/) to swap supported tokens to MATIC.

> 🚧 ERC-677 LINK on Polygon
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, you cannot use it with Chainlink services. However, you can convert LINK to the official ERC-677 compatible LINK token by using the [**Chainlink PegSwap service**](https://pegswap.chain.link/).
>
> Watch the [Moving Chainlink Cross-Chains](https://www.youtube.com/watch?v=WKvIGkBWRUA) video to learn more.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`137`|
|Address|[0xb0897686c545045afc77cf20ec7a532e3120e0f1](https://polygonscan.com/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

### Mumbai Testnet

> 🚰 Mumbai Faucet
>
> Testnet LINK and MATIC are available from the [Polygon faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`80001`|
|Address|[0x326C977E6efc84E512bB9C30f76E30c160eD06FB](https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB)|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## RSK

### Mainnet

RBTC is used to pay for transactions on RSK mainnet. Use [RSK’s built in PowPeg](https://developers.rsk.co/guides/get-crypto-on-rsk/powpeg-btc-rbtc/) to transfer BTC to RSK mainnet as RBTC. You can use the [RSK bridge](https://tokenbridge.rsk.co/) to send LINK from Ethereum mainnet to RSK mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`30`|
|Address|[0x14adae34bef7ca957ce2dde5add97ea050123827](https://explorer.rsk.co/address/0x14adae34bef7ca957ce2dde5add97ea050123827)|
|Name|rLINK|
|Symbol|rLINK|
|Decimals|18|

## Gnosis Chain (xDai)

### Mainnet

xDAI is used to pay for transactions on Gnosis Chain mainnet. Use the [xDai Bridge](https://bridge.gnosischain.com/) to send DAI from Ethereum mainnet to Gnosis Chain mainnet and convert it to xDAI. Use [OmniBridge](https://omni.gnosischain.com/bridge) to send LINK from Ethereum Mainnet to Gnosis Chain mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`100`|
|Address|[0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2](https://blockscout.com/poa/xdai/address/0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2)|
|Name|ChainLink Token on Gnosis Chain (xDai)|
|Symbol|LINK|
|Decimals|18|

## Avalanche

### Mainnet

AVAX is the token you use to pay for transactions on Avalanche mainnet. You can use the [Avalanche Bridge](https://bridge.avax.network/) to transfer LINK from Ethereum Mainnet to Avalanche mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`43114`|
|Address|[`0x5947BB275c521040051D82396192181b413227A3`](https://snowtrace.io/address/0x5947BB275c521040051D82396192181b413227A3)|
|Name|ChainLink Token on Avalanche|
|Symbol|LINK|
|Decimals|18|

### Fuji Testnet

> 🚰 Avax Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fuji

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`43113`|
|Address|[`0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`](https://testnet.snowtrace.io/address/0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846)|
|Name|ChainLink Token on Avalanche|
|Symbol|LINK|
|Decimals|18|

## Fantom

### Fantom Mainnet

FTM is used to pay for transactions on Fantom Mainnet. Use [bridge.multichain.org](https://bridge.multichain.org/#/router) to transfer FTM and LINK to Fantom mainnet.

> 🚧 ERC-677 LINK on Fantom
>
> You must use ERC-677 LINK on Fantom. ERC-20 LINK will not work with Chainlink services.
> When you use [bridge.multichain.org](https://bridge.multichain.org/#/router) to send LINK to the Fantom network, be sure to select LINK-ERC677 as the token you will receive on Fantom mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`250`|
|Address|[`0x6F43FF82CCA38001B6699a8AC47A2d0E66939407`](https://ftmscan.com/address/0x6F43FF82CCA38001B6699a8AC47A2d0E66939407)|
|Name|ChainLink Token on Fantom|
|Symbol|LINK|
|Decimals|18|

### Fantom Testnet

> 🚰 Fantom Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fantom-testnet  

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`4002`|
|Address|[`0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F`](https://testnet.ftmscan.com/address/0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F)|
|Name|ChainLink Token on Fantom|
|Symbol|LINK|
|Decimals|18|

## Arbitrum

### Arbitrum Mainnet

ETH is used to pay for transactions on the Arbitrum mainnet. You can use the [Arbitrum Bridge](https://bridge.arbitrum.io/) to transfer ETH and LINK to from Ethereum mainnet to Arbitrum mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`42161`|
|Address|[`0xf97f4df75117a78c1A5a0DBb814Af92458539FB4`](https://arbiscan.io/address/0xf97f4df75117a78c1A5a0DBb814Af92458539FB4)|
|Name|ChainLink Token on Arbitrum Mainnet|
|Symbol|LINK|
|Decimals|18|

### Rinkeby Testnet

> 🚰 Arbitrum Faucet on Rinkeby
>
> Testnet LINK is available from https://faucets.chain.link/arbitrum-rinkeby

Testnet ETH is used to pay for transactions on the Arbitrum Rinkeby testnet. You can use the [Arbitrum Bridge](https://bridge.arbitrum.io/) to transfer testnet ETH and LINK from Ethereum Rinkeby to Arbitrum Rinkeby.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`421611`|
|Address|[`0x615fBe6372676474d9e6933d310469c9b68e9726`](https://testnet.arbiscan.io/address/0x615fBe6372676474d9e6933d310469c9b68e9726)|
|Name|ChainLink Token on Arbitrum Rinkeby|
|Symbol|LINK|
|Decimals|18|

## HECO Chain

### Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`128`|
|Address|[`0x9e004545c59D359F6B7BFB06a26390b087717b42`](https://hecoinfo.com/address/0x9e004545c59D359F6B7BFB06a26390b087717b42)|
|Name|Heco-Peg LINK Token|
|Symbol|LINK|
|Decimals|18|

## Optimism

### Mainnet

ETH is used to pay for transactions on Optimism. Use the [Optimism Bridge](https://app.optimism.io/bridge) to transfer ETH and LINK from Ethereum Mainnet to Optimism mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`10`|
|Address|[`0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6`](https://optimistic.etherscan.io/address/0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6)|
|Name|ChainLink Token on Optimism Mainnet|
|Symbol|LINK|
|Decimals|18|

### Kovan Testnet

Testnet ETH is used to pay for transactions on Optimism. Use the [Optimism Bridge](https://app.optimism.io/bridge) to transfer testnet ETH and LINK from Ethereum Kovan to Optimistic Kovan.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`69`|
|Address|[`0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B`](https://kovan-optimistic.etherscan.io/address/0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B)|
|Name|ChainLink Token on Optimism Kovan|
|Symbol|LINK|
|Decimals|18|

## Harmony

### Mainnet

ONE is used to pay for transactions on Harmony mainnet. You can use the [Harmony Bridge](https://bridge.harmony.one/) to transfer ONE and LINK token from Ethereum Mainnet to Harmony mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1666600000`|
|Address|[`0x218532a12a389a4a92fC0C5Fb22901D1c19198aA`](https://explorer.harmony.one/address/0x218532a12a389a4a92fC0C5Fb22901D1c19198aA)|
|Name|ChainLink Token on Harmony Mainnet|
|Symbol|LINK|
|Decimals|18|

### Testnet

> 🚰 Harmony Testnet Faucet
>
> Testnet LINK is available from https://faucets.chain.link/harmony-testnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1666700000`|
|Address|[`0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e`](https://explorer.testnet.harmony.one/address/0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e)|
|Name|ChainLink Token on Harmony Testnet|
|Symbol|LINK|
|Decimals|18|

## Moonriver

### Mainnet

MOVR is used to pay transaction fees on Moonriver mainnet. You can use [bridge.multichain.org](https://bridge.multichain.org/#/router) to transfer LINK to Moonriver mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1285`|
|Address|[`0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e`](https://moonriver.moonscan.io/address/0x8b12Ac23BFe11cAb03a634C1F117D64a7f2cFD3e)|
|Name|ChainLink Token on Moonriver Mainnet|
|Symbol|LINK|
|Decimals|18|

## Moonbeam

### Mainnet

GLMR is used to pay transaction fees on Moonbeam mainnet.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1284`|
|Address|[`0x012414A392F9FA442a3109f1320c439C45518aC3`](https://moonscan.io/address/0x012414A392F9FA442a3109f1320c439C45518aC3)|
|Name|ChainLink Token on Moonbeam Mainnet|
|Symbol|LINK|
|Decimals|18|
