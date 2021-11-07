---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Keeper Utility Contracts'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

# Overview <!-- omit in toc -->
This guide explains the usages of Keeper utility contracts, specifically the [`EthBalanceMonitor` contract](https://github.com/smartcontractkit/upkeep-contracts/blob/master/contracts/upkeeps/EthBalanceMonitor.sol). This Keeper contract monitors and funds Ethereum addresses that developers may need to top up frequently based on a configurable threshold. As a result, nodes are funded automatically. 
<p>
</p>
Once the contract is deployed, developers can go to [keepers.chain.link](https://keepers.chain.link/) to register Upkeep and run the contract. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.
<p>
</p>

**Table of Contents**
+ [`EthBalanceMonitor` Overview](#ethbalancemonitor-overview)
+ [Functions](#functions)
  + [`setWatchList` Function](#setwatchlist-function)
  + [`setKeeperRegistryAddress` Function](#setkeeperregistryaddress-function)
  + [`setMinWaitPeriodSeconds` Function](#setminwaitperiodseconds-function)
  + [`topUp` Function](#topup-function)

# `EthBalanceMonitor` Overview
`EthBalanceMonitor` is Ownable, Pausable, and Keeper-compatible. Each of these components are explained in more detail:

- **Ownable**: The contract has an owner address, and provides basic authorization control functions. This simplifies the implementation of "user permissions" and allows for transer of ownership. 
- **Pausable**: This feature allows the contract to implement an pause/unpause mechanism that can be triggered by the owner.
- **Keeper-compatible**: The `KeeperCompatibleInterface` is necessary to create Keeper-compatible contracts. To learn more about the `KeeperCompatibleInterface` and its uses and functions, refer to [Making Keeper-compatible Contracts](../compatible-contracts/).

> ⚠️ Note on Owner Settings
> Aside from certain features listed below, only owners can withdraw funds and pause/unpause the contract. If the contract is paused/unpaused, it will affect `checkUpkeep`, `performUpkeep`, and `topUp` functions.

# Functions
Functions denoted with an asterisk (*) denote featuress that only the owner can change. Click on each function to learn more about its parameters and design patterns:

| Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
|  [`setWatchList`*](#setwatchlist-function)   | Addresses to watch minimum balance and how much to top it up.                     |
|  [`setKeeperRegistryAddress`*](#setkeeperregistryaddress-function) | Updates the `KeeperRegistry` address. |
|  [`setMinWaitPeriodSeconds`*](#setminwaitperiodseconds-function)    | Updates the global minimum period between top ups. |
|  [`topUp`](#topup-function)   | Used by `performUpkeep`. This function will only trigger top up if conditions are met.  |

<p>
</p>

Below are the fead functions in `EthBalanceMonitor` :
<p>
</p>

| Read Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
|  `getUnderfundedAddresses`    | View function used in `checkUpkeep` to find underfunded balances.                    |
|  `getKeeperRegistryAddress` | Views the `KeeperRegistry` address. |
|  `getMinWaitPeriodSeconds`    | Views the global minimum period between top ups. |
|  `getWatchList`    | Views addresses to watch minimum balance and how much to top it up.  |
|  `getAccountInfo`    | Provides information about the specific target address, including the last time it was topped up. This function is *external only*.  |

## `setWatchList` Function

### Parameters <!-- omit in toc -->
| Name                            | Description                                                  | Suggested Setting              |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `addresses`                    | The list of addresses to watch | (not applicable) |
| `minBalancesWei`                 | The minimum balances for each address | 5000000000000000000 (5 ETH)|
| `topUpAmountsWei`                 | The amount to top up each address | 5000000000000000000 (5 ETH)|

<p>
</p>

Only the owner can `setWatchList`. Each of the parameters should be set with distinct requirements for each address.

## `setKeeperRegistryAddress` Function

### Parameters <!-- omit in toc -->
| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `keeperRegistryAddress`         | Address that requires updating in `KeeperRegistry`                   |

<p>
</p>

Only the `keeperRegistryAddress` can `performUpkeep`; this is a *global setting*. `KeeperRegistry` addresses can be found [here](https://keepers.chain.link/). However, only the owner can set a new `KeeperRegistry` after deployment.

## `setMinWaitPeriodSeconds` Function

### Parameters <!-- omit in toc -->
| Name                            | Description                                                  | Suggested Setting              |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `period`                        | Minimum wait period (in seconds) for addresses between funding |  3600 (1 hour)               |

<p>
</p>

`period` denotes the length of time between top ups for a specific address. This is a *global setting* which prevents draining of funds from the contract if the private key for an address is compromised or in gas spike situations. However, only the owner can set a different minimum wait period after deployment.

## `topUp` Function

### Parameters <!-- omit in toc -->
| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `needsFunding`                  | List of addresses to fund (addresses must be pre-approved)           |

<p>
</p>

Any address can trigger the `topUp` function; this is an intentional design pattern we've used to showcase how easy it is to make an existing contract keeper-compatible while maintaining an open interface. All validations are performed before the funding is triggered, so any attempt to top up when conditions are not met will revert.