---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Release Notes'
whatsnext:
  {
    'Register a time-based upkeep': '/docs/chainlink-keepers/job-scheduler/','Register a Custom Logic Upkeep': '/docs/chainlink-keepers/register-upkeep/',

  }
---
![Chainlink Keeper Network Banner](/images/contract-devs/generic-banner.png)


**Chainlink Keepers release notes:**


- [v1.3 release](#2022-09-23---v13-release)
- [v1.2 release](#2022-08-04---v12-release)
  - [Manually migrating upkeeps from v1.1 to v1.2](#manually-migrating-upkeeps-from-v11-to-v12)
- [Underfunded upkeep email notifications](#2022-07-21---underfunded-upkeep-notifications)
- [Keepers on Fantom](#2022-06-29---keepers-on-fantom)
- [Keepers on Avalanche](#2022-06-09---keepers-on-avalanche)
- [Keepers on Ethereum Rinkeby](#2022-03-01---keepers-on-ethereum-rinkeby)
- [Keepers on Binance Smart Chain and Polygon](#2021-11-18---keepers-on-binance-smart-chain-and-polygon)
- [Keepers v1.1 launch on Ethereum](#2021-08-05---keepers-v11-launch-on-ethereum)
- [Questions](#questions)


## 2022-09-23 - v1.3 Release

Keepers Registry v1.3 [launched on Arbitrum Mainnet](/docs/chainlink-keepers/supported-networks/#arbitrum).


## 2022-08-04 - v1.2 Release

Keepers Registry v1.2 launched on Ethereum, Binance Smart Chain, Polygon, Avalanche, and Fantom

- **Automatic upkeep registration approval**: All upkeeps on supported mainnets are now automatically approved.

- **Programmatic control**: With automatic approval, you can now dynamically create, manage, and fund upkeeps from within your dApps and even have an upkeep fund itself. Learn more [here](/docs/chainlink-keepers/register-upkeep/#register-an-upkeep-using-your-own-deployed-contract).

- **Advanced turn-taking algorithm**: Our turn taking algorithm now supports upkeeps that require high-frequency execution.

- **Durable ID and user-triggered migration**: All upkeeps created in versions v1.2 and later will have durable IDs. v1.2 also supports user-triggered migration to future registry versions to make it easier to migrate to a new Keepers Registry and benefit from new features. Future migrations can still retain the existing ID. The ID is now a hash in format of a 77 digit integer.

- **Configurable upkeeps**: You can now edit the gas limit of your upkeep to easily customize your upkeep to fit your needs without having to create a new upkeep.

- **Off-chain compute improvements**: The off-chain compute sequence is improved for higher-fidelity representation of the gas and logic before transactions are submitted on-chain. This helps to reduce reverts and reduce fees.

- **Minimum spend requirement**: As part of the mission to continuously enhance the security of the Chainlink Network for all participants, each registered upkeep will have a minimum spend requirement of 0.1 LINK, in aggregate across all transactions for the upkeep, to discourage network spam. Note that an *upkeep* is the automation job itself. It is not a transaction. Each upkeep can have thousands of transactions. If an upkeep has not spent more than 0.1 LINK across all transactions at the time of cancellation, then 0.1 LINK will be retained for the network. If more than 0.1 LINK has been spent by an upkeep, the full remaining balance of the upkeep will be withdrawable when the upkeep is canceled.

### Manually migrating upkeeps from v1.1 to v1.2

If your upkeep ID has 77 digits, it is already migrated to v1.2 and no further action is required. If your upkeep ID has less than 4 digits, your upkeep is on the v1.1 registry. To migrate your upkeep from Keepers v1.1 to Keepers v1.2, you can cancel it in the Keepers App, and register an exact copy of the upkeep in the Keepers App. While you can see upkeeps from both v1.1 and v1.2 in the [Keepers App](https://keepers.chain.link), all new upkeeps in the Keepers App will be automatically created on Keepers v1.2.

## 2022-07-21 - Underfunded upkeep notifications

You will now receive notifications to the email address you register in your upkeep when your upkeep is underfunded. We are limiting notifications on the same upkeep to once per week.

## 2022-06-29 - Keepers on Fantom

Chainlink Keepers is live on the Fantom Network, [Mainnet](https://keepers.chain.link/fantom) and [Testnet](https://keepers.chain.link/fantom-testnet).

## 2022-06-09 - Keepers on Avalanche

Chainlink Keepers is live on the Avalanche Network, [Mainnet](https://keepers.chain.link/avalanche) and [Testnet](https://keepers.chain.link/fuji).

## 2022-03-01 - Keepers on Ethereum Rinkeby

Chainlink Keepers is live on [Ethereum Rinkeby](https://keepers.chain.link/rinkeby).

## 2021-11-18 - Keepers on Binance Smart Chain and Polygon

Chainlink Keepers is live on the both Binance Smart Chain [Mainnet](https://keepers.chain.link/bsc) and [Testnet](https://keepers.chain.link/chapel), and Polygon [Mainnet](https://keepers.chain.link/polygon) and [Testnet](https://keepers.chain.link/mumbai).

## 2021-08-05 - Keepers v1.1 launch on Ethereum

Chainlink Keepers officially launched on [Ethereum Mainnet](https://keepers.chain.link/mainnet).

## Questions

If you have questions, read the [Keepers Frequently Asked Questions](../faqs/) page. You can also ask questions in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [contact us](https://forms.gle/WadxnzzjHPtta5Zd9) for assistance with registration.
