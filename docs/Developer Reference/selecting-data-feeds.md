---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Selecting Quality Data Feeds"
permalink: "docs/selecting-data-feeds/"
excerpt: "Learn how to assess data feeds that you use in your smart contracts."
---

When you design your applications, consider the quality of the data that you use in your smart contracts. Chainlink lists decentralized data feeds in the documentation to help developers build new applications integrated with data.

## Data Feeds Categories
🟢 Data Feeds 

These are our standard data feeds and follow our typical data feeds workflow, Chainlink node operators each query a number of different sources for this market price, and aggregate the estimates provided by those sources. Learn more about our decentralised data model https://chain.link/data-feeds. 

🟡 Custom feeds & Monitored Feeds 

Feeds in the amber category contain non-standard price feeds, custom data feeds, feeds which may be in early development or going through a significant market event. Feeds that have been tagged in this category as (under probation) are being monitored by the team to support the stability of the wider ecosystem.

**Reasons for a price feed being under probation:**

- The token project or asset is in early development.
- The project is going through a market event such as a token or liquidity migration.
- The token or project is being deprecated in the market

**Custom Feeds**

These feeds were built to service a specific use case and may not be suitable for general use. 
We advise users to appropriately evaluate the properties of a feed to make sure it aligns with its users’ intended use case.
Please contact the team if you would like more detail on any of the specific feeds in this category.

**Each custom feed is categorised and we explain their composition below:**

- **Off-chain Single Source Feeds -** Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data.
- **On-chain single source feeds -** Similar to Off-chain Single Source Feeds however in this case the data source resides on-chain.
- **Proof of Reserve Feeds -** Chainlink Proof of Reserve utilizes the largest decentralized collection of security-reviewed and Sybil-resistant node operators in the industry to acquire and verify reserve data. Reserves could reside both on-chain and off-chain.
- **Technical Feeds -** Feeds within this category measure a particular technical metric from a specified blockchain (For example: Fast Gas or Block Difficulty).
- **Total Value Locked Feeds -** these measure the total value locked in a particular protocol.
- **Custom Index Feeds -** an index calculates a function of the values of multiple underlying assets. The function is specific to that index and is typically calculated by our node operators following an agreed formula.
- **LP Token Feeds -** these feeds use a decentralised feed for the underlying asset, along with some custom calculations to value the LP tokens.
- **Wrapped Calculated Feeds -** These feeds are typically pegged 1:1  to the underlying token/asset and under normal market conditions will track its underlying accurately, the price however is a derivative formed from a calculated method and may not always track precisely.

*Note: Users should evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.*

If your smart contracts use data feeds, assess those data feeds for the following characteristics:

- [Liquidity and its Distribution](#liquidity-and-its-distribution)
- [Single Source Data Providers](#single-source-data-providers)
- [Crypto Actions](#crypto-actions)
- [Fast Gas Reliability](#fast-gas-reliability)

## Liquidity and its Distribution

If your smart contract relies on pricing data for a specific asset, make sure that the asset has sufficient liquidity in the market to avoid price manipulation. Assets with low liquidity can be volatile, which might negatively impact your application and its users. Malicious actors might try to exploit volatility to take advantage of the logic in a smart contract and cause it to execute in a way that you did not intend.

Some data feeds obtain their pricing data from individual exchanges rather than from aggregated price tracking services that gather their data from multiple exchanges. Assess the liquidity and reliability of that specific exchange.

Design and test your contracts to handle price spikes and implement risk management measures to protect your assets. For example, create mock tests that return a wide variety of oracle responses.

## Single Source Data Providers

Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data. Evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.

## Crypto Actions

Price data quality is subject to crypto actions by the crypto project teams. Crypto actions are similar to [corporate actions](https://en.wikipedia.org/wiki/Corporate_action), but are specific to cryptocurrency projects. Sustaining data quality is dependent on data sources implementing the necessary adjustments related to token  renaming, token swaps, redenominations, splits, and other migrations that teams who govern the token might undertake.

## Fast Gas Reliability

The [Fast Gas Data Feed](https://data.chain.link/ethereum/mainnet/gas/fast-gas-gwei) provides a simple way to determine the price of gas so you can estimate how much gas you need to make a transaction execute quickly. Fast gas prices can be manipulated, so you should design your applications to detect gas price volatility or malicious activity that might affect the costs of your transactions.


> 📘 The best practices above are provided for informational purposes only. You are responsible for reviewing the quality of the data that you integrate into your smart contracts.
