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

Chainlink Keepers enable smart contract developers to execute their smart contract functions based on conditions specified by the developers, without having to create and maintain their own centralized stack. Chainlink Keepers is highly reliable and decentralized, supported by an industry leading team, and enables developers to move faster.

There are three main actors in the ecosystem:

- **Upkeeps**: These are the jobs or tasks that developers want to execute on-chain, such as calling their smart contract function if a specific set of conditions have been met.
- **Keepers registry**: The contract through which developers can [register](../register-upkeep/), and manage, their **Upkeeps**.
- **Keepers**: Nodes in the Keepers Network that service registered and funded Upkeeps in the Keepers registry. Keepers use the same Node Operators as Chainlink Data Feeds, which secures billions of dollars in DeFi.

The diagram below describes the architecture of the Keeper network. The Chainlink Keepers Registry is responsible for governing the actors on the network and compensating Keepers for performing successful Upkeeps. Developers can register their Upkeeps, and Node Operators can register as Keepers.

![keeper-overview](/images/contract-devs/keeper/keeper-overview.png)

## Keeper Contracts

Keepers use these contracts, and you can find them in the [Chainlink repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8). For details on how to use them see the [Keepers-compatible Contracts](../compatible-contracts/) page.

+ `KeeperCompatible.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperCompatible.sol): Imports the following contracts:
  + `KeeperBase.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperBase.sol): Enables the use of the `cannotExecute` modifier. Import this contract if you need for this modifier. See the [`checkUpkeep` function](/docs/chainlink-keepers/compatible-contracts#checkupkeep-function) for details.
  + `KeeperCompatibleInterface.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol): The interface to be implemented in order to make your contract Keepers-compatible. Import this contract for type safety.
+ `KeeperRegistry.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/KeeperRegistry.sol): The registry contract that tracks all registered Upkeeps and the Keepers that can perform them.
+ `UpkeepRegistrationRequests.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/UpkeepRegistrationRequests.sol): The registration contract that allows users to register and configure their Upkeep with the associated `KeeperRegistry` contract.

## How it works

Keepers follow a turn-taking algorithm to to service Upkeeps. A turn is a number of blocks and you can find the block count perturn for your network in the [configuration](../supported-networks/#configurations) section. During a turn a Upkeeps on the Registry are randomly split and ordered into buckets, and assigned to a Keeper to service them. Even if a Keeper goes down, we have built-in redundancy and your Upkeep will be performed by the next Keeper in line.

During every block the Keeper will review all of the Upkeeps in its bucket to determine which are eligible. This check is done "off-chain" using a geth simulation. The Keeper will check both the checkUpkeep and performUpkeep conditions independently via simulation and if both are true (eligible) and the upkeep is funded, then the Keeper will proceed to execute the transaction on-chain.

While only one Keeper will monitor an Upkeep at any point during a turn, an Upkeep can have multiple on-chain transaction executions oper turn. This is accomplished with a buddy-system. After a transaction has been confirmed, the next Keeper in the line will monitor the Upkeep and once a new transaction has been confirmed the previous Keeper will step in again to monitor the upkeep until the end of the turn, or another transaction confirmation. This creates a system that is secure and highly available. Note that if a node goes faulty and executes a transaction that was not eligible, the next node would not execute a transaction, and thus break the process.

Keepers use the same transaction manager mechanism built and used by Chainlink Data Feeds. This creates a hyper-reliable automation service that can execute and confirm transactions even during intense gas spikes as well as on chains with significant reorgs. This mechanism has been in use in Chainlink Labs for multiple years, battle hardened, and the team continuously improves on it.

## Internal monitoring

Internally Chainlink Keepers also uses its own monitoring and alerting mechanisms to maintain a health network and ensure developers get the reliability that they expect.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Keepers, please review the [supported networks page](../supported-networks). To learn more about the cost of using Chainlink Keepers, please review the [Keepers economics](../keeper-economics) page.
