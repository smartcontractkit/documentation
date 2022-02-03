---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Get a Random Number"
permalink: "docs/get-a-random-number/"
whatsnext: {"Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  description: "How to generate a random number inside a smart contract using Chainlink VRF."
  image:
    0: "/files/OpenGraph_V3.png"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

This guide explains how to get a random number inside a smart contract using Chainlink VRF v2.

## Overview

Generally, you configure your smart contracts to use VRF v2 with the following process:

1. Create a compatible smart contract that imports [VRFCoordinatorV2Interface.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol) and includes the following components:

  - The `VRFConsumerBaseV2()` constructor

  - The `requestRandomWords()` function

1. Create a subscription in the [Subscription Manager](https://vrf.chain.link) application. Take note of the `subscriptionId`, which your contract needs later.

1. Deploy your applications to accept a subscription ID and record the addresses for each deployed contract.

1. Register all of the deployed applications in the [Subscription Manager](https://vrf.chain.link) application.

1. Fund the subscription in the [Subscription Manager](https://vrf.chain.link) application.

##  Parameters

These parameters define how your requests will be processed. You can find the values for your network in the [VRF Contract Addresses](/docs/vrf-contracts) page.

- `address link`: The LINK token address for your selected network.

- `address vrfCoordinator`: The address of the Chainlink VRF Coordinator.

- `bytes32 keyHash`: The keyHash for specifying your gas lane, which is the maximum gas price you are willing to pay for a request in wei. It functions as an ID of the off-chain VRF job to be run in response to requests.

- `uint16 requestConfirmations`: How many confirmations the Chainlink node should wait before responding. The longer the node waits, the more secure the random value is. It must be greater than the coordinator's `minimumRequestBlockConfirmations`.

- `uint32 callbackGasLimit`: How much gas you would like in your callback to do work with the random words provided. It must be less than the coordinators `maxGasLimit`.

- `uint16 numWords`: How many random words you would like in your request. If you are able to make use of several random words in the same callback, you can achieve significant gas savings.

## Example Contract

In this example, there is only one consumer who is also the subscription owner. It also sets the request config to be static, so each request uses the same parameters.

```solidity Kovan
{% include samples/VRF/VRFSingleConsumerExample-simple.sol %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFSingleConsumerExample-simple.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

> 🚧 Security Considerations
>
> Be sure to look your contract over with [these security considerations](/docs/vrf-security-considerations/) in mind!

>❗️ Remember to fund your subscription with LINK!
>
> Your randomness request will not complete unless your subscription has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](/docs/acquire-link/)**.
