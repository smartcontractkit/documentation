---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Architecture'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

## Overview

Chainlink Keepers allow smart contracts to outsource regular maintenance tasks in a trust minimized and decentralized manner. The network aims to provide a protocol for incentivization of execution and governance of execution within the Keeper ecosystem.

There are three main actors in the ecosystem:

- **Upkeeps**: These are the maintenance tasks that smart contracts need external entities to service for them. These tasks are just functions on a smart contract and these contracts should be [Keepers-compatible](../compatible-contracts/).
- **Keepers registry**: The contract through which anyone can [register](../register-upkeep/), and manage, their **Upkeeps**.
- **Keepers**: Nodes in the Keepers Network that service registered and funded Upkeeps in the Keepers registry.

The diagram below describes the architecture of the Keeper network. It is responsible for governing the actors on the network and compensating Keepers for performing successful Upkeeps. Clients can register for Upkeep and node operators can register as Keepers.

![keeper-overview](/images/contract-devs/keeper/keeper-overview.png)

## Keeper Contracts

There are several contracts to be aware of. You can find them in the [Chainlink repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8). For details on how to use them see the [Keepers-compatible Contracts](../compatible-contracts/) page.

+ `KeeperCompatible.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperCompatible.sol): Imports the following contracts:
  + `KeeperBase.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperBase.sol): Enables the use of the `cannotExecute` modifier. Import this contract if you need for this modifier. See the [`checkUpkeep` function](/docs/chainlink-keepers/compatible-contracts#checkupkeep-function) for details.
  + `KeeperCompatibleInterface.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol): The interface to be implemented in order to make your contract Keepers-compatible. Import this contract for type safety.
+ `KeeperRegistry.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/KeeperRegistry.sol): The registry contract that tracks all registered Upkeeps and the Keepers that can perform them.
+ `UpkeepRegistrationRequests.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/UpkeepRegistrationRequests.sol): The registration contract that allows users to register and configure their Upkeep with the associated `KeeperRegistry` contract.

## How it works

Keepers take responsibility for Upkeeps in turns. Each turn is counted in blocks. See the [configuration](../supported-networks/#configurations) section to find the current block count per turn for your network. The registered Upkeeps are broken into buckets based on the number of Keepers on the network. At the end of each turn, the buckets rotate from one Keeper to the next. Even if a Keeper goes down, we have built-in redundancy and your Upkeep will be performed by the next Keeper in line.

During every block the Keeper will check if the Upkeep is eligible using off-chain compute (a simulation), and then broadcast them on-chain when eligible.

Once a Keeper has performed an Upkeep, it cannot do so again until another Keeper on the network has subsequently performed the same Upkeep. This protects against a faulty or malicious Keeper from taking repeated action on a given Upkeep.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Keepers, please review the [supported networks page](../supported-networks). To learn more about the cost of using Chainlink Keepers, please review the [Keepers economics](../keeper-economics) page.
