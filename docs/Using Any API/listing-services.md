---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Find Existing Jobs"
permalink: "docs/listing-services/"
whatsnext: {"API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
hidden: false
---
This page explains how to find an existing Oracle Job to suit the needs of your API call.

# Overview

Oracles enable smart contracts to retrieve data from the outside world. Each oracle node can be configured to perform a wide range of tasks depending on the adapters it supports. For example, if your contract needs to make an HTTP GET request, it needs to use an oracle that supports the HTTP GET adapter.

Oracles jobs can be specialized even further by implementing the configuration using [External Adapters](../developers/). For example, an Oracle job could implement URL, parameters, and conversion to Solidity compatible data, to retrieve a very specific piece of data from a specific API endpoint. Consuming a job like this is demonstrated in [Make an Existing Job Request](../existing-job-request/).

# Choosing an Oracle Job

Here are some independent listing services to help find Oracle Jobs that are pre-configured to call the APIs and endpoints you wish to access in your smart contracts:

* <a href="https://market.link/" target="_blank" rel="noreferrer, noopener">Chainlink Market</a>
* <a href="https://reputation.link/" target="_blank" rel="noreferrer, noopener">Chainlink Oracle Reputation</a>
* <a href="https://chainlinkadapters.com/" target="_blank" rel="noreferrer, noopener">CL Adapters</a>

# Types of Data Available

Your smart contracts can obtain a wide range of data from a vast number of data providers. Here are some examples of data widely consumed through Chainlink oracles today.

Implementation information for these can be found in the listing services above.

## Cryptocurrency Market Data

Get the latest market data from multiple sources, including from the following data providers:

- <a href="https://amberdata.io/" target="_blank">Amberdata</a>
- <a href="https://github.com/binance-exchange/binance-official-api-docs" target="_blank">Binance</a>
- <a href="https://bravenewcoin.com/developers" target="_blank">BraveNewCoin</a>
- <a href="https://www.coingecko.com/en/api" target="_blank">CoinGecko</a>
- <a href="https://coinmarketcap.com/api/" target="_blank">CoinMarketCap</a>
- <a href="https://min-api.cryptocompare.com/" target="_blank">CryptoCompare</a>
- <a href="https://www.kaiko.com/pages/market-data-api" target="_blank">Kaiko</a>

## Flight Data

- <a href="https://opensky-network.org/apidoc/" target="_blank">OpenSky Network</a>

## Shipping Data

- <a href="https://www.easypost.com/docs/api" target="_blank">EasyPost</a>