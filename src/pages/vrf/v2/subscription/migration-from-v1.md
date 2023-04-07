---
layout: ../../../../layouts/MainLayout.astro
section: vrf
date: Last Modified
title: "Migrating from VRF v1"
permalink: "docs/vrf/v2/subscription/migration-from-v1/"
setup: |
  import VrfCommon from "@features/vrf/v2/common/VrfCommon.astro"
  import CodeSample from "@components/CodeSample/CodeSample.astro"
---

<VrfCommon callout="subscription"/>

## Comparing VRF v1 to the VRF v2 subscription method

Chainlink VRF v2 includes several improvements and changes to the way you fund and request randomness for your smart contracts.

- **Subscription management:** Chainlink VRF v2 introduces a [Subscription Manager](/vrf/v2/subscription/ui/) application that allows smart contract applications to pre-fund multiple requests for randomness using a single LINK token balance. This reduces the gas fees for VRF requests by eliminating the need to transfer LINK tokens for each individual request. You transfer LINK tokens to the subscription balance only when it requires additional funding. Read the [Subscription Manager](/vrf/v2/subscription/ui/) page to learn more.

- **Variable Callback Gas Limit:** Chainlink VRF v2 lets you adjust the callback gas limit when your smart contract application receives verifiable randomness. Consuming contracts can execute more complex logic in the callback request function that receives the random values. Tasks involving the delivered randomness are handled during the response process. The new gas limits are higher than the VRF V1 limit, and vary depending on the underlying blockchain you use. See the gas limits on the [VRF Supported Networks](/vrf/v2/subscription/supported-networks/) page.

- **More configuration capability:** You can define how many block confirmations must pass before verifiable randomness is generated and delivered on-chain when your application makes a request transaction. The range is from 3 to 200 blocks. VRF V1 always waited 10 blocks on Ethereum before delivering on-chain randomness. Select a value that protects your application from block re-organizations while still providing sufficiently low latency from request to response. See the [Security Considerations](/vrf/v2/security/) page to learn more.

- **Multiple Random Outputs in a Single Request:** The [VRF Coordinator contracts](/vrf/v2/subscription/supported-networks/) in VRF v2 allow you to request multiple random numbers (multi-word) in a single on-chain transaction, which reduces gas costs. The fulfillment is also a single transaction, which reduces the latency of responses.

- **Unified Billing - Delegate Subscription Balance to Multiple Addresses:** Chainlink VRF v2 allows up to 100 smart contract addresses to fund their requests for verifiable randomness from a single LINK subscription balance, which is managed by the subscription owner.

Read the [Chainlink VRF v2 blog post](https://blog.chain.link/vrf-v2-mainnet-launch/) for a detailed explanation about the benefits and use cases for VRF v2.

## Updating your applications to use VRF v2

<VrfCommon callout="ui"/>

To modify your existing smart contract code to work with VRF v2, complete the following changes. See the [Get a Random Number](/vrf/v2/subscription/examples/get-a-random-number/) guide for an example.

1. Set up and fund a subscription in the Subscription Manager at [vrf.chain.link](https://vrf.chain.link).
   <!-- prettier-ignore -->
   <div class="remix-callout">
          <a href="https://vrf.chain.link" target="_blank" >Open the Subscription Manager</a>
    </div>

1. Import the new [`VRFConsumerBaseV2.sol` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBaseV2.sol) and remove the v1 `VRFConsumerBase.sol` import. This contract includes the `fulfillRandomWords` function.

1. Import the [`VRFCoordinatorV2Interface.sol` interface](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol). This interface includes the new `requestRandomWords` function.

1. Add a `VRFConsumerBaseV2` constructor as shown in the [Get a Random Number](/vrf/v2/subscription/examples/get-a-random-number/) example.

1. Change `requestRandomness` function calls to `requestRandomWords`. The `requestRandomWords` function requires several additional parameters.

1. Change `fulfillRandomness` function calls to `fulfillRandomWords`. Update the call to handle the returned `uint256[]` array instead of the single `uint256` variable.
