---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Introduction to Data Feeds"
permalink: "docs/using-chainlink-reference-contracts/"
whatsnext: {"Get the Latest Price":"/docs/get-the-latest-price/", "API Reference":"/docs/price-feeds-api-reference/", "Contract Addresses":"/docs/reference-contracts/"}
metadata:
  title: "How to Use Chainlink Decentralized Data Feeds in Smart Contracts"
  description: "Add cryptocurrency price data to your smart contract. Chainlink data feeds include BTC/USD, BTC/ETH, ETH/USD and more!"
  image:
    0: "/files/OpenGraph_V3.png"
---
![Chainlink Abstract Banner](/files/2306b8b-Decentralized_Oracles_V3.png)

# Connect Your Smart Contracts to the Outside World

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. For example, one use for data feeds is to enable smart contracts to retrieve the latest pricing data of an asset in a single call.

If you already have a project started and would like to integrate Chainlink, you can [add Chainlink to your existing project](../create-a-chainlinked-project/#install-into-existing-projects) by using the `chainlink` NPM package.

You can use the [Chainlink Market](https://market.link/) to select nodes for your requests. If you have the node's oracle contract address and the Job ID, use the [`sendChainlinkRequestTo`](/docs/chainlink-framework/#sendchainlinkrequestto) function to create requests to oracles.

# Retrieve the Latest Asset Prices

Often, smart contracts need to act upon prices of assets in real-time. This is especially true in [DeFi](https://defi.chain.link/).

For example, [Synthetix](https://www.synthetix.io/) uses Data Feeds to determine prices on their derivatives platform. Lending and Borrowing platforms like [AAVE](https://aave.com/) use Data Feeds to ensure the total value of the collateral.

The [Decentralized Data Model](../architecture-decentralized-model/) describes how Data Feeds are aggregated from many data sources and published on-chain.
