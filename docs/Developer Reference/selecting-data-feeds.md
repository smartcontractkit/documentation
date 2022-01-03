---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Selecting Quality Data Feeds"
permalink: "docs/selecting-data-feeds/"
excerpt: "Learn how to assess data feeds that you use in your smart contracts."
---

When you design your applications, consider the quality of the data that you use in your smart contracts. Chainlink lists decentralized data feeds in the documentation to help developers build new applications integrated with data.

If your smart contracts use data feeds, assess those data feeds for the following characteristics:

- [Liquidity and its Distribution](#liquidity-and-its-distribution)
- [Single Source Data Providers](#single-source-data-providers)
- [Fast Gas Reliability](#fast-gas-reliability)

## Liquidity and its Distribution

If your smart contract relies on pricing data for a specific asset, make sure that the asset has sufficient liquidity in the market to avoid price manipulation. Assets with low liquidity can be volatile, which might negatively impact your application and its users. Malicious actors might try to exploit volatility to take advantage of the logic in a smart contract and cause it to execute in a way that you did not intend.

Some data feeds obtain their pricing data from individual exchanges rather than from aggregated price tracking services that gather their data from multiple exchanges. Assess the liquidity and reliability of that specific exchange.

Design and test your contracts to handle price spikes and implement risk management measures to protect your assets. For example, create mock tests that return a wide variety of oracle responses.

## Single Source Data Providers

Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data. Evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.

## Fast Gas Reliability

The [Fast Gas Data Feed](https://data.chain.link/ethereum/mainnet/gas/fast-gas-gwei) provides a simple way to determine the price of gas so you can estimate how much gas you need to make a transaction execute quickly. Fast gas prices can be manipulated, so you should design your applications to detect gas price volatility or malicious activity that might affect the costs of your transactions.


> 📘 The best practices above are provided for informational purposes only. You are responsible for reviewing the quality of the data that you integrate into your smart contracts.
