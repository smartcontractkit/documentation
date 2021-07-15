---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Deprecated API Reference"
permalink: "docs/deprecated-aggregatorinterface-api-reference/"
metadata: 
  image: 
    0: "/files/OpenGraph_V3.png"
---
> 🚧 Deprecated
> 
> This API is deprecated. Please see [API Reference](../price-feeds-api-reference/) for the latest Price Feed API.

API reference for <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/interfaces/AggregatorInterface.sol" target="_blank" rel="noreferrer, noopener">`AggregatorInterface`</a>.

# Index

## Functions

|Name|Description|
|---|---|
|[latestAnswer](#latestanswer)|Get the latest price.|
|[latestTimestamp](#latesttimestamp)|Get the time that the price feed was last updated.|
|[latestRound](#latestround)|Get the round id.|
|[getAnswer](#getanswer)|Get the price from a specific round.|
|[getTimestamp](#gettimestamp)|Get the timestamp of a specific round.|

## Events

|Name|Description|
|---|---|
|[AnswerUpdated](#answerupdated)|Emitted when the answer is updated.|
|[NewRound](#newround)|Emitted when a new round is started.|

___

# Functions

## latestAnswer

Get the latest price.

```javascript Solidity
function latestAnswer() external view returns (int256)
```

* `RETURN`: The latest price.

## latestTimestamp

Get the time that the price feed was last updated.

```javascript Solidity
function latestTimestamp() external view returns (uint256)
```

* `RETURN`: The timestamp of the latest update.

## latestRound

Get the round id, an unsigned integer representing that latest update that increments with every update.

```javascript Solidity
function latestRound() external view returns (uint256)
```

* `RETURN`: The latest round id.

## getAnswer

Get the price from a specific round.

```javascript Solidity
function getAnswer(uint256 roundId) external view returns (int256)
```

* `roundId`: The round id.
* `RETURN`: The price from that round.

## getTimestamp

Get the timestamp of a specific round.

```javascript Solidity
function getTimestamp(uint256 roundId) external view returns (uint256)
```

* `roundId`: The round id.
* `RETURN`: The timestamp from that round.

___

# Events

## AnswerUpdated

Emitted when the answer is updated.

```javascript Solidity
event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp)
```

* `current`: The updated price.
* `roundId`: The round id.
* `timestamp`: The time at which the answer was updated.

## NewRound

Emitted when a new round is started.

```javascript Solidity
event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt)
```

* `roundId`: The new round id.
* `startedBy`: The address which starts the new round.
* `startedAt`: The time the new round was started.