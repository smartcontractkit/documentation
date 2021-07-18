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

![Chainlink Keeper Network](/images/contract-devs/generic-banner.png)

{% include keepers-beta %}

A major limitation of smart contracts is that they can't trigger or initiate their own functions at arbitrary times or under arbitrary conditions. State change will only occur when a transaction is initiated by another account (such as user, oracle, or contract).

To solve this problem, blockchain projects can:

1. Create highly reliable infrastructure trigger smart contract functions - centralized and expensive to build/maintain,
1. Outsource it to a 3rd party - often centralized and a single point of failure
1. Use an open market solution - decentralized, but can come with complex incentive alignment, the potential for competitive bots that increase the cost of execution, and difficulties ensuring reliability
1. Use the Chainlink Keeper Network

Chainlink Keepers provide users with a decentralized network of nodes that are incentivized to perform all registered jobs (Upkeeps) without competing with one another, allowing you to focus on critical smart contract functionality. [Learn how the network works.](../overview)

An example Decentralized Finance (DeFi) use would be to detect the fulfillment of a condition that triggers the execution of trades. Tasks like this generally can't be automated on-chain and must be handled by an off-chain service due to smart contracts' inability to self-execute.

The Chainlink Keeper Network is a decentralized solution where independent Keeper nodes are incentivized to check and perform Upkeep correctly.

## Getting Started

### Supported Blockchain Networks

Chainlink Keepers are currently available on Kovan and ETH mainnet. If you are interested in using Keepers but need it on a different blockchain or network, please reach out to us and [let us know](https://forms.gle/WadxnzzjHPtta5Zd9).

> 📘 Making sure your Upkeeps execute when you expect
> Our goal is to ensure flawless execution of your Upkeeps. To get the most out of Chainlink Keepers, we recommend you review these docs in full - understand their capabilities, usage patterns, best practices, and how to maintain the health of your upkeep.

## Onboarding Steps

We strongly recommend to start by testing your Keeper-compatible contracts on testnet before moving to mainnet. At any point during your testing process, please [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9) if you have questions that have not been addressed, or take a look at our [Keepers Frequently Asked Questions](../faqs/).

1. Create a [Keeper compatible contract](../compatible-contracts/)
1. Deploy your contract onto a supported testnet
1. Get [LINK](../../link-token-contracts/#kovan) on the testnet
1. [Register your Upkeep](../register-upkeep/) on testnet
1. Test, iterate, and finalize your Keeper compatible contract
1. Deploy your fully tested contract onto mainnet
1. [Register your Upkeep](../register-upkeep/) on mainnet
1. Fund your upkeep on mainnet
1. Confirm the first performance of your Upkeep

> ⚠️ Open Beta Note
> Your registrations on testnet will be auto approved immediately. To help us streamline the process of onboarding your use case on mainnet, please fill out the optional details (and form) during testnet registration so our onboarding team can expect your use case on mainnet. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.
