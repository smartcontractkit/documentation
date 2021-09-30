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
Chainlink Keepers are a powerful tool for smart contract automation. This guide demonstrates some useful patterns and best practices that you can employ within Keeper-compatible smart contracts.

It is important to understand the gas limits for on-chain execution and off-chain computation when developing your Keeper-compatible smart contract. To learn more about the economics of Chainlink Keepers, read the [Keepers Network Overview](../overview/).

## Functions

If you use `checkData` and `performData`, you create a highly flexible off-chain computation infrastructure that can perform precise actions on-chain. Both of these computations are entirely programmable.

### `checkData`

You can pass information into your `checkUpkeep` function from your [Upkeep Registration](../register-upkeep/) in order to execute different code paths for validation. You can also use the value in your computation to determine if your Keeper conditions have been met.

```solidity Rinkeby
{% include samples/Keepers/checkData.sol %}
```

### `performData`

The response from `checkUpkeep` is passed to the `performUpkeep` function as `performData`. This allows you to perform complex and costly simulations with no gas cost. Then you can identify the subset of actions that you are ready to take based on the conditions that are met.

```solidity Rinkeby
{% include samples/Keepers/performData.sol %}
```

## Modifiers

### `cannotExecute`

In most cases your `checkUpkeep` method should be marked as `view`, but sometimes it might not be possible if you want to use more advanced Solidity features like [`DelegateCall`](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries). It is a best practice to import the [`KeeperBase.sol`](https://github.com/smartcontractkit/keeper/blob/master/contracts/KeeperBase.sol) interface and use the `cannotExecute` modifier to ensure that the method can be used only for simulation purposes. For more information on Chainlink Keepers smart contacts, see the [Keepers Network Overview](../overview/).

## Useful patterns

These patterns are not mutually exclusive. Review and make use of the patterns that make sense for your use case.

### Validation of trigger conditions

Consider validating the conditions that might trigger `performUpkeep` before work is performed.

- **When triggering is not harmful**: Sometimes actions must be performed when conditions are met, but performing actions when conditions are not met is still acceptable. Condition checks within `performUpkeep` might not be required, but it can still be a good practice to short circuit expensive and unnecessary on-chain processing when it is not required.

    Calling `performUpkeep` when the `checkUpkeep` conditions haven't yet been tested by Chainlink Keepers might be desirable in some cases, so any specific checks that you perform are entirely use case specific.

- **Trigger ONLY when conditions are met**: Some actions must be performed only when specific conditions are met. Check all of the preconditions within `performUpkeep` to ensure that state change occurs only when necessary.

    In this pattern, it is undesirable for the state change to occur until the next time the Upkeep is checked by the network and the conditions are met. It is a best practice to stop any state change or effects by performing the same checks or similar checks that you use in `checkUpkeep`. These checks validate the conditions before doing the work.

    **Example**: If you have a contract where you create a timer in `checkUpkeep` that is designed to add to a balance on a weekly basis, validate the condition to ensure third-party calls to your `performUpkeep` method do not transfer funds in a way that you do not intend.

### Perform expensive computation off-chain

You can perform complex and broad off-chain computation, then execute on-chain state changes on a subset that meet your conditions. You can do this by passing the appropriate inputs within `performData` based on the results from your `checkUpkeep`. This pattern can greatly reduce your on-chain gas usage by narrowing the scope of work intelligently in your own Solidity code.

- **Identify a list of addresses that require work**: You might have a number of addresses that you are validating for conditions before your contract takes an action. Doing this on-chain can be expensive. Filter the list of addresses by validating the necessary conditions within your `checkUpkeep` function. Then, pass the addresses that meets the condition through the `performData` function.

  **Example**: If you have a "top up" contract that ensures several hundred account balances never decrease below a threshold, pass the list of accounts that meet the conditions so that the `performUpkeep` function validates and tops up only a small subset of the accounts.

- **Identify the subset of states that must be updated**: If your contract maintains complicated objects such as arrays and structs, or stores a lot of data, you should read through your storage objects within your `checkUpkeep` and run your proprietary logic to determine if they require updates or maintenance. After that is complete, you can pass the known list of objects that require updates through the `performData` function.

> 📘 Important note
>
> The `KeeperRegistry` enforces a cap for gas used both on-chain and off-chain. See the [Keepers Network Overview](../overview/) for details. The caps are configurable and might change based on user feedback. Be sure that you understand these limits if your use case requires a large amount of gas.

### Configure your `checkUpkeep` function

You can pass arbitrary `bytes` through the `checkData` argument as part of your Upkeep registration. You can use `checkData` to pass in a fixed set of inputs into your `checkUpkeep` function, which can be used to modify the behavior of your application within the constraints of your smart contract logic.

- **Manage unbounded upkeeps**: Limit the problem set of your on-chain execution by creating a range bound for your Upkeep to check and perform. This allows you to keep within predefined gas limits, which creates a predictable upper bound gas cost on your transactions. Break apart your problem into multiple Upkeep registrations to limit the scope of work.

  **Example**: You could create an Upkeep for each subset of addresses that you want to service. The ranges could be 0 to 49, 50 to 99, and 100 to 149.

- **Manage code paths**: pass in data to your `checkUpkeep` to make your contract logic go down different code paths. This can be used in creative ways based on your use case needs.

  **Example**: You could support multiple types of Upkeep within a single contract, and pass a function selector through the `checkData` function.

## Gas limits

When developing your keeper-compatible smart contracts, it is critical to understand the gas limits you are working with on the KeeperRegistry. There is a `check` gas limit and a `call` gas limit that your contract must adhere to in order to operate successfully. See the [Keepers Network Overview](../overview/) to learn the current configuration.

## Testing

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keeper-compatible contract operates within the parameters of the `KeeperRegistry`.

Test all of your mission-critical contracts, and stress-test the contract to confirm the performance and correct operation of your use case under load and adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. [Reach out](https://forms.gle/WadxnzzjHPtta5Zd9) to us if you need help, have questions, or feedback for improvement.
