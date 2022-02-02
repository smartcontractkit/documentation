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

## Generate Random Numbers in your Smart Contracts

Chainlink VRF (Verifiable Random Function) is a provably-fair and verifiable source of randomness designed for smart contracts. Smart contract developers can use Chainlink VRF as a tamper-proof random number generator (RNG) to build reliable smart contracts for any applications which rely on unpredictable outcomes:

- Building blockchain games and NFTs.
- Random assignment of duties and resources. For example, randomly assigning judges to cases.
- Choosing a representative sample for consensus mechanisms.

Learn how to write smart contracts that consume random numbers: [Get a Random Number](/docs/get-a-random-number/).

## Supported networks

Chainlink VRF v2 is currently available on the following networks:

- Ethereum:
  - Mainnet
  - Rinkeby testnet
- Binance Smart Chain
  - Testnet
- Polygon (Matic):
  - Mumbai testnet

See the [Contract Addresses](/docs/vrf-contracts) page for a complete list of coordinator addresses and gas limits.

To learn when VRF v2 becomes available on more networks, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).

## Billing

VRF v2 requests receive funding from subscription accounts. The [Subscription Manager](https://vrf.chain.link) lets you create an account and pre-pay for Chainlink products like VRF v2 so you don't need a funding transaction each time your application requests randomness. Subscriptions have the following core concepts:

- **Subscription accounts:** An account that holds LINK tokens and makes them available to fund requests to a Chainlink product like VRF v2.
- **Subscription owner:** The wallet address that creates and manages a subscription account. You can add additional owners to a subscription account after you create it. Any account can add LINK to subscription account, but only the owners can add approved consumers or withdraw funds.
- **Consumers:** Contracts that are approved to use funding from your subscription account.
- **Subscription balance:** The amount of LINK maintained on your subscription account. Requests from consumer contracts will continue to be funded until the balance runs out, so be sure to maintain sufficient funds in your subscription balance to pay for the requests and keep your applications running.

To learn how to create subscription accounts and approve consuming contracts, see the [Using the Subscription Manager](/docs/subscription-manager/) page.

### Calculating VRF costs

The cost to fulfill a randomness request depends on the blockchain network that you are using. You define the maximum amount of gas you are willing to pay for each transaction by specifying a [keyHash](/docs/get-a-random-number/#selecting-a-keyhash-and-minimum-balances). Each keyhash is associated with a maximum gas price used to fulfill a request. This maximum is important during gas price spikes where the node might need to bump the gas price for timely fulfillment. The maximum specifies an upper bound on the gas bumping and determines what the minimum subscription balance is in order to fulfill a request. You can compute the minimum with the following formula:

<!-- TODO: Explain this more clearly in terms of total cost per transaction including the fee. -->
`(max_gas_price * (callback_gas_limit + verification_gas)) / (eth_link_price) = minimum_balance`

For this calculation, the `verification_gas` value is 200k.

As an example, assume that the ETH to LINK price is 0.01 ETH/LINK and you request a 200k callback gas limit. If you select the appropriate key hash to specify a max gas price of 200 gwei, the minimum link balance required for that request to be fulfilled is `((200e9)(200,000 + 200,000)) = 0.08 ETH`, and `0.08/0.01 = 8 LINK`. This would be the maximum possible payment for that single request.

If the request is fulfilled at a gas price lower than the maximum, which is likely in steady gas conditions, then the amount billed will be much less than 8 LINK. If you make a request when the subscription is underfunded, top up the subscription with LINK and the request will go through automatically as long as the request was made in the last 24 hours.

You can find the full list of available key hashes and their associated max gas prices on the [VRF Contract Addresses](/docs/vrf-contracts) page.

<!-- TODO: Explain costs per request in greater detail. Replace the keyhash section with full billing conceptual overview here. -->

## Common use cases

For help with your specific use case, [contact us]() to connect with one of our Solutions Architects. You can also ask questions about Chainlink VRF on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink). <!-- TODO: Add contact URLs -->

## On-chain Verification of Randomness

Chainlink VRF enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that results cannot be tampered with nor manipulated by any single entity, including oracle operators, miners, users and even smart contract developers.

Read more about Chainlink VRF in [our announcement post](https://blog.chain.link/chainlink-vrf-on-chain-verifiable-randomness/). <!--TODO: Update for the v2 announcement. -->
