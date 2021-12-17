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

# Rinkeby

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
|Fee |0.25 LINK|

# Polygon (Matic) Mumbai Testnet

> 🚰Mumbai Faucet
>
> Testnet LINK and MATIC are available from [the official Matic faucet](https://faucet.polygon.technology/) and https://faucets.chain.link/mumbai.

|Item|Value|
|---|---|
|LINK Token|[`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`](https://mumbai.polygonscan.com/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB)|
|VRF Coordinator|[`0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed`](https://mumbai.polygonscan.com/address/0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)|
|500 gwei Key Hash|`0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`|

# Binance Smart Chain Testnet

> 🚰BSC Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Item|Value|
|---|---|
|LINK Token|[`0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`](https://testnet.bscscan.com/address/0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06)|
|VRF Coordinator|[`0x6A2AAd07396B36Fe02a22b33cf443582f682c82f`](https://testnet.bscscan.com/address/0x6A2AAd07396B36Fe02a22b33cf443582f682c82f)|
|50 gwei Key Hash|`0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314`|
