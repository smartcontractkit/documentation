---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Time-based automation': '/docs/chainlink-keepers/job-scheduler/',
  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

## Overview

Automate your smart contracts using **Chainlink Keepers**, the decentralized and highly reliable smart contract automation service. Relying on Chainlink Keepers will help you get to market faster and save gas by offloading expensive on-chain automation logic to our decentralized Keepers Network. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To learn more about how the Chainlink Keepers Network automates your smart contracts, read the [Chainlink Keepers Architecture](../overview) page.


## Getting Started

<div class="remix-callout">
    <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
</div>

To start using Chainlink Keepers, you must determine which trigger mechanism to use. The trigger mechanism determines when your function should run. Once you have selected your trigger, follow the steps below.

1. If your contract function needs to run repeatedly using a pre-specified time schedule, then use a [time based trigger](#time-based-trigger).

2. If your contract requires custom logic to run, then use a [custom logic trigger](#custom-logic-trigger). Examples of this include checking the balance on a contract, only executing limit orders when their levels are met, or changing the state of certain entities based on some on-chain conditions.


### Time-based Trigger

To use a time-based trigger, follow these steps. Before you begin, your contract should be deployed. You will also need the ABI for your contract if it has not been verified. Your contract should **not** be [Keepers-compatible](../compatible-contracts/).

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **Time-based** trigger. Provide the address of your deployed contract, provide the ABI if not verified, and choose the function you want to automate with relevant inputs.

2. Specify the time schedule using [CRON](../job-scheduler/#specifying-the-time-schedule).

3. Complete the remaining details. Your email will be encrypted, but the project name will be visible to all. You need to fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/). Your gas limit needs to include an extra [150K](../job-scheduler/#entering-upkeep-details).

4. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

For more details on time-based automation, click [here](../job-scheduler/).

### Custom Logic Trigger

To use a custom logic trigger, follow these steps. Before you begin, you will need to make your contract [Keepers-compatible](../compatible-contracts/).

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) and select a **Custom logic** trigger. Provide the address of your contract and complete the remaining details. Your email will be encrypted, but the project name will be visible to all. You need to fund your Upkeep with [ERC-677 LINK](../../link-token-contracts/).

2. After your Upkeep is registered, [manage](../manage-upkeeps/) it in the Keepers App.

3. For more details on custom logic automation, click [here](../compatible-contracts/).


> ❗️ **WARNING**
>
> Do **NOT** attempt to send LINK to your contract like you do with [VRF](../../get-a-random-number/). For Chainlink Keepers, contracts are funded via the registry rather than within your contract.


> ⚠️ Registration Onboarding Note
>
> Registrations on a testnet will be approved immediately. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Keepers, see the [Supported Networks](../supported-networks)  page. To learn more about the cost of using Chainlink Keepers, see the [Keepers Economics](../keeper-economics) page.


## Questions and Examples

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).

To understand different use cases for Chainlink Keepers, refer to [Other Tutorials](/docs/other-tutorials/).
