---
layout: nodes.liquid
section: legacy
date: Last Modified
title: "Introduction to Chainlink VRF [v1]"
permalink: "docs/chainlink-vrf/v1/"
whatsnext: {"Get a Random Number":"/docs/get-a-random-number/v1/", "API Reference":"/docs/chainlink-vrf-api-reference/v1/", "Contract Addresses":"/docs/vrf-contracts/v1/"}
metadata:
  title: "Generate Random Numbers for Smart Contracts using Chainlink VRF"
  description: "Learn how to securely generate random numbers for your smart contract with Chainlink VRF (an RNG). This guide uses Solidity code examples."
  image:
    0: "/files/OpenGraph_V3.png"
---
![Chainlink Abstract Banner](/files/a4c6c80-85d09b6-19facd8-banner.png)

> 🚧 VRF v2 replaces and enhances VRF v1.
>
> See the [VRF v2 documentation](/docs/chainlink-vrf/) to learn more.

## Generate Random Numbers in your Smart Contracts

Chainlink VRF (Verifiable Random Function) is a provably-fair and verifiable source of randomness designed for smart contracts. Smart contract developers can use Chainlink VRF as a tamper-proof random number generator (RNG) to build reliable smart contracts for any applications which rely on unpredictable outcomes:
*  Blockchain games and NFTs
*  Random assignment of duties and resources (e.g. randomly assigning judges to cases)
*  Choosing a representative sample for consensus mechanisms

Learn how to write smart contracts that consume random numbers: [Get a Random Number](/docs/get-a-random-number/v1/).

## On-chain Verification of Randomness

Chainlink VRF enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that the results cannot be tampered with nor manipulated by anyone, including oracle operators, miners, users and even smart contract developers.

Read more about Chainlink VRF in [our announcement post](https://blog.chain.link/verifiable-random-functions-vrf-random-number-generation-rng-feature/).
