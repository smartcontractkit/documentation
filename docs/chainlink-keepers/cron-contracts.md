---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Keepers Job Scheduler'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

# Overview
This guide explains outlines how you to schedule job upkeeps for Keeper-compatible contracts using [Cron](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm), the UNIX job scheduler. Chainlink Keepers is a decentralized service that will automate your smart contract functions the use cases for Keeper utility contracts and specifically for the [`CronUpkeepFactory` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/factories/CronUpkeepFactory.sol). 

**Table of Contents**

+ [Overview](#overview)
+ [`CronUpkeepFactory` Overview](#cronupkeepfactory-overview)
+ [Job Scheduling Tutorial](#job-scheduling-tutorial)
+ [Useful Patterns and Best Practices](#useful-patterns-and-best-practices)


# `CronUpkeepFactory` Overview

The `CronUpkeepFactory` contract generates your own `CronUpkeep` contract and assigns you ownership. To take full advantage of `CronUpkeepFactory`, developers should follow the steps below to ensure their cron jobs are automated. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

1. Use `CronUpkeepFactory` to create your own `CronUpkeep` contract that you will manage and where you will schedule your jobs, 
2. Schedule Cron jobs using the [`CronUpkeep`](https://github.com/smartcontractkit/chainlink/blob/6275f30a6c3cceea68cdbda603ef3e01e0faf0d8/contracts/src/v0.8/upkeeps/CronUpkeep.sol) contract.
3. Register your `CronUpkeep` on Chainlink Keepers to allow Keepers to monitor and execute your CRON jobs.

After successful completion of the above steps, you will be able to create CRON jobs that will execute your upkeep functions at the CRON specified time intervals. 

# Job Scheduling Tutorial

We will be using [Remix](https://remix.ethereum.org/) for this tutorial. To learn more about Remix and how you can use it to deploy a smart contract, visit our [tutorial].

## Creating `CronUpkeep` Contract using `CronUpkeepFactory`

In Remix, select the new file icon, name it `CronUpkeepFactory.abi` and paste the ABI for `CronUkeepFactory`. The ABI is the application binary interface that is used to interact with the smart contract that has been deployed to the network.

![Remix ABI Cron](/images/keepers/cron-1.png)

Select the **DEPLOY & RUN TRANSACTIONS** icon on the left and set **Environment** to *Injected Web3*. Paste the address of your deployed `CronUpkeepFactory` contract in the **At Address** box. You can find the addresses for `CronUpkeepFactory` [below](#contract-addresses). Once this step is completed, you will be able to view callable functions. Select `newCronUpkeep` and follow the prompts to confirm the transaction.

Once the transaction is complete, you will see a new transaction with a dropdown option. Please open the dropdown and copy the transaction hash.

![Remix Transaction Hash](/images/keepers/cron-2.png)

## Scheduling a CRON job with `CronUpkeep`

`CronUpkeepFactory` has now deployed a new contract called `CronUpkeep` and your address is the owner of this contract. To interact with this contract, create a new file called `CronUpkeep.abi` in Remix and paste the ABI for `CronUpkeep` contract from the Resources section below. Select the **DEPLOY & RUN TRANSACTIONS** icon on the left and paste the address of your `CronUpkeep` contract in the **At Address** box. The contract interface will then open in the bottom left of Remix.

![Remix Contract Interface](/images/keepers/cron-3.png)

To schedule a new Cron job, use the function `createCronJobFromEncodedSpec`. This function has three inputs: 

+ The target address of the smart contract we want to automate
+ The [function signature](#function-signature), or the encoding of the function we want to call 
+ The [encodedCronSpec](#encodedcronspec), which is an encoding of our specified time interval.

### Function Signature


### EncodedCronSpec

# Useful Patterns and Best Practices

## Contract Addresses
