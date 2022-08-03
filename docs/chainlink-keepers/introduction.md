---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Register a time-based Upkeep': '/docs/chainlink-keepers/job-scheduler/',
    'Create a Keepers-compatible contract for custom logic Upkeep': '/docs/chainlink-keepers/compatible-contracts/','Keepers architecture': '/docs/chainlink-keepers/overview/', 'Keepers economics': '/docs/chainlink-keepers/keeper-economics/'

  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

**Chainlink Keepers** enables conditional execution of your smart contracts functions through a hyper-reliable and decentralized automation platform that uses the same external network of node operators that secures $ billions in value. Building on Chainlink Keepers will help you get to market faster so you don't have to deal with the setup cost, ongoing maintenance, and risks associated with a centralized automation stack. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To learn more about how the Chainlink Keepers Network automates your smart contracts, read the [Chainlink Keepers Architecture](../overview) page.

**Table of Contents**

+ [Select a Trigger](#select-a-trigger)
  + [Time-based Trigger](#time-based-trigger)
  + [Custom Logic Trigger](#custom-logic-trigger)
+ [Supported Networks and Costs](#supported-networks-and-costs)
+ [Questions and Examples](#questions-and-examples)

## Select a Trigger

Chainlink Keepers can execute smart contract functions according to a time schedule (time-based trigger), or execute smart contract functions using custom logic (custom logic trigger) that you provide.

- [Time-based trigger](#time-based-trigger): If your contract function needs to run repeatedly using a pre-specified time schedule, use a [time based trigger](#time-based-trigger). Your contract does not need to be [Keepers-compatible](../compatible-contracts/).
- [Custom logic trigger](#custom-logic-trigger): If your contract requires custom logic to run, use a [custom logic trigger](#custom-logic-trigger) and make sure your contract is [Keepers-compatible](../compatible-contracts/). Examples of this include checking the balance on a contract, only executing limit orders when their levels are met, or changing the state of certain entities based on some on-chain conditions.

### Time-based Trigger

Before you begin, deploy the contract that you want to automate. You will also need the ABI for your contract if it has not been verified. Your contract does not have to be [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../job-scheduler/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **Time-based** trigger. Provide the address of your deployed contract, provide the ABI if it is not verified, and choose the function that you want to automate alogn with the relevant function inputs, if any.

1. Specify the time schedule using [CRON](../job-scheduler/#specifying-the-time-schedule).

1. Complete the remaining details. Your Upkeep name will be visible to all, but your email and Project Name will not be visible to all. Your gas limit needs to include an extra [150K](../job-scheduler/#entering-upkeep-details) for execution.

1. Fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/).

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

For more details on time-based automation, click [here](../job-scheduler/).

### Custom logic Trigger

To use a custom logic trigger, you will need to make your contract [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **custom logic** trigger. Provide the address of your [Keepers-compatible](../compatible-contracts/) contract and complete the remaining details. Your upkeep name will be publicly visible, but your email and project name will not be publicly visible. Ensure you specify the appropriate gas limit for your function to execute on chain.

1. Fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/).

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

1. For more details on custom-logic automation, click [here](../compatible-contracts/).

> ❗️ **WARNING**
>
> Do **NOT** attempt to send LINK to your contract like you do with [VRF](../../get-a-random-number/). For Chainlink Keepers, contracts are funded via the registry rather than within your contract.

  > 🚧 Funding Upkeep
    >
    > Fund your contract with more LINK than you anticipate you will need. The network will not check or perform your upkeep if your balance is too low based on current exchange rates. View the [Keepers Economics](../keeper-economics) page to learn more about the cost of using Keepers.

  > 🚧 ERC677 Link
    >
    > For registration on a mainnet, you must use ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](../../link-token-contracts/) from [faucets.chain.link](https://faucets.chain.link/).

## Supported Networks and Costs

For a list of blockchains that is supported by Chainlink Keepers, see the [Supported Networks](../supported-networks) page. To learn more about the cost of using Chainlink Keepers, see the [Keepers Economics](../keeper-economics) page.

## Questions and Examples

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).

To understand different use cases for Chainlink Keepers, refer to [Other Tutorials](/docs/other-tutorials/).
