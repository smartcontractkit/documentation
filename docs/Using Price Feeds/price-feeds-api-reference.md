---
layout: nodes.liquid
section: "ethereumDataFeeds"
date: Last Modified
title: "Data Feeds API Reference"
permalink: "docs/price-feeds-api-reference/"
metadata:
  description: "API reference for using Chainlink Data Feeds in smart contracts."
---
API reference for <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol" target="_blank">`AggregatorV3Interface`</a>.

# Functions

|Name|Description|
|---|---|
|[decimals](#decimals)|The number of decimals in the response.|
|[description](#description)|The description of the aggregator that the proxy points to.|
|[getRoundData](#getrounddata)|Get data from a specific round.|
|[latestRoundData](#latestrounddata)|Get data from the latest round.|
|[version](#version)|The version representing the type of aggregator the proxy points to.|

___

## decimals

Get the number of decimals present in the response value.

```javascript Solidity
function decimals() external view returns (uint8)
```

* `RETURN`: The number of decimals.

## description

Get the description of the underlying aggregator that the proxy points to.

```javascript Solidity
function description() external view returns (string memory)
```

* `RETURN`: The description of the underlying aggregator.

## getRoundData

Get data about a specific round, using the `roundId`.

```javascript Solidity
function getRoundData(uint80 _roundId) external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
```

### Parameters

* `roundId`: The round ID

### Return Values

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer was computed.

## latestRoundData

Get the price from the latest round.

```javascript Solidity
function latestRoundData() external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
```

### Return Values

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer was computed.

## version

The version representing the type of aggregator the proxy points to.

```javascript Solidity
function version() external view returns (uint256)
```

* `RETURN`: The version number.

___
