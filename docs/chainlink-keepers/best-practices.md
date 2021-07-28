---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Design Patterns and Best Practices'
whatsnext:
  {
    'Network Overview': '/docs/chainlink-keepers/overview/',
  }
---

{% include keepers-beta %}

Chainlink Keepers are a powerful tool for smart contract automation. These are some useful patterns and best practices that you can employ within your Keeper-compatible smart contract.

It is important to understand the gas limits for on-chain execution and off-chain computation when developing your Keeper-compatible smart contract - you can review that in [How Chainlink Keepers Work](../overview/).

## Use `checkData` and `performData` arguments

### `checkData`

You can pass information into your `checkUpkeep` from your Upkeep Registration in order to execute different code paths for validation, or use the value in your computation to determine if your conditions have been met.

<!-- @TODO Insert example of using the checkdata -->

### `performData`

The response from `checkUpkeep` gets passed as `performData` to `performUpkeep`. This allows you to perform complex and costly simulations with no gas cost, then identifying the subset of actions you’re ready to take based on the conditions met.

With these two inputs, you have a highly flexible off-chain computation infrastructure that can perform precise actions on-chain, both of which are entirely programmable.

<!-- @TODO Insert example of using performData -->

## Modifiers

### `cannotExecute`

In most cases your `checkUpkeep` method should be marked as `view`, but sometimes it might not be possible if you want to use more advanced Solidity features like [`DelegateCall`](https://docs.soliditylang.org/en/v0.8.6/introduction-to-smart-contracts.html?highlight=DelegateCall#delegatecall-callcode-and-libraries). It is therefore advisable to import the [`KeeperBase.sol`](https://github.com/smartcontractkit/keeper/blob/master/contracts/KeeperBase.sol) interface and use the `cannotExecute` modifier instead to ensure that it can only be used for simulation purposes. See [How Chainlink Keepers Work](../overview/) page for more information on Chainlink Keepers smart contacts.

## Patterns to consider

These patterns are not mutually exclusive. Review and make use of the patterns that make sense for your use case.

### Validation of trigger conditions

You should consider validating the conditions that may have triggered `performUpkeep` before work is performed.

- **When triggering is not harmful** - Sometimes actions must be performed when conditions are met, but performing actions when conditions are not met is still acceptable. Condition checks within `performUpkeep` may not be required, though it may still be good practice to short circuit expensive and unnecessary on-chain processing if it is not required.

  Calling `performUpkeep` when the `checkUpkeep` conditions haven't yet been tested by Chainlink Keepers may be desirable in some cases and therefore any specific checks performed are entirely use case specific.

- ** Trigger ONLY when conditions are met** - when actions must be performed when and **ONLY when** conditions are met. You should check all preconditions within `performUpkeep` to ensure state change only occurs when necessary.

  In this pattern, it is undesirable for the state change to occur until the next time the Upkeep is checked by the network and the conditions are met. It is therefore prudent to stop any state change or effects by performing the same, or similar, checks as in `checkUpkeep` to validate the conditions before doing work.

  **Example**: Imagine a contract where you create a timer in `checkUpkeep` designed to add to a balance on a weekly basis. You should validate the condition to ensure 3rd party calls to your `performUpkeep` method do not transfer funds in a way that you do not intend.

### Perform expensive computation off-chain

You can perform complex and broad off-chain computation, then execute on-chain state changes on a subset that meet your conditions. This is done by passing in the appropriate inputs within `performData` based on the results from your `checkUpkeep`. This pattern can greatly reduce the amount of on-chain gas usage by narrowing the scope of work intelligently using your own Solidity code.

- **Identify a list of addresses that require work** - You may have a number of addresses that you are validating for conditions before taking action. Doing this on-chain can be expensive. Filter the list of addresses to take action on by validating the necessary conditions within your `checkUpkeep`, then pass the addresses that meet said condition via `performData`.

  Example: Imagine a 'top up' contract that ensures several hundred account balances never decrease below a threshold. You should pass the list of accounts that meet the condition so that the `performUpkeep` function only attempts to validate and top up a small subset of the accounts.

- **Identify the subset of states that must be updated** - If you are maintaining complicated objects (arrays, structs), or storage a lot of data, you should read through your storage objects within your `checkUpkeep` and run your proprietary logic to determine if they require update/maintenance. Once that is complete, you can pass the known list of objects that require updates via `performData`.

> 📘 Important note
> The `KeeperRegistry` enforces a cap on gas used on-chain **and off-chain**, review [How Chainlink Keepers Work](../overview/) for details. These are configurable and may change based on user feedback. Be sure to understand these limits if your use case requires a large amount of gas.

### Configure your checkUpkeep

You can pass arbitrary `bytes` via the `checkData` argument as part of your Upkeep registration. You can use `checkData` to pass in a fixed set of inputs into your `checkUpkeep` which can be used to modify the behavior of your application within the constraints of your smart contract logic.

- **Manage unbounded upkeeps** - limit the problem set of your on-chain execution by creating a range bound for your Upkeep to check and perform. This allows you to keep within predefined gas limits, resulting in a predictable upper bound gas cost on your transactions. Break apart your problem into multiple Upkeep registrations to limit the scope of work.

  For example, create an Upkeep for each subset of addresses to be serviced - from 0 to 49, 50 to 99, 100 to 149.

- **Manage code paths** - pass in data to your `checkUpkeep` to make your contract logic go down different code paths. This can be used in creative ways based on your use case needs.

  For example, you could support multiple types of Upkeep within a single contract, and pass a function selector via your `checkData`.

## Testing

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keeper-compatible contract operates within the parameters of the `KeeperRegistry`.

Your mission critical contracts should have all code paths tested and you should stress-test your contract to confirm the performance and correct operation of your use case under load or adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. [Reach out](https://forms.gle/WadxnzzjHPtta5Zd9) to us if you need any help, have questions, or feedback for improvement.

## Gas Limits

When developing your keeper-compatible smart contracts, it is critical to understand the gas limits you are working with on the KeeperRegistry. There is a `check` gas limit and a `call` gas limit that your contract must adhere to in order to operate successfully. See [How Chainlink Keepers Work](../overview/) page for the current configuration.
