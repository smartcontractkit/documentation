---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Keepers Economics'
whatsnext:
  {
    'FAQs': '/docs/chainlink-keepers/faqs/',
  }
---

## How Funding Works

Your balance is reduced each time a Keeper executes your `performUpkeep` method. There is no cost for `checkUpkeep` calls. If you want to automate adding funds, you can directly call the `addFunds()` function on the `KeeperRegistry` contract. Anyone can call the `addFunds()` function.

## Cost of using Keepers

When a Keeper performs your Upkeep, the Keeper Registry will deduct the Upkeep's total gas cost in LINK from your Upkeep’s LINK balance on the Registry and allocate it to the Keeper’s address. The total gas cost in LINK is the gas price times the total gas used, which is then converted to LINK using Chainlink Data Feeds for the conversion rate. The total gas used is the sum of your performUpkeep's gas, an 80K gas overhead for the Registry, and a transaction payment premium. The payment premium varies by network and is listed in our [Supported Networks](../supported-networks/#configurations) page.

## No node competition

Chainlink Keepers do not compete with one another, but rather work together to ensure all registered Upkeeps are performed. This makes costs more predictable upfront, enabling you to estimate costs based on the expected gas consumption.

## Minimum balance

The network is designed to perform your work even under conditions where gas prices spike. In order to ensure appropriate payment to the Keepers, your LINK balance must exceed the maximum amount that could be paid for performance.

The minimum balance is calculated using the current fast gas price, the Gas Limit you entered for your Upkeep, the max gas multiplier, and the for conversion to LINK. To find the latest value for the `gasCeilingMultiplier`, see the [Registry Configuration](../supported-networks/#configurations).

Follow [maintain a minimum balance](../manage-upkeeps/#maintain-a-minimum-balance) to ensure your Upkeep is funded.

## Price selection and Gas Bumping

Chainlink Keeper nodes select the gas price dynamically based on the prices of transactions within the last several blocks. This optimizes the gas price based on current network conditions. Keepers are configured to select a price based on a target percentile.

If the Keeper node does not see the `performUpkeep` transaction get confirmed within the next few blocks, it automatically replaces the transaction and bumps the gas price. This process repeats until the transaction is confirmed.

## ERC-677 Link

For funding on mainnet, you will need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To fund on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).
