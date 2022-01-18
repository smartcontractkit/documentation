---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Introduction to Chainlink VRF"
permalink: "docs/chainlink-vrf/"
whatsnext: {"Get a Random Number":"/docs/get-a-random-number/", "Contract Addresses":"/docs/vrf-deployments/"}
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
*  Building blockchain games and NFTs.
*  Random assignment of duties and resources. For example, randomly assigning judges to cases.
*  Choosing a representative sample for consensus mechanisms.

Learn how to write smart contracts that consume random numbers: [Get a Random Number](/docs/get-a-random-number/).

## Supported networks

Chainlink VRF v2 is currently available on the following networks:

- Ethereum Mainnet
- Rinkeby Testnet
- Polygon (Matic)
- Polygon Mumbai Testnet
- Binance Smart Chain
- Binance Smart Chain Testnet

See the [Deployments](/docs/vrf-deployments) page for a complete list of coordinator addresses and gas limits.

## Billing

VRF v2 uses a subscription system that allows you to pre-fund multiple requests with a single transaction and reduce the gas fees paid for each request.

<!-- TODO: Explain costs per request in greater detail -->

## On-chain Verification of Randomness

Chainlink VRF enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that results cannot be tampered with nor manipulated by any single entity, including oracle operators, miners, users and even smart contract developers.

Read more about Chainlink VRF in [our announcement post](https://blog.chain.link/chainlink-vrf-on-chain-verifiable-randomness/). <!--TODO: Update for the v2 announcement. -->
