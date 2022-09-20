---
layout: nodes.liquid
section: legacy
date: Last Modified
title: 'Chainlink VRF Supported Networks [v1]'
permalink: 'docs/vrf/v1/supported-networks/'
metadata:
  title: 'Chainlink VRF v1 Supported Networks'
---

> 🚧 VRF v2 replaces and enhances VRF v1.
>
> See the [VRF v2 documentation](/docs/vrf/v2/supported-networks/) to learn more.

Chainlink VRF allows you to integrate provably-fair and verifiably random data in your smart contract.

For implementation details, read [Introduction to Chainlink VRF](/docs/vrf/v1/introduction).

## Polygon (Matic) Mainnet

> 📘 Important
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service**](https://pegswap.chain.link/)

| Item            | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| LINK Token      | `0xb0897686c545045aFc77CF20eC7A532E3120E0F1`                         |
| VRF Coordinator | `0x3d2341ADb2D31f1c5530cDC622016af293177AE0`                         |
| Key Hash        | `0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da` |
| Fee             | 0.0001 LINK                                                          |

> 📘 VRF Response Times on Polygon
>
> VRF responses are generated after 10 block confirmations on Polygon by default. Please [get in touch with us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-VRF) if you require VRF responses to be generated after a higher number of block confirmations, based on what you feel is best for achieving secure finality times on Polygon.

## Polygon (Matic) Mumbai Testnet

> 🚰 Mumbai Faucet
>
> Testnet LINK and MATIC are available from [the official Matic faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

| Item            | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| LINK Token      | `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`                         |
| VRF Coordinator | `0x8C7382F9D8f56b33781fE506E897a4F1e2d17255`                         |
| Key Hash        | `0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4` |
| Fee             | 0.0001 LINK                                                          |

## BNB Chain Mainnet

> 📘 Important
>
> The LINK provided by the [BNB Chain Bridge](https://www.bnbchain.world/en/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on BNB Chain using Chainlink's PegSwap service**](https://pegswap.chain.link/).

| Item            | Value                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token      | `0x404460C6A5EdE2D891e8297795264fDe62ADBB75`                                                                                                                                                             |
| VRF Coordinator | `0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31`                                                                                                                                                             |
| Key Hash        | `0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c`                                                                                                                                     |
| Fee             | 0.2 LINK - initial fees on BNB Chain are meant to cover the highest gas cost prices. To use VRF more efficiently, please [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-VRF) |

> 📘 Early Access
>
> For the most efficient consumption of Chainlink VRF on BNB Chain, please contact us using [this form](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-VRF) to create a payment channel, through which we can provide VRF to you at the cost of BNB Chain network gas fees. You will only be paying in LINK for the gas costs incurred by the Chainlink node from calling your smart contract.

## BNB Chain Testnet

> 🚰 BNB Chain Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

| Item            | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| LINK            | `0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`                          |
| VRF Coordinator | `0xa555fC018435bef5A13C6c6870a9d4C11DEC329C `                         |
| Key Hash        | `0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186 ` |
| Fee             | 0.1 LINK                                                              |

## Ethereum Mainnet

| Item            | Value                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token      | `0x514910771AF9Ca656af840dff83E8264EcF986CA`                                                                                                                                                          |
| VRF Coordinator | `0xf0d54349aDdcf704F77AE15b96510dEA15cb7952`                                                                                                                                                          |
| Key Hash        | `0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445`                                                                                                                                  |
| Fee             | 2 LINK - initial fees on Ethereum are meant to cover the highest gas cost prices. To use VRF more efficiently, please [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-VRF) |

> 📘 Early Access
>
> For the most efficient consumption of Chainlink VRF on Ethereum, please contact us using [this form](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-VRF) to create a payment channel, through which we can provide VRF to you at the cost of Ethereum network gas fees. You will only be paying in LINK for the gas costs incurred by the Chainlink node from calling your smart contract.

## Goerli

> 🚰 Goerli Faucets
>
> Testnet LINK is available from https://faucets.chain.link/goerli
> Testnet ETH is available from https://goerlifaucet.com/ or faucets listed at https://faucetlink.to/goerli.

| Item            | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| LINK            | `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`                         |
| VRF Coordinator | `0x2bce784e69d2Ff36c71edcB9F88358dB0DfB55b4`                         |
| Key Hash        | `0x0476f9a745b61ea5c0ab224d3a6e4c99f0b02fce4da01143a4f70aa80ae76e8a` |
| Fee             | 0.1 LINK                                                             |
