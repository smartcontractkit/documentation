---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Migration Instructions"
permalink: "docs/migrating-to-flux-aggregator/"
hidden: false
metadata: 
  description: "Migrating to the latest version of Chainlink Price Feeds."
  image: 
    0: "/files/OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
The Chainlink price reference feeds are being upgraded to a new version as of August 2020. This new release includes many new features which help make price feeds more resistant to network congestion and introduce new functions which allow developers to better handle stale data.

** "Will this break my code?" **

No, the new contracts have been deployed with the aim of making the transition seamless for developers. The new <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/AggregatorProxy.sol" target="_blank">`AggregatorProxy`</a> contract implements the legacy <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/interfaces/AggregatorInterface.sol" target="_blank">`AggregatorInterface`</a> that your contracts use currently, so existing consumer contracts will not break and do not require additional code changes.

Additionally, the new contracts implement the <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol" target="_blank">`AggregatorV3Interface`</a>, which defines new functions designed to improve your experience using price feeds.

**At a minimum, you should perform step 1 in the instructions below to update the address that your contracts reference.**

> 🚧 "What If I Don't Migrate?"
>
> Over time, the frequency at which the legacy aggregators are updated will be reduced. This means that if you do not migrate, your contracts will not consume the most up-to-date price data available as new feeds are released.

___

# How to Migrate

1. Move to the new addresses - **REQUIRED**.
2. Update the interface your contracts use to `AggregatorV3Interface`. - Optional
3. Use new aggregator functions. - Optional

 ## 1. Move Feeds to New Addresses

> ❗️ Required
>
> This step is required if you want your contracts to always reference the most up to date aggregator. If you do not upgrade, your consumer contracts may not receive the most accurate price data in future.

Use the latest [Price Feed Contracts](../reference-contracts/) to update the addresses that your contracts reference.

In order to make this migration as seamless a possible, developers are encouraged to use the proxy contracts instead of pointing directly to aggregator addresses. These contracts use the same interface your contracts use today, but can be upgraded to support future releases.


## 2. Update Aggregator Interface

> 🚧	 Optional
>
> Steps 2 and 3 are optional and allow you to take full advantage of the new functions designed to make consuming price data easier.

Update your contract's price feed reference to be of type `AggregatorV3Interface`, instead of `AggregatorInterface`. The new interface introduces new functions while conforming to the previous `AggregatorInterface`.


## 3. Use the New Functions

`AggregatorV3Interface` introduces new functions which make retrieving and manipulating Price Feed data much easier in consumer contracts:  

* `getRoundData`
* `latestRoundData`
* `decimals`
* `description`
* `version`

Instead of having to make two separate calls to `latestAnswer` and `latestTimestamp` to retrieve the latest price and the time it was updated, these are now returned in a single function call in `latestRoundData`. The [Code Examples](#code-examples) show how `latestRoundData` replaces deprecated functions.

Also, the `decimals` function enables consumer contracts to manipulate returned data programmatically, rather than hard-coding calculations.

# Code Examples

Our new `AggregatorV3Interface` removes the need to make multiple calls by returning multiple pieces of data from a specific round. So, after migrating to V3, retrieving the latest price *and* the latest timestamp occurs in a single call. See the **Before** and **After** tabs in the code snippet below.

```javascript Before
// Initialize feed using AggregatorInterface
AggregatorInterface priceFeed = AggregatorInterface(AGGREGATOR_ADDRESS);

// Get price, timestamp and roundID in multiple calls
int price =  priceFeed.latestAnswer();
uint timestamp = priceFeed.latestTimestamp();
uint roundId = priceFeed.latestRount();
```
```javascript After
// Initialize feed using AggregatorV3Interface
AggregatorV3Interface priceFeed = AggregatorV3Interface(PROXY_ADDRESS);

// Get all data from the latest round with one function call
(
    uint80 roundID, 
    int price,
    uint startedAt,
    uint timeStamp,
    uint80 answeredInRound
) = priceFeed.latestRoundData();
```