---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Job Scheduler'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

**Table of Contents**
+ [Overview](#overview)
+ [Register a new Upkeep](#register-a-new-upkeep)
+ [Trigger Selection](#trigger-selection)
+ [Using Time-Based Triggers](#using-time-based-triggers)
+ [Using Custom Logic Triggers](#using-custom-logic-triggers)

# Overview

Learn how to register a contract with the Chainlink Keepers network and automate it using the Keepers job scheduler. We encourage you to learn how to [create a Keeper-compatible contract](../compatible-contracts) before using this guide.

# Register a new Upkeep

To use the job scheduler, you must register a new upkeep on the Keepers network. On the landing page of the Keepers interface, click the blue **Register new Upkeep** button. 

![Keepers UI Landing](/images/contract-devs/keeper/keeper-ui-landing.png)

## Connecting your Wallet

If you do not already have a wallet connected with the Keepers network, the interface will prompt you to do so. Click the **Connect Wallet** button and follow the remaining prompts to connect your wallet to the network.

![Keepers Connect Waller](/images/contract-devs/keeper/keeper-connect-wallet.png)

# Trigger Selection

Once you have successfully connected your wallet, you will have options to create a trigger mechanism for automation. The trigger specifies what Keeper Nodes should look at to determine if your Upkeep should be performed. The page will present two options: [*time-based*](#using-time-based-triggers) and [*custom logic*](#using-custom-logic-triggers) triggers.  Time-based uses a time schedule (CRON) to execute your smart contract function according to the schedule. Custom logic uses a Keeper-compatible contract that you deployed to determine when to perform your Upkeep. To learn more about Keeper-compatible contracts, refer to our [guide](../compatible-contracts).

![Keepers Trigger Selection](/images/contract-devs/keeper/keeper-trigger-selection.png)

# Using Time-Based Triggers

To use the time-based trigger, you will be prompted to enter a *contract address*. This is the address of the deployed contract that contains the function that you want Keepers to execute. If you did not verify the contract on chain, you will also need to paste the [Application Binary Interface](https://docs.soliditylang.org/en/develop/abi-spec.html) (ABI) of the deployed contract into the corresponding text box.

![Keepers Time Based Trigger](/images/contract-devs/keeper/keeper-time-based-trigger.png)

## Specifying the Time Schedule

Once you have successfully entered your contract address and ABI, you will need to specify your time schedule in the form of a [CRON expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm). Once you have entered your CRON expression, click **Next**.

![Keepers Cron Expression](/images/contract-devs/keeper/keeper-cron-expression.png)

## Entering Upkeep Details

To complete the upkeep registration process using time-based triggers, you must enter some information about your upkeep includuing its name, gas limit,starting balance, and contact information.

![Keepers Upkeep Details](/images/contract-devs/keeper/keeper-upkeep-details.png)

# Using Custom Logic Triggers

To use custom logic triggers, you must enter the address of your Keeper-compatible contract. Learn how to create a Keeper-compatible contract [here](../compatible-contracts).