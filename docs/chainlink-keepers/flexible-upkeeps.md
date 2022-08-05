---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Making flexible, secure, and low-cost contracts'
whatsnext: { 'Example Contracts': '/docs/chainlink-keepers/util-overview/', 'FAQs': '/docs/chainlink-keepers/faqs/' }
---

In this guide, you will learn how the flexibility of [Chainlink Keepers](https://chain.link/keepers) enables important design patterns that reduce gas fees, enhance the resilience of dApps, and improve end-user experience. Smart contracts themselves cannot self-trigger their functions at arbitrary times or under arbitrary conditions. Transactions can only be initiated by another account.

Start by integrating an example contract to Chainlink Keepers that has not yet been optimized. Then, deploy a comparison contract that shows you how to properly use the flexibility of Chainlink Keepers to perform complex computations without paying high gas fees.

**Topics**

- [Prerequisites](#prerequisites)
- [Problem: On-chain computation leads to high gas fees](#problem-on-chain-computation-leads-to-high-gas-fees)
- [Solution: Perform complex computations with no gas fees](#solution-perform-complex-computations-with-no-gas-fees)
- [Conclusion](#conclusion)

## Prerequisites

This guide assumes you have a basic understanding of [Chainlink Keepers](https://chain.link/keepers). If you are new to Keepers, complete the following guides first:

- Know how to [deploy solidity contracts using Remix and Metamask](/docs/deploy-your-first-contract/)
- Learn how to make [Keepers-Compatible Contracts](/docs/chainlink-keepers/compatible-contracts/)
- [Register UpKeep for a Contract](/docs/chainlink-keepers/register-upkeep/)

Chainlink Keepers are supported on several [networks](../supported-networks).

> 📘 ERC677 Link
>
> - Get [LINK](/docs/link-token-contracts/) on the supported testnet that you want to use.
> - For funding on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/).

## Problem: On-chain computation leads to high gas fees

In the guide for [Making Keepers-compatible Contracts](/docs/chainlink-keepers/compatible-contracts/), you deployed a basic [counter contract](/docs/chainlink-keepers/compatible-contracts/#example-contract) and verified that the counter increments every 30 seconds. However, more complex use cases can require looping over arrays or performing expensive computation. This leads to expensive gas fees and can increase the premium that end-users have to pay to use your dApp. To illustrate this, deploy an example contract that maintains internal balances.

The contract has the following components:

- A fixed-size(1000) array `balances` with each element of the array starting with a balance of 1000.
- The `withdraw()` function decreases the balance of one or more indexes in the `balances` array. Use this to simulate changes to the balance of each element in the array.
- Keepers are responsible for regularly re-balancing the elements using two functions:
  - The `checkUpkeep()` function checks if the contract requires work to be done. If one array element has a balance of less than `LIMIT`, the function returns `upkeepNeeded == true`.
  - The `performUpkeep()` function to re-balances the elements. To demonstrate how this computation can cause high gas fees, this example does all of the computation within the transaction. The function finds all of the elements that are less than `LIMIT`, decreases the contract `liquidity`, and increases every found element to equal `LIMIT`.

```solidity
{% include 'samples/Keepers/BalancerOnChain.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/BalancerOnChain.sol" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

Test this example using the following steps:

1. Deploy the contract using Remix on the [supported testnet](../supported-networks) of your choice.

1. Before registering the upkeep for your contract, decrease the balances of some elements. This simulates a situation where upkeep is required. In Remix, Withdraw 100 at indexes 10,100,300,350,500,600,670,700,900. Pass `100,[10,100,300,350,500,600,670,700,900]` to the withdraw function:

   ![Withdraw 100 at 10,100,300,350,500,600,670,700,900](/images/contract-devs/keeper/balancerOnChain-withdraw.png)

   You can also perform this step after registering the upkeep if you need to.

1. Register the upkeep for your contract as explained [here](/docs/chainlink-keepers/register-upkeep/). Because this example has high gas requirements, specify the maximum allowed gas limit of `2,500,000`.

1. After the registration is confirmed, Keepers performs the upkeep.

   ![BalancerOnChain Upkeep History](/images/contract-devs/keeper/balancerOnChain-history.png)

1. Click the transaction hash to see the transaction details in Etherscan. You can find how much gas was used in the upkeep transaction.

   ![BalancerOnChain Gas](/images/contract-devs/keeper/balancerOnChain-gas.png)

In this example, the `performUpkeep()` function used **2,481,379** gas. This example has two main issues:

- All computation is done in `performUpkeep()`. This is a state modifying function which leads to high gas consumption.
- This example is simple, but looping over large arrays with state updates can cause the transaction to hit the gas limit of the [network](../supported-networks), which prevents `performUpkeep` from running successfully.  

To reduce these gas fees and avoid running out of gas, you can make some simple changes to the contract.

## Solution: Perform complex computations with no gas fees

Modify the contract and move the computation to the `checkUpkeep()` function. This computation _doesn’t consume any gas_ and supports multiple upkeeps for the same contract to do the work in parallel. The main difference between this new contract and the previous contract are:

- The `checkUpkeep()` function receives [`checkData`](/docs/chainlink-keepers/compatible-contracts/#checkdata), which passes arbitrary bytes to the function. Pass a `lowerBound` and an `upperBound` to scope the work to a sub-array of `balances`. This creates several upkeeps with different values of `checkData`. The function loops over the sub-array and looks for the indexes of the elements that require re-balancing and calculates the required `increments`. Then, it returns `upkeepNeeded == true` and `performData`, which is calculated by encoding `indexes` and `increments`. Note that `checkUpkeep()` is a view function, so computation does not consume any gas.
- The `performUpkeep()` function takes [performData](/docs/chainlink-keepers/compatible-contracts/#performdata-1) as a parameter and decodes it to fetch the `indexes` and the `increments`.

> 🚧 **Note on `performData`**
>
> This data should always be validated against the contract’s current state to ensure that `performUpkeep()` is idempotent. It also blocks malicious keepers from sending non-valid data. This example, tests that the state is correct after re-balancing:
> `require(_balance == LIMIT, "Provided increment not correct");`

```solidity
{% include 'samples/Keepers/BalancerOffChain.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/BalancerOffChain.sol" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

Run this example to compare the gas fees:

1. Deploy the contract using Remix on the [supported testnet](../supported-networks) of your choice.

1. Withdraw 100 at 10,100,300,350,500,600,670,700,900. Pass `100,[10,100,300,350,500,600,670,700,900]` to the withdraw function the same way that you did for the [previous example](#problem-on-chain-computation-leads-to-high-gas-fees).

1. Register three upkeeps for your contract as explained [here](/docs/chainlink-keepers/register-upkeep/). Because the keepers handle much of the computation off-chain, a gas limit of 200,000 is sufficient. For each registration, pass the following `checkData` values to specify which balance indexes the registration will monitor. **Note**: You must remove any breaking line when copying the values.

   | Upkeep Name             | CheckData(base16)                                                                                                                                      | Remark: calculated using [`abi.encode()`](https://docs.soliditylang.org/en/develop/abi-spec.html#strict-encoding-mode) |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
   | balancerOffChainSubset1 | 0x000000000000000000000000<br/>00000000000000000000000000<br/>00000000000000000000000000<br/>00000000000000000000000000<br/>0000000000000000000000014c | lowerBound: 0<br/>upperBound: 332                                                                                      |
   | balancerOffChainSubset2 | 0x000000000000000000000000<br/>00000000000000000000000000<br/>0000000000014d000000000000<br/>00000000000000000000000000<br/>0000000000000000000000029a | lowerBound: 333<br/>upperBound: 666                                                                                    |
   | balancerOffChainSubset3 | 0x000000000000000000000000<br/>00000000000000000000000000<br/>0000000000029b000000000000<br/>00000000000000000000000000<br/>000000000000000000000003e7 | lowerBound: 667<br/>upperBound: 999                                                                                    |

1. After the registration is confirmed, the three upkeeps run:

   ![BalancerOffChain1 History](/images/contract-devs/keeper/balancerOffChain1-history.png 'balancerOffChainSubset1')

   ![BalancerOffChain2 History](/images/contract-devs/keeper/balancerOffChain2-history.png 'balancerOffChainSubset2')

   ![BalancerOffChain3 History](/images/contract-devs/keeper/balancerOffChain3-history.png 'balancerOffChainSubset3')

1. Click each transaction hash to see the details of each transaction in Etherscan. Find the gas used by each of the upkeep transactions:

   ![BalancerOffChain1 Gas](/images/contract-devs/keeper/balancerOffChain1-gas.png 'balancerOffChainSubset1')

   ![BalancerOffChain2 Gas](/images/contract-devs/keeper/balancerOffChain2-gas.png 'balancerOffChainSubset2')

   ![BalancerOffChain3 Gas](/images/contract-devs/keeper/balancerOffChain3-gas.png 'balancerOffChainSubset3')

In this example the total gas used by each `performUpkeep()` function was 133,464 + 133,488 + 133,488 = **400,440**. This is an improvement of about 84% compared to the previous example, which used **2,481,379** gas.

## Conclusion

Using Chainlink Keepers efficiently not only allows you to reduce the gas fees, but also keeps them within predictable limits. That’s the reason why [several Defi protocols](https://chainlinktoday.com/prominent-founders-examine-chainlink-keepers-role-in-defis-evolution/) outsource their maintenance tasks to Chainlink Keepers.
