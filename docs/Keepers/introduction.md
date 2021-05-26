---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Introduction to Chainlink Keepers (Beta)'
permalink: 'docs/chainlink-keepers/introduction/'
whatsnext:
  {
    'Making Keeper Compatible Contracts': '/docs/chainlink-keepers/compatible-contracts/',
  }
---
![Chainlink Keeper Network](/images/contract-devs/generic-banner.png)

{% include keepers-beta %}

A major limitation of smart contracts is that they can't trigger or initiate their own functions at arbitrary times or under arbitrary conditions. State change will only occur when a transaction is initiated by another account (such as user, oracle, or contract).

Chainlink Keepers allow you to register Upkeep for your contract. When the conditions you specify are met, the Chainlink Keeper Network will execute a method on your contract. [Learn how the network works.](../overview)

An example Decentralized Finance (DeFi) use case would be to detect when a debt position in a smart contract is insufficiently collateralized. The contract could be triggered to liquidate the position automatically.  Capabilities like this generally can't be automated on-chain and must be handled by an off-chain service due to smart contracts inability to self-execute. 

The Chainlink Keeper Network is a decentralized solution where independent Keeper nodes are incentivized to check and perform Upkeep correctly.

To use the Chainlink Keeper Network, you'll need to:.

1. Write a compatible contract, or make an existing contract compatible
1. Register Upkeep for your contract on the Chainlink Keeper Network
1. Fund your Upkeep with LINK

