---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Get a Random Number"
permalink: "docs/get-a-random-number/"
whatsnext: {"Contract Addresses":"/docs/vrf-deployments/"}
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
to link using an ETH/LINK feed, and charged to the subscription including a flat per-request fee. See more information about the fee structure in the [VRF Deployments page](../vrf-deployments).

# Static Parameters
These parameters are the same for all VRF users. You can find the respective values for your network in the [VRF Deployments page](../vrf-deployments).
- `address link` - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc).
- `address vrfCoordinator` - Address of the Chainlink VRF Coordinator.
- `bytes32 keyHash` - Hash of the public key used to verify the VRF proof. It functions as an ID of the offchain VRF job to be run in response to requests.
Invalid key hashes will result in the request not being processed.  

# Selecting a keyhash and minimum balances
Each keyhash is associated with a maximum gas price used to fulfill a request. This maximum is important in the case of gas price spikes, 
where the node may need to bump the gas price for timely fulfillment as it specifies an upper bound on the gas bumping. 
It also determines what the minimum subscription balance is in order to fulfill a request, computed as follows:

$$ (max_gas_price * (callback_gas_limit + verification_gas)) / (eth_link_price) $$

where the verification_gas has a safe probabilistic upper bound of 200k.

So for example, say the eth_link_price is 0.02 ETH/LINK and we want to request 200k callback gas limit using a max gas price of 200gwei (by selecting the appropriate keyhash). 
The minimum link balance required for that request to be fulfilled is ((200e9)(200000 + 200000))/0.01 = 8 LINK, which is the maximum possible payment for that single request.
Should the request be fulfilled at a gas price lower than the maximum, which is quite likely in steady gas conditions, then amount billed will be much less than 8 LINK. 
If you make a request when the subscription is underfunded, you can simply top up the subscription with LINK and the request will go through automatically as long as the request was made in the last 24 hours. 
The full list of available keyhashes and their associated max gas prices can be found on the [VRF Deployments page](../vrf-deployments). 

# User Parameters
These parameters are configurable based on the users needs.
- `uint16 requestConfirmations` - How many confirmations you'd like the Chainlink node to wait before responding. The longer the node waits the more secure the random value is. It must be greater than the coordinators `minimumRequestBlockConfirmations`.
- `uint32 callbackGasLimit` - How much gas you would like in your callback to do work with the random words provided. It must be less than the coordinators `maxGasLimit`.
- `uint16 numWords` - How many random words you would like in your request. If you are able to make use of several random words in the same callback, you can achieve significant gas savings.

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
1. Deploy your applications which accept a subscription ID like `VRFExternalSubOwnerExample.requestRandomWords` does and record all their addresses.
1. Register all the applications `addConsumer(uint64 subId, address consumer)` . TODO: metamask screen shots
1. Fund the subscription with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFExternalSubOwnerExample.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/VRF/VRFExternalSubOwnerExample.sol %}
```

## Advanced

The above examples are by no means the only way to make use of the VRF. The subscription can be managed dynamically as follows:

- Change the consumer set with `addConsumer(uint64 subId, address consumer)`/`removeConsumer(uint64 subId, address consumer)`
  - Note there are a maximum of 100 consumers per subscription, if you need more use multiple subscriptions.
- Transfer the subscription ownership with `requestSubscriptionOwnerTransfer(uint64 subId, address newOwner)`/`acceptSubscriptionOwnerTransfer(uint64 subId)`.
- Top up the subscription balance with `LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(subId));`
  - Note that any address can fund a subscription
- View the subscription with `getSubscription(uint64 subId)`
- Cancel the subscription with  `cancelSubscription(uint64 subId)`

The full coordinator interface is available [here](https://github.com/smartcontractkit/chainlink/blob/bbc471860883f302ea90425346c7a51a0e867a24/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol). You can use the subscription management functions however you see fit.

> 🚧 Security Considerations
>
> Be sure to look your contract over with [these security considerations](../vrf-security-considerations/) in mind!

>❗️ Remember to fund your subscription with LINK!
>
> Your randomness request will not complete unless your subscription has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/)**.
