---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Making Keeper Compatible Contracts'
whatsnext:
  {
    'Register for Upkeep': '/docs/chainlink-keepers/register-upkeep/',
  }
---
Lets walk through how to make your contract keeper-compatible. While this will get you up and running quickly and showcase how easy it is to use, we highly recommend taking the time to fully understand and become a proficient user of Chainlink Keepers. We want you to take full advantage of the automation infrastructure we’ve built.

1. [The Interface](#keepercompatibleinterface)
1. [Example Contract](#example-contract)


# `KeeperCompatibleInterface`

## Functions

| Name                            | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [checkUpkeep](#checkupkeep)     | Checks if the contract requires work to be done.                     |
| [performUpkeep](#performupkeep) | Performs the work on the contract, if instructed by `checkUpkeep()`. |

### `checkUpkeep`
The Keeper node runs this method as an [`eth_call`](https://eth.wiki/json-rpc/API#eth_call) in order to determine if your contract requires some work to be done. If the off-chain simulation of your `checkUpkeep` confirms your predefined conditions are met, the Keeper will broadcast a transaction to the blockchain executing the `performUpkeep` method described below.

> ⚠️ Important Note
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

#### Parameters

- `checkData`: Data passed to the contract when checking for Upkeep. Specified in the Upkeep registration so it is always the same for a registered Upkeep.

#### Return Values

- `upkeepNeeded`: Indicates whether the Keeper should call `performUpkeep` or not.
- `performData`: Bytes that the Keeper should call `performUpkeep` with, if Upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.

### `performUpkeep`

When your checkUpkeep returns `upkeepNeeded == true`, the Keeper node broadcasts a transaction to the blockchain to execute your contract code with `performData` as an input.

> ⚠️ Important note
> The Upkeep that is performed is subject to the `callGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/overview/#configuration).
>
> Ensure your `performUpkeep` is idempotent. Your `performUpkeep` should change state such that `checkUpkeep` will not return `true` for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible and result in multiple performances by the Keeper Network on the exactly same subset of work.



```solidity
  function performUpkeep(
    bytes calldata performData
  ) external;
```

#### Parameters

- `performData`: Data which was passed back from the `checkData` simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should always be validated against the contract's current state.

# Example Contract
The example below represents a simple counter contract. Each time `performUpkeep` is called, it increments its counter by one.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/KeepersCounter.sol" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity
{% include samples/Keepers/KeepersCounter.sol %}
```

> ❗️ WARNING
> DO NOT attempt to send LINK to your contract like you may be used to with [VRF](../../get-a-random-number/). With Chainlink Keepers, contracts are funded via the registry rather than within your contract

Once deployed, your contract doesn't automatically start to receive Upkeep after deployment, it must be registered. See [Register for Upkeep](../register-upkeep/) for more details.
