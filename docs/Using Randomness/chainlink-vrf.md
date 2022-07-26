---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink VRF'
permalink: 'docs/vrf/v2/introduction/'
whatsnext: { 'Method 1 : Subscription': '/docs/vrf/v2/subscription/', 'Method 2 : Ad-hoc': '/docs/vrf/v2/ad-hoc/' }
metadata:
  title: 'Generate Random Numbers for Smart Contracts using Chainlink VRF'
  description: 'Learn how to securely generate random numbers for your smart contract with Chainlink VRF (an RNG). This guide uses Solidity code examples.'
---

![Chainlink](/files/a4c6c80-85d09b6-19facd8-banner.png)

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](/docs/vrf/v1/introduction/).

Chainlink VRF (Verifiable Random Function) is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability.

**Table of contents**

- [Overview](#overview)
- [Two methods to request randomness](#two-methods-to-request-randomness)
- [Choosing the correct method](#choosing-the-correct-method)
- [Supported networks](#supported-networks)

## Overview

For each request, Chainlink VRF generates one or more random values and cryptographic proof of how those values were determined. The proof is published and verified on-chain before any consuming applications can use it. This process ensures that results cannot be tampered with or manipulated by any single entity including oracle operators, miners, users, or smart contract developers.

Use Chainlink VRF to build reliable smart contracts for any applications that rely on unpredictable outcomes:

- Building blockchain games and NFTs.
- Random assignment of duties and resources. For example, randomly assigning judges to cases.
- Choosing a representative sample for consensus mechanisms.

To learn more about the benefits of Chainlink VRF v2, see our blog post [Chainlink VRF v2 Is Now Live on Mainnet](https://blog.chain.link/vrf-v2-mainnet-launch/). For help with your specific use case, [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-footer) to connect with one of our Solutions Architects. You can also ask questions about Chainlink VRF on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink).

## Two methods to request randomness

Chainlink VRF v2 offers two methods for requesting randomness:

- [Subscription](/docs/vrf/v2/subscription/): Create a subscription account and fund its balance with LINK tokens. Users can then connect multiple consuming contracts to the subscription account. When the consuming contracts request randomness, the transaction costs are calculated after the randomness requests are fulfilled and the subscription balance is deducted accordingly. This method allows you to fund requests for multiple consumer contracts from a single subscription.
- [Ad-hoc](/docs/vrf/v2/ad-hoc/): Consuming contracts directly pay with LINK when they request random values. You must directly fund your consumer contracts and ensure that there are enough LINK tokens to pay for randomness requests.

## Choosing the correct method

Depending on your use case, one method might be more suitable than another. The recommendations are the following:

- If your use case requires regular requests for randomness, choose the subscription method to simplify funding and reduce the overall cost. Otherwise , choose the ad-hoc method. The ad-hoc method is more suitable for infrequent one-off requests.
- If you have several VRF consuming contracts, choose the subscription method.
- To reduce gas overhead and have more control over the maximum gas price for requests, choose the subscription method. You can read the [Subscription](/docs/vrf/v2/subscription/) and [Ad-hoc](/docs/vrf/v2/ad-hoc/) explanation pages to understand how the transaction costs are calculated.
- Because the ad-hoc method has higher overhead, it cannot return as many random words in a single request as the subscription method. You can compare the maximum number of words per request and per method on the [Subscription configuration](/docs/vrf/v2/subscription/configuration/#configurations) and [Ad-hoc configuration](/docs/vrf/v2/ad-hoc/configuration/#configurations) pages.

## Supported networks

The contract addresses and gas price limits are different depending on which method you use to get randomness. You can find the configuration, addresses, and limits for each method on the following pages:

- [Subscription Configuration](/docs/vrf/v2/subscription/configuration/)
- [Ad-hoc Configuration](/docs/vrf/v2/ad-hoc/configuration/)

Chainlink VRF v2 is currently available on the following networks:

- Ethereum:
  - Mainnet
  - Rinkeby testnet
- BNB Chain:
  - Mainnet
  - Testnet
- Polygon (Matic):
  - Mainnet
  - Mumbai Testnet
- Avalanche:
  - Avalanche Mainnet
  - Avalanche Fuji Testnet
- Fantom:
  - Fantom Mainnet
  - Fantom Testnet

To learn when VRF v2 becomes available on more networks, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).
