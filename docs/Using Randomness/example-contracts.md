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

How you manage the subscription depends on your randomness needs. You can configure your subscriptions using the [Subscription Manager](https://vrf.chain.link) application, but these examples demonstrate how to create your subscription and register your applications programmatically. For these examples, the contract owns and manages the subscription. You can still view the subscriptions in the [Subscription Manager](https://vrf.chain.link) and any wallet can provide funding to those subscriptions.

**Table of contents**

- [Modifying subscriptions and configurations](#modifying-subscriptions-and-configurations)
- [Subscription manager contract](#subscription-manager-contract)
- [Funding and requesting simultaneously](#funding-and-requesting-simultaneously)

## Modifying subscriptions and configurations

Subscription configurations do not have to be static. You can change your subscription configuration dynamically by calling the following functions on the VRF v2 coordinator contract:

- Change the consumer set with `addConsumer(uint64 subId, address consumer)` or `removeConsumer(uint64 subId, address consumer)`.
- Transfer the subscription ownership with `requestSubscriptionOwnerTransfer(uint64 subId, address newOwner)` and `acceptSubscriptionOwnerTransfer(uint64 subId)`.
- Top up the subscription balance with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`. Any wallet can fund a subscription.
- View the subscription with `getSubscription(uint64 subId)`.
- Cancel the subscription with `cancelSubscription(uint64 subId)`.

The full coordinator interface is available on [GitHub](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol). You can use the subscription management functions however you see fit.

See the example in the [Subscription manager contract](#subscription-manager-contract) section to learn how to create a contract that can change your subscription configuration.

## Subscription manager contract

In this example, the contract operates as a subscription owner and can run functions to add consumer contracts to the subscription. Those contracts need to include only the `requestRandomWords()` function, the `fulfillRandomWords()` functions with the correct coordinator parameters and the correct `subscriptionId` value to obtain their own random values and use the subscription balance.

Subscription owners and consumers do not have to be separate. This contract can also act as a consumer by running its own `requestRandomWords()` function, but it must add itself as an approved consumer. This example creates the subscription and adds itself as a consumer when you deploy it.

```solidity
{% include samples/VRF/VRFv2SubscriptionManager.sol %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2SubscriptionManager.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

To use this contract, compile and deploy it in Remix.

1. Open the contract in [Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2SubscriptionManager.sol).

1. Compile and deploy the contract. Specify the constructor parameters with the desired addresses and values for your network. For a full list of available configuration variables, see the [Contract Addresses](/docs/vrf-contracts/) page.

    This contract automatically creates a new subscription when you deploy it. Read the `s_requestConfig` variable to see the configuration details. You can look up this subscription in the [Subscription Manager](https://vrf.chain.link) using the `subId` value.

1. Fund the subscription by running the `topUpSubscription()` function. For this function, a value of 1000000000000000000 = 1 LINK.

1. Create and deploy consumer contracts that include the following components:

    - The `requestRandomWords()` function and the required variables
    - The `fulfillRandomWords()` callback function

1. After you deploy these consumer contracts, add them to the subscription as approved consumers using the `addConsumer()` function on your subscription manager contract.

1. On each of the consumer contracts, run their `requestRandomWords()` functions to request and receive random values.

1. When you are done with this contract and its subscription, run the `cancelSubscription()` to close the subscription and send remaining LINK tokens to your wallet address.

The consumer contracts can continue to make requests until your subscription balance runs out. The subscription manager contract must maintain sufficient balance in the subscription so that the consumers can continue to operate.

If you need to remove consumer contracts later, use the `removeConsumer()` function.

## Funding and requesting simultaneously

You can fund a subscription and request randomness in a single transaction. This is similar to how VRF v1 functions, but you must estimate how much the transaction might cost and determine the amount of funding to send to the subscription yourself. See the [Subscription billing](/docs/chainlink-vrf/#subscription-billing) page to learn how to estimate request costs.

```solidity
{% include snippets/VRF/VRFv2FundAndRequestFunction.sol %}
```

Add this function to your contracts if you need to provide funding simultaneously with your requests. The `transferAndCall()` function sends LINK from your contract to the subscription, and the `requestRandomWords()` function requests the random words. Your contract still needs the `fulfillRandomWords()` callback function to receive the random values.


> 🚧 Security Considerations
>
> Be sure to review your contract with the [security considerations](/docs/vrf-security-considerations/) in mind.
