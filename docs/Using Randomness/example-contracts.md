---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Example Contracts"
permalink: "docs/chainlink-vrf/example-contracts/"
whatsnext: {"Security Considerations":"/docs/vrf-security-considerations/", "Best Practices":"/docs/chainlink-vrf-best-practices/", "Migrating from VRF v1 to v2":"/docs/chainlink-vrf/migration-vrf-v1-v2/", "Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  description: "Example contracts for generating a random number inside a smart contract using Chainlink VRF."
---

> 📘 You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](/docs/get-a-random-number/v1/).

How you manage the subscription depends on your randomness needs. You can configure your subscriptions using the [Subscription Manager](https://vrf.chain.link), but these examples demonstrate how to create your subscription and add your consumer contracts programmatically. For these examples, the contract owns and manages the subscription. You can still view the subscriptions in the [Subscription Manager](https://vrf.chain.link). Any wallet can provide funding to those subscriptions.

**Topics**

- [Modifying subscriptions and configurations](#modifying-subscriptions-and-configurations)
- [Subscription manager contract](#subscription-manager-contract)
- [Funding and requesting simultaneously](#funding-and-requesting-simultaneously)

## Modifying subscriptions and configurations

Subscription configurations do not have to be static. You can change your subscription configuration dynamically by calling the following functions using the [VRFCoordinatorV2Interface](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol):

- Change the list of approved subscription consumers with `addConsumer(uint64 subId, address consumer)` or `removeConsumer(uint64 subId, address consumer)`.
- Transfer the subscription ownership with `requestSubscriptionOwnerTransfer(uint64 subId, address newOwner)` and `acceptSubscriptionOwnerTransfer(uint64 subId)`.
- View the subscription with `getSubscription(uint64 subId)`.
- Cancel the subscription with `cancelSubscription(uint64 subId)`.

To send LINK to the subscription balance, use the LINK token interface with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`. Any wallet can fund a subscription.

See the example in the [Subscription manager contract](#subscription-manager-contract) section to learn how to create a contract that can change your subscription configuration.

## Subscription manager contract

In this example, the contract operates as a subscription owner and can run functions to add consumer contracts to the subscription. The consumer contracts must include the `requestRandomWords()` function with the correct coordinator parameters and the correct subscription ID to request random values and use the subscription balance. The consumer contracts must also include the `fulfillRandomWords()` function to receive the random values.

Subscription owners and consumers do not have to be separate. This contract can also act as a consumer by running its own `requestRandomWords()` function, but it must add itself as an approved consumer. This example contract includes functions in the `constructor()` that creates the subscription and adds itself as a consumer automatically when you deploy it.

```solidity
{% include 'samples/VRF/VRFv2SubscriptionManager.sol' %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2SubscriptionManager.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

To use this contract, compile and deploy it in Remix.

1. Open the contract in [Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2SubscriptionManager.sol).

1. Compile and deploy the contract using the Injected Provider environment. The contract includes all of the configuration variables that you need, but you can edit them if necessary. For a full list of available configuration variables, see the [Contract Addresses](/docs/vrf-contracts/) page.

    This contract automatically creates a new subscription when you deploy it. Read the `s_subscriptionId` variable to find your subscription ID. You can use this value to find the subscription in the [Subscription Manager](https://vrf.chain.link).

1. In this example, the `topUpSubscription()` function sends LINK from your contract to the subscription. Fund your contract with at least three testnet LINK. Alternatively, you can send LINK directly to the subscription in the [Subscription Manager](https://vrf.chain.link). Any address can provide funding to a subscription balance. If you need testnet LINK, you can get it from one of the available [Rinkeby faucets](/docs/link-token-contracts/#rinkeby).

1. Run the `topUpSubscription()` function to send LINK from your contract to your subscription balance. For this example, specify a value of `3000000000000000000`, which is equivalent to three LINK.

1. Create and deploy a consumer contract that includes the following components:

    - The `requestRandomWords()` function and the required variables and your subscription ID
    - The `fulfillRandomWords()` callback function

    You can use the example from the [Get a Random Number](/docs/get-a-random-number/#analyzing-the-contract) guide.

1. After you deploy the consumer contract, add it to the subscription as an approved consumer using the `addConsumer()` function on your subscription manager contract. Specify the address of your consumer contract.

1. On the consumer contract, run the `requestRandomWords()` function to request and receive random values. The request might take several minutes to process. Track pending request status in the [Subscription Manager](https://vrf.chain.link) app.

    The consumer contract can continue to make requests until your subscription balance runs out. The subscription manager contract must maintain sufficient balance in the subscription so that the consumers can continue to operate.

1. When you are done with your contracts and the subscription, run the `cancelSubscription()` to close the subscription and send the remaining LINK to your wallet address. Specify the address of the receiving wallet.

If you need to remove consumer contracts from the subscription, use the `removeConsumer()` function. Specify the address of the consumer contract to be removed.

## Funding and requesting simultaneously

You can fund a subscription and request randomness in a single transaction. This is similar to how VRF v1 functions, but you must estimate how much the transaction might cost and determine the amount of funding to send to the subscription yourself. See the [Subscription billing](/docs/chainlink-vrf/#subscription-billing) page to learn how to estimate request costs.

```solidity
{% include 'snippets/VRF/VRFv2FundAndRequestFunction.sol' %}
```

Add this function to your contracts if you need to provide funding simultaneously with your requests. The `transferAndCall()` function sends LINK from your contract to the subscription, and the `requestRandomWords()` function requests the random words. Your contract still needs the `fulfillRandomWords()` callback function to receive the random values.

> 🚧 Security Considerations
>
> Be sure to review your contract with the [security considerations](/docs/vrf-security-considerations/) in mind.
