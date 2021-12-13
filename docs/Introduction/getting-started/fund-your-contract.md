---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Fund Your Contracts"
permalink: "docs/fund-your-contract/"
---

Some smart contracts require funding at their addresses so they can operate without you having to call functions manually and pay for the transactions through MetaMask. This guide explains how to fund Solidity contracts with LINK or ETH using the Remix IDE.

## Retrieve the contract address

1. In Remix, deploy your contract and wait until you see a new contract in the **Deployed Contracts** section.
1. On the left side panel, use the **Copy** button located near the contract title to copy the contract address to your clipboard.

![Remix Copy Deployed Contract Address](/files/25d2c8e-Screen_Shot_2020-09-08_at_7.15.50_AM.png)

## Send funds to your contract

1. Open MetaMask.
1. Select the network that you want to send funds on. For example, select the Kovan testnet.
1. Click the **Send** button to initiate a transaction.
1. Paste your contract address in the address field.
1. In the **Asset** drop down menu, select the type of asset that you need to send to your contract. For example, you can send LINK. If LINK is not listed, follow the guide to [Acquire testnet LINK](/docs/acquire-link/).
1. In the **Ammount** field, enter the amount of LINK that you want to send.
1. Click **Next** to review the transaction details and the Gas cost.
1. If the transaction details are correct, click **Confirm** and wait for the transaction to process.

![Metamask Send Link Screen](/files/867073d-metamask.png)

> 🚧 Transaction fee didn't update?
>
> You may need to click **Fastest**, **Fast**, **Slow**, or **Advanced Options** after entering the **Amount** to update the gas limit for the token transfer to be successful.
