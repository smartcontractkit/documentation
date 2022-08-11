---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Manage your Upkeeps'
whatsnext:
  { 'Keepers economics': '/docs/chainlink-keepers/keeper-economics/' }
---

## Overview

Manage your Upkeeps to get the best performance.

**Topics**

- [Fund your Upkeep](#fund-your-upkeep)
- [Maintain a Minimum Balance](#maintain-a-minimum-balance)
- [Withdraw funds](#withdraw-funds)
- [Interacting directly with the Keepers Registry](#interacting-directly-with-the-keepers-registry)

## Fund your Upkeep

You must monitor the balance of your Upkeep. If the Upkeep LINK balance drops below the [minimum balance](../keeper-economics/#minimum-balance), the Keepers Network will not perform the Upkeep.

> 📘 ERC677 Link
>
> For funding on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To fund on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).

Follow these steps to fund your Upkeep:

1. **Click `View Upkeep`** or go to the [Chainlink Keepers App](https://keepers.chain.link) and click on your recently registered Upkeep under My Upkeeps.

1. **Click the `Add funds` button**

1. **Approve the LINK spend allowance**
   ![Approve LINK Spend Allowance](/images/contract-devs/keeper/keeper-approve-allowance.png)

1. **Confirm the LINK transfer** by sending funds to the Chainlink Keeper Network Registry
   ![Confirm LINK Transfer](/images/contract-devs/keeper/keeper-confirm-transfer.png)

1. **Receive a success message** and verify that the funds were added to the Upkeep
   ![Funds Added Successful Message](/images/contract-devs/keeper/keeper-add-funds.png)

## Maintain a Minimum Balance

Each Upkeep has a [minimum balance](../keeper-economics/#minimum-balance) to ensure that an Upkeeps will still run should a sudden spike occur. If your Upkeep LINK balance drops below this amount, the Upkeep will not be performed.

To account for Upkeep execution over time and possible extended gas spikes, maintain an Upkeep LINK balance that is 3 to 5 times the minimum balance. Note if you have an upkeep that performs frequently you may want to increase the buffer to ensure a reasonable interval before you need to fund again.  Developers also have the ability to update `performGasLimit` for an upkeep.

## Withdraw funds

To withdraw funds, the Upkeep administrator have to cancel the Upkeep first. There is a 50 block delay once an Upkeep has been cancelled before funds can be withdrawn. Once 50 blocks have passed, select **Withdraw funds**.

## Interacting directly with the Keepers Registry

After registration, you can interact directly with the [registry contract](https://etherscan.io/address/0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B#code) functions such as `cancelUpkeep` and `addFunds` using your **Upkeep ID**. The Registry Address might change when new contracts are deployed with new functionality.
