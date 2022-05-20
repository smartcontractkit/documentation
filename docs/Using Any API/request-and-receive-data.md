---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Using Any API'
permalink: 'docs/request-and-receive-data/'
whatsnext:
  {
    'Make a GET Request': '/docs/make-a-http-get-request/',
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
  }
metadata:
  title: 'Request and Receive API Data with Chainlink'
  description: 'Chainlink provides your smart contract with access to any external API. Learn how to integration any API into your smart contract.'
  image:
    0: '/files/bc12c34-link.png'
---

![Chainlink Any API](/files/8c35025-Request__Receive_Data.png)

## Overview

Chainlink enables your contracts to access to _any_ external data source through our decentralized oracle network.

Whether your contract requires sports results, the latest weather, or any other publicly available data, the [Chainlink contract library](https://github.com/smartcontractkit/chainlink/tree/master/contracts) provides the tools required for your contract to consume it.

> ⚠️ Note on Price Feed Data
>
> If your smart contracts need access to price feed data, try using [Chainlink Data Feeds](../using-chainlink-reference-contracts/).

## Getting Started

We understand making smart contracts compatible with off-chain data adds to the complexity of building smart contracts. We created a framework with minimal requirements, yet unbounded flexibility, so developers can focus more on the functionality of smart contracts rather than what feeds them.

Chainlink’s decentralized oracle network provides smart contracts with the ability to push and pull data, facilitating the interoperability between on-chain and off-chain applications.

### Requesting Off-chain Data

Outlined below are multiple ways developers can connect smart contracts to off-chain data feeds. Click a request type to learn more about it:

| Request Type                                                         | Description                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [HTTP GET Single Word Response](/docs/single-word-response/)         | This guide explains how to make an HTTP GET request and parse the _json_ response to retrieve the value of one single attribute.                                                                                                                                                          |
| [HTTP GET Multi-Variable Responses](/docs/multi-variable-responses/) | This guide explains how to make an HTTP GET request and parse the _json_ response to retrieve the values of multiple attributes.                                                                                                                                                  |
| [HTTP GET Element in Array Response](/docs/api-array-response/)      | This guide explains how to make an HTTP GET request that returns a _json_ array and parse it to retrieve the target element's value.                                                                                                                                                   |
| [HTTP GET Large Reponses](/docs/large-responses/)                    | This guide explains how to make an HTTP Get request that returns a _json_ containing an arbitrary-length raw byte data and parse it to return the data as _bytes_ data type.                                                                                                           |
| [Existing Job Request](/docs/existing-job-request/)                  | This guide explains how to call a job that leverages [External adapters](/docs/external-adapters/) and returns the relevant data to the smart contract. This allows building succinct smart contracts that do not need to comprehend the URL or the response format of the target API. |

### Building External Adapters

To learn more about building external adapters and adding them to nodes, refer to the [External Adapters](../external-adapters/) documentation.


To understand different use cases for using any API, refer to [Other Tutorials](/docs/other-tutorials/).