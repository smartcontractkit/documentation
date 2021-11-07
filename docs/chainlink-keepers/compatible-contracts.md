---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Making Keeper-compatible Contracts'
whatsnext:
  {
    'Register for Upkeep': '/docs/chainlink-keepers/register-upkeep/',
  }
---

> ⚠️ Design Patterns and Best Practices
> When creating Keeper-compatible contracts, please refer to [Design Patterns and Best Practices](../best-practices) to understand usage patterns and best practices you can employ within Keeper-compatible smart contracts.

# Overview <!-- omit in toc -->
This guide will explain how to make smart contracts **Keeper-compatible**. You will learn about the `KeeperCompatibleInterface` and its functions. We have provided an example contract for reference. This purpose of this guide is to showcase the convenience Keepers brings to developers. To take full advantage of the Keepers automation infrastructure, we highly recommend reading all documentation and understanding all the features of Chainlink Keepers.

**Table of Contents**

+ [`KeeperCompatibleInterface`](#keepercompatibleinterface)
  + [`checkUpkeep`](#checkupkeep)
  + [`performUpkeep`](#performupkeep)
+ [Example Contract](#example-contract)


# `KeeperCompatibleInterface`

## Functions <!-- omit in toc -->

| Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [checkUpkeep](#checkupkeep)     | Checks if the contract requires work to be done.                     |
| [performUpkeep](#performupkeep) | Performs the work on the contract, if instructed by `checkUpkeep()`. |

## `checkUpkeep`
The Keeper node runs this method as an [`eth_call`](https://eth.wiki/json-rpc/API#eth_call) in order to determine if your contract requires some work to be done. If the off-chain simulation of your `checkUpkeep` confirms your predefined conditions are met, the Keeper will broadcast a transaction to the blockchain executing the `performUpkeep` method described below.

> ⚠️ Note on `checkUpkeep`
> The check that is run is subject to the `checkGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/overview/#configuration).
>
> Since `checkUpkeep` is only ever performed off-chain in simulation, for most cases it is best to treat this as a `view` function and not modify any state.

```solidity
  function checkUpkeep(
    bytes calldata checkData
  )
    external
    returns (
        bool upkeepNeeded,
        bytes memory performData
    );
```

### Parameters

| Name                  | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `checkData`                     | Data passed to the contract when checking for Upkeep. Specified in the Upkeep registration so it is always the same for a registered Upkeep. |
| `performUpkeep`                 | Performs the work on the contract, if instructed by `checkUpkeep()`. |

### Return Values

| Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `upkeepNeeded`     | Indicates whether the Keeper should call `performUpkeep` or not.                    |
| `performData` | Bytes that the Keeper should call `performUpkeep` with, if Upkeep is needed. If you would like to encode data to decode later, try `abi.encode`. |


## `performUpkeep`

When your checkUpkeep returns `upkeepNeeded == true`, the Keeper node broadcasts a transaction to the blockchain to execute your contract code with `performData` as an input.

> ⚠️ Note on `performUpkeep`
> The Upkeep that is performed is subject to the `callGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/overview/#configuration).
>
> Ensure your `performUpkeep` is idempotent. Your `performUpkeep` should change state such that `checkUpkeep` will not return `true` for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible and result in multiple performances by the Keeper Network on the exactly same subset of work.



```solidity
  function performUpkeep(
    bytes calldata performData
  ) external;
```

### Parameters

| Name                  | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `performData`                   | Data which was passed back from the `checkData` simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should always be validated against the contract's current state. |

# Example Contract
The example below represents a simple counter contract. Each time `performUpkeep` is called, it increments its counter by one.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/KeepersCounter.sol" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity
{% include samples/Keepers/KeepersCounter.sol %}
```

> ❗️ **WARNING**
> Do **NOT** attempt to send LINK to your contract as you may with [VRF](../../get-a-random-number/). With Chainlink Keepers, contracts are funded via the registry rather than within your contract.

Once deployed, your contract doesn't automatically begin to receive Upkeep after deployment. It must be registered. See [Register for Upkeep](../register-upkeep/) for next steps.
