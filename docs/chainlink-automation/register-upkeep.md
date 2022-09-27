---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Register a Custom Logic Upkeep'
whatsnext:
  {
    'Create a compatible contract for custom logic Upkeep': '/docs/chainlink-automation/compatible-contracts/',
  }
---

## Overview

This guide explains how to register a custom logic Upkeep that uses a [compatible contract](../compatible-contracts). You can register it using the Chainlink Automation App or from within a contract that you deploy.

**Topics**
+ [Register an Upkeep using the Chainlink Automation App](#register-an-upkeep-using-the-chainlink-automation-app)
+ [Register an Upkeep using your own deployed contract](#register-an-upkeep-using-your-own-deployed-contract)

## Register an Upkeep using the Chainlink Automation App

<div class="remix-callout">
    <a href="https://automation.chain.link" >Open the Chainlink Automation App</a>
</div>

1. **Click the Register New Upkeep button**
  ![Click Register New Upkeep](/images/contract-devs/automation/auto-ui-home.png)

1. **Connect your wallet** using the *Connect Wallet* choose a network. For a list of supported networks, see the [Supported Blockchain Networks](../supported-networks) section. The Chainlink Automation App also lists the currently supported networks.
  ![Connect With Metamask](/images/contract-devs/automation/auto-ui-wallet.png)

1. **Select the custom logic trigger**

1. **Provide the address of your [compatible contract](../compatible-contracts)** You do not need to verify the contract on-chain, but it must be [compatible](../compatible-contracts/) with the `AutomationCompatibleInterface` contract.

1. **Complete the required details:**

    - **Upkeep name**: This will be publicly visible in the Chainlink Automation app.
    - **Gas limit**: This is the maximum amount of gas that your transaction requires to execute on chain. This limit cannot exceed the `performGasLimit` value configured on the [registry](/docs/chainlink-automation/supported-networks/#configurations). Before the network executes your transaction on chain, it simulates the transaction. If the gas required to execute your transaction exceeds the gas limit that you specified, your transaction will not be confirmed. Developers also have the ability to update `performGasLimit` for an upkeep. Consider running your function on a testnet to see how much gas it uses before you select a gas limit. This can be changed afterwards.
    - **Starting balance (LINK)**: Specify a LINK starting balance to fund your upkeep. See the [LINK Token Contracts](/docs/link-token-contracts/) page to find the correct contract address and access faucets for testnet LINK. This field is required. You must have LINK before you can use the Chainlink Automation service.
    - **Check data**: This field is provided as an input for when your `checkUpkeep` function is simulated. Either leave this field blank or specify a hexadecimal value starting with `0x`. To learn how to make flexible upkeeps using `checkData`, see the [Flexible Upkeeps](../flexible-upkeeps) guide.
    - **Your email address**: This email address will be encrypted and is used to send you an email when your upkeep is underfunded.

    > 🚧 Funding Upkeep
    >
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance is too low based on current exchange rates. View the [Automation economics](../automation-economics) page to learn more about the cost of using Chainlink Automation.

    > 🚧 ERC677 Link
    >
    > Fund your Upkeep with more LINK than you anticipate you will need. The network will not check or perform your upkeep if your balance is too low based on current exchange rates. View the [Automation Economics](../automation-economics) page to learn more about the cost of using Chainlink Automation.

    > 🚧 Testing and best practices
    >
    > Follow the [best practices](../compatible-contracts/#best-practices) when creating a compatible contract and test your upkeep on a testnet before deploying it to a mainnet.

1. **Click `Register upkeep`** and confirm the transaction in MetaMask.
    ![Upkeep Registration Success Message](/images/contract-devs/automation/automation-registration-submitted.png)

Your upkeeps will be displayed in your list of **Active Upkeeps**. You must monitor the balance of your upkeep. If the balance drops below the **minimum balance**, the Chainlink Automation Network will not perform the Upkeep. See [Managing Upkeeps](../manage-upkeeps) to learn how to manage your upkeeps.

## Register an Upkeep using your own deployed contract

You can dynamically create and manage Upkeeps from within your own dApp. To do this you will need to keep track of the Upkeep ID as your contract will use this to subsequently interact with the Chainlink Automation registry. The following example displays a smart contract that can create an Upkeep and determine the Upkeep ID. Note your contract must be compatible and you will need [ERC-677 LINK](../../link-token-contracts/) to fund the upkeep. You can also program your Upkeep to check its own balance and fund itself by interacting with the registry.


### Prerequisites 

Find the following addresses for your network:

- Correct [LINK token contract](../../link-token-contracts/)
- [Registry and registrar addresses for your network](../supported-networks/#registry-and-registrar-addresses) 

Optionally, you can fetch the LINK address and registrar address from the intended registry at run-time.

> 📘 Make sure your contract has enough [ERC-677 LINK](../../link-token-contracts/) to fund the Upkeep at creation. _The minimum amount is 5 LINK._

### Code example

```solidity
{% include 'samples/Automation/UpkeepIDConsumerExample.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Automation/UpkeepIDConsumerExample.sol" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" > What is Remix?</a>
</div>

### `registerAndPredictID` Parameters

| Name                   | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `name`                 | Name of Upkeep         |
| `encryptedEmail`       | Not in use in programmatic registration. Please specify with `0x`           |
| `upkeepContract`       | Address of Keepers-compatible contract that will be automated           |
| `gasLimit`             | The maximum amount of gas that will be used to execute your function on-chain          |
| `adminAddress`         | Address for Upkeep administrator. Upkeep administrator can fund contract.        |
| `checkData`            | ABI-encoded fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)          |
| `amount`               | The amount of LINK (in Wei) to fund your Upkeep. The minimum amount is 5 LINK. To fund 5 LINK please set this to 5000000000000000000       |
| `source`               | Not in use in programmatic registration. Please specify with `0`.           |

Refer to the [Supported Networks](../supported-networks/#registry-and-registrar-addresses) page to find the correct registry and registrar addresses for your contract.
