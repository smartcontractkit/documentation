---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Binance Smart Chain Data Feeds"
permalink: "docs/binance-smart-chain-price-feeds/"
hidden: true
metadata: 
  image: 
    0: "/files/OpenGraph_V3.png"
---
# Introduction to Data Feeds

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. They enable smart contracts to retrieve the latest price of an asset in a single call.

Often, smart contracts need to act upon prices of assets in real-time. This is especially true in <a href="https://defi.chain.link/" target="_blank">DeFi</a>. For example, <a href="https://www.synthetix.io/" target="_blank">Synthetix</a> use Data Feeds to determine prices on their derivatives platform. Lending and Borrowing platforms like <a href="https://aave.com/" target="_blank">AAVE</a> use Data Feeds to ensure the total value of the collateral.

___

# Get the Latest Price

This section explains how to get the latest price of BNB inside smart contracts using Chainlink Data Feeds, on the Binance Smart Chain.

## Solidity Contract

To consume price data, your smart contract should reference <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/interfaces/AggregatorInterface.sol" target="_blank">`AggregatorInterface`</a>, which defines the external functions implemented by Data Feeds.

As long as the address provided is a Chainlink aggregator, your smart contract will be able to retrieve the latest price from it.

```javascript Binance
pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract PriceConsumer {

	AggregatorInterface internal priceFeed;
  
	/**
     * Network: Binance Smart Chain
     * Aggregator: BNB/USD
     * Address: 0x859AAa51961284C94d970B47E82b8771942F1980
     */
	constructor() public {
    	priceFeed = AggregatorInterface(0x859AAa51961284C94d970B47E82b8771942F1980);
	}
  
  	/**
   	 * Returns the latest price
   	 */
  	function getLatestPrice() public view returns (int256) {
  		return priceFeed.latestAnswer();
  	}

    /**
     * Returns the timestamp of the latest price update
     */
    function getLatestPriceTimestamp() public view returns (uint256) {
        return priceFeed.latestTimestamp();
    }
}
```

## Javascript Web3

```javascript
const Web3 = require("web3");
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const aggregatorInterfaceABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const addr = "0x859AAa51961284C94d970B47E82b8771942F1980";
const priceFeed = new web3.eth.Contract(aggregatorInterfaceABI, addr);
priceFeed.methods.latestAnswer().call()
    .then((price) => {
        //Do something with price
        console.log(price)
    });
```

## Python Web3

```python
from web3 import Web3
web3 = Web3(Web3.HTTPProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
addr = '0x859AAa51961284C94d970B47E82b8771942F1980'
contract = web3.eth.contract(address=addr, abi=abi)
latestPrice = contract.functions.latestAnswer().call()
print(latestPrice)
```

___

# Get Historical Price Data

The most common use case for Data Feeds is to get the latest price. However, <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/interfaces/AggregatorInterface.sol" target="_blank" rel="noreferrer, noopener">`AggregatorInterface`</a> also exposes functions which can be used to retrieve historical price data.

This section explains how to get historical price data for BNB using Chainlink Data Feeds, on the Binance Smart Chain.

## Solidity Contract

```javascript Binance
pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

contract PriceConsumer {

	AggregatorInterface internal priceFeed;
  
	/**
     * Network: Binance Smart Chain
     * Aggregator: BNB/USD
     * Address: 0x859AAa51961284C94d970B47E82b8771942F1980
     */
	constructor() public {
    	priceFeed = AggregatorInterface(0x859AAa51961284C94d970B47E82b8771942F1980);
	}
  
    /**
     * Returns historical data from previous update rounds
     */
    function getPreviousPrice(uint256 _back) public view returns (int256) {
        uint256 latest = priceFeed.latestRound();
        require(_back <= latest, "Not enough history");
        return priceFeed.getAnswer(latest - _back);
    }

    /**
     * Returns historical data from previous update rounds
     */
    function getPreviousPriceTimestamp(uint256 _back) public view returns (uint256) {
        uint256 latest = priceFeed.latestRound();
        require(_back <= latest, "Not enough history");
        return priceFeed.getTimestamp(latest - _back);
    }
}
```

## Javascript Web3

```javascript
const Web3 = require("web3");
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const aggregatorInterfaceABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const addr = "0x859AAa51961284C94d970B47E82b8771942F1980";
const priceFeed = new web3.eth.Contract(aggregatorInterfaceABI, addr);
priceFeed.methods.latestRound().call()
    .then((roundId) => {
        // Go 5 rounds back in history
        let historicalRoundId = roundId - 5;
        priceFeed.methods.getAnswer(historicalRoundId).call()
            .then((price) => {
                // Do something with price
                console.log("Historical price", price);
            });
    });
```

## Python Web3

```python
from web3 import Web3
web3 = Web3(Web3.HTTPProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
addr = '0x859AAa51961284C94d970B47E82b8771942F1980'
contract = web3.eth.contract(address=addr, abi=abi)
latestRound = contract.functions.latestRound().call()
# Go 5 rounds back
historicalRoundId = latestRound - 5
historicalPrice = contract.functions.getAnswer(historicalRoundId).call()
print("Historical Price", historicalPrice)
```

