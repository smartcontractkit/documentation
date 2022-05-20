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

## Connect Your Smart Contracts to the Outside World

Chainlink Data Feeds are the quickest way to connect your smart contracts to the real-world data such as asset prices. One use for data feeds is to retrieve the latest pricing data of an asset in a single call and use that data either on-chain in a smart contract or off-chain in another application of your choice.

If you already have a project started and would like to integrate Chainlink, you can [add Chainlink to your existing project](../create-a-chainlinked-project/#install-into-existing-projects) by using the [`chainlink` NPM package](https://www.npmjs.com/package/@chainlink/contracts).

See the [Data Feeds Contract Addresses](/docs/reference-contracts/) page for a list of networks and proxy addresses. You can also use [data.chain.link](https://data.chain.link/) or the [Chainlink Market](https://market.link/) to select nodes for your requests.  

## Retrieve the Latest Asset Prices

Often, smart contracts need to act in real-time on data such as prices of assets. This is especially true in [DeFi](https://defi.chain.link/).

For example, [Synthetix](https://www.synthetix.io/) uses Data Feeds to determine prices on their derivatives platform. Lending and borrowing platforms like [AAVE](https://aave.com/) use Data Feeds to ensure the total value of the collateral.

Data Feeds aggregate many data sources and publish them on-chain using the [Off-chain Reporting Model](/docs/off-chain-reporting/).
