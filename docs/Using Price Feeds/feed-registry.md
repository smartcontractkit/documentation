---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Feed Registry"
permalink: "docs/feed-registry/"
whatsnext: {"API Reference":"/docs/price-feeds-api-reference/", "Contract Addresses":"/docs/reference-contracts/"}
metadata: 
  title: "How to Use Chainlink Feed Registry"
  description: "The Chainlink Feed Registry is an on-chain mapping of assets to feeds. It allows users and DeFi protocols to query Chainlink price feeds from a given pair of asset and denomination addresses."
  image: 
    0: "/files/OpenGraph_V3.png"
---
![Feed Registry](/files/TODO.png)

The Chainlink Feed Registry is an on-chain mapping of assets to feeds. It enables you to query Chainlink price feeds from a pair of asset and denomination addresses. They enable smart contracts to retrieve the latest price of an asset in a single call.

# Assets and Denominations

TODO

# Code Examples

## Solidity

To consume price data from the feed registry, your smart contract should reference <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.7/interfaces/FeedRegistryInterface.sol" target="_blank">`FeedRegistryInterface`</a>, which defines the external functions implemented by the Feed Registry.

```solidity Mainnet

pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.7/interfaces/FeedRegistryInterface.sol";

contract PriceConsumer {

    FeedRegistryInterface internal registry;

    /**
     * Network: Mainnet
     * Feed Registry: 0xd441F0B98BcF34749391A3879A94caA95ffDB74D
     */
    constructor() public {
        registry = FeedRegistryInterface(0xd441F0B98BcF34749391A3879A94caA95ffDB74D);
    }

    /**
     * Returns the latest price
     */
    function getThePrice(address asset, address, denomination) public view returns (int) {
        return registry.latestAnswer(asset, denomination);
    }
}
```

# API Reference

API reference for <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.7/interfaces/FeedRegistryInterface.sol" target="_blank">`FeedRegistryInterface`</a>.

# Functions

|Name|Description|
|---|---|
|[decimals](#decimals)|The number of decimals in the response.|
|[description](#description)|The description of the aggregator that the proxy points to.|
|[getRoundData](#getrounddata)|Get data from a specific round.|
|[latestRoundData](#latestrounddata)|Get data from the latest round.|
|[version](#version)|The version representing the type of aggregator the proxy points to.|
|[TODO](#)|TODO|
|[TODO](#)|TODO|
|[TODO](#)|TODO|
|[TODO](#)|TODO|
|[TODO](#)|TODO|
|[TODO](#)|TODO|

___

## decimals

Get the number of decimals present in the response value.

```javascript Solidity
function decimals(address asset, address denomination) external view returns (uint8)
```

### Parameters

* `asset`: The asset address
* `denomination`: The denomination address

### Return Values

* `RETURN`: The number of decimals.

## description

Get the description of the underlying aggregator that the proxy points to.

```javascript Solidity
function description(address asset, address denomination) external view returns (string memory)
```

### Parameters

* `asset`: The asset address
* `denomination`: The denomination address

### Return Values

* `RETURN`: The description of the underlying aggregator.

## getRoundData

Get data about a specific round, using the `roundId`.

```javascript Solidity
function getRoundData(address asset, address denomination, uint80 _roundId) external view 
    returns (
        uint80 roundId, 
        int256 answer, 
        uint256 startedAt, 
        uint256 updatedAt, 
        uint80 answeredInRound
    )
```

### Parameters

* `asset`: The asset address
* `denomination`: The denomination address
* `roundId`: The round ID

### Return Values

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer
   * was computed.

## latestRoundData

Get the price from the latest round.

```javascript Solidity
function latestRoundData(address asset, address denomination) external view 
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
* `answeredInRound`: The round ID of the round in which the answer
   * was computed.

## version

The version representing the type of aggregator the proxy points to.

```javascript Solidity
function version(address asset, address denomination) external view returns (uint256)
```

### Parameters

* `asset`: The asset address
* `denomination`: The denomination address

### Return Values

* `RETURN`: The version number.