___

# API Reference

API reference for <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/interfaces/AggregatorInterface.sol" target="_blank" rel="noreferrer, noopener">`AggregatorInterface`</a>.

## Functions

|Name|Description|
|---|---|
|[latestAnswer](#latestanswer)|Get the latest price.|
|[latestTimestamp](#latesttimestamp)|Get the time that the data feed was last updated.|
|[latestRound](#latestround)|Get the round id.|
|[getAnswer](#getanswer)|Get the price from a specific round.|
|[getTimestamp](#gettimestamp)|Get the timestamp of a specific round.|

### latestAnswer

Get the latest price.

```javascript Solidity
function latestAnswer() external view returns (int256)
```

* `RETURN`: The latest price.

### latestTimestamp

Get the time that the data feed was last updated.

```javascript Solidity
function latestTimestamp() external view returns (uint256)
```

* `RETURN`: The timestamp of the latest update.

### latestRound

Get the round id, an unsigned integer representing that latest update that increments with every update.

```javascript Solidity
function latestRound() external view returns (uint256)
```

* `RETURN`: The latest round id.

### getAnswer

Get the price from a specific round.

```javascript Solidity
function getAnswer(uint256 roundId) external view returns (int256)
```

* `roundId`: The round id.
* `RETURN`: The price from that round.

### getTimestamp

Get the timestamp of a specific round.

```javascript Solidity
function getTimestamp(uint256 roundId) external view returns (uint256)
```

* `roundId`: The round id.
* `RETURN`: The timestamp from that round.

## Events

|Name|Description|
|---|---|
|[AnswerUpdated](#answerupdated)|Emitted when the answer is updated.|
|[NewRound](#newround)|Emitted when a new round is started.|

### AnswerUpdated

Emitted when the answer is updated.

```javascript Solidity
event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp)
```

* `current`: The updated price.
* `roundId`: The round id.
* `timestamp`: The time at which the answer was updated.

### NewRound

Emitted when a new round is started.

```javascript Solidity
event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt)
```

* `roundId`: The new round id.
* `startedBy`: The address which starts the new round.
* `startedAt`: The time the new round was started.

___

# Contract Addresses

Chainlink data feed contracts are updated on a regular basis by multiple Chainlink nodes. This section lists the contract addresses for Data Feeds on the Binance Smart Chain.

|Name|Address|
|:---|:---|
|BTC/USD|<a href='https://explorer.binance.org/smart-testnet/address/0xf18c5e1a0E8309f1b6e9884DA0fcEd4139cc76fa/transactions' target='_blank' rel='noreferrer, noopener'>`0xf18c5e1a0E8309f1b6e9884DA0fcEd4139cc76fa`</a>|
|BTC/ETH|<a href='https://explorer.binance.org/smart-testnet/address/0x71199172Af06b51c7594Afb0ea9C2D2D3ef13eb8/transactions' target='_blank' rel='noreferrer, noopener'>`0x71199172Af06b51c7594Afb0ea9C2D2D3ef13eb8`</a>|
|BUSD/ETH|<a href='https://explorer.binance.org/smart-testnet/address/0x5f466C6daFDC6f3ffAd683622Edbfe214D388B18/transactions' target='_blank' rel='noreferrer, noopener'>`0x5f466C6daFDC6f3ffAd683622Edbfe214D388B18`</a>|
|BUSD/USD|<a href='https://explorer.binance.org/smart-testnet/address/0xDEC6bA5a1025117B07596A88CBb2F45dDfEdA250/transactions' target='_blank' rel='noreferrer, noopener'>`0xDEC6bA5a1025117B07596A88CBb2F45dDfEdA250`</a>|
|BTC/BUSD|<a href='https://explorer.binance.org/smart-testnet/address/0x0893AaF58f62279909F9F6FF2E5642f53342e77F/transactions' target='_blank' rel='noreferrer, noopener'>`0x0893AaF58f62279909F9F6FF2E5642f53342e77F`</a>|
|LINK/USD|<a href='https://explorer.binance.org/smart-testnet/address/0x1a1517EB62382140E713DE3a341D468a4D66B6BE/transactions' target='_blank' rel='noreferrer, noopener'>`0x1a1517EB62382140E713DE3a341D468a4D66B6BE`</a>|
|BNB/USD|<a href='https://explorer.binance.org/smart-testnet/address/0x859AAa51961284C94d970B47E82b8771942F1980/transactions' target='_blank' rel='noreferrer, noopener'>`0x859AAa51961284C94d970B47E82b8771942F1980`</a>|
|DAI/BNB|<a href='https://explorer.binance.org/smart-testnet/address/0x9d3425CE0F3766a949e622E535Ce16EDF5098448/transactions' target='_blank' rel='noreferrer, noopener'>`0x9d3425CE0F3766a949e622E535Ce16EDF5098448`</a>|