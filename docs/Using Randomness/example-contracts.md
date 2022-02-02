---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Example Contracts"
permalink: "docs/chainlink-vrf/example-contracts/"
whatsnext: {"Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  description: "Example contracts for generating a random number inside a smart contract using Chainlink VRF."
  image:
    0: "/files/OpenGraph_V3.png"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](/docs/get-a-random-number/v1/).

How you manage the subscription depends on your randomness needs. You can configure your subscriptions using the [Subscription Manager]() application, but these examples demonstrate how to create your subscription and register your applications programmatically. <!--TODO: Add subscription management app URL -->

## Table of Contents

- [Single consumer and subscription owner](#single-consumer-and-subscription-owner)
- [Multiple consumers with an external subscription owner](#multiple-consumers-with-an-external-subscription-owner)
- [Modify existing subscriptions](#modify-existing-subscriptions)

## Single consumer and subscription owner

In this example, there is only one consumer who is also the subscription owner. It also sets the request config to be static, so each request uses the same parameters.

```solidity Kovan
{% include samples/VRF/VRFSingleConsumerExample.sol %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFSingleConsumerExample.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

## Multiple consumers with an external subscription owner

In this example, an external account manages the subscription for multiple consumers. Set up this configuration using the following process:

1. Create a subscription with `createSubscription()`. Make a note of the subscriptionId emitted in the `SubscriptionCreated` log.
1. Deploy your applications which accept a subscription ID like `VRFExternalSubOwnerExample.requestRandomWords` does and record all their addresses. <!--TODO: Clarify this sentence -->
1. Register all the applications `addConsumer(uint64 subId, address consumer)` . <!--TODO: Clarify this sentence -->
1. Fund the subscription with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFExternalSubOwnerExample.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="/docs/deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/VRF/VRFExternalSubOwnerExample.sol %}
```

## Modify existing subscriptions

Subscription configurations do not have to be static. You can change your subscription configuration dynamically using the following functions:

- Change the consumer set with `addConsumer(uint64 subId, address consumer)` or `removeConsumer(uint64 subId, address consumer)`.
  - There are a maximum of 100 consumers per subscription. If you need more than 100 consumers, use multiple subscriptions.
- Transfer the subscription ownership with `requestSubscriptionOwnerTransfer(uint64 subId, address newOwner)` and `acceptSubscriptionOwnerTransfer(uint64 subId)`.
- Top up the subscription balance with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`. Any address can fund a subscription.
- View the subscription with `getSubscription(uint64 subId)`.
- Cancel the subscription with `cancelSubscription(uint64 subId)`.

The full coordinator interface is available [here](https://github.com/smartcontractkit/chainlink/blob/bbc471860883f302ea90425346c7a51a0e867a24/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol). You can use the subscription management functions however you see fit.

> 🚧 Security Considerations
>
> Be sure to look your contract over with [these security considerations](/docs/vrf-security-considerations/) in mind!

>❗️ Remember to fund your subscription with LINK!
>
> Your randomness request will not complete unless your subscription has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](/docs/acquire-link/)**.
