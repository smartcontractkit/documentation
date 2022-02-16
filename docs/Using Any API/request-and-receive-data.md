---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Introduction to Using Any API"
permalink: "docs/request-and-receive-data/"
whatsnext: {"Make a GET Request":"/docs/make-a-http-get-request/","Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
metadata:
  title: "Request and Receive API Data with Chainlink"
  description: "Chainlink provides your smart contract with access to any external API. Learn how to integration any API into your smart contract."
  image:
    0: "/files/bc12c34-link.png"
---
![Chainlink Any API](/files/8c35025-Request__Receive_Data.png)

## Overview

Chainlink enables your contracts to access to *any* external data source through our decentralized oracle network.

Whether your contract requires sports results, the latest weather, or any other publicly available data, the [Chainlink contract library](https://github.com/smartcontractkit/chainlink/tree/master/contracts) provides the tools required for your contract to consume it.

> ⚠️ Note on Price Feed Data
>
> If your smart contracts need access to price feed data, try using [Chainlink Data Feeds](../using-chainlink-reference-contracts/).

## Getting Started

We understand making smart contracts compatible with off-chain data adds to the complexity of building smart contracts. We created a framework with minimal requirements, yet unbounded flexibility, so developers can focus more on the functionality of smart contracts rather than what feeds them.

Chainlink’s decentralized oracle network provides smart contracts with the ability to push and pull data, facilitating the interoperability between on-chain and off-chain applications.

### Requesting Off-chain Data

Outlined below are multiple ways developers can connect smart contracts to off-chain data feeds. Click a request type to learn more about it:

| Request Type                  | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [HTTP GET Request](../make-a-http-get-request/)                | This is a request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../advanced-tutorial/) cycle. This type of request can receive [multi-variable](../multi-variable-responses/) or [large](../large-responses/) responses. |
| [Existing Job Request ](../existing-job-request/)                | This is a request which uses an *existing* Oracle Job to retrieve off-chain data.|

### Building External Adapters

To learn more about building external adapters and adding them to nodes, refer to the [External Adapters](../external-adapters/) documentation.
