---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'EthBalanceMonitor Contract'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

This guide explains the use case for the [`EthBalanceMonitor` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/upkeeps/EthBalanceMonitor.sol). This Keeper contract monitors and funds Ethereum addresses that developers might need to top up frequently based on a configurable threshold. As a result, nodes are funded automatically.

After deploying the contract, developers can go to [keepers.chain.link](https://keepers.chain.link/) to register Upkeep and run the contract. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To find other example contracts, see the [Example Keepers Contracts](/docs/chainlink-keepers/util-overview/) page.

**Topics**

+ [`EthBalanceMonitor` Properties](#ethbalancemonitor-properties)
+ [Functions](#functions)
  + [`setWatchList` Function](#setwatchlist-function)
  + [`setKeeperRegistryAddress` Function](#setkeeperregistryaddress-function)
  + [`setMinWaitPeriodSeconds` Function](#setminwaitperiodseconds-function)
  + [`topUp` Function](#topup-function)

## `EthBalanceMonitor` Properties

`EthBalanceMonitor` is ownable, pausable, and Keepers-compatible:

- **Ownable**: The contract has an owner address, and provides basic authorization control functions. This simplifies the implementation of *user permissions* and allows for transer of ownership.
- **Pausable**: This feature allows the contract to implement a pause and unpause mechanism that the contract owner can trigger.
- **Keepers-compatible**: The `KeeperCompatibleInterface` is necessary to create Keepers-compatible contracts. To learn more about the `KeeperCompatibleInterface` and its uses and functions, refer to [Making Keepers-compatible Contracts](../compatible-contracts/).

You can open the contract in Remix:
<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/EthBalanceMonitor.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

> 🚧 Note on Owner Settings
>
> Aside from certain features listed below, only owners can withdraw funds and pause or unpause the contract. If the contract is paused or unpaused, it will affect `checkUpkeep`, `performUpkeep`, and `topUp` functions.

## Functions

Functions with an asterisk (`*`) denote features that only the owner can change. Click on each function to learn more about its parameters and design patterns:

| Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
|  [`setWatchList`*](#setwatchlist-function)   | Addresses to watch minimum balance and how much to top it up.                     |
|  [`setKeeperRegistryAddress`*](#setkeeperregistryaddress-function) | Updates the `KeeperRegistry` address. |
|  [`setMinWaitPeriodSeconds`*](#setminwaitperiodseconds-function)    | Updates the global minimum period between top ups. |
|  [`topUp`](#topup-function)   | Used by `performUpkeep`. This function will only trigger top up if conditions are met.  |

Below are the feed functions in `EthBalanceMonitor`:

| Read Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
|  `getUnderfundedAddresses`    | View function used in `checkUpkeep` to find underfunded balances.                    |
|  `getKeeperRegistryAddress` | Views the `KeeperRegistry` address. |
|  `getMinWaitPeriodSeconds`    | Views the global minimum period between top ups. |
|  `getWatchList`    | Views addresses to watch minimum balance and how much to top it up.  |
|  `getAccountInfo`    | Provides information about the specific target address, including the last time it was topped up. This function is *external only*.  |

### `setWatchList` Function

#### Parameters

| Name                            | Description                                                  | Suggested Setting              |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `addresses`                    | The list of addresses to watch | (not applicable) |
| `minBalancesWei`                 | The minimum balances for each address | 5000000000000000000 (5 ETH)|
| `topUpAmountsWei`                 | The amount to top up each address | 5000000000000000000 (5 ETH)|

Only the owner can `setWatchList`. Each of the parameters should be set with distinct requirements for each address.

### `setKeeperRegistryAddress` Function

#### Parameters

| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `keeperRegistryAddress`         | Address that requires updating in `KeeperRegistry`                   |

Only the `keeperRegistryAddress` can `performUpkeep`, which is a *global setting*. `KeeperRegistry` addresses can be found on the [Keepers app](https://keepers.chain.link/). However, only the owner can set a new `KeeperRegistry` after deployment.

### `setMinWaitPeriodSeconds` Function

#### Parameters

| Name                            | Description                                                  | Suggested Setting              |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `period`                        | Minimum wait period (in seconds) for addresses between funding |  3600 (1 hour)               |

`period` denotes the length of time between top ups for a specific address. This is a *global setting* that prevents draining of funds from the contract if the private key for an address is compromised or if a gas spike occurs. However, only the owner can set a different minimum wait period after deployment.

### `topUp` Function

#### Parameters

| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `needsFunding`                  | List of addresses to fund (addresses must be pre-approved)           |

Any address can trigger the `topUp` function. This is an intentional design pattern that shows how easy it is to make an existing contract Keepers-compatible while maintaining an open interface. All validations are performed before the funding is triggered. If the conditions are not met, any attempt to top up will revert.
