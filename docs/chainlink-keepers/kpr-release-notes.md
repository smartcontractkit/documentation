---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Release Notes'
whatsnext:
  {
    'Register a time-based Upkeep': '/docs/chainlink-keepers/job-scheduler/','Register a Custom Logic Upkeep': '/docs/chainlink-keepers/register-upkeep/',

  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)


**Chainlink Keepers** release notes

**Table of Contents**

+ [V1.2](#v1.2)
+ [Manually migrating Upkeeps from V1.1 to V1.2](#Manually-migrating-Upkeeps-from-V1.1-to-V1.2)
+ [Underfunded Upkeep email notifications](#Underfunded-Upkeep-email-notifications)
+ [Keepers on Fantom](#fantom)
+ [Keepers on Avalanche](#avalanche)
+ [Keepers on Binance Smart Chain and Polygon](#bnb-and-polygon)
+ [Keepers v1.1 launch on Ethereum](#Keepers-v1.1-launch-on-Ethereum)


## V1.2

Keepers Registry v1.2 launched on 2022-08-04 on Ethereum, Binance Smart Chain, Polygon, Avalanche, and Fantom

- **Automatic Upkeep registration approval**: All upkeeps on supported mainnets are now automatically approved.
- **Programmatic control**: With automatic approval you can now dynamically create, manage, and fund Upkeeps from within your dApps and even have an Upkeep fund itself. Learn more [here](../register-upkeep/#register-an-upkeep-using-your-own-deployed-contract)
- **Advanced turn-taking algorithm**: Our turn taking algorithm now supports Upkeeps that require high-frequency execution.
- **Durable ID and user-triggered migration**: All Upkeeps created in v1.2 and onwards will have durable IDs. V1.2 also supports user-triggered migration to future registry versions to make it easier to migrate to a new Keepers Registry to benefit from new features, but still retain the existing ID. The ID is now a hash in format of a 77 digit integer.
- **Configurable Upkeeps**: You can now edit the gas limit of your Upkeep to easily customize your Upkeep to fit your needs, without having to create a new one.
- **Off-chain compute improvements**: We improved our off-chain compute sequence to get a higher-fidelity representation of the gas and logic before transactions are submitted on-chain. This helps to reduce reverts, saving users money.
- **Minimum spend requirement**: As part of the mission to continuously enhance the security of the Chainlink Network for all participants, a minimum spend requirement of 0.1 LINK is being introduced to discourage network spam. What this means is if a canceled Upkeep does not meet the minimum spend requirement, then 0.1 LINK will be reserved for node operators. If more than the minimum amount is spent on an Upkeep, the full remaining balance on the Upkeep is withdrawable when the Upkeep is canceled.

## Manually migrating Upkeeps from V1.1 to V1.2
If your Upkeep ID has 77 digits, it is on the V1.2 Upkeep (don't read further). If your Upkeep ID has less than 4 digits, your Upkeep is on the v1.1 registry. To migrate your Upkeep from Keepers v1.1 to Keepers v1.2, you can cancel it in the Keepers App, and register an exact copy of the Upkeep in the Keepers App. While you can see Upkeeps from both v1.1 and v1.2 in the Keepers App, all new Upkeeps in the Keepers App will be automatically created on Keepers v1.2.

## Underfunded Upkeep email notifications

You will now receive notifications to the email address you register in your Upkeep when your Upkeep is underfunded. We are limiting notifications on the same Upkeep to once per week.

## Keepers on Fantom

Chainlink Keepers is live on the Fantom Network, [Mainnet](https://keepers.chain.link/fantom) and [Testnet](https://keepers.chain.link/fantom-testnet)!

## Keepers on Avalanche

Chainlink Keepers is live on the Avalanche Network, [Mainnet](https://keepers.chain.link/avalanche) and [Testnet](https://keepers.chain.link/fuji)!

## Keepers on Ethereum Rinkeby

Chainlink Keepers is live on [Ethereum Rinkeby](https://keepers.chain.link/rinkeby)!


## Keepers on Binance Smart Chain and Polygon

Chainlink Keepers is live on the both Binance Smart Chain [Mainnet](https://keepers.chain.link/bsc) and [Testnet](https://keepers.chain.link/chapel), and Polygon [Mainnet](https://keepers.chain.link/polygon) and [Testnet](https://keepers.chain.link/mumbai)!

## Keepers v1.1 launch on Ethereum

Chainlink Keepers officially launched on [Ethereum Mainnet](https://keepers.chain.link/mainnet) and [Ethereum Kovan](https://keepers.chain.link/kovan)!

## Questions

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page, ask them in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [reach out to us](https://forms.gle/WadxnzzjHPtta5Zd9).
