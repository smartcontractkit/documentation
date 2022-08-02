---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Register a Custom Logic Upkeep'
whatsnext:
  {
    'Manage your Upkeeps': '/docs/chainlink-keepers/manage-upkeeps/',
  }
---

## Overview

This guide explains how to register a [Keepers-compatible contract](../compatible-contracts) with the Chainlink Keeper Network. You can use the Keepers Registry or your own smart contract to register your contract and create an Upkeep.

**Table of Contents**
+ [Register Contract with Registry](#register-contract-with-registry)
+ [Register Contract Programmatically ](#register-contract-programmatically)

## Register Contract with Registry

<div class="remix-callout">
    <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
</div>

1. **Connect your wallet** with the button in the top right corner and choose a chain. For a list of supported networks, see the [Supported Blockchain Networks](../supported-networks) section. The Chain Keepers App also lists the currently supported networks.
  ![Connect With Metamask](/images/contract-devs/keeper/keeper-metamask.png)

1. **Click the Register New Upkeep button**
  ![Click Register New Upkeep](/images/contract-devs/keeper/keeper-register.png)

1. **Select the custom logic trigger**

1. **Provide the address of your [Keepers-compatible contract](../compatible-contracts)** You do not need to verify the contract on-chain, but it must be [Keepers-compatible](../compatible-contracts/).

1. **Complete the required details:**

    - **Upkeep name**: This will be publicly visible in the Keepers app.
    - **Gas limit**: This is the maximum amount of gas that your transaction requires to execute on chain. This limit cannot exceed the `performGasLimit` value configured on the [registry](/docs/chainlink-keepers/supported-networks/#configurations). Before the network executes your transaction on chain, it simulates the transaction. If the gas required to execute your transaction exceeds the gas limit that you specified, your transaction will not be confirmed. Developers also have the ability to update `performGasLimit` for an upkeep. Consider running your function on a testnet to see how much gas it uses before you select a gas limit. This can be changed afterwards.
    - **Starting balance (LINK)**: Specify a LINK starting balance to fund your upkeep. See the [LINK Token Contracts](/docs/link-token-contracts/) page to find the correct contract address and access faucets for testnet LINK. This field is required. You must have LINK before you can use the Keepers service.
    - **Check data**: This field is provided as an input for when your `checkUpkeep` function is simulated. Either leave this field blank or specify a hexadecimal value starting with `0x`. To learn how to make flexible upkeeps using `checkData`, see the [Flexible Upkeeps](../flexible-upkeeps) guide.
    - **Your email address**: This email address will be encrypted and is used to send you an email when your upkeep is underfunded.

    > 🚧 Funding Upkeep
    >
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance is too low based on current exchange rates. View the [Keepers economics](../keeper-economics) page to learn more about the cost of using Keepers.

    > 🚧 ERC677 Link
    >
    > For registration on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from [faucets.chain.link](https://faucets.chain.link/).

    > 🚧 Testing and best practices
    >
    > Follow the [best practices](../compatible-contracts/#best-practices) when creating a Keepers-compatible contract and test your Upkeeps on a testnet before deploying them to a mainnet.

1. **Click `Register upkeep`** and confirm the transaction in MetaMask.
    ![Upkeep Registration Success Message](/images/contract-devs/keeper/keeper-registration-submitted.png)

> 📘 Registration Onboarding Note
>
> Registrations on testnets are approved immediately. Mainnet upkeeps are automatically approved after you register them. With auto-approval you must optimize and test your contracts before going live. Follow the [best practices](../compatible-contracts/#best-practices) when creating an Upkeep. Please test your Upkeeps before going to production.

After your Upkeep is approved, you will receive an Upkeep ID and be registered on the Registry. Providing that your Upkeep is appropriately funded, the Keepers Network will monitor it. You must monitor the balance of your Upkeep. If the balance drops below the **Minimum Balance**, the Keepers Network will not perform the Upkeep. See [Manage Your Upkeeps](../manage-upkeeps) to learn how to manage your Upkeeps.

## Register Contract Programmatically

This example displays a smart contract which can create Upkeep and receive an Upkeep ID when auto-approval is turned on. To register your contract with the Keepers network programmatically, you will need to ensure your contract is Keeper-compatible and

> 🚧 ERC677 Link
>
> For registration on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).

```solidity
{% include 'samples/Keepers/UpkeepIDConsumerExample.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Keepers/UpkeepIDConsumerExample.sol" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" > What is Remix?</a>
</div>

### `registerAndPredictID` Parameters

| Name                   | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `name`                 | Name of Upkeep         |
| `encryptedEmail`       | Email address which received Upkeep notifications; this will be encrypted          |
| `upkeepContract`       | Address of contract which requires Upkeep           |
| `gasLimit`             | The maximum amount of gas that will be used to execute your function on-chain          |
| `adminAddress`         | Address for admin        |
| `checkData`            | Fixed and specified at Upkeep registration and used in every checkUpkeep. Can be empty (0x)          |
| `amount`               | A LINK starting balance to fund your Upkeep          |
| `source`               | Source of funding for Upkeep          |
| `sender`               | Address of sender
