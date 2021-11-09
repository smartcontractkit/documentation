---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Design Patterns and Best Practices'
whatsnext:
  {
    'Network Overview': '/docs/chainlink-keepers/overview/',
  }
---
Chainlink Keepers are a powerful tool for smart contract automation. This guide demonstrates some useful patterns and best practices that you can employ within Keeper-compatible smart contracts.

It is important to understand the gas limits for on-chain execution and off-chain computation when developing your Keeper-compatible smart contract. To learn more about the economics of Chainlink Keepers, read the [Keepers Network Overview](../overview/).

## Useful patterns

These patterns are not mutually exclusive. Review and make use of the patterns that make sense for your use case.

> 📘 Important note
>
> The `KeeperRegistry` enforces a cap for gas used both on-chain and off-chain. See the [Keepers Network Overview](../overview/) for details. The caps are configurable and might change based on user feedback. Be sure that you understand these limits if your use case requires a large amount of gas.

## Gas limits

When developing your keeper-compatible smart contracts, it is critical to understand the gas limits you are working with on the KeeperRegistry. There is a `check` gas limit and a `call` gas limit that your contract must adhere to in order to operate successfully. See the [Keepers Network Overview](../overview/) to learn the current configuration.

## Testing

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keeper-compatible contract operates within the parameters of the `KeeperRegistry`.

Test all of your mission-critical contracts, and stress-test the contract to confirm the performance and correct operation of your use case under load and adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. [Reach out](https://forms.gle/WadxnzzjHPtta5Zd9) to us if you need help, have questions, or feedback for improvement.
