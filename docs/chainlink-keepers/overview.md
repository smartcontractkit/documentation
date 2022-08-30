---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Architecture'
whatsnext: { 'FAQs': '/docs/chainlink-keepers/faqs/' }
---

## Overview

Chainlink Keepers enable you to execute smart contract functions based on conditions that you specify without having to create and maintain your own centralized stack. Chainlink Keepers is highly reliable and decentralized, supported by an industry leading team, and enables developers to deploy applications faster.

There are three main actors in the ecosystem:

- **Upkeeps**: These are the jobs or tasks that you execute on-chain. For example, you can call a smart contract function if a specific set of conditions are met.
- **Keepers registry**: The contract that you use to [register](../register-upkeep/) and manage **upkeeps**.
- **Keepers**: Nodes in the Keepers Network that service registered and funded upkeeps in the Keepers registry. Keepers use the same Node Operators as Chainlink Data Feeds.

The following diagram describes the architecture of the Keeper network. The Chainlink Keepers Registry governs the actors on the network and compensates keepers for performing successful upkeeps. Developers can register their upkeeps, and Node Operators can register as Keepers.

![keeper-overview](/images/contract-devs/keeper/keeper-overview.png)

## Keeper Contracts

Keepers use these contracts. You can find them in the [Chainlink repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8). For details about how to use them, see the [Keepers-compatible Contracts](../compatible-contracts/) page.

- `KeeperCompatible.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperCompatible.sol): Imports the following contracts:
  - `KeeperBase.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperBase.sol): Enables the use of the `cannotExecute` modifier. Import this contract if you need for this modifier. See the [`checkUpkeep` function](/docs/chainlink-keepers/compatible-contracts#checkupkeep-function) for details.
  - `KeeperCompatibleInterface.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol): The interface to be implemented in order to make your contract keepers-compatible. Import this contract for type safety.
- `KeeperRegistry.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperRegistry.sol): The registry contract that tracks all registered upkeeps and the keepers that can perform them.
- `KeeperRegistrar.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperRegistrar.sol): The Registrar contract governs the registration of new upkeeps on the associated `KeeperRegistry` contract. Users who want to register Upkeeps by directly calling the deployed contract have to call the Transfer-and-Call function on the respective ERC-677 LINK contract configured on the Registrar and ensure they pass the correct encoded function call and inputs.

## How it works

Keepers follow a turn-taking algorithm to service upkeeps. A turn is a number of blocks and you can find the block count per turn for your network in the [configuration](../supported-networks/#configurations) section. During a turn, upkeeps on the registry are randomly split, ordered into buckets, and assigned to a keeper to service them. Even if a keeper goes down, the network has built-in redundancy and upkeeps are performed by the next keeper in line.

During every block, the keeper reviews all of the upkeeps in its bucket to determine which upkeeps are eligible. This check is done off-chain using a geth simulation. The keeper checks both the `checkUpkeep` and `performUpkeep` conditions independently using simulation. If both are true (eligible), and the upkeep is funded, the keeper proceeds to execute the transaction on-chain.

While only one keeper monitors an upkeep at any point during a turn, an upkeep can have multiple on-chain transaction executions per turn. This is accomplished with a buddy-system. After a transaction is confirmed, the next keeper in the line monitors the upkeep. After a new transaction is confirmed, the previous keeper steps in again to monitor the upkeep until the end of the turn or until another transaction confirmation is complete. This creates a system that is secure and highly available. If a node becomes faulty and executes a transaction that is not eligible, the next node does not execute a transaction, which breaks the process.

Keepers use the same transaction manager mechanism built and used by Chainlink Data Feeds. This creates a hyper-reliable automation service that can execute and confirm transactions even during intense gas spikes or on chains with significant reorgs. This mechanism has been in use in Chainlink Labs for multiple years, is battle hardened, and the team continuously improves on it.

## Internal monitoring

Internally, Chainlink Keepers also uses its own monitoring and alerting mechanisms to maintain a health network and ensure developers get the reliability that they expect.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Keepers, please review the [supported networks page](../supported-networks). To learn more about the cost of using Chainlink Keepers, see the [Keepers economics](../keeper-economics) page.
