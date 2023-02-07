---
layout: ../../../layouts/MainLayout.astro
section: dataFeeds
date: Last Modified
title: "Proof of Reserve Feeds"
permalink: "docs/data-feeds/proof-of-reserve/"
whatsnext: { "Find contract addresses for Proof of Reserve Feeds": "/data-feeds/proof-of-reserve/addresses/" }
---

Chainlink Proof of Reserve Feeds provide the status of the reserves for several assets. You can use these feeds the same way that you read other Data Feeds. Specify the [Proof of Reserve Feed Address](/data-feeds/proof-of-reserve/addresses/) that you want to read instead of specifying a Price Feed address. See the [Using Data Feeds](/data-feeds/using-data-feeds/) page to learn more.

To find a list of available Proof of Reserve Feeds, see the [Proof of Reserve Feed Addresses](/data-feeds/proof-of-reserve/addresses/) page.

## Types of Proof of Reserve Feeds

Reserves are available for both cross-chain assets and off-chain assets. Token issuers prove the reserves for their assets through several different methods:

- [Cross-chain reserves](#cross-chain-reserves):
  - Wallet address manager
  - Self-attested wallet API
- [Off-chain reserves](#off-chain-reserves):
  - Third-party API
  - Custodian API
  - Self-attested API

### Cross-chain reserves

Cross-Chain reserves are sourced from the network where the reserves are held. This includes but is not limited to networks including Bitcoin, Filecoin, Cardano, and chains where Chainlink has a native integration. Chainlink Node operators can report cross-chain reserves by running an [external adapter](/chainlink-nodes/external-adapters/external-adapters) and querying the source-chain client directly. In some instances, the reserves are composed of a dynamic list of IDs or addresses using a composite adapter.

![Cross-chain reserves diagram](/images/data-feed/cross-chain-reserves.webp)

Cross-chain reserves provide their data using the following methods:

- Wallet address manager: The project uses the [IPoRAddressList](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/PoRAddressList.sol) wallet address manager contract and self-attests to which addresses they own.
- Self-attested wallet API: The project attests which addresses they own through a self-hosted API.

### Off-chain reserves

Off-Chain reserves are sourced from APIs through an [external adapter](/chainlink-nodes/external-adapters/external-adapters).

![Off-chain reserves diagram](/images/data-feed/off-chain-reserves.webp)

Off-chain reserves provide their data using the following methods:

- Third-party API: An auditor or a third-party verifies the reserves and provides that data through an API.
- Custodian API: Reserve status is read directly from a bank or custodian API.
- Self-attested API: Reserve status is read from an API that the token issuer hosts.

## Using Proof of Reserve Feeds

Read answers from Proof of Reserve Feeds the same way that you read other Data Feeds. Specify the [Proof of Reserve Feed Address](/data-feeds/proof-of-reserve/addresses/) that you want to read instead of specifying a Price Feed address. See the [Using Data Feeds](/data-feeds/using-data-feeds/) page to learn more.

Using Solidity, your smart contract should reference [`AggregatorV3Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol), which defines the external functions implemented by Data Feeds.

::solidity-remix[samples/PriceFeeds/ReserveConsumerV3.sol]
