---
layout: nodes.liquid
section: ethereumKeepers
date: Last Modified
title: 'Chainlink Keepers Frequently Asked Questions'
---

## Will Chainlink Keepers work for my use case?

For help with your specific use case, [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-keepers) to connect with one of our Solutions Architects. You can also ask questions about Chainlink Keepers on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink) or the [#keepers channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT).

## Is the Chainlink Keeper Network available on platforms other than Ethereum?

Keepers are available on the networks listed in the [Supported Blockchain Networks](../introduction/#supported-blockchain-networks) section. To see when we integrate with other platforms, [follow us on Twitter](https://twitter.com/chainlink) or [join our community on Discord](https://discord.com/channels/592041321326182401/821350860302581771).

## How long does a Keeper take to respond when the condition is fulfilled?

Chainlink Keepers check blocks to determine if predefined conditions are met. If the condition returns true, the Keeper will broadcast the transaction immediately.

## What gas price does the Keeper use to trigger the function?

Keepers select an optimal gas price based on the transactions within the last several blocks upon initial submission. A Keeper will continue to monitor the transaction and perform gas “bumping”, a process which replaces the transaction with an updated (higher) gas price at preset block intervals. The "bumping" continues until the Keeper observes the corresponding transaction event.

## How do I join the Chainlink Keepers Network as a node operator?

We are not accepting new Keepers at this time, but be sure to sign up for our [mailing list](/docs/developer-communications/), or join our [Discord server](https://discord.gg/qj9qarT) to be notified when this becomes available.
