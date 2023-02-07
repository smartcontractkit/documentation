---
layout: ../../layouts/MainLayout.astro
section: automation
date: Last Modified
title: "Chainlink Automation Economics"
whatsnext: { "FAQs": "/chainlink-automation/faqs/" }
---

## Cost of using Chainlink Automation

Chainlink Automation only requires an execution fee for transactions on-chain. This fee includes the transaction cost, a percentage premium (refer to the formula below), and a small fixed gas overhead accounting for gas between the network and the registry. The premium compensates the Automation Network for monitoring and performing your upkeep. The premium varies by chain and is listed on our [Supported Networks](/chainlink-automation/supported-networks/) page.

![Automation Pricing Formula](/images/automation/automation-pricing.png)

There is no registration fee or other fees for any off-chain computation.

**Example**: An upkeep transaction was executed on _Polygon mainnet_. It used _1.16M_ gas at a gas price of _183.3 gwei_. The premium percentage on Polygon is _70%_ (as of October 2022) and the Matic/LINK exchange rate is _0.131_. The upkeep's LINK balance will be reduced by a fee of _0.00495 LINK_.

![Automation Pricing Example](/images/automation/automation-pricing-example.png)

## How Funding Works

Upkeeps have a LINK (ERC-677) balance. Every time an on-chain transaction is performed for your upkeep, its LINK balance will be reduced by the LINK fee.

Your upkeep's balance must exceed the minimum balance. If this requirement is not met, the Automation Network will not perform on-chain transactions. You can add funds using the [Chainlink Automation App](https://automation.chain.link/) or by directly calling the `addFunds()` function on the `AutomationRegistry` contract. Anyone can call the `addFunds()` function.

## Withdrawing funds

To withdraw a LINK balance, you must cancel your upkeep first. Any upkeep that has not spent more than an aggregated amount of 0.1 LINK fees over the span of its lifetime is subject to a _0.1 LINK_ fee. This cancellation fee protects node operators from spammers who register jobs that never perform.

**Example 1**: Your upkeep has spent _4.8 LINK_ over its lifetime and has a balance of _5 LINK_. When it is cancelled, I will receive _5 LINK_.
**Example 2**: Your upkeep has spent _0 LINK_ over its lifetime and has a balance of _5 LINK_. When it is cancelled, I will receive _4.9 LINK_.

## No node competition

Individual Automation Nodes do not compete with one another, but rather work together to ensure all registered upkeeps are performed. This makes costs more predictable upfront, enabling you to estimate costs based on the expected gas consumption.

## Minimum balance

The Chainlink Automation Network is designed to perform your upkeep even when gas prices spike. The minimum balance in LINK reflects the best estimate of the cost to perform your upkeep when gas prices spike. To ensure your upkeep is monitored and performed, ensure that your upkeep's balance is above this minimum balance.

The minimum balance is calculated using the current fast gas price, the gas limit you entered for your upkeep, the max gas multiplier, and the for conversion to LINK. To find the latest value for the `gasCeilingMultiplier`, see the [Registry Configuration](/chainlink-automation/supported-networks/#configurations) page.

Follow [maintain a minimum balance](/chainlink-automation/manage-upkeeps/#maintain-a-minimum-balance) to ensure that your upkeep is funded.

## Price selection and Gas Bumping

Automation Nodes select the gas price dynamically based on the prices of transactions within the last several blocks. This optimizes the gas price based on current network conditions. Automation Nodes are configured to select a price based on a target percentile.

If the Automation Node does not see the `performUpkeep` transaction get confirmed within the next few blocks, it automatically replaces the transaction and bumps the gas price. This process repeats until the transaction is confirmed.

## ERC-677 Link

For funding on mainnet, you will need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To fund on a supported testnet, get [LINK](/resources/link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).
