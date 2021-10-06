---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Get a Random Number"
permalink: "docs/get-a-random-number/"
whatsnext: {"API Reference":"/docs/chainlink-vrf-api-reference/", "Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  description: "How to generate a random number inside a smart contract using Chainlink VRF."
  image:
    0: "/files/OpenGraph_V3.png"
---
This page explains how to get a random number inside a smart contract using Chainlink VRF.

# Random Number Consumer

Chainlink VRF follows the [Request & Receive Data](../request-and-receive-data/) cycle. To consume randomness, your contract should inherit from <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/VRFConsumerBase.sol" target="_blank">`VRFConsumerBase`</a> and define two required functions

1. `requestRandomness`, which makes the initial request for randomness.
2. `fulfillRandomness`, which is the function that receives and does something with verified randomness.

The contract should own enough LINK to pay the specified fee. The beginner walkthrough explains how to [fund your contract](../fund-your-contract/).

Note, the below values have to be configured correctly for VRF requests to work. You can find the respective values for your network in the [VRF Contracts page](../vrf-contracts).
- `LINK Token` - LINK token address on the corresponding network (Ethereum, Polygon, BSC, etc)
- `VRF Coordinator` - address of the Chainlink VRF Coordinator
- `Key Hash` - public key against which randomness is generated
- `Fee` - fee required to fulfill a VRF request

> 🚧 Security Considerations
>
> Be sure to look your contract over with [these security considerations](../vrf-security-considerations/) in mind!

>❗️ Remember to fund your contract with LINK!
>
> Requesting randomness will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/RandomNumberConsumer.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/VRF/RandomNumberConsumer.sol %}
```

> 🚧 Maximum Gas for Callback
>
> If your `fulfillRandomness` function uses more than 200k gas, the transaction will fail.

## Getting More Randomness

If you are looking for how to turn a single result into multiple random numbers, check out our guide on [Randomness Expansion](../chainlink-vrf-best-practices/#getting-multiple-random-numbers).

## Network Congestion and Responsiveness

Network congestion can occur on all blockchains from time to time, which may result in transactions taking longer to get included in a block. During times of network congestion, VRF nodes will continue responding to randomness requests, but fulfillment response times will corresponding increase based on the level of congestion. It is important you account for this in your use case and set expectations accordingly.
