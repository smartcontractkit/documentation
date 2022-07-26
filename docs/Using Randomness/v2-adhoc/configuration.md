---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Configuration'
permalink: 'docs/vrf/v2/ad-hoc/configuration/'
metadata:
  title: 'Chainlink VRF Contract Addresses'
  linkToWallet: true
  image:
    0: '/files/OpenGraph_V3.png'
---

> ℹ️You are viewing the VRF v2 guide - Ad-hoc method.
>
> - To learn how to request random numbers with a subscription, see the [Subscription Method](/docs/vrf/v2/subscription/) guide.
>
> - If you are using v1, see the [VRF v1 guide](/docs/vrf/v1/introduction/).

Chainlink VRF allows you to integrate provably fair and verifiably random data in your smart contract.

For implementation details, read [Introduction to Chainlink VRF v2 Ad-hoc method](/docs/vrf/v2/ad-hoc/).

**Table of contents**

- [Wrapper Parameters](#wrapper-parameters)
- [Coordinator Parameters](#coordinator-parameters)
- [Fee Parameters](#fee-parameters)
- [Configurations](#configurations)

## Wrapper Parameters

These parameters are configured in the VRF v2 Wrapper contract. You can view these values by running `getConfig` on the VRF v2 Wrapper or by viewing the VRF v2 Wrapper contract in a blockchain explorer.

- `uint32 stalenessSeconds`: How long the VRF v2 Wrapper waits until we consider the ETH/LINK price used for converting gas costs to LINK is stale and use `fallbackWeiPerUnitLink`.
- `uint32 wrapperGasOverhead`: The gas overhead of the VRF v2 Wrapper's `fulfillRandomWords` function.
- `uint32 coordinatorGasOverhead`: The gas overhead of the coordinator's `fulfillRandomWords` function.
- `uint8 maxNumWords`: Maximum number of words that can be requested in a single wrapped VRF request.

## Coordinator Parameters

Some parameters are important to know and are configured in the coordinator contract. You can view these values by running `getConfig` on the coordinator or by viewing the coordinator contract in a blockchain explorer.

- `uint16 minimumRequestConfirmations`: The minimum number of confirmation blocks on VRF requests before oracles respond
- `uint32 maxGasLimit`: The maximum gas limit supported for a `fulfillRandomWords` callback. Note that you still need to substract the `wrapperGasOverhead` for the accurate limit, as explained in [Ad-hoc limits](/docs/vrf/v2/ad-hoc/#limits).

## Fee Parameters

Fee parameters are configured in the VRF v2 Wrapper and the VRF v2 Coordinator contracts and specify the premium you pay per request in addition to the gas cost for the transaction. You can view them by running `getConfig` on the VRF v2 Wrapper:

- The `uint32 fulfillmentFlatFeeLinkPPM` parameter is a flat fee and defines the fees per request specified in millionths of LINK.
- The `uint8 wrapperPremiumPercentage` parameter defines the premium ratio in percentage. For example, a value of _0_ indicates no premium. A value of _15_ indicates a _15%_ premium.

The details for calculating the total transaction cost can be found [here](/docs/vrf/v2/ad-hoc/#request-and-receive-data).

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

| Item                       | Value                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token                 | <a class="erc-token-address" id="1_0x514910771af9ca656af840dff83e8264ecf986ca" href="https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca">`0x514910771af9ca656af840dff83e8264ecf986ca`</a> |
| VRF Wrapper                | [`0x685fCaf489C2FE2e289a68Bc10AA94F88A83E655`](https://etherscan.io/address/0x685fCaf489C2FE2e289a68Bc10AA94F88A83E655)                                                                                      |
| VRF Coordinator            | [`0x271682DEB8C4E0901D1a1550aD2e64D568E69909`](https://etherscan.io/address/0x271682DEB8C4E0901D1a1550aD2e64D568E69909)                                                                                      |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                            |
| Coordinator Flat Fee       | 0.25 LINK                                                                                                                                                                                                    |
| Maximum Confirmations      | 200                                                                                                                                                                                                          |
| Maximum Random Values      | 10                                                                                                                                                                                                           |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                        |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                        |

### Rinkeby testnet

> 🚰Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from: https://faucets.chain.link/rinkeby
> Backup Testnet ETH Faucets: https://rinkeby-faucet.com/, https://app.mycrypto.com/faucet

| Item                       | Value                                                                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="4_0x01BE23585060835E02B77ef475b0Cc51aA1e0709" href="https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709">`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`</a> |
| VRF Wrapper                | [`0x750ec030f6738129287e6057680d4158D84eB1D9`](https://rinkeby.etherscan.io/address/0x750ec030f6738129287e6057680d4158D84eB1D9)                                                                                      |
| VRF Coordinator            | [`0x6168499c0cFfCaCD319c818142124B7A15E857ab`](https://rinkeby.etherscan.io/address/0x6168499c0cFfCaCD319c818142124B7A15E857ab)                                                                                      |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                                    |
| Coordinator Flat Fee       | 0.25 LINK                                                                                                                                                                                                            |
| Maximum Confirmations      | 200                                                                                                                                                                                                                  |
| Maximum Random Values      | 10                                                                                                                                                                                                                   |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                                |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                                |

### BNB Chain

| Item                       | Value                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token                 | <a class="erc-token-address" id="56_0x404460c6a5ede2d891e8297795264fde62adbb75" href="https://bscscan.com/token/0x404460c6a5ede2d891e8297795264fde62adbb75">`0x404460c6a5ede2d891e8297795264fde62adbb75`</a> |
| VRF Wrapper                | [`0x4Be4e509a0374b88e5BeCF4703796aac506FfF06`](https://bscscan.com/address/0x4Be4e509a0374b88e5BeCF4703796aac506FfF06)                                                                                       |
| VRF Coordinator            | [`0xc587d9053cd1118f25F645F9E08BB98c9712A4EE`](https://bscscan.com/address/0xc587d9053cd1118f25F645F9E08BB98c9712A4EE)                                                                                       |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                            |
| Coordinator Flat Fee       | 0.005 LINK                                                                                                                                                                                                   |
| Maximum Confirmations      | 200                                                                                                                                                                                                          |
| Maximum Random Values      | 10                                                                                                                                                                                                           |
| Wrapper Gas overhead       | 40000                                                                                                                                                                                                        |
| Coordinator Gas Overhead   | 110000                                                                                                                                                                                                       |

### BNB Chain testnet

> 🚰 BNB Chain Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

| Item                       | Value                                                                                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="97_0x84b9b910527ad5c03a9ca831909e21e236ea7b06" href="https://testnet.bscscan.com/address/0x84b9b910527ad5c03a9ca831909e21e236ea7b06">`0x84b9b910527ad5c03a9ca831909e21e236ea7b06`</a> |
| VRF Wrapper                | [`0xeDA5B00fB33B13c730D004Cf5D1aDa1ac191Ddc2`](https://testnet.bscscan.com/address/0xeDA5B00fB33B13c730D004Cf5D1aDa1ac191Ddc2)                                                                                         |
| VRF Coordinator            | [`0x6A2AAd07396B36Fe02a22b33cf443582f682c82f`](https://testnet.bscscan.com/address/0x6A2AAd07396B36Fe02a22b33cf443582f682c82f)                                                                                         |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                                      |
| Coordinator Flat Fee       | 0.005 LINK                                                                                                                                                                                                             |
| Maximum Confirmations      | 200                                                                                                                                                                                                                    |
| Maximum Random Values      | 10                                                                                                                                                                                                                     |
| Wrapper Gas overhead       | 40000                                                                                                                                                                                                                  |
| Coordinator Gas Overhead   | 130000                                                                                                                                                                                                                 |

### Polygon (Matic) Mainnet

> 📘 Important
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service**](https://pegswap.chain.link/)

| Item                       | Value                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="137_0xb0897686c545045afc77cf20ec7a532e3120e0f1" href="https://polygonscan.com/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1">`0xb0897686c545045afc77cf20ec7a532e3120e0f1`</a> |
| VRF Wrapper                | [`0xdEA68FD294163cE1310124c4336e092243eaD52A`](https://polygonscan.com/address/0xdEA68FD294163cE1310124c4336e092243eaD52A)                                                                                          |
| VRF Coordinator            | [`0xAE975071Be8F8eE67addBC1A82488F1C24858067`](https://polygonscan.com/address/0xAE975071Be8F8eE67addBC1A82488F1C24858067)                                                                                          |
| Wrapper Premium Percentage | 60                                                                                                                                                                                                                  |
| Coordinator Flat Fee       | 0.0005 LINK                                                                                                                                                                                                         |
| Maximum Confirmations      | 200                                                                                                                                                                                                                 |
| Maximum Random Values      | 10                                                                                                                                                                                                                  |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                               |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                               |

### Polygon (Matic) Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from the [Polygon faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

| Item                       | Value                                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="80001_0x326C977E6efc84E512bB9C30f76E30c160eD06FB" href="https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB `</a> |
| VRF Wrapper                | [`0x25D7214ae75F169263921a1cAaf7E6F033210E24`](https://mumbai.polygonscan.com/address/0x25D7214ae75F169263921a1cAaf7E6F033210E24)                                                                                             |
| VRF Coordinator            | [`0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed`](https://mumbai.polygonscan.com/address/0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)                                                                                             |
| Wrapper Premium Percentage | 60                                                                                                                                                                                                                            |
| Coordinator Flat Fee       | 0.0005 LINK                                                                                                                                                                                                                   |
| Maximum Confirmations      | 200                                                                                                                                                                                                                           |
| Maximum Random Values      | 10                                                                                                                                                                                                                            |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                                         |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                                         |

### Avalanche Mainnet

| Item                       | Value                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token                 | <a class="erc-token-address" id="43114_0x5947BB275c521040051D82396192181b413227A3" href="https://snowtrace.io/address/0x5947BB275c521040051D82396192181b413227A3">`0x5947BB275c521040051D82396192181b413227A3`</a> |
| VRF Wrapper                | [`0x71B632bbaf0F4a5F8c28f4A78e56b73162eF6F3e`](https://snowtrace.io/address/0x71B632bbaf0F4a5F8c28f4A78e56b73162eF6F3e)                                                                                            |
| VRF Coordinator            | [`0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`](https://snowtrace.io/address/0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634)                                                                                            |
| Wrapper Premium Percentage | 10                                                                                                                                                                                                                 |
| Coordinator Flat Fee       | 0.005 LINK                                                                                                                                                                                                         |
| Maximum Confirmations      | 200                                                                                                                                                                                                                |
| Maximum Random Values      | 10                                                                                                                                                                                                                 |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                              |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                              |

### Avalanche Fuji Testnet

> 🚰 Avax Fuji Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fuji

| Item                       | Value                                                                                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="43113_0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846" href="https://testnet.snowtrace.io/address/0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846">`0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`</a> |
| VRF Wrapper                | [`0x78b69899C8cD252126cBB1A50171ec37286C3877`](https://testnet.snowtrace.io/address/0x78b69899C8cD252126cBB1A50171ec37286C3877)                                                                                            |
| VRF Coordinator            | [`0x2eD832Ba664535e5886b75D64C46EB9a228C2610`](https://testnet.snowtrace.io/address/0x2eD832Ba664535e5886b75D64C46EB9a228C2610)                                                                                            |
| Wrapper Premium Percentage | 10                                                                                                                                                                                                                         |
| Coordinator Flat Fee       | 0.005 LINK                                                                                                                                                                                                                 |
| Maximum Confirmations      | 200                                                                                                                                                                                                                        |
| Maximum Random Values      | 10                                                                                                                                                                                                                         |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                                      |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                                      |

### Fantom Mainnet

> 🚧 ERC-677 LINK on Fantom
>
> You must use ERC-677 LINK on Fantom. ERC-20 LINK will not work with Chainlink services.
> Use [bridge.multichain.org](https://bridge.multichain.org/#/router) to send LINK to the Fantom network and be sure to select LINK-ERC677 as the token you will receive on the Fantom mainnet.

| Item                       | Value                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK Token                 | <a class="erc-token-address" id="250_0x6f43ff82cca38001b6699a8ac47a2d0e66939407" href="https://ftmscan.com/token/0x6f43ff82cca38001b6699a8ac47a2d0e66939407">`0x6f43ff82cca38001b6699a8ac47a2d0e66939407`</a> |
| VRF Wrapper                | [`0xeda5b00fb33b13c730d004cf5d1ada1ac191ddc2`](https://ftmscan.com/address/0xeda5b00fb33b13c730d004cf5d1ada1ac191ddc2)                                                                                        |
| VRF Coordinator            | [`0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`](https://ftmscan.com/address/0xd5d517abe5cf79b7e95ec98db0f0277788aff634)                                                                                        |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                             |
| Coordinator Flat Fee       | 0.0005 LINK                                                                                                                                                                                                   |
| Maximum Confirmations      | 200                                                                                                                                                                                                           |
| Maximum Random Values      | 10                                                                                                                                                                                                            |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                         |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                         |

### Fantom Testnet

> 🚰 Fantom Testnet Faucet
>
> Testnet LINK is available from https://faucets.chain.link/fantom-testnet

| Item                       | Value                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LINK Token                 | <a class="erc-token-address" id="4002_0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F" href="https://testnet.ftmscan.com/address/0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F">`0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F`</a> |
| VRF Wrapper                | [`0x78b69899C8cD252126cBB1A50171ec37286C3877`](https://testnet.ftmscan.com/address/0x78b69899C8cD252126cBB1A50171ec37286C3877)                                                                                           |
| VRF Coordinator            | [`0xbd13f08b8352A3635218ab9418E340c60d6Eb418`](https://testnet.ftmscan.com/address/0xbd13f08b8352a3635218ab9418e340c60d6eb418)                                                                                           |
| Wrapper Premium Percentage | 0                                                                                                                                                                                                                        |
| Coordinator Flat Fee       | 0.0005 LINK                                                                                                                                                                                                              |
| Maximum Confirmations      | 200                                                                                                                                                                                                                      |
| Maximum Random Values      | 10                                                                                                                                                                                                                       |
| Wrapper Gas overhead       | 30000                                                                                                                                                                                                                    |
| Coordinator Gas Overhead   | 90000                                                                                                                                                                                                                    |
