---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Register Custom logic trigger Upkeep'
whatsnext:
  {
    'Manage your Upkeeps': '/docs/chainlink-keepers/manage-upkeeps/',
  }
---

## Overview

This guide explains how to register a Custom logic trigger upkeep using a [Keepers-compatible contract](../compatible-contracts).

**Table of Contents**
+ [Register Contract](#register-contract)



## Register Contract

<div class="remix-callout">
    <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
</div>

1. **Connect your wallet** with the button in the top right corner and choose a chain. For a list of supported networks, see the [Supported Blockchain Networks](../supported-networks) section. The Chain Keepers App also lists the currently supported networks.
  ![Connect With Metamask](/images/contract-devs/keeper/keeper-metamask.png)

1. **Click the `Register new upkeep` button**
  ![Click Register New Upkeep](/images/contract-devs/keeper/keeper-register.png)

1. **Select Custom logic trigger**

1. **Provide the address of your [Keepers-compatible contract](../compatible-contracts)**
    You do not need to verify the contract on-chain, but it needs to be Keepers-compatible.

1. **Complete the required details**
     - Provide an **Upkeep name**. This will be publicly visible in the Keepers app.
     - Enter the Gas Limit of your function. The **Gas Limit** is the maximum amount of gas that will be used to execute your function.. The contract doesn't need to be validated on-chain, but for Keepers to work it needs to be [Keepers-compatible](../compatible-contracts/).
     - Enter an **email** to receive Upkeep notifications. The email address will be encrypted and we will use it to send you an email when your upkeep is underfunded.
     - The **Gas Limit** is the maximum amount of gas that your transaction will need to execute on chain. This limit cannot exceed the `callGasLimit` value configured on the [registry](/docs/chainlink-keepers/supported-networks/#configurations).Before we execute your transaction on chain, we will simulate it and if the gas needed exceeds the Gas limit you specified, your transaction will not be confirmed. Consider running your function on a test chain to see how much gas it uses before setting a Gas Limit. This can be changed afterward.
     - Specify a LINK starting balance to fund your Upkeep. If you do not know which contract is the correct token, please see the [LINK Token Contracts](/docs/link-token-contracts/) page which also contains details to access faucets for testnet LINK. Note you have to type a value in this box, and if you don't have LINK you have to get LINK before you can use the service.
     - The **Check data** field will be provided as an input when your checkUpkeep function is simulated. It can be blank UI. However, if you want to supply a value it must be a hexadecimal value starting with `0x`. To learn how to make flexible Upkeeps using checkData please see our [flexible upkeeps](../flexible-upkeeps) page.
     

    > 🚧 Funding Upkeep
    >
    > You should fund your contract with more LINK that you anticipate you will need. The network will not check or perform your Upkeep if your balance is too low based on current exchange rates. View the [Keepers economics](../keeper-economics) page to learn more about the cost of using Keepers.

    > 🚧 ERC677 Link
    >
    > For registration on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).


    > 🚧 Testing and best practices
    >
    > We recommend you follow our [best practices](../compatible-contracts/#best-practices) when creating a Keepers-compatible contract and also that you test your Upkeeps on a testnet before going to a Mainnet.


1. **Click `Register upkeep`** and confirm the transaction in MetaMask.
    ![Upkeep Registration Success Message](/images/contract-devs/keeper/keeper-registration-submitted.png)

> 📘 Registration Onboarding Note
>
> Registrations on a testnet will be approved immediately. Mainnet Upkeeps will now be automatically approved once you register them. With auto-approval you must optimize and test your contracts before going live. We recommend you follow our [best practices](../compatible-contracts/#best-practices) when creating an Upkeep. Please test your Upkeeps before going to production.

> 🚧 Minimum Spend Requirement Note
>
> There is a minimum spend requirement per upkeep to prevent misuse of the Keepers network. The minimum amount required is currently 0.1 LINK on any Upkeep that you register. If you do not spend at least this amount, 0.1 LINK will not be withdrawable when you cancel. If you spend more than 0.1 LINK you will be able to withdraw all remaining LINK, even after additional funds are added, once you cancel.

After your Upkeep is approved, you will receive an Upkeep ID and be registered on the Registry. Providing that your Upkeep is appropriately funded, the Keepers Network will monitor it. You must monitor the balance of your Upkeep. If the balance drops below the **Minimum Balance**, the Keepers Network will not perform the Upkeep. See [Manage Your Upkeeps](../manage-upkeeps) to learn how to manage your Upkeeps.