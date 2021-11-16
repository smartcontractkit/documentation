---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Making Keeper Compatible Contracts': '/docs/chainlink-keepers/compatible-contracts/',
  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

# Overview

Smart contracts alone can't trigger or initiate their own functions at arbitrary times or under arbitrary conditions. State change will only occur when a transaction is initiated by another account (such as user, oracle, or contract).

To resolve this issue, blockchain projects can:

1. Create highly reliable infrastructure trigger smart contract functions. This is centralized and often expensive to build and maintain.
1. Outsource it to a third party. This option is also centralized and creates a single point of failure.
1. Use an open market solution. This option is decentralized, but comes with complex incentive alignment, the potential for competitive bots that increase the cost of execution, and difficulties in ensuring reliability.
1. Use the **Chainlink Keeper** Network


Chainlink Keepers provide users with a decentralized network of nodes that are incentivized to perform all registered jobs (or *Upkeeps*) without competing with each other. The network has several benefits:

- Provide developers with hyper-reliable, decentralized smart contract automation
- Offer expandable computation allowing developers to build more advanced dApps at lower costs
- Flexibility and programmability

Read the [Network Overview](../overview) page to learn how these networks work.

# Getting Started

The goal of Keepers is to ensure flawless execution of Upkeeps when expected. To get the most out of Chainlink Keepers, review these docs in full: [how to create a Keepers-compatible contract](../compatible-contracts), usage patterns, best practices, and how to [maintain the health of your upkeep](../register-upkeep).

## Supported Blockchain Networks

Chainlink Keepers are currently available on Kovan and ETH testnet and mainnet. If you are interested in using Keepers but need it on a different blockchain or network, reach out to us and [let us know](https://forms.gle/WadxnzzjHPtta5Zd9).

## Onboarding Steps

Below are the steps needed to create a Keeper compatible contract and register Upkeep for the contract. Test Keeper-compatible contracts on testnet before moving to mainnet. 

1. Create a [Keeper compatible contract](../compatible-contracts/)
1. Deploy your contract onto a supported testnet
1. Get [LINK](../../link-token-contracts/#kovan) on the testnet
1. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/).
1. [Register your Upkeep](../register-upkeep/) on testnet
1. Test, iterate, and finalize your Keeper compatible contract
1. Deploy your fully tested contract onto mainnet
1. [Register your Upkeep](../register-upkeep/) on mainnet
1. Fund your upkeep on mainnet
1. Confirm the first performance of your Upkeep

> ⚠️ Registration Onboarding Note
> Your registrations on testnet will be auto approved immediately. To help us streamline the process of onboarding your use case on mainnet, please fill out the optional details (and form) during testnet registration so our onboarding team can expect your use case on mainnet. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).
