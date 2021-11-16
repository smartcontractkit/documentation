---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: 'Chainlink Keepers Frequently Asked Questions'
---

## Will Chainlink Keepers work for my use case?

We are here to help! For help with your use case, please [reach out directly](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-keepers) and we would be happy to connect you with one of our Solutions Architects. You can also ask questions about Chainlink Keepers on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink) or in the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT).

## Is the Chainlink Keeper Network available on platforms other than Ethereum?

At this time, The Chainlink Keeper Network is available on Ethereum's Kovan testnet and mainnet. [Follow us](https://twitter.com/chainlink) or [join our community](https://discord.com/channels/592041321326182401/821350860302581771) for the latest updates when we integrate with other platforms.

## How long does a Keeper take to respond when the condition is fulfilled?

Chainlink Keepers check blocks to determine if predefined conditions are met. If the condition returns true, the Keeper will broadcast the transaction immediately.

## What gas price does the Keeper use to trigger the function?

Keepers will select an optimal gas price based on the transactions within the last several blocks upon initial submission. It will continue to monitor the transaction and perform gas “bumping” - replacing the transaction with an updated (higher) gas price - at preset block intervals until it observes the corresponding transaction event.

## How do I join the Chainlink Keepers Network as a node operator?

We are not accepting new Keepers at this time, but be sure to sign up for our [mailing list](/docs/developer-communications/), or join our [Discord server](https://discord.gg/qj9qarT) to be notified when this becomes available.