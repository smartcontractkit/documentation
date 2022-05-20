---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Data Feeds Architecture"
permalink: "docs/architecture-overview/"
whatsnext: {"Basic Request Model":"/docs/architecture-request-model/", "Decentralized Data Model":"/docs/architecture-decentralized-model/", "Off-Chain Reporting":"/docs/off-chain-reporting/"}
metadata:
  title: "Data Feeds Architecture"
  image:
    0: "/files/OpenGraph_V3.png"
---
![Request Model Banner](/files/8c35025-Request__Receive_Data.png)

## Basic Request Model

Chainlink connects smart contracts with external data using its decentralized oracle network. Chainlink API requests are handled 1:1 by an oracle.

The [Basic Request Model](../architecture-request-model/) describes the on-chain architecture of requesting data from a single oracle source.

To learn how to make a GET request using a single oracle, see [Make a GET Request](../make-a-http-get-request/).

## Decentralized Data Model

For a more robust and trustworthy answer, you can aggregate data from many oracles. With on-chain aggregation, data is aggregated from a decentralized network of independent oracle nodes. This architecture is applied to Chainlink Data Feeds, which can aggregate data such as asset price data.

The [Decentralized Data Model](../architecture-decentralized-model/) describes how data is aggregated, and how consumer contracts can retrieve this data.

## Off-Chain Reporting

Off-Chain Reporting (OCR) is an improvement on the decentralization and scalability of Chainlink networks. With our Off-Chain Reporting aggregators, all nodes communicate using a peer to peer network. During the communication process, a lightweight consensus algorithm runs where each node reports its price observation and signs it. A single aggregate transaction is then transmitted, which saves a significant amount of gas.

To learn more about OCR and how it works, see the [Off-Chain Reporting](/docs/off-chain-reporting/) page.
