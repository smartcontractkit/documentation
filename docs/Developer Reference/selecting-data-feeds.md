---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Selecting Quality Data Feeds"
permalink: "docs/selecting-data-feeds/"
excerpt: "Learn how to assess data feeds that you use in your smart contracts."
---

When you design your applications, consider the quality of the data that you use in your smart contracts. Chainlink lists decentralized data feeds in the documentation to help developers build new applications integrated with data.

## Table of Contents

+ [Data Feed Categories](#data-feed-categories)
+ [Chainlink Community Deployments](#chainlink-community-deployments)
+ [Evaluating data sources](#evaluating-data-sources)

## Data Feed Categories

Data feeds are grouped into the following categories:

+ [Verified Feeds](#🟢-verified-feeds)
+ [Monitored and Custom Feeds](#🟡-monitored-and-custom-feeds)
+ [Specialized Feeds](#-specialized-feeds)

### 🟢 Verified Feeds

These are our standard data feeds that follow our typical data feeds workflow. Chainlink node operators each query several sources for the market price and aggregate the estimates provided by those sources. Verified feeds have the following characteristics:

- Highly resilient to disruption
- Many data sources
- Extensive network of nodes
- Highly liquid and well represented on a large number of markets

Learn more about our decentralized data model at [https://chain.link/data-feeds](https://chain.link/data-feeds).

### 🟡 Monitored and Custom Feeds

#### Monitored Feeds

Feeds in this category contain non-standard price feeds, custom data feeds, feeds that might be in early development, and feeds for assets going through a significant market event.

Feeds tagged as *under review* are being monitored by the team to support the stability of the broader ecosystem. Data feeds might be under review for the following reasons:

- The token project or asset is in early development
- The project is going through a market event such as a token or liquidity migration
- The token or project is being deprecated in the market

#### Custom Feeds

Custom Feeds are built to service a specific use case and might not be suitable for general use. Users must evaluate the properties of a feed to make sure it aligns with their user's intended use case. Contact the team if you want more detail on any specific feeds in this category.

Custom feeds have the following categories and compositions:

- **On-chain single source feeds:** These feeds are similar to Off-chain Single Source Feeds. However, in this case the data source resides on-chain.
- **On-chain Proof of Reserve Feeds:** Chainlink Proof of Reserve uses the largest decentralized collection of security-reviewed and Sybil-resistant node operators in the industry to acquire and verify reserve data, reserves in this use case reside on-chain.
- **Technical Feeds:** Feeds within this category measure a particular technical metric from a specified blockchain. For example, Fast Gas or Block Difficulty.
- **Total Value Locked Feeds:** These feeds measure the total value locked in a particular protocol.
- **Custom Index Feeds:** An index calculates a function of the values for multiple underlying assets. The function is specific to that index and is typically calculated by our node operators following an agreed formula.

If you plan on using one of these feeds and would like to get a more detailed understanding, please contact the Chainlink Labs team.

### 🔴 Specialized Feeds

These are highly complex and bespoke feeds that inherently contain more significant risk factors associated with them. Typical users of these feeds are our large institutional users with deep expertise in the market space they operate in.

While these are monitored and well supported, they might not meet the same levels of resiliency as the above categories. We strongly advise you to speak with the team to understand their use case, properties, and associated risks.

**Examples of Specialized feeds:**

- **Off-chain Single Source Feeds:** Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data.
- **Off-chain Proof of Reserve Feeds:** Chainlink Proof of Reserve uses the largest decentralized collection of security-reviewed and Sybil-resistant node operators in the industry to acquire and verify reserve data, reserves in this use case reside on-chain.
- **LP Token Feeds:** These feeds use a decentralized feed for the underlying asset as well as some custom calculations to value the LP tokens.
- **Wrapped Calculated Feeds:** These feeds are typically pegged 1:1 to the underlying token or asset. Under normal market conditions, these feeds track its underlying value accurately. However, the price is a derivative formed from a calculated method and might not always track value precisely.

> 📘 Note:
>
> Users should evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.
```suggestion
At Chainlink Labs we plan for all eventualities, however small they might be. To help our users prepare for such events, we recommend adding additional tooling for custom or specialized feeds to protect their application/protocol. This tooling is put in place to mitigate against some of the following risks: extreme market events, possible malicious activity occurring on a 3rd party venues/contracts, potential delays, or outages.
Below are some of the examples of tooling some of our users have put in place:
- Circuit Breakers - In the case of an extreme price event, the contract would pause operations for a limited period of time.
- Contract update delays - contracts would not update until the protocol had received a recent fresh input from the data feed.
- Manual Kill Switch - Example: If a vulnerability/bug was discovered in one of the upstream contracts, The user would manually be able to cease operation and temporarily sever the connection to the Price feed.
- Additionally, monitoring - some users create their own monitoring alerts based on deviations in the price feeds they’re using.

## Chainlink Community Deployments

Deployments built and run by community members are not tracked in our documentation. Chainlink's community is continuously growing, and we believe they play a vital role in developing the blockchain ecosystem. Chainlink Labs fully supports the use and growth of open-source software and the philosophies underpinning the DeFi and Web3 communities.

Chainlink's technology is used by many in the community to provide data on-chain; we continue to develop support and tooling for anyone to use. Users have a wide variety of options for choosing how to deliver data on-chain. They can deploy Chainlink nodes themselves or via our extensive network of node operators that offer services and access one of our community-managed oracle networks that supports the supply of various types of data on-chain.

We would always recommend conducting a thorough analysis of your requirements and carrying out appropriate due diligence on any partners you wish to use with your project.

> **Chainlink Labs does not monitor community deployments** in our infrastructure and encourages users to use best practices in observability, monitoring and risk mitigation as appropriate for your application's stage of development and use case.

As a deployment evolves and develops, requirements for higher availability and greater security may increase due to the value secured by the oracle network. In these cases, Chainlink Labs can provide support and services to ensure deployments meet the highest levels of availability and security.

## Evaluating data sources

If your smart contracts use data feeds, assess those data feeds for the following characteristics:

- [Liquidity and its Distribution](#liquidity-and-its-distribution)
- [Single Source Data Providers](#single-source-data-providers)
- [Crypto Actions](#crypto-actions)
- [Fast Gas Reliability](#fast-gas-reliability)

### Liquidity and its Distribution

If your smart contract relies on pricing data for a specific asset, make sure that the asset has sufficient liquidity in the market to avoid price manipulation. Assets with low liquidity can be volatile, which might negatively impact your application and its users. Malicious actors might try to exploit volatility to take advantage of the logic in a smart contract and cause it to execute in a way that you did not intend.

Some data feeds obtain their pricing data from individual exchanges rather than from aggregated price tracking services that gather their data from multiple exchanges. Assess the liquidity and reliability of that specific exchange.

Design and test your contracts to handle price spikes and implement risk management measures to protect your assets. For example, create mock tests that return a wide variety of oracle responses.

### Single Source Data Providers

Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data. Evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.

### Crypto Actions

Price data quality is subject to crypto actions by the crypto project teams. Crypto actions are similar to [corporate actions](https://en.wikipedia.org/wiki/Corporate_action), but are specific to cryptocurrency projects. Sustaining data quality is dependent on data sources implementing the necessary adjustments related to token  renaming, token swaps, redenominations, splits, and other migrations that teams who govern the token might undertake.

### Fast Gas Reliability

The [Fast Gas Data Feed](https://data.chain.link/ethereum/mainnet/gas/fast-gas-gwei) provides a simple way to determine the price of gas so you can estimate how much gas you need to make a transaction execute quickly. Fast gas prices can be manipulated, so you should design your applications to detect gas price volatility or malicious activity that might affect the costs of your transactions.

> 📘 The best practices above are provided for informational purposes only. You are responsible for reviewing the quality of the data that you integrate into your smart contracts.
