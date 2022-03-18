---
layout: beta-launches.liquid
section:
  [
    {
      'title': 'GETTING STARTED',
      'contents':
        [
          { title: 'Overview', url: '#overview' },
          { title: 'Data Feeds', url: '#data-feeds' },
          { title: 'VRF', url: '#vrf' },
        ],
    },
  ]
date: Last Modified
title: 'Avalanche Summit  March 22nd - 27th, 2022'
permalink: 'avasummit/'
metadata:
  title: 'Avalanche Summit  March 22nd - 27th, 2022'
  image:
    0: '/files/OpenGraph_V3.png'
---

# Avalanche Summit March 22nd - 27th, 2022

> ℹ️ We are happy to announce our participation in the [Avalanche Summit](https://www.avalanchesummit.com/). To make the most out of it:
>
> - Keep an eye on the [schedule](https://www.avalanchesummit.com/agenda) and join the Chainlink talks.
> - Apply for the [Avalanche Summit Hackathon](https://hackathon.avalanchesummit.com/).
> - Join us at the [Chainlink Happy Hour](https://www.eventbrite.com/e/chainlink-happy-hour-avalanche-summit-tickets-258013052987).

Next, we will show you how you can use Chainlink with Avalanche. **Please Note** Chainlink VRF is an early-beta implementation, specifically for the Avalanche Summit. Chainlink cannot provide official support, but we hope you enjoy building with us!

## Overview

If you are new to Chainlink, please get familiar with [hybrid smart contracts](https://blog.chain.link/hybrid-smart-contracts-explained/). Our [developer documentation](/docs/conceptual-overview) is also a good place to start interacting with Chainlink.

At the moment, you can use these Chainlink features on Avalanche:

- Data Feeds are supported on [Avalanche](/docs/avalanche-price-feeds/).
- Chainlink VRF: Although not officially supported yet, we will walk you through a tutorial to get you started on Avalanche Fuji Testnet.

## Data Feeds

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world data. For instance, you can get the price of Avalanche (AVAX) in your smart contract by calling the AVAX/USD feed.

Check the [developer documentation](/docs/using-chainlink-reference-contracts/) to learn how to use Data Feeds. The examples are compatible with EVM Chains, make sure to use the [Avalanche Feeds](/docs/avalanche-price-feeds/).

## VRF

Chainlink VRF (Verifiable Random Function) is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability.
Use Chainlink VRF to build reliable smart contracts for any applications that rely on unpredictable outcomes. Also, check our blog to learn how Chainlink VRF enables [35+ Blockchain RNG Use Cases](https://blog.chain.link/blockchain-rng-use-cases-enabled-by-chainlink-vrf/).

Check the [developer documentation](/docs/chainlink-vrf/) to learn how to use Chainlink VRF. **Important Note** : The [Subscription Manager User-Interface](https://vrf.chain.link/) is not live for Avalanche yet. Therefore, the following guide will explain how to test Chainlink VRF on [Avalanche Fuji Testnet](https://docs.avax.network/build/tutorials/platform/fuji-workflow/).

### Requirements

This guide assumes that you know how to create and deploy smart contracts on Avalanche Fuji Testnet using the following tools:

- [The Remix IDE](https://remix.ethereum.org/)
- [MetaMask](https://metamask.io/)
- [Fuji testnet AVAX](/docs/link-token-contracts/#fuji-testnet)

If you are new to developing smart contracts on Ethereum, see the [Getting Started](/docs/conceptual-overview/) guide to learn the basics. Avalanche is an EVM-compatible chain; hence the basic tutorials should be portable.

### Subscription manager contract

Since the [Subscription Manager](https://vrf.chain.link/) is currently not available on Avalanche, we are going to walk you through a contract that operates at the same time as:

- Subscription owner: creates a subscription to Chainlin VRF when deployed. It also allows adding and removing consumers from the subscription.
- Consumer: calls Chainlink VRF to request random values. You will notice that, when deployed, the contract adds itself as a consumer to the subscription.

```solidity
{% include samples/beta-launch/avasummit/VRFv2SubscriptionManager.sol %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/beta-launch/avasummit/VRFv2SubscriptionManager.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

These parameters define how your requests will be processed:

- `uint64 s_subscriptionId`: The subscription ID that this contract uses for funding requests.

- `address vrfCoordinator`: The address of the Chainlink VRF Coordinator contract. `0x2eD832Ba664535e5886b75D64C46EB9a228C2610` is the Avalanche Fuji Coordinator address.

- `address link`: The LINK token address for your selected network. `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846` is the Avalanche Fuji Link token address.

- `bytes32 keyHash`: The gas lane key hash value, which is the maximum gas price you are willing to pay for a request in wei. It functions as an ID of the off-chain VRF job that runs in response to requests. Only `0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61` is currently available on Avalanche Fuji Testnet.

- `uint32 callbackGasLimit`: The limit for how much gas to use for the callback request to your contract's `fulfillRandomWords()` function. It must be less than the `maxGasLimit` limit on the coordinator contract, `2500000` on Avalanche Fuji Testnet. In this example, the `fulfillRandomWords()` function stores two random values, which cost about 20,000 gas each, so a limit of `100000` gas is sufficient. Adjust this value for larger requests depending on how your `fulfillRandomWords()` function processes and stores the received random values. If your `callbackGasLimit` is not sufficient, the callback will fail, and the contract subscription is still charged for the work done to generate your requested random values.

- `uint16 requestConfirmations`: How many confirmations the Chainlink node should wait before responding. The longer the node waits, the more secure the random value is. It must be greater than the `minimumRequestBlockConfirmations` limit on the coordinator contract, which is `1` on Avalanche Fuji Testnet. In this example, we set the value to `1,` but you can set it higher.

- `uint16 numWords`: How many random values to request. If you can use several random values in a single callback, you can reduce the amount of gas you spend per random value. The total cost of the callback request depends on how your `fulfillRandomWords()` function processes and stores the received random values, so adjust your `callbackGasLimit` accordingly. Here we are requesting two random values.

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/beta-launch/avasummit/VRFv2SubscriptionManager.sol).

1. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables you need, but you can edit them if necessary (cf. above).

This contract automatically creates a new subscription when you deploy it. Read the `s_subscriptionId` variable to find the contract subscription ID.

1. Fund your contract with at least two testnet LINK as shown [here](/docs/fund-your-contract/). Call the `getLinkBalance()` function to verify: it should return `2000000000000000000`.

1. In this example, the `topUpSubscription()` function sends LINK from your contract to the subscription. Fund your contract with at least two testnet LINK. If you need testnet LINK, you can get it from one of the available [Avalanche Fuji faucets](/docs/link-token-contracts/#fuji-testnet).
   Run the `topUpSubscription()` function to send LINK from your contract to its subscription balance. For this example, specify a value of `2000000000000000000`, which is equivalent to two LINK.

1. Call the `getSubscriptionDetails()` function to get details of the subscription. You will notice that your contract is part of the consumers list and that its subscription balance is 2 LINK.

1. On the consumer contract, run the `requestRandomWords()` function to request and receive random values. The request might take several minutes to process. You can track if the request is still pending by calling `pendingRequestExists().` When `pendingRequestExists()` returns `false`, that means `fulfillRandomWords()` has been called. `fulfillRandomWords()` receives random values and stores them in the contract.

1. Read `s_randomWords` at index `0`or `1`to fetch the random values.

Notice that even though we didn’t call the following functions in this tutorial, we implemented them to show how you can support other Chainlink VRF consumers:

- `addConsumer()`: Add a Chainlink VRF consumer to the subscription. As discussed above, the contract used in this tutorial is also the subscription owner.
- `removeConsumer()`: Remove a Chainlink VRF consumer from the subscription.

### Clean up

When you are done with your contracts and the subscription, run the `cancelSubscription()` to close the subscription and send the remaining LINK to your wallet address. Specify the address of the receiving wallet. You can also call the `withdraw()` function to withdraw any remaining testnet LINK in the contract. The `getLinkBalance()` returns the LINK balance of the contract.

### Next Steps

Be sure to review your contract with:

- [The Security Considerations](/docs/vrf-security-considerations/).
- [The Best Practices](/docs/chainlink-vrf-best-practices/).

We also encourage you to ask your questions on [Stackoverflow](https://stackoverflow.com/questions/tagged/chainlink) and join our [Discord](https://discord.com/invite/aSK4zew) where you can participate to technical discussions.
