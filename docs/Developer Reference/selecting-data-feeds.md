---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Selecting Quality Data Feeds"
permalink: "docs/selecting-data-feeds/"
excerpt: "Learn how to assess data feeds that you use in your smart contracts."
---

When you design your applications, consider the quality of the data that you use in your smart contracts. Ultimately you are responsible for identifying and assessing the accuracy, availability, and quality of data that you choose to consume via the Chainlink Network. Note that all feeds contain some inherent risk. Read the [Risk Mitigation](#risk-mitigation) and [Evaluating Data Sources](#evaluating-data-sources-and-risks) sections when making design decisions. Chainlink lists decentralized data feeds in the documentation to help developers build new applications integrated with data.

**Topics**

+ [Data Feed Categories](#data-feed-categories)
+ [Risk Mitigation](#risk-mitigation)
+ [Chainlink Community Deployments](#chainlink-community-deployments)
+ [Evaluating Data Sources and Risks](#evaluating-data-sources-and-risks)

## Data Feed Categories

Data feeds are grouped into the following categories based on the level of risk from lowest to highest:

+ [Verified Feeds](#🟢-verified-feeds)
+ [Monitored Feeds](#🟡-monitored-feeds)
+ [Custom Feeds](#-custom-feeds)
+ [Specialized Feeds](#-specialized-feeds)

> 📘 For important updates regarding the use of Chainlink Price Feeds, users should join the official Chainlink Discord and subscribe to the [data-feeds-user-notifications channel](https://discord.gg/Dqy5N9UbsR).

### 🟢 Verified Feeds

These are data feeds that follow a standardized data feeds workflow. Chainlink node operators each query several sources for the market price and aggregate the estimates provided by those sources.

Verified feeds have the following characteristics:

- Highly resilient to disruption
- Leverage many data sources
- Use an extensive network of nodes
- Highly liquid and well represented on a large number of markets

These feeds incorporate three layers of aggregation (at the data source, node operator, and oracle network layers), providing industry-grade security and reliability on the price data they reference. To learn more about the three layers of data aggregation, see the blog post about [Data Aggregation in Chainlink Price Feeds](https://blog.chain.link/levels-of-data-aggregation-in-chainlink-price-feeds/).

Inherent risks might still exist based on your use case, the blockchain on which the feed is deployed and the conditions on that chain.

### 🟡 Monitored Feeds

Feeds under the monitored category are *under review* by the Chainlink Labs team to support the stability of the broader ecosystem. While generally resilient and distributed, these feeds carry additional risk.

Data feeds might be under review for the following reasons:

- The token project or asset is in early development
- The project is going through a market event such as a token or liquidity migration
- The token or project is being deprecated in the market

### 🔵 Custom Feeds

Custom Feeds are built to serve a specific use case and might not be suitable for general use or your use case's risk parameters. Users must evaluate the properties of a feed to make sure it aligns with their intended use case. [Contact the Chainlink Labs team](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=market-data-feeds) if you want more detail on any specific feeds in this category.

Custom feeds have the following categories and compositions:

- **On-chain single source feeds:** These feeds take their data from an on-chain source, however the feed has only a single data provider currently supporting the feed.
- **On-chain Proof of Reserve Feeds:** Chainlink Proof of Reserve uses the largest decentralized collection of security-reviewed and Sybil-resistant node operators in the industry to acquire and verify reserve data. In this use case, reserves reside on-chain.
- **Technical Feeds:** Feeds within this category measure a particular technical metric from a specified blockchain. For example, Fast Gas or Block Difficulty.
- **Total Value Locked Feeds:** These feeds measure the total value locked in a particular protocol.
- **Custom Index Feeds:** An index calculates a function of the values for multiple underlying assets. The function is specific to that index and is typically calculated by node operators following an agreed formula.

If you plan on using one of these feeds and would like to get a more detailed understanding, [contact the Chainlink Labs team](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=market-data-feeds).

### ⚫ Specialized Feeds

These are purpose-built feeds that might rely heavily on contracts maintained by external entities. Typical users of these feeds are large institutional users with deep expertise in the market space they operate in.

These feeds are monitored and well-supported, but they might not meet the same levels of resiliency as the above categories. We strongly advise you to [speak with the Chainlink Labs team](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=market-data-feeds) to understand their use cases, properties, and associated risks.

**Examples of Specialized feeds:**

- **Off-chain Single Source Feeds:** Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data.
- **Off-chain Proof of Reserve Feeds:** Chainlink Proof of Reserve uses the largest decentralized collection of security-reviewed and Sybil-resistant node operators in the industry to acquire and verify reserve data. In this use case, reserves reside off-chain.
- **LP Token Feeds:** These feeds use a decentralized feed for the underlying asset as well as calculations to value the LP tokens.
- **Wrapped Calculated Feeds:** These feeds are typically pegged 1:1 to the underlying token or asset. Under normal market conditions, these feeds track their underlying value accurately. However, the price is a derivative formed from a calculated method and might not always track value precisely.

If you plan on using one of these feeds and would like to get a more detailed understanding, [contact the Chainlink Labs team](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=market-data-feeds).

### ⭕ Deprecating

These feeds are being [deprecated](/docs/reference-contracts/#deprecation-of-chainlink-data-feeds). To find the deprecation dates for specific feeds, see the complete [deprecation list](/docs/deprecating-feeds/) or the [data feeds lists](/docs/reference-contracts/) for each network.

## Risk Mitigation

As a development best practice, design your systems and smart contracts to be resilient and mitigate risk to your protocol and your users. Ensure that your systems can tolerate known and unknown exceptions that might occur. Some examples include but are not limited to volatile market conditions, the degraded performance of infrastructure, chains, or networks, and any other upstream outage related to data providers or node operators. You bear responsibility for any manner in which you use the Chainlink Network, its software, and documentation.

To help you prepare for unforeseen market events, we recommend taking additional steps for custom or specialized feeds to protect your application or protocol. This might also be worth considering in all categories based on the value that your application secures. This tooling is put in place to mitigate extreme market events, possible malicious activity on third-party venues or contracts, potential delays, performance degradation, and outages.

Below are some examples of tooling that Chainlink users have put in place:

- **Circuit breakers:** In the case of an extreme price event, the contract would pause operations for a limited period of time.
- **Contract update delays:** Contracts would not update until the protocol had received a recent fresh input from the data feed.
- **Manual kill switch:** If a vulnerability or bug is discovered in one of the upstream contracts, the user can manually cease operation and temporarily sever the connection to the data feed.
- **Monitoring:** Some users create their own monitoring alerts based on deviations in the data feeds that they are using.
- **Soak testing:** Users are strongly advised to thoroughly test price feed integrations and incorporate a [soak period](https://en.wikipedia.org/wiki/Soak_testing) prior to providing access to end users or securing value.

For more detailed information about some of these examples, see the [Monitoring data feeds](/docs/using-chainlink-reference-contracts/#monitoring-data-feeds) documentation.

For important updates regarding the use of Chainlink Price Feeds, users should join the official Chainlink Discord and subscribe to the data-feeds-user-notifications channel: https://discord.gg/Dqy5N9UbsR

## Chainlink Community Deployments

Chainlink technology is used by many within the blockchain community to support their use cases. Deployments built and run by community members are not tracked in the Chainlink documentation. Chainlink's community is continuously growing, and we believe they play a vital role in developing the ecosystem, so we continue to develop our software and tooling for anyone to use. Users have a wide variety of options for choosing how to deliver data on-chain. They can deploy Chainlink nodes themselves or via the extensive network of node operators that offer services and access one of the community-managed oracle networks that support the supply of various types of data on-chain. Chainlink Labs does not take responsibility for the use of Chainlink node software.

It is always recommended that you conduct a thorough analysis of your requirements and carry out appropriate due diligence on any partners you wish to use with your project.

> **The Chainlink Labs team does not monitor community deployments** and encourages users to use best practices in observability, monitoring, and risk mitigation as appropriate for your application's stage of development and use case.

As your usage of data feeds evolves and requirements for higher availability and greater security increases, such as securing substantive value, the reliability properties of your data feed will become crucial. [Contact Chainlink Labs team](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=market-data-feeds) for services to ensure deployments meet the highest levels of availability and security.

**High Risk: Forked, modified, or custom software:**

As Chainlink is open source, independent forks and modifications may exist. Chainlink Labs and development teams are not involved in these and do not track or maintain visibility on them. Chainlink Labs is not responsible for updates, enhancements, or bug fixes for these versions, and Chainlink Labs does not monitor them. Their use might pose risks that can do harm to your project. Users are responsible for thoroughly vetting and validating such deployments and determining their suitability.

## Evaluating Data Sources and Risks

If your smart contracts use data feeds, assess those data feeds for the following characteristics:

- [Liquidity and its Distribution](#liquidity-and-its-distribution)
- [Single Source Data Providers](#single-source-data-providers)
- [Crypto Actions](#crypto-actions)
- [Market Failures Resulting from Extreme Events](#market-failures-resulting-from-extreme-events)
- [Periods of High Network Congestion](#periods-of-high-network-congestion)
- [Unknown and Known Users](#unknown-and-known-users)
- [Fast Gas Reliability](#fast-gas-reliability)

### Liquidity and its Distribution

If your smart contract relies on pricing data for a specific asset, make sure that the asset has sufficient liquidity in the market to avoid price manipulation. Assets with low liquidity can be volatile, which might negatively impact your application and its users. Malicious actors might try to exploit volatility to take advantage of the logic in a smart contract and cause it to execute in a way that you did not intend.

Some data feeds obtain their pricing data from individual exchanges rather than from aggregated price tracking services that gather their data from multiple exchanges. These are marked as such in the docs page for that feed. Assess the liquidity and reliability of that specific exchange.

**Liquidity migrations** occur when a project moves its tokens from one liquidity provider (such as a DEX, a CEX, or a new DeFi application) to another. When liquidity migrations occur, it can result in low liquidity in the original pool, making the asset susceptible to market manipulation. If your project is considering a liquidity migration, you should coordinate with relevant stakeholders, including liquidity providers, exchanges, oracle node operators, and users, to ensure prices are accurately reported throughout the migration.

Design and test your contracts to handle price spikes and implement risk management measures to protect your assets. For example, create mock tests that return a wide variety of oracle responses.

### Single Source Data Providers

Some data providers use a single data source, which might be necessary if only one source exists off-chain for a specific type of data. Evaluate data providers to make sure they provide high-quality data that your smart contracts can rely on. Any error or omission in the provider's data might negatively impact your application and its users.

### Crypto Actions

Price data quality is subject to crypto actions by the crypto project teams. Crypto actions are similar to [corporate actions](https://en.wikipedia.org/wiki/Corporate_action) but are specific to cryptocurrency projects. Sustaining data quality is dependent on data sources implementing the necessary adjustments related to token renaming, token swaps, redenominations, splits, and other migrations that teams who govern the token might undertake.

For example, when a project upgrades to a new version of their token, this results in a *token migration*. When token migrations occur, they require building a new price feed to ensure that the token price is accurately reported. When considering a token migration, or other crypto action, projects should proactively reach out to relevant stakeholders to ensure the asset price is accurately reported throughout the process.

### Market Failures Resulting from Extreme Events

Users are strongly advised to set up monitoring and alerts in the event of unexpected market failures. Black swan events or extreme market conditions may trigger unanticipated outcomes such as liquidity pools becoming unbalanced, unexpected re-weighting of indices, abnormal behavior by exchanges, or the de-pegging of synthetic assets and currencies from their intended exchange rates.

Users should be aware of inherently increased risk during such periods of high volatility and market failure.

### Periods of High Network Congestion

Data Feed performance relies on the chains they are deployed on. Periods of high network congestion might impact the frequency of Chainlink Price Feeds. It is advised that you configure your applications to detect such chain performance issues and to respond appropriately.

### Unknown and Known Users

Routine maintenance is carried out on Chainlink Data Feeds, including decommissioning, on an ad-hoc basis. These maintenance periods might require users to take action in order to maintain business continuity.

Notifications are sent to inform users regarding such occurrences, and it is strongly encouraged for users to provide their contact information before utilizing data feeds. Without providing contact information, users will be unable to receive notifications around important price feed updates.

If you are using price feeds but have not provided your contact information, you can do so [here](https://chainlinkcommunity.typeform.com/unknownDfUsers).

### Fast Gas Reliability

The [Fast Gas Data Feed](https://data.chain.link/ethereum/mainnet/gas/fast-gas-gwei) provides a simple way to determine the price of gas so you can estimate how much gas you need to make a transaction execute quickly. Fast gas prices can be manipulated, so you should design your applications to detect gas price volatility or malicious activity that might affect the costs of your transactions.

> 📘 The best practices above are provided for informational purposes only. You are responsible for reviewing the quality of the data that you integrate into your smart contracts.
