---
layout: ../../layouts/MainLayout.astro
section: automation
date: Last Modified
title: "Register a Custom Logic Upkeep"
whatsnext: { "Create a compatible contract for custom logic Upkeep": "/chainlink-automation/compatible-contracts/" }
---

This guide explains how to register a custom logic Upkeep that uses a [compatible contract](/chainlink-automation/compatible-contracts). You can register it using the Chainlink Automation App or from within a contract that you deploy.

## Register an Upkeep using the Chainlink Automation App

<div class="remix-callout">
    <a href="https://automation.chain.link" >Open the Chainlink Automation App</a>
</div>

1. **Click the Register New Upkeep button**
   ![Click Register New Upkeep](/images/contract-devs/automation/auto-ui-home.png)

1. **Connect your wallet** using the _Connect Wallet_ choose a network. For a list of supported networks, see the [Supported Blockchain Networks](/chainlink-automation/supported-networks) section. The Chainlink Automation App also lists the currently supported networks.
   ![Connect With Metamask](/images/contract-devs/automation/auto-ui-wallet.png)

1. **Select the custom logic trigger**

1. **Provide the address of your [compatible contract](/chainlink-automation/compatible-contracts)** You do not need to verify the contract on-chain, but it must be [compatible](/chainlink-automation/compatible-contracts/) with the `AutomationCompatibleInterface` contract.

1. **Complete the required details:**

   - **Upkeep name**: This will be publicly visible in the Chainlink Automation app.
   - **Gas limit**: This is the maximum amount of gas that your transaction requires to execute on chain. This limit cannot exceed the `performGasLimit` value configured on the [registry](/chainlink-automation/supported-networks/#configurations). Before the network executes your transaction on chain, it simulates the transaction. If the gas required to execute your transaction exceeds the gas limit that you specified, your transaction will not be confirmed. Developers also have the ability to update `performGasLimit` for an upkeep. Consider running your function on a testnet to see how much gas it uses before you select a gas limit. This can be changed afterwards.
   - **Starting balance (LINK)**: Specify a LINK starting balance to fund your upkeep. See the [LINK Token Contracts](/resources/link-token-contracts/) page to find the correct contract address and access faucets for testnet LINK. This field is required. You must have LINK before you can use the Chainlink Automation service.
   - **Check data**: This field is provided as an input for when your `checkUpkeep` function is simulated. Either leave this field blank or specify a hexadecimal value starting with `0x`. To learn how to make flexible upkeeps using `checkData`, see the [Flexible Upkeeps](/chainlink-automation/flexible-upkeeps) guide.
   - **Your email address**: This email address will be encrypted and is used to send you an email when your upkeep is underfunded.
      <!-- prettier-ignore -->

     :::tip[Funding Upkeep]
     You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance is too low based on current exchange rates. View the [Automation economics](/chainlink-automation/automation-economics) page to learn more about the cost of using Chainlink Automation.
     :::

      <!-- prettier-ignore -->

     :::tip[ERC677 Link]
     Fund your Upkeep with more LINK than you anticipate you will need. The network will not check or perform your upkeep if your balance is too low based on current exchange rates. View the [Automation Economics](/chainlink-automation/automation-economics) page to learn more about the cost of using Chainlink Automation.
     :::

      <!-- prettier-ignore -->

     :::tip[Testing and best practices]
     Follow the [best practices](/chainlink-automation/compatible-contracts/#best-practices) when creating a compatible contract and test your upkeep on a testnet before deploying it to a mainnet.
     :::

1. **Click `Register upkeep`** and confirm the transaction in MetaMask.
   ![Upkeep Registration Success Message](/images/contract-devs/automation/automation-registration-submitted.png)

Your upkeeps will be displayed in your list of **Active Upkeeps**. You must monitor the balance of your upkeep. If the balance drops below the **minimum balance**, the Chainlink Automation Network will not perform the Upkeep. See [Managing Upkeeps](/chainlink-automation/manage-upkeeps) to learn how to manage your upkeeps.

## Register an Upkeep using your own deployed contract

You can dynamically create and manage Upkeeps from within your own dApp. To do this you will need to keep track of the Upkeep ID as your contract will use this to subsequently interact with the Chainlink Automation registry. The following example displays a smart contract that can create an Upkeep and determine the Upkeep ID. Note your contract must be compatible and you will need [ERC-677 LINK](/resources/link-token-contracts/) to fund the upkeep. You can also program your Upkeep to check its own balance and fund itself by interacting with the registry.

### Prerequisites

Find the following addresses for your network:

- Correct [LINK token contract](/resources/link-token-contracts/)
- [Registry and registrar addresses for your network](/chainlink-automation/supported-networks/#configurations)

Optionally, you can fetch the LINK address and registrar address from the intended registry at run-time.

:::note[Fund your contract]
Make sure your contract has enough [ERC-677 LINK](/resources/link-token-contracts/) to fund the Upkeep at creation. _The minimum amount is 5 LINK._
:::

### Code example

::solidity-remix[samples/Automation/UpkeepIDConsumerExample.sol]

### `registerAndPredictID` Parameters

| Name             | Description                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name`           | Name of Upkeep                                                                                                                       |
| `encryptedEmail` | Not in use in programmatic registration. Please specify with `0x`                                                                    |
| `upkeepContract` | Address of Keepers-compatible contract that will be automated                                                                        |
| `gasLimit`       | The maximum amount of gas that will be used to execute your function on-chain                                                        |
| `adminAddress`   | Address for Upkeep administrator. Upkeep administrator can fund contract.                                                            |
| `checkData`      | ABI-encoded fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)                              |
| `amount`         | The amount of LINK (in Wei) to fund your Upkeep. The minimum amount is 5 LINK. To fund 5 LINK please set this to 5000000000000000000 |
| `source`         | Not in use in programmatic registration. Please specify with `0`.                                                                    |

Refer to the [Supported Networks](/chainlink-automation/supported-networks/#configurations) page to find the correct registry and registrar addresses for your contract.
