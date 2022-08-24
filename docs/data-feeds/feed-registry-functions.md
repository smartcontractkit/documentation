---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Feed Registry API Reference"
permalink: "docs/feed-registry-functions/"
metadata:
  title: "Feed Registry API Reference"
  description: "Chainlink Feed Registry Functions"
---

This guide outlines the functions which can be used with Chainlink's Feed Registry. You can learn more about the feed registry [here](../feed-registry).

## Functions

|Name|Description|
|---|---|
|[decimals](#decimals)|The number of decimals in the response.|
|[description](#description)|The description of the aggregator that the proxy points to.|
|[getRoundData](#getrounddata)|Get data from a specific round.|
|[latestRoundData](#latestrounddata)|Get data from the latest round.|
|[version](#version)|The version representing the type of aggregator the proxy points to.|
|[getFeed](#getfeed)| Returns the primary aggregator address of a base / quote pair.|
|[getPhaseFeed](#getphasefeed)| Returns the aggregator address of a base / quote pair at a specified phase.|
|[isFeedEnabled](#isfeedenabled)| Returns true if an aggregator is enabled as primary on the registry.|
|[getPhase](#getphase)| Returns the raw starting and ending aggregator round ids of a base / quote pair.|
|[getRoundFeed](#getroundfeed)| Returns the underlying aggregator address of a base / quote pair at a specified round.|
|[getPhaseRange](#getphaserange)| Returns the starting and ending round ids of a base / quote pair at a specified phase.|
|[getPreviousRoundId](#getpreviousroundid)| Returns the previous round id of a base / quote pair given a specified round.|
|[getNextRoundId](#getnextroundid)| Returns the next round id of a base / quote pair given a specified round.|
|[getCurrentPhaseId](#getcurrentphaseid)| Returns the current phase id of a base / quote pair.|
___

### decimals

Get the number of decimals present in the response value.

```solidity
function decimals(address base, address quote) external view returns (uint8)
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.

### Return Values

* `RETURN`: The number of decimals.

## description

Get the description of the underlying aggregator that the proxy points to.

```solidity
function description(address base, address quote) external view returns (string memory)
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.

#### Return Values

* `RETURN`: The description of the underlying aggregator.

### getRoundData

Get data about a specific round, using the `roundId`.

```solidity
function getRoundData(address base, address quote, uint80 _roundId) external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `roundId`: The round ID.

#### Return Values

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer was computed.

### latestRoundData

Get the price from the latest round.

```solidity
function latestRoundData(address base, address quote) external view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
```

#### Return Values

* `roundId`: The round ID.
* `answer`: The price.
* `startedAt`: Timestamp of when the round started.
* `updatedAt`: Timestamp of when the round was updated.
* `answeredInRound`: The round ID of the round in which the answer was computed.

### version

The version representing the type of aggregator the proxy points to.

```solidity
function version(address base, address quote) external view returns (uint256)
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.

#### Return Values

* `RETURN`: The version number.

### getFeed

Returns the primary aggregator address of a base / quote pair. Note that on-chain contracts cannot read from aggregators directly, only through Feed Registry or Proxy contracts.

```solidity
function getFeed(
    address base,
    address quote
  )
    external
    view
    returns (
      AggregatorV2V3Interface aggregator
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.

#### Return Values

* `aggregator`: The primary aggregator address.

### getPhaseFeed

Returns the underlying aggregator address of a base / quote pair at a specified phase. Note that on-chain contracts cannot read from aggregators directly, only through Feed Registry or Proxy contracts.
Phase ids start at `1`. You can get the current Phase by calling `getCurrentPhaseId()`.

```solidity
function getPhaseFeed(
    address base,
    address quote,
    uint16 phaseId
  )
    external
    view
    returns (
      AggregatorV2V3Interface aggregator
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `phaseId`: The phase id.

#### Return Values

* `aggregator`: The primary aggregator address at the specified phase.

### isFeedEnabled

Returns true if an aggregator is enabled as primary on the feed registry. This is useful to check if you should index events from an aggregator contract, because you want to only index events of primary aggregators.

```solidity
function isFeedEnabled(
    address aggregator
  )
    external
    view
    returns (
      bool
    );
```

#### Parameters

* `aggregator`: The aggregator address

#### Return Values

* `RETURN`: `true` if the supplied aggregator is a primary aggregator for any base / quote pair.

### getPhase

Returns the starting and ending aggregator round ids of a base / quote pair.

```solidity
function getPhase(
    address base,
    address quote,
    uint16 phaseId
  )
    external
    view
    returns (
      Phase memory phase
    );
```

Phases hold the following information:

```solidity
struct Phase {
    uint16 phaseId;
    uint80 startingAggregatorRoundId;
    uint80 endingAggregatorRoundId;
}
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `phaseId`: The phase id.

#### Return Values

* `RETURN`: `Phase` details of a base / quote pair.

### getRoundFeed

Returns the underlying aggregator address of a base / quote pair at a specified round. Note that on-chain contracts cannot read from aggregators directly, only through Feed Registry or Proxy contracts.

```solidity
  function getRoundFeed(
    address base,
    address quote,
    uint80 roundId
  )
    external
    view
    returns (
      AggregatorV2V3Interface aggregator
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `roundId`: The round id.

#### Return Values

* `aggregator`: The underlying aggregator address of a base / quote pair at the specified round.

### getPhaseRange

Returns the starting and ending round ids of a base / quote pair at a specified phase.

Please note that this `roundId` is calculated from the phase id and the underlying aggregator's round id. To get the raw aggregator round ids of a phase for indexing purposes, please use `getPhase()`.

```solidity
  function getPhaseRange(
    address base,
    address quote,
    uint16 phaseId
  )
    external
    view
    returns (
      uint80 startingRoundId,
      uint80 endingRoundId
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `phaseId`: The phase id.

#### Return Values

* `startingRoundId`: The starting round id
* `endingRoundId`: The ending round id

### getPreviousRoundId

Returns the previous round id of a base / quote pair given a specified round. Note that rounds are non-monotonic across phases.

```solidity
  function getPreviousRoundId(
    address base,
    address quote,
    uint80 roundId
  ) external
    view
    returns (
      uint80 previousRoundId
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `roundId`: The round id.

#### Return Values

* `previousRoundId`: The previous round id of a base / quote pair.

### getNextRoundId

Returns the next round id of a base / quote pair given a specified round. Note that rounds are non-monotonic across phases.

```solidity
  function getNextRoundId(
    address base,
    address quote,
    uint80 roundId
  ) external
    view
    returns (
      uint80 nextRoundId
    );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.
* `roundId`: The round id.

#### Return Values

* `nextRoundId`: The next round id of a base / quote pair.

### getCurrentPhaseId

Returns the current phase id of a base / quote pair.

```solidity
function getCurrentPhaseId(
  address base,
  address quote
)
  external
  view
  returns (
    uint16 currentPhaseId
  );
```

#### Parameters

* `base`: The base asset address.
* `quote`: The quote asset address.

#### Return Values

* `phaseId`: The current phase id of a base / quote pair.
