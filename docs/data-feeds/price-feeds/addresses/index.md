---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Data Feeds Contract Addresses"
permalink: "docs/reference-contracts/"
metadata:
  title: "Data Feeds Contract Addresses"
  description: "A list of links to data feed addresses for Data Feed aggregator contracts on supported networks."
---

Chainlink Data Feed contracts are updated on a regular basis by multiple Chainlink nodes. For implementation details, read [Introduction to Data Feeds](../using-chainlink-reference-contracts/). Chainlink is a blockchain-agnostic technology. This page lists the blockchain networks that Chainlink Data Feeds are currently live on, and the details of where to access them.

> 📘 LINK token on multiple chains
>
> See the [LINK Token Contracts](../link-token-contracts/) page for the details of LINK on each blockchain.

## Available networks

Data feeds are available on the following networks:

- EVM (Ethereum) Chains
  - [Ethereum Data Feeds](../ethereum-addresses/)
  - [BNB Chain Data Feeds](../bnb-chain-addresses/)
  - [Polygon (Matic) Data Feeds](../matic-addresses/)
  - [Gnosis Chain (xDai) Data Feeds](../data-feeds-gnosis-chain/)
  - [HECO Chain Data Feeds](../huobi-eco-chain-price-feeds/)
  - [Avalanche Data Feeds](../avalanche-price-feeds/)
  - [Fantom Data Feeds](../fantom-price-feeds/)
  - [Arbitrum Data Feeds](../arbitrum-price-feeds/)
  - [Harmony Data Feeds](../harmony-price-feeds/)
  - [Optimism Data Feeds](../optimism-price-feeds/)
  - [Moonriver Data Feeds](../data-feeds-moonriver/)
  - [Moonbeam Data Feeds](../data-feeds-moonbeam/)
  - [Metis Data Feeds](../data-feeds-metis/)
- Other chains
  - [Solana Data Feeds](/docs/solana/data-feeds-solana/)

{% include 'data-quality.md' %}

## Data Feed categories

This categorization is put in place to inform users about the intended use cases of feeds and help to highlight some of the inherent market risks surrounding the data quality of these feeds.

All feeds published on [docs.chain.link](http://docs.chain.link) are monitored and maintained to the same levels and standards. Each feed goes through a rigorous assessment process when implemented. The assessment criteria can change depending on the product type of feed being deployed.

Feeds do though evolve over time and we regularly monitor their market fundamentals and will proactively communicate any upcoming changes or issues we identify with a feed, these categories are designed to act as a mechanism in order to assist in accomplishing that task.

Data feeds are grouped into the following categories:

🟢 Verified
🟡 Monitored
🔵 Custom
⚫ Specialized
⭕ Deprecating

For more information on these categories, see the [Selecting Quality Data Feeds](/docs/selecting-data-feeds/#data-feed-categories) page.

## Deprecation of Chainlink Data Feeds

The smart contract ecosystem is constantly evolving. As a result, Data Feeds within the Chainlink ecosystem are continuously evaluated for their usage and economic viability across all the blockchains and layer-2 networks they are deployed on.

Data Feeds without publicly known active users may be scheduled for deprecation. Doing so not only helps preserve blockchains as public goods by optimizing blockspace usage, but it helps reduce unnecessary costs incurred by Chainlink node operators. This process is part of a broader ecosystem shift towards Chainlink Economics 2.0, designed to maximize the adoption of the Chainlink protocol while optimizing for cost-efficiency and long-term economic sustainability. Over time, new Data Feeds may be launched or relocated to alternative blockchains/layer-2s that better reflect current user demand.

For status updates regarding Data Feeds, users should join the official Chainlink Discord and subscribe to the data-feeds-user-notifications channel: [https://discord.gg/Dqy5N9UbsR](https://discord.gg/Dqy5N9UbsR)

Users with additional questions are encouraged to reach out [here](https://chainlinkcommunity.typeform.com/s/dataFeedQs).

A list of data feeds designated for deprecation along with their corresponding shutdown date can be found on the [deprecation list](/docs/deprecating-feeds/).
