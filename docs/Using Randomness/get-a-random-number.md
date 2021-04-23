---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Get a Random Number"
permalink: "docs/get-a-random-number/"
hidden: false
metadata: 
  description: "How to generate a random number inside a smart contract using Chainlink VRF."
  image: 
    0: "https://files.readme.io/b7f753e-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
This page explains how to get a random number inside a smart contract using Chainlink VRF.

# Random Number Consumer

Chainlink VRF follows the [Request & Receive Data](../request-and-receive-data) cycle. To consume randomness, your contract should inherit from <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/VRFConsumerBase.sol" target="_blank">`VRFConsumerBase`</a> and define two required functions

1. `requestRandomness`, which makes the initial request for randomness.
2. `fulfillRandomness`, which is the function that receives and does something with verified randomness.

The contract should own enough LINK to pay the specified fee. The beginner walkthrough explains how to [fund your contract](../fund-your-contract).

> 🚧 Security Considerations
>
> If your contract could have multiple VRF requests in flight simultaneously, you must ensure that the order in which the VRF responses arrive cannot be used to manipulate your contract's user-significant behavior.

>❗️ Remember to fund your contract with LINK!
>
> Requesting randomness will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link) and [Fund your contract](../fund-your-contract)**.

<div class="row cl-button-container">
  <div class="col-xs-12 col-md-12">
    <a href="https://remix.ethereum.org/#version=soljson-v0.6.6+commit.6c089d02.js&optimize=false&evmVersion=null&gist=536123b71478ad4442cfc4278e8de577" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
  </div>
  <div class="col-xs-12 col-md-12">
    <a href="../deploy-your-first-contract" title="">What is Remix?</a>
  </div>
</div>

```javascript Kovan

pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract RandomNumberConsumer is VRFConsumerBase {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    
    uint256 public randomResult;
    
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ) public
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    /** 
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}
```

> 🚧 Maximum Gas for Callback
>
> If your `fulfillRandomness` function uses more than 200k gas, the transaction will fail.

## Making the most out of VRF

It's possible to get multiple numbers from a single VRF response: 

```javascript
function expand(uint256 randomValue, uint256 n) public pure returns (uint256[] memory expandedValues) {
    expandedValues = new uint256[](n);
    for (uint256 i = 0; i < n; i++) {
        expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
    }
    return expandedValues;
}

```