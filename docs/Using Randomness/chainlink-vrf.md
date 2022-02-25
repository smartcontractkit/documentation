---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Introduction to Chainlink VRF"
permalink: "docs/chainlink-vrf/"
whatsnext: {"Get a Random Number":"/docs/get-a-random-number/", "Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  title: "Generate Random Numbers for Smart Contracts using Chainlink VRF"
  description: "Learn how to securely generate random numbers for your smart contract with Chainlink VRF (an RNG). This guide uses Solidity code examples."
  image:
    0: "/files/OpenGraph_V3.png"
---
![Chainlink](/files/a4c6c80-85d09b6-19facd8-banner.png)

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

Chainlink VRF (Verifiable Random Function) is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability.

**Table of contents**

- [Overview](#overview)
- [Supported networks](#supported-networks)
- [Subscriptions](#subscriptions)
- [Subscription billing](#subscription-billing)
- [Limits](#limits)

## Overview

For each request, Chainlink VRF generates one or more random values and cryptographic proof of how those values were determined. The proof is published and verified on-chain before any consuming applications can use it. This process ensures that results cannot be tampered with or manipulated by any single entity including oracle operators, miners, users, or smart contract developers.

Use Chainlink VRF to build reliable smart contracts for any applications that rely on unpredictable outcomes:

- Building blockchain games and NFTs.
- Random assignment of duties and resources. For example, randomly assigning judges to cases.
- Choosing a representative sample for consensus mechanisms.

For help with your specific use case, [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-footer) to connect with one of our Solutions Architects. You can also ask questions about Chainlink VRF on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink).

## Supported networks

Chainlink VRF v2 is currently available on the following networks:

- Ethereum:
  - [Mainnet](/docs/vrf-contracts/#ethereum-mainnet)
  - [Rinkeby testnet](/docs/vrf-contracts/#rinkeby-testnet)
- Binance Smart Chain
  - [Mainnet](/docs/vrf-contracts/#binance-smart-chain)
  - [Testnet](/docs/vrf-contracts/#binance-smart-chain-testnet)

See the [Contract Addresses](/docs/vrf-contracts) page for a complete list of coordinator addresses and gas price limits.

To learn when VRF v2 becomes available on more networks, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).

## Subscriptions

VRF v2 requests receive funding from subscription accounts. The [Subscription Manager](https://vrf.chain.link) lets you create an account and pre-pay for VRF v2, so you don't provide funding each time your application requests randomness. This reduces the total gas cost to use VRF v2. It also provides a simple way to fund your use of Chainlink products from a single location, so you don't have to manage multiple wallets across several different systems and applications.

Subscriptions have the following core concepts:

- **Subscription accounts:** An account that holds LINK tokens and makes them available to fund requests to Chainlink VRF v2 coordinators.
- **Subscription owner:** The wallet address that creates and manages a subscription account. Any account can add LINK to the subscription balance, but only the owner can add approved consumers or withdraw funds.
- **Consumers:** Contracts that are approved to use funding from your subscription account.
- **Subscription balance:** The amount of LINK maintained on your subscription account. Requests from consumer contracts will continue to be funded until the balance runs out, so be sure to maintain sufficient funds in your subscription balance to pay for the requests and keep your applications running.

## Subscription billing

For Chainlink VRF v2 to fulfill your requests, you must maintain a sufficient amount of LINK in your subscription balance. Gas cost calculation includes the following variables:

- **Gas price:** The current gas price, which fluctuates depending on network conditions

- **Callback gas:** The amount of gas used for the callback request that returns your requested random values

- **Verification gas:** The amount of gas used to verify randomness on-chain

These variables depend on current network conditions, your specified limit on callback gas, and the number of random values in your request. The cost of each request is final only after the transaction is complete, but you define the limits you are willing to spend for the request with the following variables:

- **Gas lane:** The maximum gas price you are willing to pay for a request in wei. Define this limit by specifying the appropriate `keyHash` in your request. The limits of each gas lane are important for handling gas price spikes when Chainlink VRF bumps the gas price to fulfill your request quickly.

- **Callback gas limit:** Specifies the maximum amount of gas you are willing to spend on the callback request. Define this limit by specifying the `callbackGasLimit` value in your request.

Requests to Chainlink VRF v2 follow the [Request & Receive Data](/docs/request-and-receive-data/) cycle. The VRF coordinator processes the request and determines the final charge to your subscription using the following steps:

1. You submit your request with a specified gas lane `keyHash` and the `callbackGasLimit`. If your request is urgent, specify a gas lane with a higher gas price limit. The `callbackGasLimit` depends on the size of your request. Generally, a limit of 100,000 gas is appropriate. Verification gas has a hard upper limit of 200,000 gas.

1. The coordinator starts the transaction and bumps the gas price until the transaction is complete. The coordinator will not exceed the gas price limit of your selected gas lane. If your request cannot be completed at your specified gas limit, resubmit the request with a different gas lane or wait until gas prices fall below your current gas lane limits.

1. The responding Chainlink oracle verifies your random values on-chain and completes the callback to your contract with the random values.

1. After the request is complete, the final gas cost is recorded based on how much gas is required for the verification and callback. The total gas cost in wei for your request uses the following formula:

    ```
    (Gas price * (Verification gas + Callback gas)) = total gas cost
    ```

1. The total gas cost is converted to LINK using the ETH/LINK data feed. In the unlikely event that the data feed is unavailable, the VRF coordinator uses the `fallbackWeiPerUnitLink` value for the conversion instead. The `fallbackWeiPerUnitLink` value is defined in the [coordinator contract](/docs/vrf-contracts/#configurations) for your selected network.

1. The LINK premium is added to the total gas cost. The premium is defined in the [coordinator contract](/docs/vrf-contracts/#configurations) with the `fulfillmentFlatFeeLinkPPMTier1` parameter in millionths of LINK.

    ```
    (total gas cost + LINK premium) = total request cost
    ```

1. The total request cost is charged to your subscription balance.

## Limits

Chainlink VRF v2 has some [subscription limits](#subscription-limits) and [coordinator contract limits](#coordinator-contract-limits).

### Subscription limits

Each subscription has the following limits:

- Each subscription must maintain a minimum balance to fund requests from consumer contracts. If your balance is below that minimum, your requests remain pending for up to 24 hours before they expire. After you add sufficient LINK to a subscription, pending requests automatically process as long as they have not expired.
- The minimum subscription balance must be sufficient for each new consumer contract that you add to a subscription. The required size of the minimum balance depends on the gas lane and the size of the request that the consumer contract makes. For example, a consumer contract that requests one random value will require a smaller minimum balance than a consumer contract that requests 50 random values. In general, you can estimate the required minimum LINK balance using the following formula where max verification gas is always 200,000.

    ```
    ((Gas lane maximum * (Max verification gas + Callback gas limit)) / (ETH to LINK price)) + LINK premium = Minimum LINK
    ```

- Each subscription supports up to 100 consumer contracts. If you need more than 100 consumers, create multiple subscriptions.

### Coordinator contract limits

You can see the configuration for each network on the [Contract Addresses](/docs/vrf-contracts/) page. You can also view the full configuration for each coordinator contract directly in Etherscan. As an example, view the [Ethereum Mainnet VRF v2 coordinator contract](https://etherscan.io/token/0x271682DEB8C4E0901D1a1550aD2e64D568E69909#readContract) configuration.

- Each coordinator has a `MAX_NUM_WORDS` parameter that limits the maximum number of random values you can receive in each request.
- Each coordinator has a `maxGasLimit` parameter, which is the maximum allowed `callbackGasLimit` value for your requests.
- You must specify a sufficient `callbackGasLimit` to fund the callback request to your consumer contract. This depends on the number of random values you request and how you process them in your `fulfillRandomWords()` function. If your `callbackGasLimit` is not sufficient, the callback fails but your subscription is still charged for the work done to generate your requested random values.
