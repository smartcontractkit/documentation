---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Decentralized Data Model'
permalink: 'docs/architecture-decentralized-model/'
whatsnext: { 'Using Data Feeds': '/docs/get-the-latest-price/', 'Off-Chain Reporting': '/docs/off-chain-reporting/' }
metadata:
  title: 'Chainlink Decentralised Data Model'
  description: 'This page describes the decentralized architecture which enables Chainlink to aggregate data from multiple independent node operators.'
  image:
    0: '/files/OpenGraph_V3.png'
---

## Overview

This page describes how data aggregation is applied to produce Chainlink Data Feeds and provides more insight as to how price feeds are updated.

**Topics**

- [Data Aggregation](#data-aggregation)
- [Shared Data Resource](#shared-data-resource)
- [Decentralized Oracle Network](#decentralized-oracle-network)
- [Components of a Decentralized Oracle Network](#components-of-a-decentralized-oracle-network)
  - [Consumer](#consumer)
  - [Proxy](#proxy)
  - [Aggregator](#aggregator)

## Data Aggregation

Each data feed is updated by multiple, independent Chainlink oracle operators. The [AccessControlledOffchainAggregator](https://github.com/smartcontractkit/libocr/blob/master/contract/AccessControlledOffchainAggregator.sol) aggregates the data on-chain.

Off-Chain Reporting (OCR) further enhances the aggregation process. To learn more about OCR and how it works, see the [Off-Chain Reporting](/docs/off-chain-reporting/) page.

![Chainlink Feeds List](/images/contract-devs/price-aggr.png)

## Shared Data Resource

Each data feed is built and funded by the community of users who rely on accurate, up-to-date data in their smart contracts. As more users rely on and contribute to a data feed, the quality of the data feed improves. For this reason, each data feed has its own properties depending on the needs of its community of users.

## Decentralized Oracle Network

Each data feed is updated by a decentralized oracle network. Each oracle operator is rewarded for publishing data. The number of oracles contributing to each feed varies. In order for an update to take place, the data feed aggregator contract must receive responses from a minimum number of oracles or the latest answer will not be updated. You can see the minimum number of oracles for the corresponding feed at [data.chain.link](https://data.chain.link).

Each oracle in the set publishes data during an aggregation round. That data is validated and aggregated by a smart contract, which forms the feed's latest and trusted answer.

## Components of a Decentralized Oracle Network

Data Feeds are an example of a decentralized oracle network, and include the following components:

- [A consumer contract](#consumer)
- [A proxy contract](#proxy)
- [An aggregator contract](#aggregator)

To learn how to create a consumer contract that uses an existing data feed, read the [Using Data Feeds](../get-the-latest-price/) documentation.

### Consumer

A Consumer contract is any contract that uses Chainlink Data Feeds to consume aggregated data. Consumer contracts must reference the correct [`AggregatorV3Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol) contract and call one of the exposed functions.

```solidity
...
AggregatorV3Interface feed = AggregatorV3Interface(address);
return feed.latestRoundData();
```

Off-chain applications can also consume data feeds. See the Javascript and Python example code on the [Using Data Feeds](../get-the-latest-price/) page to learn more.

### Proxy

Proxy contracts are on-chain proxies that point to the aggregator for a particular data feed. Using proxies enables the underlying aggregator to be upgraded without any service interruption to consuming contracts.

Proxy contracts can vary from one data feed to another, but the [`AggregatorProxy.sol` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/dev/AggregatorProxy.sol) on Github is a common example.

### Aggregator

An aggregator is the contract that receives periodic data updates from the oracle network. Aggregators store aggregated data on-chain so that consumers can retrieve it and and act upon it within the same transaction.

You can access this data using the Data Feed address and the [`AggregatorV3Interface` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol).

Aggregators receive updates from the oracle network only when the **Deviation Threshold** or **Heartbeat Threshold** triggers an update during an aggregation round. The first condition that is met triggers an update to the data.

- Deviation Threshold: A new aggregation round starts when a node identifies that the off-chain values deviate by more than the defined deviation threshold from the on-chain value. Individual nodes monitor one or more data providers for each feed.
- Heartbeat Threshold: A new aggregation round starts after a specified amount of time from the last update.
