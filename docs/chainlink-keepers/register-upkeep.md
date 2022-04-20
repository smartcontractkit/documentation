---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Register Keeper Upkeep for a Contract'
whatsnext:
  {
    'Manage your Upkeeps': '/docs/chainlink-keepers/manage-upkeeps/',
  }
---

## Overview

This guide explains how to register a [Keepers-compatible contract](../compatible-contracts) with the Chainlink Keeper Network.

**Table of Contents**
+ [Register Contract](#register-contract)

## Register Contract

After you register your contract as an Upkeep on the Keepers Registry, the Keepers Network monitors the Upkeep and executes your functions.

<div class="remix-callout">
    <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
</div>

1. **Connect your wallet** with the button in the top right corner and choose a chain. For a list of supported networks, see the [Supported Blockchain Networks](../supported-networks) section. The Chain Keepers App also lists the currently supported networks.
  ![Connect With Metamask](/images/contract-devs/keeper/keeper-metamask.png)

1. **Click the `Register new upkeep` button**
  ![Click Register New Upkeep](/images/contract-devs/keeper/keeper-register.png)

1. **Fill out the registration form**
    The information that you provide will be publicly visible on the blockchain.

     - Provide the **Upkeep address** of the contract you want to automate. The contract doesn't need to be validated on-chain, but for Keepers to work it needs to be [Keepers-compatible](../compatible-contracts/).
     - Enter an **email** to receive Upkeep notifications. The email address will be encrypted.
     - The **Gas Limit** is the maximum amount of gas that will be used to execute your function on-chain. The Gas Limit of the [KeepersCounters.sol](/docs/chainlink-keepers/compatible-contracts#example-contract) example contract should be set to 200,000. We simulate `performUpkeep` during `checkUpkeep` and if the gas exceeds this limit the function will not execute on-chain. The gas limit cannot exceed the `callGasLimit` in the [configuration of the registry](/docs/chainlink-keepers/supported-networks/#configurations).
     - The **Check data** field can be empty or `0x`. If you want to supply a value it must be a hexadecimal value starting with `0x`.
     - Specify a LINK starting balance to fund your Upkeep. If you need testnet LINK, see the [LINK Token Contracts](/docs/link-token-contracts/) page to find the LINK faucets available on your network.

    > 🚧 Funding Upkeep
    >
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance is too low based on current exchange rates. View the [Keepers economics](../keeper-economics) page to learn more about the cost of using Keepers.

    > 🚧 ERC677 Link
    >
    > For registration on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).

1. **Click `Register upkeep`** and confirm the transaction in MetaMask.
    ![Upkeep Registration Success Message](/images/contract-devs/keeper/keeper-registration-submitted.png)

> 📘 Registration Onboarding Note
>
> Registrations on a testnet will be approved immediately. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.

After your Upkeep is approved, will receive an Upkeep ID and be registered on the Registry. Providing that your Upkeep is appropriately funded, the Keepers Network will monitor it. You must monitor the balance of your Upkeep. If the balance drops below the **Minimum Balance**, the Keepers Network will not perform the Upkeep. See [Manage Your Upkeeps](../manage-upkeeps) to learn how to manage your Upkeeps.
