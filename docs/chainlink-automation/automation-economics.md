---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Chainlink Automation Economics'
whatsnext:
  {
    'FAQs': '/docs/chainlink-automation/faqs/',
  }
---

## Cost of using Chainlink Automation

There is no fee for registering a Chainlink Automation job. There is a 0.1 LINK cancellation fee that only applies to jobs which have not spent more than 0.1 LINK over their entire lifespan. This cancellation fee is to protect node operators from spammers who register jobs that never perform.

## How Funding Works

Upkeeps have a LINK (ERC-677) balance. Every time an Automation Node executes the `performUpkeep` function, the LINK balance will be reduced. You can add funds using the Chainlink Automation App or by directly calling the `addFunds()` function on the `AutomationRegistry` contract. Anyone can call the `addFunds()` function.

When an Automation Node executes the `performUpkeep` function, the Chainlink Automation Registry will deduct the upkeep's total gas cost in LINK and a percentage premium from the upkeep’s LINK balance and allocate it to the Automation Node's address. The total gas cost (in LINK) comprises of the gas price of the transaction multiplied by the sum of the gas used for the transaction and an 80K gas overhead for the Automation Node call gas used. Chainlink Data Feeds convert this total amount to LINK. 

The percentage premium compensates the Automation Node for monitoring and performing your upkeep. The percentage premium varies by network and is listed in our [Supported Networks](../supported-networks/#configurations) page.


## Minimum Spend Requirement

To prevent misuse of the Chainlink Automation network, each registered upkeep requires a small minimum spend of 0.1 LINK across all upkeep transactions. If the total LINK spent across all transactions for the upkeep does not exceed this amount, the difference between 0.1 LINK and the amount spent in LINK is not refunded after you cancel the upkeep. If you spend more than 0.1 LINK across all of your upkeep's transactions, all remaining LINK is refundable after you cancel. This amount is intentionally small so that even a few upkeep transactions on the cheapest networks can easily exceed this amount.

## No node competition

Individual Automation Nodes do not compete with one another, but rather work together to ensure all registered upkeeps are performed. This makes costs more predictable upfront, enabling you to estimate costs based on the expected gas consumption.

## Minimum balance

The Chainlink Automation Network is designed to perform your upkeep even when gas prices spike. The minimum balance in LINK reflects the best estimate of the cost to perform your upkeep when gas prices spike. To ensure your upkeep is monitored and performed, ensure that your upkeep's balance is above this minimum balance.

The minimum balance is calculated using the current fast gas price, the gas limit you entered for your upkeep, the max gas multiplier, and the for conversion to LINK. To find the latest value for the `gasCeilingMultiplier`, see the [Registry Configuration](../supported-networks/#configurations) page.

Follow [maintain a minimum balance](../manage-upkeeps/#maintain-a-minimum-balance) to ensure that your upkeep is funded.

## Price selection and Gas Bumping

Automation Nodes select the gas price dynamically based on the prices of transactions within the last several blocks. This optimizes the gas price based on current network conditions. Automation Nodes are configured to select a price based on a target percentile.

If the Automation Node does not see the `performUpkeep` transaction get confirmed within the next few blocks, it automatically replaces the transaction and bumps the gas price. This process repeats until the transaction is confirmed.

## ERC-677 Link

For funding on mainnet, you will need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To fund on a supported testnet, get [LINK](../../link-token-contracts/) for the testnet you are using from our [faucet](https://faucets.chain.link/).
