---
layout: nodes.liquid
section: nonEvm
date: Last Modified
title: "Terra on Chainlink"
permalink: "docs/terra/"
whatsnext: {"Using Data Feeds":"/docs/terra/using-data-feeds-terra/"}
---

## Overview

[Terra](https://www.terra.money/) is an application-specific blockchain built on the Cosmos SDK and Tendermint consensus. Chainlink Data Feeds run natively on Terra's high-throughput blockchain and have no dependencies on other blockchains.

Terra supports on-chain programs in the [Rust](https://docs.terra.money/Tutorials/Smart-contracts/Overview.html) language. Smart contracts on Terra are singleton objects with an internal state that persists on the blockchain. Users can query the state of the contract and trigger state changes in the contract through JSON messages. To learn more about the Terra network, see the [Terra Documentation](https://docs.terra.money/).

The [CosmWasm contract platform](https://docs.cosmwasm.com/docs/) is a multi-chain solution for smart contracts that is compatible with the Terra network. The documentation for using Chainlink services on the Terra network often uses the CosmWasm libraries in example code.

## Available services

The following Chainlink services are available on the Terra network:

- [Terra Bombay-12 testnet](https://finder.terra.money/bombay-12):
  - [Data Feeds](/docs/terra/using-data-feeds-terra/)

To learn when more Chainlink services become available, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).
