---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Contract Addresses"
permalink: "docs/vrf-deployments/"
metadata:
  title: "Chainlink VRF Contract Addresses"
  image:
    0: "/files/OpenGraph_V3.png"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

Chainlink VRF allows you to integrate provably-fair and verifiably random data in your smart contract.

For implementation details, read [Introduction to Chainlink VRF](/docs/chainlink-vrf/).

## Coordinator Parameters

These parameters are configured by the coordinator owner, which currently is Chainlink itself until the threshold VRF is released.

You can view their values by running `getConfig` on the coordinator.
- `uint16 minimumRequestBlockConfirmations` - A minimum number of confirmation blocks on VRF requests before oracles should respond.
- `uint32 maxGasLimit` - The maximum gas limit supported for a fulfillRandomWords callback.
- `uint32 stalenessSeconds` - How long we wait until we consider the ETH/LINK price (used for converting gas costs to LINK) is stale and use `fallbackWeiPerUnitLink`
- `uint32 gasAfterPaymentCalculation` - How much gas is used outside of the payment calculation. Specifically its the gas outside of here [here]() and [here](). <!--TODO: add links-->

## Fee parameters

Also configured by the coordinator owner, these specify the billing tranches based on request count.
You can view them by running `getFeeConfig` on the coordinator.
- `uint32 fulfillmentFlatFeeLinkPPMTier1`, `uint32 fulfillmentFlatFeeLinkPPMTier2`, `uint32 fulfillmentFlatFeeLinkPPMTier3`, `uint32 fulfillmentFlatFeeLinkPPMTier4`, `uint32 fulfillmentFlatFeeLinkPPMTier5` - fees for each tier specified in millionths of LINK.
- `uint24 reqsForTier2`, `uint24 reqsForTier3`, `uint24 reqsForTier4`, `uint24 reqsForTier5` - tier boundaries in terms of requests made using a given subscription.

## Gas prices

To avoid costly responses during gas price volatility, VRF response transactions are submitted with a limit on the maximum gas price. Because every use case is different, different VRF jobs are set up on each blockchain with different gas caps. Each VRF job corresponds to a different keyHash. Contract developers can reference the appropriate keyHash according to how much they are willing to pay for gas for each specific use case. Note that these are maximum gas prices and are used only if current network conditions require it. Otherwise, a more appropriate lower gas price is used to submit the response. If your use case requires a different gas price cap than what is currently available, [contact our team](https://chainlinkcommunity.typeform.com/to/OYQO67EF).

## Ethereum Mainnet

|Item|Value|
|---|---|
|LINK Token|[`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)|
|VRF Coordinator|[`0x271682DEB8C4E0901D1a1550aD2e64D568E69909`](https://etherscan.io/token/0x271682DEB8C4E0901D1a1550aD2e64D568E69909)|
|200 gwei Key Hash|`0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef`|
|500 gwei Key Hash|`0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92`|
|1000 gwei Key Hash|`0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805`|
|Premium|0.25 LINK|
|Minimum Confirmations|3|

## Rinkeby

> 🚰Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from: https://faucets.chain.link/rinkeby
> Backup Testnet ETH Faucets: https://rinkeby-faucet.com/, https://app.mycrypto.com/faucet

|Item|Value|
|---|---|
|LINK Token|[`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`](https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)|
|VRF Coordinator|[`0x6168499c0cFfCaCD319c818142124B7A15E857ab`](https://rinkeby.etherscan.io/token/0x6168499c0cFfCaCD319c818142124B7A15E857ab)|
|30 gwei Key Hash|`0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc`|
|Premium|0.25 LINK|
|Minimum Confirmations|3|

## Binance Smart Chain Mainnet

> 📘 Important
>
> The LINK provided by the [Binance Bridge](https://www.binance.org/en/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on BSC using Chainlink's PegSwap service**](https://pegswap.chain.link/).

|Item|Value|
|---|---|
|LINK Token|[`0x404460c6a5ede2d891e8297795264fde62adbb75`](https://bscscan.com/address/0x404460c6a5ede2d891e8297795264fde62adbb75)|
|VRF Coordinator|[`0xc587d9053cd1118f25F645F9E08BB98c9712A4EE`](https://bscscan.com/address/0xc587d9053cd1118f25F645F9E08BB98c9712A4EE)|
|200 gwei Key Hash|`0xba6e730de88d94a5510ae6613898bfb0c3de5d16e609c5b7da808747125506f7`|
|500 gwei Key Hash|`0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`|
|1000 gwei Key Hash|`0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8`|
|Premium|0.005 LINK|
|Minimum Confirmations|3|

## Binance Smart Chain Testnet

> 🚰BSC Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Item|Value|
|---|---|
|LINK Token|[`0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`](https://testnet.bscscan.com/address/0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06)|
|VRF Coordinator|[`0x6A2AAd07396B36Fe02a22b33cf443582f682c82f`](https://testnet.bscscan.com/address/0x6A2AAd07396B36Fe02a22b33cf443582f682c82f)|
|50 gwei Key Hash|`0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314`|
|Premium|0.005 LINK|
|Minimum Confirmations|3|

## Polygon (Matic) Mainnet

> 📘 Important
>
> The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [**converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service**](https://pegswap.chain.link/)

|Item|Value|
|---|---|
|LINK Token|[`0xb0897686c545045afc77cf20ec7a532e3120e0f1`](https://polygonscan.com/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1)|
|VRF Coordinator|[`0xAE975071Be8F8eE67addBC1A82488F1C24858067`](https://polygonscan.com/address/0xAE975071Be8F8eE67addBC1A82488F1C24858067)|
|200 gwei Key Hash|`0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93`|
|500 gwei Key Hash|`0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`|
|1000 gwei Key Hash|`0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8`|
|Premium|0.0005 LINK|
|Minimum Confirmations|3|

## Polygon (Matic) Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from the [Polygon faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

|Item|Value|
|---|---|
|LINK Token|[`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`](https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB)|
|VRF Coordinator|[`0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed`](https://mumbai.polygonscan.com/address/0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)|
|500 gwei Key Hash|`0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`|
|Premium|0.0005 LINK|
|Minimum Confirmations|3|
