---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Creating Keepers-compatible contracts'
whatsnext:
  {

    'Build flexible contracts': '/docs/chainlink-keepers/flexible-upkeeps/', 'Manage your Upkeeps': '/docs/chainlink-keepers/manage-upkeeps/',
  }
---

Use custom logic to allow Keepers to determine when to execute your smart contract functions.

## Overview

Learn how to make smart contracts **Keepers-compatible** with the `KeeperCompatibleInterface` and its functions.

**Topics**
+ [Example Contract](#example-contract)
+ [Functions](#functions)
  + [`checkUpkeep` function](#checkupkeep-function)
    + [`checkData`](#checkdata)
    + [`performData`](#performdata)
  + [`performUpkeep` function](#performupkeep-function)
    + [`performData`](#performdata-1)
+ [Best practices](#best-practices)
  + [Revalidate `performUpkeep`](#revalidate-performupkeep)
  + [Test your contract](#test-your-contract)


## Example Contract

Keepers-compatible contracts must meet the following requirements:

* Import `KeepersCompatible.sol`. You can refer to the [Chainlink Contracts](https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src) on GitHub to find the latest version.
* Use the `KeepersCompatibleInterface` from the library to ensure your `checkUpkeep` and `performUpkeep`function definitions match the definitions expected by the Keepers Network.
* Include a `checkUpkeep` function that contains the logic that will be executed off-chain to see if `performUpkeep` should be executed. `checkUpkeep` can use on-chain data and a specified `checkData` parameter to perform complex calculations off-chain and then send the result to `performUpkeep` as `performData`.
* Include a `performUpkeep` function that will be executed on-chain when `checkUpkeep` returns `true`. Because `performUpkeep` is external, users are advised to revalidate conditions and performData.

Use these elements to create a Keepers-compatible contract that will automatically increment a counter after every `updateInterval` seconds. After you register the contract as an upkeep, the Keepers Network simulates our `checkUpkeep` off-chain during every block to determine if the `updateInterval` time has passed since the last increment (timestamp). When `checkUpkeep` returns true, the Keepers Network calls `performUpkeep` on-chain and increments the counter. This cycle repeats until the upkeep is cancelled or runs out of funding.


```solidity
{% include 'samples/Keepers/KeepersCounter.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/KeepersCounter.sol" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" > What is Remix?</a>
</div>

Compile and deploy your own Keepers Counter onto a [supported Testnet](../supported-networks).

1. In the Remix example, select the compile tab on the left and press the compile button. Make sure that your contract compiles without any errors. Note that the Warning messages in this example are acceptable and will not block the deployment.
1. Select the **Deploy** tab and deploy the `Counter` smart contract in the `injected web3` environment. When deploying the contract, specify the `updateInterval` value. For this example, set a short interval of 60. This is the interval at which the `performUpkeep` function will be called.
1. After deployment is complete, copy the address of the deployed contract. This address is required to register your upkeep.

To see more complex examples, go to the [utility contracts](../utility-contracts) page.

We will now look at each function in a Keepers-compatible contract in detail.


## Functions

| Function Name                   | Description                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| [checkUpkeep](#checkupkeep-function)     | Runs off-chain at every block to determine if the `performUpkeep` function should be called on-chain.                     |
| [performUpkeep](#performupkeep-function) | Contains the logic that should be executed on-chain when `checkUpkeep` returns true. |

### `checkUpkeep` function

This function contains the logic that runs off-chain during every block as an `eth_call`[(link)](https://eth.wiki/json-rpc/API#eth_call) to determine if `performUpkeep` should be executed on-chain. To reduce on-chain gas usage, attempt to do your gas intensive calculations off-chain in `checkUpkeep` and pass the result to `performUpkeep` on-chain.

> 📘 Gas limits for `checkUpkeep`
>
> The `checkUpkeep` function is subject to the `checkGasLimit` in the [registry configuration](/docs/chainlink-keepers/supported-networks/#configurations).

Because `checkUpkeep` is only off-chain in simulation it is best to treat this as a `view` function and not modify any state. This might not always be possible if you want to use more advanced Solidity features like `DelegateCall`[(link)](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries). It is a best practice to import the `KeeperCompatible.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/KeeperCompatible.sol) contract and use the `cannotExecute` modifier to ensure that the method can be used only for simulation purposes.

```solidity
function checkUpkeep(
  bytes calldata checkData
)
  external
  view
  override
  returns (
    bool upkeepNeeded,
    bytes memory performData
  );
```

Below are the parameters and return values of the `checkUpkeep` function. Click each value to learn more about its design patterns and best practices:

**Parameters:**

- [`checkData`](#checkdata): Fixed and specified at upkeep registration and used in every `checkUpkeep`. Can be empty (0x).

**Return Values:**

- `upkeepNeeded`: Boolean that when True will trigger the on-chain `performUpkeep` call.
- [`performData`](#performdata): Bytes that will be used as input parameter when calling `performUpkeep`. If you would like to encode data to decode later, try `abi.encode`.

#### `checkData`

You can pass information into your `checkUpkeep` function from your [upkeep registration](../register-upkeep/) to execute different code paths. For example, to check the balance on an specific address, set the `checkData` to abi encode of the address. To learn how to create flexible upkeeps with checkData, please see out [flexible upkeeps](../flexible-upkeeps/) page.

```solidity Rinkeby
{% include 'snippets/Keepers/checkData.sol' %}
```

Tips on using `checkData`:

- **Managing unbounded upkeeps**: Limit the problem set of your on-chain execution by creating a range bound for your upkeep to check and perform. This allows you to keep within predefined gas limits, which creates a predictable upper bound gas cost on your transactions. Break apart your problem into multiple upkeep registrations to limit the scope of work.

  **Example**: You could create an upkeep for each subset of addresses that you want to service. The ranges could be 0 to 49, 50 to 99, and 100 to 149.

- **Managing code paths**: Pass in data to your `checkUpkeep` to make your contract logic go down different code paths. This can be used in creative ways based on your use case needs.

  **Example**: You could support multiple types of upkeep within a single contract and pass a function selector through the `checkData` function.

#### `performData`

The response from `checkUpkeep` is passed to the `performUpkeep` function as `performData`. This allows you to perform complex and gas intensive calculations as a simulation off-chain and only pass the needed data on-chain.

You can create a highly flexible off-chain computation infrastructure that can perform precise actions on-chain by using `checkData` and `performData`. Both of these computations are entirely programmable.

### `performUpkeep` function

When `checkUpkeep` returns `upkeepNeeded == true`, the Keeper node broadcasts a transaction to the blockchain to execute your `performUpkeep` function on-chain with `performData` as an input.

> 📘 Gas limits for `performUpkeep`
>
> During registration you have to specify the maximum gas limit that we should allow your contract to use. We simulate `performUpkeep` during `checkUpkeep` and if the gas exceeds this limit the function will not execute on-chain. One method to determine your upkeep's gas limit is to simulate the `performUpkeep` function and add enough overhead to take into account increases that might happen due to changes in `performData` or on-chain data. The gas limit you specify cannot exceed the `callGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/supported-networks/#configurations).

Ensure that your `performUpkeep` is *idempotent*. Your `performUpkeep` function should change state such that `checkUpkeep` will not return `true` for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible and result in multiple performances by the Keeper Network on the exactly same subset of work. As a best practice, always [revalidate](#revalidate-performupkeep) conditions for your upkeep at the start of your `performUpkeep` function.

```solidity
function performUpkeep(
  bytes calldata performData
) external override;
```

**Parameters:**

- [`performData`](#performdata-1): Data which was passed back from the `checkData` simulation. If it is encoded, it can easily be decoded into other types by calling `abi.decode`. This data should always be validated against the contract's current state.

#### `performData`

You can perform complex and broad off-chain computation, then execute on-chain state changes on a subset that meet your conditions. This can be done by passing the appropriate inputs within `performData` based on the results from your `checkUpkeep`. This pattern can greatly reduce your on-chain gas usage by narrowing the scope of work intelligently in your own Solidity code.

- **Identify a list of addresses that require work**: You might have a number of addresses that you are validating for conditions before your contract takes an action. Doing this on-chain can be expensive. Filter the list of addresses by validating the necessary conditions within your `checkUpkeep` function. Then, pass the addresses that meets the condition through the `performData` function.

  For example, if you have a "top up" contract that ensures several hundred account balances never decrease below a threshold, pass the list of accounts that meet the conditions so that the `performUpkeep` function validates and tops up only a small subset of the accounts.

- **Identify the subset of states that must be updated**: If your contract maintains complicated objects such as arrays and structs, or stores a lot of data, you should read through your storage objects within your `checkUpkeep` and run your proprietary logic to determine if they require updates or maintenance. After that is complete, you can pass the known list of objects that require updates through the `performData` function.


## Best practices

### Revalidate `performUpkeep`

We recommend that you revalidate the conditions and data in `performUpkeep` before work is performed. By default the `performUpkeep` is `external` and thus any party can call it, so revalidation is recommended. If you send data from your `checkUpkeep` to your `performUpkeep` and this data drives a critical function, please ensure you put adequate checks in place.

### Perform ONLY when conditions are met

Some actions must be performed only when specific conditions are met. Check all of the preconditions within `performUpkeep` to ensure that state change occurs only when necessary.

In this pattern, it is undesirable for the state change to occur until the next time the Upkeep is checked by the network and the conditions are met. It is a best practice to stop any state change or effects by performing the same checks or similar checks that you use in `checkUpkeep`. These checks validate the conditions before doing the work.

For example, if you have a contract where you create a timer in `checkUpkeep` that is designed to start a game at a specific time, validate the condition to ensure third-party calls to your `performUpkeep` function do not start the game at a different time.

### Perform ONLY when data is verified

Some actions must be performed using data you intend to use. Revalidate that the `performData` is allowed before execution.

For example, if you have a `performUpkeep` that funds a wallet and the address of the wallet is received via the `performData` parameter, ensure you have a list of permissable addresses to compare against to prevent third-party calling your function to send money to their address.

### When performing is not harmful

Sometimes actions must be performed when conditions are met, but performing actions when conditions are not met is still acceptable. Condition checks within `performUpkeep` might not be required, but it can still be a good practice to short circuit expensive and unnecessary on-chain processing when it is not required.

It might be desirable to call `performUpkeep` when the `checkUpkeep` conditions haven't yet been tested by Chainlink Keepers, so any specific checks that you perform are entirely use case specific.

### Test your contract

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keepers-compatible contract operates within the parameters of the `KeeperRegistry`.

Test all of your mission-critical contracts, and stress-test the contract to confirm the performance and correct operation of your use case under load and adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. For a list of supported Testnet blockchains, please review the [supported networks page](../supported-networks).
