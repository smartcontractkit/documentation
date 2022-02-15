---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "VRF Best Practices"
permalink: "docs/chainlink-vrf-best-practices/"
metadata:
  title: "Chainlink VRF API Reference"
  description: "Best pracices for using Chainlink VRF."
  image:
    0: "/files/OpenGraph_V3.png"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

Best are the practices for using Chainlink VRF.

## Getting a random number within a range

If you need to generate a random number within a given range, you should use [modulo](https://docs.soliditylang.org/en/v0.8.7/types.html#modulo) to define the limits of your range. Below you can see how to get a random number in a range from 1 to 50.

```solidity
uint256 public randomResult;

function fulfillRandomness(uint256 requestId, uint256[] randomness) internal override {
    // Assuming only one random word was requested.
    randomResult = (randomness[0] % 50) + 1;
}
```

## Getting multiple random values

If you want to get multiple random values from a single VRF request, you can request this directly with the `numWords` argument. See the [Get a Random Number](/docs/get-a-random-number/) guide for an example where one request returns multiple random values.

## Having multiple VRF requests in flight

If you want to have multiple VRF requests in flight, you might want to create a mapping between the `requestId` and the address of the requester.

```solidity
mapping(uint256 => address) public requestIdToAddress;

function getRandomNumber() public {
    uint256 requestId =  COORDINATOR.requestRandomWords(keyHash, subId, 10, 200000, 1);
    requestIdToAddress[requestId] = msg.sender;
}

function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    address requestAddress = requestIdToAddress[requestId];
}
```

If you want to keep order when a request was made, you might want to use a mapping of `requestId` to the index/order of this request.

```solidity
mapping(uint256 => uint256) public requestIdToRequestNumberIndex;
uint256 public requestCounter;

function getRandomNumber() public {
    uint256 requestId =  COORDINATOR.requestRandomWords(keyHash, subId, 10, 200000, 1);
    requestIdToRequestNumberIndex[requestId] = requestCounter;
    requestCounter += 1;
}

function fulfillRandomWords(bytes32 requestId, uint256 randomness) internal override {
    uint256 requestNumber = requestIdToRequestNumberIndex[requestId];
}
```

If you want to keep generated random numbers of several VRF requests, you might want to map `requestId` to the returned random number.

```solidity
mapping(uint256 => uint256) public requestIdToRandomNumber;

function getRandomNumber() public {
    COORDINATOR.requestRandomWords(keyHash, subId, 10, 200000, 1);
}

function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    requestIdToRandomNumber[requestId] = randomness;
}
```

Feel free to use whatever data structure you prefer.
