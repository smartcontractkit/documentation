---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Introduction to Chainlink Keepers'
whatsnext:
  {
    'Make your contract Keepers-compatible': '/docs/chainlink-keepers/compatible-contracts/',
  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)

## Overview

Automate your smart contracts using **Chainlink Keepers**, Chainlink Labs' decentralized and highly reliable smart contract automation service. Relying on Chainlink Keepers will help you get to market faster and save gas by offloading expensive on-chain automation logic to our decentralized Keepers Network. To take full advantage of the Keepers automation infrastructure, read all of the documentation to understand the features of Chainlink Keepers.

To learn more about how the Chainlink Keepers Network automates your smart contracts, read the [Chainlink Keepers Architecture](../overview) page.


## Using Chainlink Keepers

<div class="remix-callout">
    <a href="https://keepers.chain.link" >Open the Chainlink Keepers App</a>
</div>

You can automate your smart contract using the following steps:

1. Make your contract [Keepers-compatible](../compatible-contracts/) so the Keepers Network knows how to check if your contract should be called, and what to do when calling your contract.

1. [Register](../register-upkeep/) a new Upkeep in the [Chainlink Keepers App](https://keepers.chain.link) so the Keepers Network knows to monitor your contract and fund your Upkeep with [LINK](../../link-token-contracts/). For registration on mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/).

1. After your Upkeep is registered and funded, [manage](../manage-upkeeps/) it in the Keepers App.

> ❗️ **WARNING**
>
> Do **NOT** attempt to send LINK to your contract like you do with [VRF](../../get-a-random-number/). For Chainlink Keepers, contracts are funded via the registry rather than within your contract.


> ⚠️ Registration Onboarding Note
>
> Registrations on a testnet will be approved immediately. Mainnet registrations will be reviewed by our onboarding team before being approved. We are working towards a fully self-serve model.

## Supported Networks and Cost

For a list of blockchains that is supported by Chainlink Keepers, see the [Supported Networks](../supported-networks)  page. To learn more about the cost of using Chainlink Keepers, see the [Keepers Economics](../keeper-economics) page.


## Questions

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).
