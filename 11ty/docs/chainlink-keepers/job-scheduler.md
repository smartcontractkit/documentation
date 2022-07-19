---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Job Scheduler'
whatsnext:
  {
    'Custom logic automation': '/docs/chainlink-keepers/compatible-contracts/',
  }
---

Learn how to register a contract with the Chainlink Keepers network and automate it using the Keepers job scheduler.

**Table of Contents**

+ [Register a new Upkeep](#register-a-new-upkeep)
+ [Trigger Selection](#trigger-selection)
+ [Using Time-Based Triggers](#using-time-based-triggers)
+ [Using Custom Logic Triggers](#using-custom-logic-triggers)

# Register a new Upkeep

To use the job scheduler, you must register a new upkeep on the Keepers network. On the landing page of the Keepers interface, click the blue **Register new Upkeep** button.

![Keepers UI Landing](/images/contract-devs/keeper/keeper-ui-landing.png)

## Connecting your Wallet

If you do not already have a wallet connected with the Keepers network, the interface will prompt you to do so. Click the **Connect Wallet** button and follow the remaining prompts to connect your wallet to the network.

![Keepers Connect Waller](/images/contract-devs/keeper/keeper-connect-wallet.png)

# Trigger Selection

After you have successfully connected your wallet, you will have options to select a trigger mechanism for automation. The trigger specifies what Keeper Nodes should look at to determine if your Upkeep should be performed.

- [Time-based triggers](#using-time-based-triggers) use a time schedule (CRON) to execute deployed smart contract function according to the schedule
- [Custom logic triggers](#using-custom-logic-triggers) use a Keeper-compatible contract that you deployed to determine when to perform your Upkeep.

To learn how to create Keeper-compatible contracts, see [Making Keepers-compatible Contracts](../compatible-contracts).

![Keepers Trigger Selection](/images/contract-devs/keeper/keeper-trigger-selection.png)

# Using Time-Based Triggers

When you select the time-based trigger, you are prompted to enter a *contract address*. This is the address of the deployed contract that contains the function that you want Keepers to execute. If you did not verify the contract on chain, you will also need to paste the [Application Binary Interface](https://docs.soliditylang.org/en/develop/abi-spec.html) (ABI) of the deployed contract into the corresponding text box.

![Keepers Time Based Trigger](/images/contract-devs/keeper/keeper-time-based-trigger.png)

## Specifying the Time Schedule

After you successfully enter your contract address and ABI, specify your time schedule in the form of a CRON expression. CRON expressions are a shorthand way to create a time schedule. Use the provided example buttons to experiment with different schedules and then create your own.

```
Cron jobs are interpreted according to this format:

  ┌───────────── minute (0 - 59)
  │ ┌───────────── hour (0 - 23)
  │ │ ┌───────────── day of the month (1 - 31)
  │ │ │ ┌───────────── month (1 - 12)
  │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
  │ │ │ │ │
  │ │ │ │ │
  │ │ │ │ │
  * * * * *

All times are in UTC

- can be used for range e.g. "0 8-16 * * *"
/ can be used for interval e.g. "0 */2 * * *"
, can be used for list e.g. "0 17 * * 0,2,4"

  Special limitations:
    * there is no year field
    * no special characters: ? L W #
    * lists can have a max length of 26
    * no words like JAN / FEB or MON / TUES
```

After you enter your CRON expression, click **Next**.

![Keepers Cron Expression](/images/contract-devs/keeper/keeper-cron-expression.png)

## Entering Upkeep Details

To complete the upkeep registration process using time-based triggers, you must enter some information about your upkeep including its name, gas limit, starting balance, and contact information.

> 📘 Job Scheduler Gas requirements
>
> When you create an upkeep through the Job Scheduler, Chainlink Keepers deploys a new `CronUpkeep` contract from the [CronUpkeepFactory](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/factories/CronUpkeepFactory.sol) to manage your time schedule and ensure that it is Keepers-compatible. This contract uses roughly 110K gas per call, so it is recommended to add 150K additional gas to the gas limit of the function you are automating.

![Keepers Upkeep Details](/images/contract-devs/keeper/keeper-upkeep-details.png)

# Using Custom Logic Triggers

To use custom logic triggers, you must enter the address of your Keeper-compatible contract. Learn how to create a Keeper-compatible contract [here](../compatible-contracts).
