---
layout: nodes.liquid
section: smartContract
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

This page explains how to get a random number inside a smart contract using Chainlink VRF.

Chainlink VRF is subscription-based. The subscription owner manages the subscription LINK balance as well as the set of addresses (consumers) that are allowed to use that balance for VRF requests. The requests follow the
[Request & Receive Data](../request-and-receive-data/) cycle. Upon fulfillment, the gas used to fulfill the request is calculated, converted
to link using an ETH/LINK feed, and charged to the subscription including a flat per request fee. To learn more about the fee, see `fulfillmentFlatFeeLinkPPM` in the [Coordinator Parameters](#coordinator-parameters) list.

# Static Parameters
These parameters are the same for all VRF users. You can find the respective values for your network in the [VRF Contracts page](../vrf-contracts).
- `address link` - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc).
- `address vrfCoordinator` - Address of the Chainlink VRF Coordinator.
- `bytes32 keyHash` - Hash of the public key used to verify the VRF proof. It functions as an ID of the offchain VRF job to be run in response to requests. It is very important this is correct, if not, your request will not be processed.

# User Parameters
These parameters are configurable based on the users needs.
- `uint16 requestConfirmations` - How many confirmations you'd like the Chainlink node to wait before responding. The longer the node waits the more secure the random value is. It must be greater than the coordinators `minimumRequestBlockConfirmations`.
- `uint32 callbackGasLimit` - How much gas you would like in your callback to do work with the random words provided. It must be less than the coordinators `maxGasLimit`.
- `uint16 numWords` - How many random words you would like in your request. If you are able to make use of several random words in the same callback, you can achieve significant gas savings.

# Coordinator Parameters
These parameters are configured by the coordinator owner, which currently is Chainlink itself until the threshold VRF is released. You can view their values by running `getConfig` on the coordinator contract (see [VRF Contracts](../vrf-contracts) for the coordinator address).
- `uint16 minimumRequestBlockConfirmations` - A minimum number of confirmation blocks on VRF requests before oracles should respond.
- `uint32 fulfillmentFlatFeeLinkPPM`- The charge per request on top of the gas fees. Its flat fee specified in millionths of LINK.
- `uint32 maxGasLimit` - The maximum gas limit supported for a fulfillRandomWords callback.
- `uint32 stalenessSeconds` - How long we wait until we consider the ETH/LINK price (used for converting gas costs to LINK) is stale and use `fallbackWeiPerUnitLink`
- `uint32 gasAfterPaymentCalculation` - How much gas is used outside of the payment calculation. Specifically its the gas outside of here (TODO link) and here (TODO link).
- `uint96 minimumSubscriptionBalance` - The minimum subscription balance required to make a request. Its set to be about 300% of the cost of a single request to handle fluctuations in ETH/LINK price between request and fulfillment time.
- `uint256 MAXIMUM_CONSUMERS` - A fixed maximum of 100 consumers per subscription. Use multiple separate subscriptions if you need more.

# Example Configurations

How you manage the subscription is up to you and depends on your randomness needs. Here are a few example configurations.

## Single consumer/subscription owner

A simple example subscription with only one consumer who is also the subscription owner. It also sets the request config to be static, so each request uses the same parameters.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFSingleConsumerExample.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/VRF/VRFSingleConsumerExample.sol %}
```

## Multiple consumers, external subscription owner

In this example, the subscription for multiple consumers is managed by an external account. Steps to set up this configuration:

1. Create a subscription with `createSubscription()`. Make a note of the subscriptionId emitted in the `SubscriptionCreated` log. TODO: metamask screen shots
1. Deploy your applications which expose a `setSubscriptionId(uint64 subId)` like `VRFConsumerExternalSubOwner` does and record all their addresses.
1. Register all the applications `addConsumer(uint64 subId, address consumer)` . TODO: metamask screen shots
1. Fund the subscription with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFConsumerExternalSubOwnerExample.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/VRF/VRFConsumerExternalSubOwnerExample.sol %}
```

## Advanced

The above examples are by no means the only way to make use of the VRF. The subscription can be managed dynamically as follows:

- Change the consumer set with `addConsumer(uint64 subId, address consumer)`/`removeConsumer(uint64 subId, address consumer)`
- Transfer the subscription ownership with `requestSubscriptionOwnerTransfer(uint64 subId, address newOwner)`/`acceptSubscriptionOwnerTransfer(uint64 subId)`.
- Withdraw from the subscription balance with `defundSubscription(uint64 subId, address to, uint96 amount)`
- Top up the subscription balance with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`
- View the subscription with `getSubscription(uint64 subId)`
- Cancel the subscription with  `cancelSubscription(uint64 subId)`

The full coordinator interface is available [here](https://github.com/smartcontractkit/chainlink/blob/b56b40353b0df29f058e3d2d79d55c1caaf60031/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol). You can use the subscription management functions however you see fit.

> 🚧 Security Considerations
>
> Be sure to look your contract over with [these security considerations](../vrf-security-considerations/) in mind!

>❗️ Remember to fund your subscription with LINK!
>
> Requesting randomness will fail unless your subscription contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/)**.
