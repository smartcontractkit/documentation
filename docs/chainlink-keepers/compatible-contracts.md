---
layout: nodes.liquid
section: ethereumKeepers
date: Last Modified
title: 'Making Keeper-compatible Contracts'
whatsnext:
  {
    'Register for Upkeep': '/docs/chainlink-keepers/register-upkeep/',
  }
---

# Overview
This guide explains how to make smart contracts **Keeper-compatible**. You will learn about the `KeeperCompatibleInterface` and its functions with an example contract. The guide showcases the convenience that Keepers provide to developers. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

**Table of Contents**


+ [Functions](#functions)
  + [`checkUpkeep` Function](#checkupkeep-function)
    + [`checkData`](#checkdata)
    + [`performUpkeep`](#performupkeep)
    + [`performData`](#performdata)
    + [`cannotExecute`](#cannotexecute)
  + [`performUpkeep` Function](#performupkeep-function)
    + [`performData`](#performdata-1)
+ [Example Contract](#example-contract)


# Functions

| Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [checkUpkeep](#checkupkeep-function)     | Checks if the contract requires work to be done.                     |
| [performUpkeep](#performupkeep-function) | Performs the work on the contract, if instructed by `checkUpkeep()`. |

## `checkUpkeep` Function
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
<br>
Below are the parameters and return values of the `checkUpkeep` function. Click each value to learn more about its design patterns and best practices:

### Parameters

| Name                  | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [`checkData`](#checkdata)                     | Data passed to the contract when checking for Upkeep. Specified in the Upkeep registration so it is always the same for a registered Upkeep. |
| [`performUpkeep`](#performupkeep)                 | Performs the work on the contract, if instructed by `checkUpkeep()`. |

### Return Values

| Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [`upkeepNeeded`](#performupkeep)     | Indicates whether the Keeper should call `performUpkeep` or not.                    |
| [`performData`](#performdata) | Bytes that the Keeper should call `performUpkeep` with, if Upkeep is needed. If you would like to encode data to decode later, try `abi.encode`. |
<p>
</p>
If you use `checkData` and `performData`, you create a highly flexible off-chain computation infrastructure that can perform precise actions on-chain. Both of these computations are entirely programmable.

### `checkData`

You can pass information into your `checkUpkeep` function from your [Upkeep Registration](../register-upkeep/) to execute different code paths for validation. You can also use the value in your computation to determine if your Keeper conditions have been met.

```solidity Rinkeby
{% include snippets/Keepers/checkData.sol %}
```

You can also pass arbitrary `bytes` through the `checkData` argument as part of your Upkeep registration. You can use `checkData` to pass in a fixed set of inputs into your `checkUpkeep` function, which can be used to modify the behavior of your application within the constraints of your smart contract logic such as:

- **Managing unbounded upkeeps**: Limit the problem set of your on-chain execution by creating a range bound for your Upkeep to check and perform. This allows you to keep within predefined gas limits, which creates a predictable upper bound gas cost on your transactions. Break apart your problem into multiple Upkeep registrations to limit the scope of work.

  **Example**: You could create an Upkeep for each subset of addresses that you want to service. The ranges could be 0 to 49, 50 to 99, and 100 to 149.

- **Managing code paths**: Pass in data to your `checkUpkeep` to make your contract logic go down different code paths. This can be used in creative ways based on your use case needs.

  **Example**: You could support multiple types of Upkeep within a single contract and pass a function selector through the `checkData` function.

### `performUpkeep`

Consider validating the conditions that might trigger `performUpkeep` before work is performed:

- **When triggering is not harmful**: Sometimes actions must be performed when conditions are met, but performing actions when conditions are not met is still acceptable. Condition checks within `performUpkeep` might not be required, but it can still be a good practice to short circuit expensive and unnecessary on-chain processing when it is not required.

    It might be desirable to call `performUpkeep` when the `checkUpkeep` conditions haven't yet been tested by Chainlink Keepers, so any specific checks that you perform are entirely use case specific.

- **Trigger ONLY when conditions are met**: Some actions must be performed only when specific conditions are met. Check all of the preconditions within `performUpkeep` to ensure that state change occurs only when necessary.

    In this pattern, it is undesirable for the state change to occur until the next time the Upkeep is checked by the network and the conditions are met. It is a best practice to stop any state change or effects by performing the same checks or similar checks that you use in `checkUpkeep`. These checks validate the conditions before doing the work.

    **Example**: If you have a contract where you create a timer in `checkUpkeep` that is designed to add to a balance on a weekly basis, validate the condition to ensure third-party calls to your `performUpkeep` method do not transfer funds in a way that you do not intend.

### `performData`

The response from `checkUpkeep` is passed to the `performUpkeep` function as `performData`. This allows you to perform complex and costly simulations with no gas cost. Then you can identify the subset of actions that you are ready to take based on the conditions that are met.

```solidity Rinkeby
{% include snippets/Keepers/performData.sol %}
```

### `cannotExecute`

In most cases your `checkUpkeep` method should be marked as `view`. This might not always be possible if you want to use more advanced Solidity features like [`DelegateCall`](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries). It is a best practice to import the [`KeeperBase.sol`](https://github.com/smartcontractkit/keeper/blob/master/contracts/KeeperBase.sol) interface and use the `cannotExecute` modifier to ensure that the method can be used only for simulation purposes. For more information on Chainlink Keepers smart contacts, see the [Network Overview](../overview/).

## `performUpkeep` Function

When your checkUpkeep returns `upkeepNeeded == true`, the Keeper node broadcasts a transaction to the blockchain to execute your contract code with `performData` as an input.

> ⚠️ Note on `performUpkeep`
> The Upkeep that is performed is subject to the `callGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/overview/#configuration).
>
> Ensure your `performUpkeep` is *idempotent*. Your `performUpkeep` should change state such that `checkUpkeep` will not return `true` for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible and result in multiple performances by the Keeper Network on the exactly same subset of work.

```solidity
function performUpkeep(
  bytes calldata performData
) external;
```

### Parameters

Below is the parameter of the `performUpkeep` function. Click the value to learn more about its design patterns and best practices:

| Name                  | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [`performData`](#performdata-1)                   | Data which was passed back from the `checkData` simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should always be validated against the contract's current state. |

### `performData`

You can perform complex and broad off-chain computation, then execute on-chain state changes on a subset that meet your conditions. This can be done by passing the appropriate inputs within `performData` based on the results from your `checkUpkeep`. This pattern can greatly reduce your on-chain gas usage by narrowing the scope of work intelligently in your own Solidity code.

- **Identify a list of addresses that require work**: You might have a number of addresses that you are validating for conditions before your contract takes an action. Doing this on-chain can be expensive. Filter the list of addresses by validating the necessary conditions within your `checkUpkeep` function. Then, pass the addresses that meets the condition through the `performData` function.

  **Example**: If you have a "top up" contract that ensures several hundred account balances never decrease below a threshold, pass the list of accounts that meet the conditions so that the `performUpkeep` function validates and tops up only a small subset of the accounts.

- **Identify the subset of states that must be updated**: If your contract maintains complicated objects such as arrays and structs, or stores a lot of data, you should read through your storage objects within your `checkUpkeep` and run your proprietary logic to determine if they require updates or maintenance. After that is complete, you can pass the known list of objects that require updates through the `performData` function.

## Example Contract
The example below represents a simple counter contract. Each time `performUpkeep` is called, it increments its counter by one.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/KeepersCounter.sol" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity
{% include samples/Keepers/KeepersCounter.sol %}
```

> ❗️ **WARNING**
> Do **NOT** attempt to send LINK to your contract like you do with [VRF](../../get-a-random-number/). For Chainlink Keepers, contracts are funded via the registry rather than within your contract.

After you deploy your contract, it does not automatically begin to receive Upkeep. You must register the contract. See [Register for Upkeep](../register-upkeep/) for next steps.
