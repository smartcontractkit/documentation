---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Make your contract Keepers-compatible': '/docs/chainlink-keepers/compatible-contracts/',
    'Time-based automation': '/docs/chainlink-keepers/job-scheduler/',
  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

Automate your smart contracts using **Chainlink Keepers**, the decentralized and highly reliable smart contract automation service. Relying on Chainlink Keepers will help you get to market faster and save gas by offloading expensive on-chain automation logic to our decentralized Keepers Network. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To learn more about how the Chainlink Keepers Network automates your smart contracts, read the [Chainlink Keepers Architecture](../overview) page.

**Table of Contents**

+ [Select a Trigger](#select-a-trigger)
  + [Time-based Trigger](#time-based-trigger)
  + [Custom Logic Trigger](#custom-logic-trigger)
+ [Supported Networks and Costs](#supported-networks-and-costs)
+ [Questions and Examples](#questions-and-examples)

## Select a Trigger

To start using Chainlink Keepers, you must determine which trigger mechanism to use. The trigger mechanism determines when your function should run. The following triggers are avilable:

- [Time-based trigger](#time-based-trigger): If your contract function needs to run repeatedly using a pre-specified time schedule, use a [time based trigger](#time-based-trigger).
- [Custom logic trigger](#custom-logic-trigger): If your contract requires custom logic to run, use a [custom logic trigger](#custom-logic-trigger). Examples of this include checking the balance on a contract, only executing limit orders when their levels are met, or changing the state of certain entities based on some on-chain conditions.

### Time-based Trigger

Before you begin, deploy the contract that you want to automate. You will also need the ABI for your contract if it has not been verified. Your contract should **not** be [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **Time-based** trigger. Provide the address of your deployed contract, provide the ABI if it is not verified, and choose the function that you want to automate with relevant inputs.

1. Specify the time schedule using [CRON](../job-scheduler/#specifying-the-time-schedule).

1. Complete the remaining details. Your email will be encrypted, but the project name will be visible to all. Your gas limit needs to include an extra [150K](../job-scheduler/#entering-upkeep-details).

1. Fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/).

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

For more details on time-based automation, click [here](../job-scheduler/).

### Custom Logic Trigger

To use a custom logic trigger, you will need to make your contract [Keepers-compatible](../compatible-contracts/).

1. Open the Chainlink Keepers app.

    <div class="remix-callout">
        <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
    </div>

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **Custom logic** trigger. Provide the address of your contract and complete the remaining details. Your email will be encrypted, but the project name will be visible to all.

1. Fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/).

1. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

1. For more details on custom logic automation, click [here](../compatible-contracts/).

> ❗️ **WARNING**
>
> Do **NOT** attempt to send LINK to your contract. For Chainlink Keepers, contracts are funded via the registry rather than within your contract.

> ⚠️ Registration Onboarding Note
>
> Registrations on a testnet will be approved immediately. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.

## Supported Networks and Costs

For a list of blockchains that is supported by Chainlink Keepers, see the [Supported Networks](../supported-networks)  page. To learn more about the cost of using Chainlink Keepers, see the [Keepers Economics](../keeper-economics) page.

## Questions and Examples

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).

To understand different use cases for Chainlink Keepers, refer to [Other Tutorials](/docs/other-tutorials/).
