---
layout: nodes.liquid
date: Last Modified
title: "Overview"
permalink: "docs/contract-creators-overview/"
hidden: true
metadata: 
  title: "Overview for Smart Contract Developers Integrating Chainlink"
  description: "Developer documentation and user guides for building smart contracts with the goal of connecting them to off-chain data sources."
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2a0ca3e-Create_a_Chainlinked_Project.png",
        "Create a Chainlinked Project.png",
        3246,
        731,
        "#f7f8fd"
      ]
    }
  ]
}
[/block]
Contract creators are developers who build smart contracts with the goal of connecting them to off-chain data sources.

# Getting started
---

You can start creating your contracts now! Start with [Create a Chainlinked Project](../create-a-chainlinked-project) or the [Example Walkthrough](../example-walkthrough).

We strongly recommend you deploy first to testnets before deploying to Ethereum mainnet. Chainlink provides a practical developer environment on Ropsten, Rinkeby and Kovan.

You will also want to consider what kind of data and what data source you want to use.

# Choosing a Data Source
---

There are two categories of data sources available to you:
1. **Reference Data** - Aggregated data from many sources
2. **Request & Receive Data** - Request specific data from API endpoints

## Reference Data

Reference data contracts are updated by a network on independent Chainlink nodes. They aggregate results from many sources and make that data available in a single place.

Visit [Using Reference Data](../using-chainlink-reference-contracts) for more information.

This type of data source is great for immediately using data in your smart contract without waiting to receive a response back to your contract. We have provided a list of reference data: [Reference Data Contracts](../reference-contracts)

## Request & Receive

Request & receive describes the scheme in which your contract requests data from an oracle and the oracle sends the data back to your contract, triggering a custom function which does something with the data.

Visit our [Example Walkthrough](../example-walkthrough) which allows you to fetch the price of ETHUSD and use it in your contract.

This type of data source is great for connecting to any API and bringing its data on-chain. We have provided lists of ready-made data sources available: [Chainlinks (Testnet)](../available-oracles) and [Chainlinks (Ethereum Mainnet)](../chainlinks-ethereum-mainnet)