---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Register Keeper Upkeep for a Contract'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

# Overview

This guide explains how to register a Keeper-compatible contract with the Chainlink Keeper Network. To find more information about deploying a Keeper-compatible contract, see the [Making Compatible Contracts](../compatible-contracts) page. Register your contracts in the Chainlink Keepers App:

<div class="remix-callout">
    <a href="https://keepers.chain.link" class="cl-button--ghost solidity-tracked">Chainlink Keepers App</a>
</div>

After you register, you can interact directly with the [registry contract](https://etherscan.io/address/0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B#code) functions such as `cancelUpkeep` and `addFunds`.

**Table of Contents**
+ [Register Contract](#register-contract)
+ [Fund Upkeep](#fund-upkeep)
+ [How Funding Works](#how-funding-works)
+ [Maintain a Minimum Balance](#maintain-a-minimum-balance)
+ [Registration Completion](#registration-completion)
+ [Useful Patterns](#useful-patterns)
  + [Gas Limits](#gas-limits)
  + [Testing](#testing)

# Register Contract

Registering an Upkeep with the Chainlink Keepers App notifies the Keeper Network about your contract and allows you to fund it so your work is performed continuously. As part of the registration, we’re requesting some information that will help us to deliver the optimal experience for your use case as we continue to improve the product.

1. **Connect your wallet** with the button in the top right corner and choose a chain. For a list of supported networks, see the [Supported Blockchain Networks](../introduction/#supported-blockchain-networks) section. The Chain Keepers App also lists the currently supported networks.
  ![Connect With Metamask](/images/contract-devs/keeper/keeper-metamask.png)

1. **Click the `Register new upkeep` button**
  ![Click Register New Upkeep](/images/contract-devs/keeper/keeper-register.png)

1. **Fill out the registration form**
    The information that you provide will be publicly visible on the blockchain.

     - You must enter an email to receive upkeep notifications. The email address will be encrypted.
     - The gas limit of the [KeepersCounters.sol](/docs/chainlink-keepers/compatible-contracts#example-contract) example contract should be set to 200,000.
     - The **Check data** field must be a hexadecimal value starting with `0x`.
     - Specify a LINK starting balance to fund your Upkeep. If you need testnet LINK, see the [LINK Token Contracts](/docs/link-token-contracts/) page to find the LINK faucets available on your network.

    > ❗️ Funding Upkeep
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance could be too low based on current exchange rates.
    >
    > Your balance is charged LINK to run `performUpkeep`. Gas costs include the gas required for your Keeper-compatible contract to complete execution and an 80k overhead from the `KeeperRegistry` itself. The premium and overhead are not fixed and will change over time. See the [Network Configuration](/docs/chainlink-keepers/overview/#configuration) section to find the gas premium for your specific network.

    The gas limit of the example counter contract should be set to 200,000.

1. **Click `Register upkeep`** and confirm the transaction in MetaMask
  This sends a request to the Chainlink Keeper Network that will need to be manually approved. On testnets, requests are automatically approved.

    ![Upkeep Registration Success Message](/images/contract-devs/keeper/keeper-registration-submitted.png)

# Fund Upkeep

1. **Add funds to your Upkeep**
  You provided initial funding as part of the registration step. If the balance runs low, add more LINK to your Upkeep. If you allow the balance to run out, the Keepers network will not perform upkeep.

  * Click `View Upkeep` or go to the [Chainlink Keepers App](https://keepers.chain.link) and click on your recently registered Upkeep
  * Click the `Add funds` button
  * Approve the LINK spend allowance
    ![Approve LINK Spend Allowance](/images/contract-devs/keeper/keeper-approve-allowance.png)
  * Confirm the LINK transfer by sending funds to the Chainlink Keeper Network Registry
    ![Confirm LINK Transfer](/images/contract-devs/keeper/keeper-confirm-transfer.png)
  * Receive a success message and verify that the funds were added to the Upkeep
    ![Funds Added Successful Message](/images/contract-devs/keeper/keeper-add-funds.png)

  Note: Funds added to your upkeep will not be available for use by the Keeper Network until the minimum number of block confirmations have passed. This differs from chain to chain.

# How Funding Works

* Your balance is reduced each time a Keeper executes your `performUpkeep` method.
* There is no cost for `checkUpkeep` calls.
* If you want to automate adding funds, you can directly call the `addFunds()` function on the `KeeperRegistry` contract.
* Anyone can call the `addFunds()` function, not just the Upkeep owner.
* To withdraw funds, cancel the Upkeep and then click **Withdraw funds**.

# Maintain a Minimum Balance
To ensure that the Chainlink Keepers are compensated for performance, there is an expected minimum balance on each Upkeep. If your funds drop below this amount, the Upkeep will not be performed.

The minimum balance is calculated using the current fast gas price, the Gas Limit you entered for your Upkeep, and the max gas multiplier. To find the latest value for the `gasCeilingMultiplier`, see the [Registry Configuration](../overview/#configuration) section on the Network Overview page.

To account for gas price fluctuations, maintain a balance that is 3 to 5 times the minimum balance.

# Registration Completion
After you register your Upkeep and it is approved with sufficient funds, the Chainlink Keeper Network starts to simulate `checkUpkeep` calls and execute your contract's `performUpkeep` function as needed.

You have now successfully built and registered a Keeper Compatible contract with the Chainlink Keeper Network.

# Useful Patterns

These patterns are not mutually exclusive. Review and make use of the patterns that make sense for your use case.

## Gas Limits

> ❗️ Gas Limits
>
> The `KeeperRegistry` enforces a cap for gas used both on-chain and off-chain. See the [Keepers Network Overview](../overview/) for details. The caps are configurable and might change based on user feedback. Be sure that you understand these limits if your use case requires a large amount of gas.

When developing your keeper-compatible smart contracts, you must understand the gas limits that you are working with on the KeeperRegistry. There is a `check` gas limit and a `call` gas limit that your contract must adhere to in order to operate successfully. See the [Keepers Network Overview](../overview/) to learn the current configuration.

## Testing

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keeper-compatible contract operates within the parameters of the `KeeperRegistry`.

Test all of your mission-critical contracts, and stress-test the contract to confirm the performance and correct operation of your use case under load and adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. [Reach out](https://forms.gle/WadxnzzjHPtta5Zd9) to us if you need help, have questions, or feedback for improvement.
