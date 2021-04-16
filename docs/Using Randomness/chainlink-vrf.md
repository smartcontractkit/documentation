---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Introduction to Chainlink VRF"
permalink: "docs/chainlink-vrf/"
hidden: false
metadata: 
  title: "Generate Random Numbers for Smart Contracts using Chainlink VRF"
  description: "Learn how to securely generate random numbers for your smart contract with Chainlink VRF (an RNG). This guide uses Solidity code examples."
  image: 
    0: "https://files.readme.io/c5e90d5-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/a4c6c80-85d09b6-19facd8-banner.png",
        "85d09b6-19facd8-banner.png",
        3246,
        731,
        "#f7f8fd"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "If you're interested in early access to Chainlink VRF on mainnet, please email [vrf@chain.link](mailto:vrf@chain.link).",
  "title": "Available now on mainnet"
}
[/block]
# Generate Random Numbers in your Smart Contracts

Chainlink VRF (Verifiable Random Function) is a provably-fair and verifiable source of randomness designed for smart contracts. Smart contract developers can use Chainlink VRF as a tamper-proof RNG to build reliable smart contracts for any applications which rely on unpredictable outcomes:
*  Blockchain games and NFTs
*  Random assignment of duties and resources (e.g. randomly assigning judges to cases)
*  Choosing a representative sample for consensus mechanisms

Learn how to write smart contracts that consume random numbers: [Get a Random Number](../get-a-random-number).

# On-chain Verification of Randomness

Chainlink VRF enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that the results cannot be tampered with nor manipulated by anyone, including oracle operators, miners, users and even smart contract developers.

Read more about Chainlink VRF in <a href="https://blog.chain.link/verifiable-random-functions-vrf-random-number-generation-rng-feature/" target="_blank">our announcement post</a>.