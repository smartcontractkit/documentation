---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Contract Addresses'
permalink: 'docs/vrf-contracts/'
metadata:
  title: 'Chainlink VRF Contract Addresses'
  image:
    0: '/files/OpenGraph_V3.png'
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

Chainlink VRF allows you to integrate provably fair and verifiably random data in your smart contract.

For implementation details, read [Introduction to Chainlink VRF](/docs/chainlink-vrf/).

## Coordinator Parameters

These parameters are configured in the coordinator contract. You can view these values by running `getConfig` on the coordinator or by viewing the coordinator contracts in a blockchain explorer.

- `uint16 minimumRequestConfirmations`: The minimum number of confirmation blocks on VRF requests before oracles respond
- `uint32 maxGasLimit`: The maximum gas limit supported for a `fulfillRandomWords` callback.
- `uint32 stalenessSeconds`: How long the coordinator waits until we consider the ETH/LINK price used for converting gas costs to LINK is stale and use `fallbackWeiPerUnitLink`
- `uint32 gasAfterPaymentCalculation`: How much gas is used outside of the payment calculation. This covers the additional operations required to decrement the subscription balance and increment the balance for the oracle that handled the request.

## Fee parameters

Fee parameters are configured in the coordinator contract and specify the premium you pay per request in addition to the gas cost for the transaction. You can view them by running `getFeeConfig` on the coordinator. The `uint32 fulfillmentFlatFeeLinkPPMTier1` parameter defines the fees per request specified in millionths of LINK.

## Configurations

