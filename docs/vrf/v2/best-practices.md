---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'VRF Best Practices'
permalink: 'docs/vrf/v2/best-practices/'
metadata:
  title: 'Chainlink VRF API Reference'
  description: 'Best pracices for using Chainlink VRF.'
---

> 📘 You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](/docs/vrf/v1/introduction/).

These are example best practices for using Chainlink VRF. To explore more applications of VRF, refer to our [blog](https://blog.chain.link/).

## Getting a random number within a range

If you need to generate a random number within a given range, use [modulo](https://docs.soliditylang.org/en/v0.8.7/types.html#modulo) to define the limits of your range. Below you can see how to get a random number in a range from 1 to 50.

```solidity
function fulfillRandomWords(
  uint256, /* requestId */
  uint256[] memory randomWords
) internal override {
  // Assuming only one random word was requested.
  s_randomRange = (randomWords[0] % 50) + 1;
}
```

## Getting multiple random values

If you want to get multiple random values from a single VRF request, you can request this directly with the `numWords` argument. See the [Get a Random Number](/docs/vrf/v2/examples/get-a-random-number/) guide for an example where one request returns multiple random values.

## Processing simultaneous VRF requests

If you want to have multiple VRF requests processing simultaneously, create a mapping between `requestId` and the response. You might also create a mapping between the `requestId` and the address of the requester to track which address made each request.

```solidity
mapping(uint256 => uint256[]) public s_requestIdToRandomWords;
mapping(uint256 => address) public s_requestIdToAddress;
uint256 public s_requestId;

function requestRandomWords() external onlyOwner returns (uint256) {
  uint256 requestId = COORDINATOR.requestRandomWords(
    keyHash,
    s_subscriptionId,
    requestConfirmations,
    callbackGasLimit,
    numWords
  );
  s_requestIdToAddress[requestId] = msg.sender;

  // Store the latest requestId for this example.
  s_requestId = requestId;

  // Return the requestId to the requester.
  return requestId;
}

function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override {
  // You can return the value to the requester,
  // but this example simply stores it.
  s_requestIdToRandomWords[requestId] = randomWords;
}
```

You could also map the `requestId` to an index to keep track of the order in which a request was made.

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex;
mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
uint256 public requestCounter;

function requestRandomWords() external onlyOwner {
  uint256 requestId = COORDINATOR.requestRandomWords(
    keyHash,
    s_subscriptionId,
    requestConfirmations,
    callbackGasLimit,
    numWords
  );
  s_requestIdToRequestIndex[requestId] = requestCounter;
  requestCounter += 1;
}

function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override {
  uint256 requestNumber = s_requestIdToRequestIndex[requestId];
  s_requestIndexToRandomWords[requestNumber] = randomWords;
}
```

## Processing Different Functions VRF Requests

If you want to have multiple VRF requests in different functions, create a mapping between `requestId` and the `functionId`. This `functionId` could be a uint256 of your choice or the hash of the function name like `keccak256("FunctionName")`. This way, you can have different functions making requests and different logic for each request. When handling different logic in your `fulfillRandomWords` function, keep in mind the your `callbackGasLimit` and appropriate `keyHash` set.

```solidity
uint256 public variableA;
uint256 public variableB;
bytes32 public UPDATE_VARIABLE_A_ID = keccak256("updateVariableA");
bytes32 public UPDATE_VARIABLE_B_ID = keccak256("updateVariableB");
mapping(uint256 => bytes32) public requestIdToFunctionId;

function updateVariableA() public {
  uint256 requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callBackGasLimit,
      numWords
  );
  requestIdToFunctionId[requestId] = UPDATE_VARIABLE_A_ID;
}

function updateVariableB() public {
  uint256 requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callBackGasLimit,
      numWords
  );
  requestIdToFunctionId[requestId] = UPDATE_VARIABLE_B_ID;
}

function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
  {
      if (requestIdToFunctionId[requestId] == UPDATE_VARIABLE_A_ID) {
          variableA = randomWords[0];
      }
      if (requestIdToFunctionId[requestId] == UPDATE_VARIABLE_B_ID) {
          variableB = randomWords[0];
      }
}

```
