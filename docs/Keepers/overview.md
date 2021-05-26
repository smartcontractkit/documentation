---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Chainlink Keeper Network Overview'
permalink: 'docs/chainlink-keepers/overview/'
---
{% include keepers-beta %}

The Chainlink Keeper Network provides options for smart contracts to outsource regular maintenance tasks in a trust minimized & decentralized manner. The network aims to provide a protocol for incentivization & governance for the keeper ecosystem.

There are three main actors in the network:

- **Client Contracts**: Smart contracts that need external entities to service their maintenance tasks.
- **Keepers**: Chainlink nodes that execute registered Upkeeps.
- **Registry**: The contract through which anyone can create and manage Upkeeps, and node operators can perform Upkeeps.

The diagram below describes the architecture of the Keeper network. It is responsible for governing the actors on the network and compensating Keepers for performing successful Upkeeps. Through it, clients can register for Upkeep and node operators can register as Keepers.

![keeper-overview](/images/contract-devs/keeper/keeper-overview.png)
