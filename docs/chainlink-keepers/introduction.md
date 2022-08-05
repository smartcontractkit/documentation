---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Register a time-based Upkeep': '/docs/chainlink-keepers/job-scheduler/','Register a Custom Logic Upkeep': '/docs/chainlink-keepers/register-upkeep/','Create a Keepers-compatible contract for custom logic Upkeep': '/docs/chainlink-keepers/compatible-contracts/','Keepers architecture': '/docs/chainlink-keepers/overview/', 'Keepers economics': '/docs/chainlink-keepers/keeper-economics/'

  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

**Chainlink Keepers** enables conditional execution of your smart contracts functions through a hyper-reliable and decentralized automation platform that uses the same external network of node operators that secures billions in value. Building on Chainlink Keepers will help you get to market faster so you don't have to deal with the setup cost, ongoing maintenance, and risks associated with a centralized automation stack. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To learn more about how the Chainlink Keepers Network automates your smart contracts, read the [Chainlink Keepers Architecture](../overview) page.

**Topics**

+ [Select a Trigger](#select-a-trigger)
  + [Time-based Trigger](#time-based-trigger)
  + [Custom logic Trigger](#custom-logic-trigger)
+ [Supported Networks and Costs](#supported-networks-and-costs)
+ [Questions and Examples](#questions-and-examples)

## Select a Trigger

Chainlink Keepers will reliably execute smart contract functions using a variety of triggers.

- [Time-based trigger](#time-based-trigger): Use a [time based trigger](#time-based-trigger) if you want Keepers to execute your function according to a time schedule. We simply call it the Job Scheduler and it is a throwback to the Ethereum Alarm Clock. Your contract does not need to be [Keepers-compatible](../compatible-contracts/).
- [Custom logic trigger](#custom-logic-trigger): Use [custom logic trigger](#custom-logic-trigger) if you want to provide custom solidity logic that Keepers will evaluate (off-chain) to determine when to execute your function on-chain. Your contract should be [Keepers-compatible](../compatible-contracts/). Custom logic examples include checking the balance on a contract, only executing limit orders when their levels are met, any one of our [coded examples](/docs/chainlink-keepers/util-overview), and many many more.

### Time-based Trigger

Before you begin, deploy the contract that you want to automate. You will also need the ABI for your contract if it has not been verified. Your contract does not have to be [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../job-scheduler/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select **Time-based** trigger. Provide the address of your deployed contract, provide the ABI if it is not verified, and choose the function that you want to automate along with the relevant function inputs, if any.

1. Specify the time schedule using [CRON](../job-scheduler/#specifying-the-time-schedule).

1. Complete the remaining details. Your upkeep name will be publicly visible, but your email and project name will not be publicly visible. Your gas limit needs to include an extra [150K](../job-scheduler/#entering-upkeep-details) for execution.

1. Fund your Upkeep with ERC-677 LINK. See the [LINK token contracts](../../link-token-contracts/) page to determine where to acquire ERC-677 LINK.

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

For more details on time-based automation, click [here](../job-scheduler/).

### Custom logic Trigger

To use a custom logic trigger, you will need to make your contract [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select **Custom logic** trigger. Provide the address of your [Keepers-compatible](../compatible-contracts/) contract and complete the remaining details. Your upkeep name will be publicly visible, but your email and project name will **not** be publicly visible. Ensure you specify the appropriate gas limit for your function to execute on chain.

1. Fund your Upkeep with ERC-677 LINK. See the [LINK token contracts](../../link-token-contracts/) page to determine where to acquire ERC-677 LINK.

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

1. For more details on custom logic automation, click [here](../compatible-contracts/).

> ❗️ **WARNING**
>
> Do **NOT** attempt to send LINK to your contract like you do with [VRF](../../get-a-random-number/). For Chainlink Keepers, contracts are funded via the registry rather than within your contract.

> 🚧 Funding Upkeep
>
> Fund your Upkeep with more LINK than you anticipate you will need. The network will not check or perform your upkeep if your balance is too low based on current exchange rates. View the [Keepers Economics](../keeper-economics) page to learn more about the cost of using Keepers.

> 🚧 ERC677 Link
>
> For registration you must use ERC-677 LINK. Read our [LINK](../../link-token-contracts/) page to determine where to acquire mainnet LINK, or visit our [faucets.chain.link](https://faucets.chain.link/) for testnet LINK.

## Supported Networks and Costs

For a list of blockchains that is supported by Chainlink Keepers, see the [Supported Networks](../supported-networks) page. To learn more about the cost of using Chainlink Keepers, see the [Keepers Economics](../keeper-economics) page.

## Questions and Examples

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).

To understand different use cases for Chainlink Keepers, refer to [Other Tutorials](/docs/other-tutorials/).