- [Ethereum Mainnet](#ethereum-mainnet)
- [Rinkeby testnet](#rinkeby-testnet)
- [BNB Chain](#bnb-chain)
- [BNB Chain testnet](#bnb-chain-testnet)
- [Polygon Mainnet](#polygon-matic-mainnet)
- [Polygon Mumbai Testnet](#polygon-matic-mumbai-testnet)
- [Avalanche Mainnet](#avalanche-mainnet)
- [Avalanche Fuji Testnet](#avalanche-fuji-testnet)
- [Fantom Mainnet](#fantom-mainnet)
- [Fantom Testnet](#fantom-testnet)

### Ethereum Mainnet

| Item                  | Value                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)   |
| VRF Coordinator       | [`0x271682DEB8C4E0901D1a1550aD2e64D568E69909`](https://etherscan.io/address/0x271682DEB8C4E0901D1a1550aD2e64D568E69909) |
| 200 gwei Key Hash     | `0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef`                                                    |
| 500 gwei Key Hash     | `0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92`                                                    |
| 1000 gwei Key Hash    | `0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805`                                                    |
| Premium               | 0.25 LINK                                                                                                               |
| Minimum Confirmations | 3                                                                                                                       |
| Maximum Confirmations | 200                                                                                                                     |
| Maximum Random Values | 500                                                                                                                     |

### Rinkeby testnet

> 🚰Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from: https://faucets.chain.link/rinkeby
> Backup Testnet ETH Faucets: https://rinkeby-faucet.com/, https://app.mycrypto.com/faucet

| Item                  | Value                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`](https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)   |
| VRF Coordinator       | [`0x6168499c0cFfCaCD319c818142124B7A15E857ab`](https://rinkeby.etherscan.io/address/0x6168499c0cFfCaCD319c818142124B7A15E857ab) |
| 30 gwei Key Hash      | `0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc`                                                            |
| Premium               | 0.25 LINK                                                                                                                       |
| Minimum Confirmations | 3                                                                                                                               |
| Maximum Confirmations | 200                                                                                                                             |
| Maximum Random Values | 500                                                                                                                             |

### BNB Chain

| Item                  | Value                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x404460c6a5ede2d891e8297795264fde62adbb75`](https://bscscan.com/address/0x404460c6a5ede2d891e8297795264fde62adbb75) |
| VRF Coordinator       | [`0xc587d9053cd1118f25F645F9E08BB98c9712A4EE`](https://bscscan.com/address/0xc587d9053cd1118f25F645F9E08BB98c9712A4EE) |
| 200 gwei Key Hash     | `0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04`                                                   |
| 500 gwei Key Hash     | `0xba6e730de88d94a5510ae6613898bfb0c3de5d16e609c5b7da808747125506f7`                                                   |
| 1000 gwei Key Hash    | `0x17cd473250a9a479dc7f234c64332ed4bc8af9e8ded7556aa6e66d83da49f470`                                                   |
| Premium               | 0.005 LINK                                                                                                             |
| Minimum Confirmations | 3                                                                                                                      |
| Maximum Confirmations | 200                                                                                                                    |
| Maximum Random Values | 500                                                                                                                    |

### BNB Chain testnet

> 🚰 BNB Chain Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

| Item                  | Value                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token            | [`0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`](https://testnet.bscscan.com/address/0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06) |
| VRF Coordinator       | [`0x6A2AAd07396B36Fe02a22b33cf443582f682c82f`](https://testnet.bscscan.com/address/0x6A2AAd07396B36Fe02a22b33cf443582f682c82f) |
| 50 gwei Key Hash      | `0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314`                                                           |
| Premium               | 0.005 LINK                                                                                                                     |
| Minimum Confirmations | 3                                                                                                                              |
| Maximum Confirmations | 200                                                                                                                            |
| Maximum Random Values | 500                                                                                                                            |

### Polygon (Matic) Mainnet

> 📘 Important
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service**](https://pegswap.chain.link/)

| Item                  | Value                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0xb0897686c545045aFc77CF20eC7A532E3120E0F1`](https://polygonscan.com/address/0xb0897686c545045aFc77CF20eC7A532E3120E0F1) |
| VRF Coordinator       | [`0xAE975071Be8F8eE67addBC1A82488F1C24858067`](https://polygonscan.com/address/0xAE975071Be8F8eE67addBC1A82488F1C24858067) |
| 200 gwei Key Hash     | `0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93`                                                       |
| 500 gwei Key Hash     | `0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`                                                       |
| 1000 gwei Key Hash    | `0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8`                                                       |
| Premium               | 0.0005 LINK                                                                                                                |
| Minimum Confirmations | 3                                                                                                                          |
| Maximum Confirmations | 200                                                                                                                        |
| Maximum Random Values | 500                                                                                                                        |

### Polygon (Matic) Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from the [Polygon faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

| Item                  | Value                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`](https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB) |
| VRF Coordinator       | [`0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed`](https://mumbai.polygonscan.com/address/0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed) |
| 500 gwei Key Hash     | `0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`                                                              |
| Premium               | 0.0005 LINK                                                                                                                       |
| Minimum Confirmations | 3                                                                                                                                 |
| Maximum Confirmations | 200                                                                                                                               |
| Maximum Random Values | 500                                                                                                                               |

### Avalanche Mainnet

| Item                  | Value                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x5947BB275c521040051D82396192181b413227A3`](https://snowtrace.io/token/0x5947BB275c521040051D82396192181b413227A3)   |
| VRF Coordinator       | [`0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`](https://snowtrace.io/address/0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634) |
| 200 gwei Key Hash     | `0x83250c5584ffa93feb6ee082981c5ebe484c865196750b39835ad4f13780435d`                                                    |
| 500 gwei Key Hash     | `0x89630569c9567e43c4fe7b1633258df9f2531b62f2352fa721cf3162ee4ecb46`                                                    |
| 1000 gwei Key Hash    | `0x06eb0e2ea7cca202fc7c8258397a36f33d88568d2522b37aaa3b14ff6ee1b696`                                                    |
| Premium               | 0.005 LINK                                                                                                              |
| Minimum Confirmations | 1                                                                                                                       |
| Maximum Confirmations | 200                                                                                                                     |
| Maximum Random Values | 500                                                                                                                     |

### Avalanche Fuji Testnet

> 🚰 Avax Fuji Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fuji

| Item                  | Value                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`](https://testnet.snowtrace.io/token/0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846)   |
| VRF Coordinator       | [`0x2eD832Ba664535e5886b75D64C46EB9a228C2610`](https://testnet.snowtrace.io/address/0x2eD832Ba664535e5886b75D64C46EB9a228C2610) |
| 300 gwei Key Hash     | `0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61`                                                            |
| Premium               | 0.005 LINK                                                                                                                      |
| Minimum Confirmations | 1                                                                                                                               |
| Maximum Confirmations | 200                                                                                                                             |
| Maximum Random Values | 500                                                                                                                             |

### Fantom Mainnet

| Item                  | Value                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| LINK Token            | [`0x6f43ff82cca38001b6699a8ac47a2d0e66939407`](https://ftmscan.com/token/0x6f43ff82cca38001b6699a8ac47a2d0e66939407)   |
| VRF Coordinator       | [`0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`](https://ftmscan.com/address/0xd5d517abe5cf79b7e95ec98db0f0277788aff634) |
| 4000 gwei Key Hash    | `0xb4797e686f9a1548b9a2e8c68988d74788e0c4af5899020fb0c47784af76ddfa`                                                   |
| 10000 gwei Key Hash   | `0x5881eea62f9876043df723cf89f0c2bb6f950da25e9dfe66995c24f919c8f8ab`                                                   |
| 20000 gwei Key Hash   | `0x64ae04e5dba58bc08ba2d53eb33fe95bf71f5002789692fe78fb3778f16121c9`                                                   |
| Premium               | 0.0005 LINK                                                                                                            |
| Minimum Confirmations | 1                                                                                                                      |
| Maximum Confirmations | 200                                                                                                                    |
| Maximum Random Values | 500                                                                                                                    |

### Fantom Testnet

> 🚰 Fantom Testnet Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fantom-testnet

| Item                  | Value                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token            | [`0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f`](https://testnet.ftmscan.com/token/0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f)   |
| VRF Coordinator       | [`0xbd13f08b8352A3635218ab9418E340c60d6Eb418`](https://testnet.ftmscan.com/address/0xbd13f08b8352a3635218ab9418e340c60d6eb418) |
| 3000 gwei Key Hash    | `0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4`                                                           |
| Premium               | 0.0005 LINK                                                                                                                    |
| Minimum Confirmations | 1                                                                                                                              |
| Maximum Confirmations | 200                                                                                                                            |
| Maximum Random Values | 500                                                                                                                            |
