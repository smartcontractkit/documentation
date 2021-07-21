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

For implementation details, read [Introduction to Chainlink VRF](../chainlink-vrf/).

# Coordinator Parameters

These parameters are configured by the coordinator owner, which currently is Chainlink itself until the threshold VRF is released.

You can view their values by running `getConfig` on the coordinator.
- `uint16 minimumRequestBlockConfirmations` - A minimum number of confirmation blocks on VRF requests before oracles should respond.
- `uint32 maxGasLimit` - The maximum gas limit supported for a fulfillRandomWords callback.
- `uint32 stalenessSeconds` - How long we wait until we consider the ETH/LINK price (used for converting gas costs to LINK) is stale and use `fallbackWeiPerUnitLink`
- `uint32 gasAfterPaymentCalculation` - How much gas is used outside of the payment calculation. Specifically its the gas outside of here [here]() and [here](). <!--TODO: add links-->

# Fee parameters

Also configured by the coordinator owner, these specify the billing tranches based on request count.
You can view them by running `getFeeConfig` on the coordinator.
- `uint32 fulfillmentFlatFeeLinkPPMTier1`, `uint32 fulfillmentFlatFeeLinkPPMTier2`, `uint32 fulfillmentFlatFeeLinkPPMTier3`, `uint32 fulfillmentFlatFeeLinkPPMTier4`, `uint32 fulfillmentFlatFeeLinkPPMTier5` - fees for each tier specified in millionths of LINK.
- `uint24 reqsForTier2`, `uint24 reqsForTier3`, `uint24 reqsForTier4`, `uint24 reqsForTier5` - tier boundaries in terms of requests made using a given subscription.

# Gas prices

To avoid costly responses during gas price volatility, VRF response transactions are submitted with a limit on the maximum gas price. Because every use case is different, different VRF jobs are set up on each blockchain with different gas caps. Each VRF job corresponds to a different keyHash. Contract developers can reference the appropriate keyHash according to how much they are willing to pay for gas for each specific use case. Note that these are maximum gas prices and are used only if current network conditions require it. Otherwise, a more appropriate lower gas price is used to submit the response. If your use case requires a different gas price cap than what is currently available, [contact our team](https://chainlinkcommunity.typeform.com/to/OYQO67EF).

# Ethereum Mainnet

|Item|Value|
|---|---|
|LINK Token|[`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)|
|VRF Coordinator|[`0x7D2A4c7C0036f26A01C62c53DD93608145E3CeC9`](https://etherscan.io/token/0x7D2A4c7C0036f26A01C62c53DD93608145E3CeC9)|
|200 gwei Key Hash|`0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef`|
|500 gwei Key Hash|`0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92`|
|1000 gwei Key Hash|`0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805`|
|Fee |0.25 LINK|

# Rinkeby

> 🚰Rinkeby Faucets
>
> Testnet LINK is available from https://faucets.chain.link/rinkeby
> Testnet ETH is available from: https://faucets.chain.link/rinkeby
> Backup Testnet ETH Faucets: https://rinkeby-faucet.com/, https://app.mycrypto.com/faucet

|Item|Value|
|---|---|
|LINK Token|[`0x01BE23585060835E02B77ef475b0Cc51aA1e0709`](https://rinkeby.etherscan.io/token/0x01BE23585060835E02B77ef475b0Cc51aA1e0709)|
|VRF Coordinator|[`0x5Ff6db248780a059ad893c898ba9a198Eddc4a08`](https://rinkeby.etherscan.io/token/0x5Ff6db248780a059ad893c898ba9a198Eddc4a08)|
|10 gwei Key Hash|`0x59245bc7b65da15a2d4328d176535e11d9675cd7cf13fcb800eb7277da216a36`|
|30 gwei Key Hash|`0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc`|
|Fee |0.25 LINK|

<!-- Commented out for now

# Polygon (Matic) Mainnet

|Item|Value|
|---|---|
|LINK Token|[`0xb0897686c545045afc77cf20ec7a532e3120e0f1`](https://polygonscan.com/address/0xb0897686c545045afc77cf20ec7a532e3120e0f1)|
|VRF Coordinator|[`0x7cc90fF2b9cFb4001362b21d95aa78Fef189c57B`](https://polygonscan.com/address/0x7cc90fF2b9cFb4001362b21d95aa78Fef189c57B)|
|200 gwei Key Hash|[`0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93`|
|500 gwei Key Hash|[`0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`|
|1000 gwei Key Hash|[`0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8`|

# Polygon (Matic) Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from [the official Matic faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

|Item|Value|
|---|---|
|LINK Token|[`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`](https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB)|
|VRF Coordinator|[`0xb96A95d11cE0B8E3AEdf332c9Df17fC31D379651`](https://mumbai.polygonscan.com/address/0xb96A95d11cE0B8E3AEdf332c9Df17fC31D379651)|
|100 gwei Key Hash|`0x85ebe225389765a0f6256c01b0ffab64c2e3eee50527cca47800417218b84b47`|
|500 gwei Key Hash|`0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`|

# Binance Smart Chain Mainnet

|Item|Value|
|---|---|
|LINK Token|[`0x404460c6a5ede2d891e8297795264fde62adbb75`](https://bscscan.com/token/0x404460c6a5ede2d891e8297795264fde62adbb75)|
|VRF Coordinator|[`0x7FF1Ec825886BA323d669b77c7229c29b826F982`](https://bscscan.com/token/0x7FF1Ec825886BA323d669b77c7229c29b826F982)|
|200 gwei Key Hash|`0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04`|
|500 gwei Key Hash|`0xba6e730de88d94a5510ae6613898bfb0c3de5d16e609c5b7da808747125506f7`|
|1000 gwei Key Hash|`0x17cd473250a9a479dc7f234c64332ed4bc8af9e8ded7556aa6e66d83da49f470`|

# Binance Smart Chain Testnet

> 🚰BSC Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Item|Value|
|---|---|
|LINK Token|[`0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`](https://testnet.bscscan.com/address/0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06)|
|VRF Coordinator|[`0xb96A95d11cE0B8E3AEdf332c9Df17fC31D379651`](https://testnet.bscscan.com/address/0xb96A95d11cE0B8E3AEdf332c9Df17fC31D379651)|
|20 gwei Key Hash|`0xbed0624a3355d6c02f88cfa96054e0d39b788c380fdf7e14063edea8ba624d7d`|
|50 gwei Key Hash|`0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314`|

-->
