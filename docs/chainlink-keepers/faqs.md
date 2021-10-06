---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Chainlink Keepers Frequently Asked Questions'
---
## Why should I use Chainlink Keepers?

There's lots of reasons we think Chainlink Keepers are great.

Chainlink Keepers:

- provide developers with hyper-reliable, decentralized smart contract automation
- offer expandable computation allowing developers to build more advanced dApps at lower costs
- are flexible and highly programmable

## Will Chainlink Keepers work for my use case?

We are here to help! For help with your use case, please [reach out directly](mailto:keeper@chain.link) and we would be happy to connect you with one of our Solutions Architects. You can also ask questions about Chainlink Keepers on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink) or in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT).

## Is the Chainlink Keeper Network available on platforms other than Ethereum?

At this time, The Chainlink Keeper Network is available on Ethereum's Kovan testnet and mainnet. [Follow us](https://twitter.com/chainlink) or [join our community](https://discord.com/channels/592041321326182401/821350860302581771) for the latest updates when we integrate with other platforms.

## How long does a Keeper take to respond when the condition is fulfilled?

Chainlink Keepers check blocks to determine if predefined conditions are met. If the condition returns true, the Keeper will broadcast the transaction immediately.

## What gas price does the Keeper use to trigger the function?

Keepers will select an optimal gas price based on the transactions within the last several blocks upon initial submission. It will continue to monitor the transaction and perform gas “bumping” - replacing the transaction with an updated (higher) gas price - at preset block intervals until it observes the corresponding transaction event.

## What is the cost structure?

You register your Upkeep and fund it with LINK. The Keepers are paid from your Upkeep balance when it performs the Upkeep at a 20% premium over the gas cost. Gas costs includes the gas required for your Keeper-compatible contract to complete execution and an 80k overhead from the `KeeperRegistry` itself.

## How do I join the Chainlink Keepers Network as a node operator?

We are not accepting new Keepers at this time, but be sure to sign up for our [mailing list](/docs/developer-communications/), or join our [Discord server](https://discord.gg/qj9qarT) to be notified when this becomes available.

## Why do I need to register my Upkeep?

Registering an Upkeep with the Chainlink Keepers App notifies the Keeper Network about your contract, and allows you to fund it so your work is performed continuously. As part of the registration, we’re requesting some information that will help us to deliver the optimal experience for your use case as we continue to improve the product.
