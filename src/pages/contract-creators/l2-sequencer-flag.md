---
layout: ../../layouts/MainLayout.astro
section: ethereum
date: Last Modified
title: "L2 Sequencer Uptime Feeds"
permalink: "docs/l2-sequencer-flag/"
---

## Overview

Optimistic rollup protocols move all execution off the layer 1 (L1) Ethereum chain, complete execution on a layer 2 (L2) chain, and  return the results of the L2 execution back to the L1. These protocols have a [sequencer](https://community.optimism.io/docs/how-optimism-works/#block-production) that executes and rolls up the L2 transactions by batching multiple transactions into a single transaction.

If a sequencer becomes unavailable, it is impossible to access read/write APIs that consumers are using and applications on the L2 network will be down for most users without interacting directly through the L1 optimistic rollup contracts. The L2 has not stopped, but it would be unfair to continue providing service on your applications when only a few users can use them.

To help your applications identify when the sequencer is unavailable, you can use a data feed that tracks the last known status of the sequencer at a given point in time. This is to allow customers to prevent mass liquidations by providing a grace period to allow customers to react to such an event.

L2 sequencer feeds are available on the following networks:

- [Arbitrum mainnet](#sequencer-feed-proxy-addresses)
- [Ethereum Rinkeby testnet](#sequencer-feed-proxy-addresses)

## Architecture

L2 sequencer uptime feeds are architected similar to other Chainlink feeds. The diagram below shows how these feeds update and how a consumer retrieves the status of the Arbitrum sequencer.

![L2 Sequencer Feed Diagram](/images/data-feed/l2-diagram.png)

1. Chainlink nodes trigger an OCR round every 30s and update the sequencer status by calling the `validate` function in the [`ArbitrumValidator` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/dev/ArbitrumValidator.sol) by calling it through the [`ValidatorProxy` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ValidatorProxy.sol).
1. The `ArbitrumValidator` checks to see if the latest update is different from the previous update. If it detects a difference, it places a message in the [Arbitrum inbox contract](https://developer.offchainlabs.com/docs/inside_arbitrum#the-big-picture).
1. The inbox contract sends the message to the [`ArbitrumSequencerUptimeFeed` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/dev/ArbitrumSequencerUptimeFeed.sol). The message calls the `updateStatus` function in the `ArbitrumSequencerUptimeFeed` contract and updates the latest sequencer status to 0 if the sequencer is up and 1 if it is down. It also records the block timestamp to indicate when the message was sent from the L1 network.
1. A consumer contract on the L2 network can read these values from the [proxy contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/EACAggregatorProxy.sol), which reads values from the `ArbitrumSequencerUptimeFeed` contract.

## Handling Arbitrum outages

If the Arbitrum network becomes unavailable, the `ArbitrumValidator` contract continues to send messages to the L2 network through the delayed inbox on L1. This message stays there until the sequencer is back up again. When the sequencer comes back online after downtime, it processes all transactions from the delayed inbox before it accepts new transactions. The message that signals when the sequencer is down will be processed before any new messages with transactions that require the sequencer to be operational.

## Example code

Create your consumer contract for uptime feeds similarly to contracts you would use for other Chainlink data feeds. You will need the following items:

- The [sequencer uptime feed proxy address](#sequencer-feed-proxy-addresses): This contract on the L2 network
- A contract that imports the [`AggregatorV2V3Interface.sol` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol): Use this interface to create a `flagsFeed` object that points to the sequencer feed proxy.

You can use the sequencer uptime feed on Arbitrum, but this example uses an Ethereum Rinkeby testnet feed for development and testing purposes.


<CodeSample src='samples/PriceFeeds/ArbitrumPriceConsumer.sol' lang="solidity" />


This example includes a modified `getLatestPrice` function that reverts if `checkSequencerState` returns false. The `checkSequencerState` function reads the answer from the sequencer uptime feed and returns either a `1` or a `0`.

- 0: The sequencer is up
- 1: The sequencer is down

The `updatedAt` timestamp is the block timestamp when the answer updated on the L1 network, Ethereum Mainnet. Use this to ensure the latest answer is recent enough to be trustworthy.

## Sequencer feed proxy addresses

You can find proxy addresses for the L2 sequencer feeds on the following networks:

- Arbitrum mainnet: [0xFdB631F5EE196F0ed6FAa767959853A9F217697D](https://arbiscan.io/address/0xfdb631f5ee196f0ed6faa767959853a9f217697d)
- Ethereum Rinkeby testnet: [0x13E99C19833F557672B67C70508061A2E1e54162](https://rinkeby.etherscan.io/address/0x13E99C19833F557672B67C70508061A2E1e54162)
