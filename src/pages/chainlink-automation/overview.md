---
layout: ../../layouts/MainLayout.astro
section: automation
date: Last Modified
title: "Chainlink Automation Architecture"
whatsnext: { "FAQs": "/chainlink-automation/faqs/" }
---

Chainlink Automation enable you to execute smart contract functions based on conditions that you specify without having to create and maintain your own centralized stack. Chainlink Automation is highly reliable and decentralized, supported by an industry leading team, and enables developers to deploy applications faster.

There are three main actors in the ecosystem:

- **Upkeeps**: These are the jobs or tasks that you execute on-chain. For example, you can call a smart contract function if a specific set of conditions are met.
- **Automation registry**: The contract that you use to [register](/chainlink-automation/register-upkeep/) and manage **upkeeps**.
- **Automation Nodes**: Nodes in the Chainlink Automation Network that service registered and funded upkeeps in the Automation registry. Automation Nodes use the same Node Operators as Chainlink Data Feeds.

The following diagram describes the architecture of the Chainlink Automation Network. The Chainlink Automation Registry governs the actors on the network and compensates Automation Nodes for performing successful upkeeps. Developers can register their Upkeeps, and Node Operators can register as Automation Nodes.

![automation-overview](/images/contract-devs/automation/automation-overview.png)

## Automation Contracts

Automation Nodes use these contracts. You can find them in the [Chainlink repository](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8). For details about how to use them, see the [Creating Compatible Contracts](/chainlink-automation/compatible-contracts/) guide.

- `AutomationCompatible.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/AutomationCompatible.sol): Imports the following contracts:
  - `AutomationBase.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/AutomationBase.sol): Enables the use of the `cannotExecute` modifier. Import this contract if you need for this modifier. See the [`checkUpkeep` function](/chainlink-automation/compatible-contracts#checkupkeep-function) for details.
  - `AutomationCompatibleInterface.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol): The interface to be implemented in order to make your contract compatible. Import this contract for type safety.
- `AutomationRegistry1_2.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/AutomationRegistry1_2.sol): The registry contract that tracks all registered Upkeeps and the Automation Nodes that can perform them.
- `KeeperRegistrar.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/KeeperRegistrar.sol): The Registrar contract coverns the registration of new Upkeeps on the associated `KeeperRegistry` contract. Users who want to register Upkeeps by directly calling the deployed contract have to call the Transfer-and-Call function on the respective ERC-677 LINK contract configured on the Registrar and ensure they pass the correct encoded function call and inputs.

## How it works

Automation Nodes follow a turn-taking algorithm to service upkeeps. A turn is a number of blocks and you can find the block count per turn for your network in the [configuration](/chainlink-automation/supported-networks/#configurations) section. During a turn a Upkeeps on the registry are randomly split, ordered into buckets, and assigned to an Automation Node to service them. Even if an Automation Node goes down, the network has built-in redundancy and your Upkeep will be performed by the next Automation Node in line.

During every block, the Automation Node reviews all of the upkeeps in its bucket to determine which upkeeps are eligible. This check is done off-chain using a geth simulation. The Automation Node checks both the `checkUpkeep` and `performUpkeep` conditions independently using simulation. If both are true (eligible), and the upkeep is funded, the Automation Node proceeds to execute the transaction on-chain.

While only one Automation Node monitors an upkeep at any point during a turn, an upkeep can have multiple on-chain transaction executions per turn. This is accomplished with a buddy-system. After a transaction is confirmed, the next Automation Node in the line monitors the upkeep. After a new transaction is confirmed, the previous Automation Node steps in again to monitor the upkeep until the end of the turn or until another transaction confirmation is complete. This creates a system that is secure and highly available. If a node becomes faulty and executes a transaction that is not eligible, the next node does not execute a transaction, which breaks the process.

Chainlink Automation use the same transaction manager mechanism built and used by Chainlink Data Feeds. This creates a hyper-reliable automation service that can execute and confirm transactions even during intense gas spikes or on chains with significant reorgs. This mechanism has been in use in Chainlink Labs for multiple years, is battle hardened, and the team continuously improves on it.

## Internal monitoring

Internally, Chainlink Automation also uses its own monitoring and alerting mechanisms to maintain a health network and ensure developers get the reliability that they expect.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Automation, please review the [supported networks page](/chainlink-automation/supported-networks). To learn more about the cost of using Chainlink Automation, please review the [Automation economics](/chainlink-automation/automation-economics) page.
