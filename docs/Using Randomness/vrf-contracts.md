---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Contract Addresses"
permalink: "docs/vrf-contracts/"
metadata:
  title: "Chainlink VRF Contract Addresses"
  image:
    0: "/files/OpenGraph_V3.png"
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

### Ethereum Mainnet

|Item|Value|
|---|---|
|LINK Token|[`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)|
|VRF Coordinator|[`0x271682DEB8C4E0901D1a1550aD2e64D568E69909`](https://etherscan.io/token/0x271682DEB8C4E0901D1a1550aD2e64D568E69909)|
|200 gwei Key Hash|`0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef`|
|500 gwei Key Hash|`0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92`|
|1000 gwei Key Hash|`0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805`|
|Premium|0.25 LINK|
|Minimum Confirmations|3|
|Maximum Confirmations|200|
|Maximum Random Values|500|

### Rinkeby testnet

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
|Maximum Confirmations|200|
|Maximum Random Values|500|

### BNB Chain

|Item|Value|
|---|---|
|LINK Token|[`0x404460c6a5ede2d891e8297795264fde62adbb75`](https://bscscan.com/address/0x404460c6a5ede2d891e8297795264fde62adbb75)|
|VRF Coordinator|[`0xc587d9053cd1118f25F645F9E08BB98c9712A4EE`](https://bscscan.com/address/0xc587d9053cd1118f25F645F9E08BB98c9712A4EE)|
|200 gwei Key Hash|`0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04`|
|500 gwei Key Hash|`0xba6e730de88d94a5510ae6613898bfb0c3de5d16e609c5b7da808747125506f7`|
|1000 gwei Key Hash|`0x17cd473250a9a479dc7f234c64332ed4bc8af9e8ded7556aa6e66d83da49f470`|
|Premium|0.005 LINK|
|Minimum Confirmations|3|
|Maximum Confirmations|200|
|Maximum Random Values|500|

### BNB Chain testnet

> 🚰 BNB Chain Faucet
>
> Testnet LINK is available from https://faucets.chain.link/chapel

|Item|Value|
|---|---|
|LINK Token|[`0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`](https://testnet.bscscan.com/address/0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06)|
|VRF Coordinator|[`0x6A2AAd07396B36Fe02a22b33cf443582f682c82f`](https://testnet.bscscan.com/address/0x6A2AAd07396B36Fe02a22b33cf443582f682c82f)|
|50 gwei Key Hash|`0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314`|
|Premium|0.005 LINK|
|Minimum Confirmations|3|
|Maximum Confirmations|200|
|Maximum Random Values|500|
