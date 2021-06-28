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

> 🚧 Open Alpha
> 
> Chainlink Feed Registry is in alpha. We're continuing to test the feature with users and improve the experience based on your feedback. Please do not yet use it in production.

![Feed Registry](/files/feed-registry.png)

The Chainlink Feed Registry is an on-chain mapping of assets to feeds. It enables you to query Chainlink price feeds from a pair of asset and denomination addresses directly, without needing to know the feed contract addresses. They enable smart contracts to retrieve the latest price of an asset in a single call.

# Assets and Denominations

The Feed Registry maps feeds using `asset` and `denomination` address  pairs. For example, to get the LINK / USD feed, you supply:

- `asset`: The LINK token address on that network
- `denomination`: A `Denominations.USD` address, which is based on [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).

The Feed Registry fully supports the <a href="https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol" target="_blank">`AggregatorV3Interface`</a> API, for multiple pairs and feeds.

# Code Examples

## Solidity

To consume price data from the Feed Registry, your smart contract should reference <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.7/interfaces/FeedRegistryInterface.sol" target="_blank">`FeedRegistryInterface`</a>, which defines the external functions implemented by the Feed Registry.

```solidity Mainnet

pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.7/interfaces/FeedRegistryInterface.sol";

contract PriceConsumer {

    FeedRegistryInterface internal registry;

    /**
     * Network: Mainnet Alpha Preview
     * Feed Registry: 0xd441F0B98BcF34749391A3879A94caA95ffDB74D
     */
    constructor() public {
        registry = FeedRegistryInterface(0xd441F0B98BcF34749391A3879A94caA95ffDB74D);
    }

    /**
     * Returns the latest price
     */
    function getThePrice(address asset, address, denomination) public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = registry.latestRoundData(asset, denomination);
        return price;
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

# Denominations library

A <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.7/dev/Denominations.sol" target="_blank">`Denominations`</a> Solidity library is available to help you query common asset and fiat denominations:

```javascript Solidity
pragma solidity ^0.7.0;

library Denominations {
  address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
  address public constant BTC = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;

  // Fiat currencies follow https://en.wikipedia.org/wiki/ISO_4217
  address public constant USD = address(840);
  address public constant GBP = address(826);
  address public constant EUR = address(978);
  address public constant JPY = address(392);
  address public constant KRW = address(410);
  address public constant CNY = address(156);
  address public constant AUD = address(36);
  address public constant CAD = address(124);
  address public constant CHF = address(756);
  address public constant ARS = address(32);
}
```
