---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Migrating to VRF v2"
permalink: "docs/chainlink-vrf/migration-vrf-v1-v2/"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](/docs/chainlink-vrf/v1/).

# Comparison between VRF v1 and VRF v2

+ Subscription management: Chainlink VRF V2 introduces a subscription management app that allows smart contract applications to pre-fund multiple requests for randomness using a single LINK token balance. This reduces the gas fees for VRF requests by eliminating the need to transfer LINK tokens for each individual request. You need to transfer LINK tokens only one time to fill your subscription balance. Go to the [subscription management app]() to learn more. <!-- TODO: Add URL and url text and maybe reconsider a link to the docs instead-->

+ Variable Callback Gas Limit: Chainlink VRF V2 lets you adjust the callback gas limit when your smart contract application receives verifiable randomness. Consuming contracts can execute more complex logic in the same transaction that verifiable randomness is received in. Tasks involving the delivered randomness are handled during the response process. The new gas limits are higher than the VRF V1 limit, and vary depending on the underlying blockchain you use. See the gas limits on the []() page. <!-- TODO: Add URL and url text -->

+ More configurability: You can define how many block confirmations must pass before verifiable randomness is generated and delivered on-chain when your application makes a request transaction. The range is from 3 to 200 blocks. VRF V1 always waited 10 blocks on Ethereum before delivering on-chain randomness. Select a value that protects your application from block re-organizations while still providing sufficiently low latency from request to response. See the [Security Considerations]() page to learn more. <!-- TODO: Add URL and url text -->

+ Multiple Random Outputs in a Single Request: The [VRF Coordinator contract]() in VRF V2 allows you to request multiple random numbers (multi-word) in a single on-chain transaction, which reduces gas costs. The fulfillment is also a single transaction, which reduces the latency of responses. <!-- TODO: Add URL and url text -->

+ Unified Billing - Delegate Subscription Balance to Multiple Addresses: Chainlink VRF V2 allows up to 100 smart contract addresses to fund their requests for verifiable randomness from a single LINK subscription balance, which is managed by the subscription owner.

# Updating your applications to use VRF v2

To modify your existing smart contract code to work with VRF v2, complete the following changes. See the [Get a Random Number](/docs/get-a-random-number/#example-configurations) guide for an example.

- Set up and fund a subscription. <!-- TODO: Add URL and url text -->

- Import the new [`VRFConsumerBaseV2.sol` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol) and remove the v1 `VRFConsumerBase.sol` import. This contract includes the `fulfillRandomWords` function.

- Import the [`VRFCoordinatorV2Interface.sol`](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol) interface. This interface includes the new `requestRandomWords` function.

- Add a `VRFConsumerBaseV2` constructor as shown in the [Get a Random Number](/docs/get-a-random-number/#example-configurations) example.

- Change `requestRandomness` function calls to `requestRandomWords`. The `requestRandomWords` function requires several additional parameters.

- Change `fulfillRandomness` function calls to `fulfillRandomWords`. Update the call to handle the returned `uint256[]` array instead of the single `uint256` variable.
