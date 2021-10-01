---
layout: nodes.liquid
section: smartContract
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

The LINK token is an ERC677 token that inherits functionality from the ERC20 token standard and allows token transfers to contain a data payload. Read more about the <a href="https://github.com/ethereum/EIPs/issues/677" target="_blank" rel="noreferrer, noopener">ERC677 transferAndCall token standard</a>.

# Ethereum

## Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`1`|
|Address|<a href="https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca" target="_blank" rel="noreferrer, noopener">`0x514910771af9ca656af840dff83e8264ecf986ca`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Kovan

> 🚰Kovan Faucets
>
> Testnet LINK are available from https://faucets.chain.link/kovan
> Testnet ETH are available from https://faucets.chain.link/kovan

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`42`|
|Address|<a href="https://kovan.etherscan.io/token/0xa36085F69e2889c224210F603D836748e7dC0088" target="_blank" rel="noreferrer, noopener">`0xa36085F69e2889c224210F603D836748e7dC0088`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Rinkeby

> 🚰Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from one of these addresses. If one is currently offline, try the other: https://faucet.rinkeby.io/, https://app.mycrypto.com/faucet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`4`|
|Address|<a href="https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709" target="_blank" rel="noreferrer, noopener">`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Goerli

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`5`|
|Address|<a href="https://goerli.etherscan.io/address/0x326c977e6efc84e512bb9c30f76e30c160ed06fb" target="_blank" rel="noreferrer, noopener">`0x326c977e6efc84e512bb9c30f76e30c160ed06fb`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

--------------------

# Other EVM Compatible Chains

LINK is native to Ethereum, so to use LINK on other chains, it must be bridged. <a href="https://www.youtube.com/watch?v=WKvIGkBWRUA" target="_blank">This guide</a> explains how to bridge and swap tokens to other chains.

## Binance Smart Chain

### Mainnet

> 📘 Important
>
> The LINK provided by the [Binance Bridge](https://www.binance.org/en/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on BSC using Chainlink's PegSwap service**](https://pegswap.chain.link/).

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`56`|
|Address|<a href="https://bscscan.com/token/0x404460c6a5ede2d891e8297795264fde62adbb75" target="_blank" rel="noreferrer, noopener">`0x404460c6a5ede2d891e8297795264fde62adbb75`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

### Testnet

> 🚰BSC Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`97`|
|Address|<a href="https://testnet.bscscan.com/address/0x84b9b910527ad5c03a9ca831909e21e236ea7b06" target="_blank" rel="noreferrer, noopener">`0x84b9b910527ad5c03a9ca831909e21e236ea7b06`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## Polygon (Matic)

> 📘 Important
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.matic.network/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service**](https://pegswap.chain.link/)

You can also <a href="https://www.youtube.com/watch?v=WKvIGkBWRUA" target="_blank"> watch this video </a>.

### Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`137`|
|Address|<a href="https://explorer.matic.network/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1" target="_blank" rel="noreferrer, noopener">`0xb0897686c545045afc77cf20ec7a532e3120e0f1`</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

### Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from [the official Matic faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`80001`|
|Address|<a href="https://explorer-mumbai.maticvigil.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB" target="_blank" rel="noreferrer, noopener">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB `</a>|
|Name|ChainLink Token|
|Symbol|LINK|
|Decimals|18|

## RSK

### Mainnet

> 🌉Token Bridge
>
> Supported token bridge at https://tokenbridge.rsk.co/

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`30`|
|Address|<a href="https://explorer.rsk.co/address/0x14adae34bef7ca957ce2dde5add97ea050123827" target="_blank" rel="noreferrer, noopener">`0x14adae34bef7ca957ce2dde5add97ea050123827`</a>|
|Name|rLINK|
|Symbol|rLINK|
|Decimals|18|

## xDai

### Mainnet

> 🚰xDai Faucet
>
> Free xDai for transactions: https://blockscout.com/poa/xdai/faucet
>
> 🌉OmniBridge
>
> Supported bridge: https://omni.xdaichain.com/

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`100`|
|Address|<a href="https://blockscout.com/poa/xdai/address/0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2" target="_blank" rel="noreferrer, noopener">`0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2`</a>|
|Name|ChainLink Token on xDai|
|Symbol|LINK|
|Decimals|18|

## Avalanche

### Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`43114`|
|Address|[`0x5947BB275c521040051D82396192181b413227A3`](https://cchain.explorer.avax.network/address/0x5947BB275c521040051D82396192181b413227A3)|
|Name|ChainLink Token on Avalanche|
|Symbol|LINK|
|Decimals|18|

### Fuji Testnet

> 🚰Avax Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fuji
>

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`43113`|
|Address|[`0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`](https://cchain.explorer.avax-test.network/address/0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846)|
|Name|ChainLink Token on Avalanche|
|Symbol|LINK|
|Decimals|18|

## Fantom

### Fantom Mainnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`250`|
|Address|[`0x6F43FF82CCA38001B6699a8AC47A2d0E66939407`](https://ftmscan.com/address/0x6F43FF82CCA38001B6699a8AC47A2d0E66939407)|
|Name|ChainLink Token on Fantom|
|Symbol|LINK|
|Decimals|18|

### Fantom Testnet

> 🚰Fantom Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fantom-testnet  
>

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`4002`|
|Address|[`0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F`](https://testnet.ftmscan.com/address/0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F)|
|Name|ChainLink Token on Fantom|
|Symbol|LINK|
|Decimals|18|

## Arbitrum

### Rinkeby Testnet

> 🚰Arbitrum Faucet on Rinkeby
>
> Testnet LINK is available from https://faucets.chain.link/arbitrum-rinkeby
>
> Supported bridge: https://bridge.arbitrum.io

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`421611`|
|Address|[`0x615fBe6372676474d9e6933d310469c9b68e9726`](https://rinkeby-explorer.arbitrum.io/address/0x615fBe6372676474d9e6933d310469c9b68e9726)|
|Name|ChainLink Token on Arbitrum Rinkeby|
|Symbol|LINK|
|Decimals|18|

## Huobi Eco Chain

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

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`10`|
|Address|[`0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6`](https://optimistic.etherscan.io/address/0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6)|
|Name|ChainLink Token on Optimism Mainnet|
|Symbol|LINK|
|Decimals|18|

### Kovan Testnet

|Parameter|Value|
|:---|:---|
|`ETH_CHAIN_ID`|`69`|
|Address|[`0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B`](https://kovan-optimistic.etherscan.io/address/0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B)|
|Name|ChainLink Token on Optimism Kovan|
|Symbol|LINK|
|Decimals|18|
