---
layout: nodes.liquid
section: solana
date: Last Modified
title: "Solana on Chainlink"
permalink: "docs/solana/"
whatsnext: {"Using Data Feeds":"/docs/solana/using-data-feeds-solana/"}
---

## Overview

[Solana](https://solana.com/) supports on-chain programs in the [Rust](https://docs.solana.com/developing/on-chain-programs/developing-rust) or [C](https://docs.solana.com/developing/on-chain-programs/developing-c) languages. Chainlink’s Solana deployment has no dependencies on external blockchain networks such as Ethereum. To learn more about the Solana programming model, see the [Solana Documentation](https://docs.solana.com/developing/programming-model/overview).

In Solana, storage and smart contract logic are separate. Programs store all the logic similar to an EVM smart contract. The accounts store all the data. Solana programs are stateless, so you don't always need to deploy your program to the network to test it. Compared to Solidity, the combination of an account and a program is equivalent to a smart contract on an EVM chain. State and logic are separate in Solana.

## Available services

The following Chainlink services are available on the Solana network:

- [Solana Devnet](https://explorer.solana.com/?cluster=devnet):
  - [Data Feeds](/docs/solana/using-data-feeds-solana/)

To learn when more Chainlink services become available, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/docs/developer-communications/).
