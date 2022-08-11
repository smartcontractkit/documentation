---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "L2 Sequencer Uptime Feeds"
permalink: "docs/l2-sequencer-flag/"
---

Optimistic rollup protocols move all execution off the layer 1 (L1) Ethereum chain, complete execution on a layer 2 (L2) chain, and return the results of the L2 execution back to the L1. These protocols have a [sequencer](https://community.optimism.io/docs/how-optimism-works/#block-production) that executes and rolls up the L2 transactions by batching multiple transactions into a single transaction.

If a sequencer becomes unavailable, it is impossible to access read/write APIs that consumers are using and applications on the L2 network will be down for most users without interacting directly through the L1 optimistic rollup contracts. The L2 has not stopped, but it would be unfair to continue providing service on your applications when only a few users can use them.

To help your applications identify when the sequencer is unavailable, you can use a data feed that tracks the last known status of the sequencer at a given point in time. This is to allow customers to prevent mass liquidations by providing a grace period to allow customers to react to such an event.

**Topics**

- [Available networks](#available-networks)
- [Arbitrum](#arbitrum)
  - [Handling Arbitrum outages](#handling-arbitrum-outages)
- [Optimism and Metis](#optimism-and-metis)
  - [Handling outages on Optimism and Metis](#handling-outages-on-optimism-and-metis)
- [Example code](#example-code)

## Available networks

You can find proxy addresses for the L2 sequencer feeds at the following addresses:

- Arbitrum: [0xFdB631F5EE196F0ed6FAa767959853A9F217697D](https://arbiscan.io/address/0xfdb631f5ee196f0ed6faa767959853a9f217697d)
- Optimism Mainnet: [0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389](https://optimistic.etherscan.io/address/0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389)
- Metis Andromeda: [0x58218ea7422255EBE94e56b504035a784b7AA204](https://andromeda-explorer.metis.io/address/0x58218ea7422255EBE94e56b504035a784b7AA204)

### Arbitrum

The diagram below shows how these feeds update and how a consumer retrieves the status of the Arbitrum sequencer.

![L2 Sequencer Feed Diagram](/images/data-feed/l2-diagram-arbitrum.webp)

1. Chainlink nodes trigger an OCR round every 30s and update the sequencer status by calling the `validate` function in the [`ArbitrumValidator` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/dev/ArbitrumValidator.sol) by calling it through the [`ValidatorProxy` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ValidatorProxy.sol).
1. The `ArbitrumValidator` checks to see if the latest update is different from the previous update. If it detects a difference, it places a message in the [Arbitrum inbox contract](https://developer.offchainlabs.com/docs/inside_arbitrum#the-big-picture).
1. The inbox contract sends the message to the [`ArbitrumSequencerUptimeFeed` contract](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/dev/ArbitrumSequencerUptimeFeed.sol). The message calls the `updateStatus` function in the `ArbitrumSequencerUptimeFeed` contract and updates the latest sequencer status to 0 if the sequencer is up and 1 if it is down. It also records the block timestamp to indicate when the message was sent from the L1 network.
1. A consumer contract on the L2 network can read these values from the [`ArbitrumUptimeFeedProxy` contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/EACAggregatorProxy.sol), which reads values from the `ArbitrumSequencerUptimeFeed` contract.

### Handling Arbitrum outages

If the Arbitrum network becomes unavailable, the `ArbitrumValidator` contract continues to send messages to the L2 network through the delayed inbox on L1. This message stays there until the sequencer is back up again. When the sequencer comes back online after downtime, it processes all transactions from the delayed inbox before it accepts new transactions. The message that signals when the sequencer is down will be processed before any new messages with transactions that require the sequencer to be operational.

## Optimism and Metis

On Optimism and Metis, the sequencer’s status is relayed from L1 to L2 where the consumer can retrieve it.

![L2 Sequencer Feed Diagram](/images/data-feed/l2-diagram-optimism-metis.webp)

**On the L1 network:**

1. A network of node operators runs the external adapter to post the latest sequencer status to the `AggregatorProxy` contract and relays the status to the `Aggregator` contract.  The `Aggregator` contract calls the `validate` function in the `OptimismValidator` contract.  

1. The `OptimismValidator` contract calls the `sendMessage` function in the `L1CrossDomainMessenger` contract. This message contains instructions to call the `updateStatus(bool status, uint64 timestamp)` function in the sequencer uptime feed deployed on the L2 network.

1. The `L1CrossDomainMessenger` contract calls the `enqueue` function to enqueue a new message to the `CanonicalTransactionChain`.

1. The `Sequencer` processes the transaction enqueued in the `CanonicalTransactionChain` contract to send it to the L2 contract.

**On the L2 network:**

1. The `Sequencer` posts the message to the `L2CrossDomainMessenger` contract.

1. The `L2CrossDomainMessenger` contract relays the message to the `OptimismSequencerUptimeFeed` contract.

1. The message relayed by the `L2CrossDomainMessenger` contains instructions to call `updateStatus` in the `OptimismSequencerUptimeFeed` contract.  

1. Consumers can then read from the `AggregatorProxy` contract, which fetches the latest round data from the `OptimismSequencerUptimeFeed` contract.

### Handling outages on Optimism and Metis

If the sequencer is down, messages cannot be transmitted from L1 to L2 and **no L2 transactions are executed**. Instead, messages are enqueued in the `CanonicalTransactionChain` on L1 and only processed in the order they arrived later when the sequencer comes back up. As long as the message from the validator on L1 is already enqueued in the `CTC`, the flag on the sequencer uptime feed on L2 will be guaranteed to be flipped prior to any subsequent transactions. The transaction that flips the flag on the uptime feed will be executed before transactions that were enqueued after it. This is further explained in the diagrams below.

When the Sequencer is down, all L2 transactions sent from the L1 network wait in the pending queue.

1. **Transaction 3** contains Chainlink’s transaction to set the status of the sequencer as being down on L2.
1. **Transaction 4** is a transaction made by a consumer that is dependent on the sequencer status.

![L2 Sequencer Feed Diagram](/images/data-feed/seq-down-1.webp)

After the sequencer comes back up, it moves moves all transactions in the pending queue to the processed queue.

1. Transactions are processed in the order they arrived so **Transaction 3** is processed before **Transaction 4**.
1. Because **Transaction 3** happens before **Transaction 4**, **Transaction 4** will read the status of the Sequencer as being down and responds accordingly.

![L2 Sequencer Feed Diagram](/images/data-feed/seq-down-2.webp)

## Example code

Create the consumer contract for sequencer uptime feeds similarly to contracts you use for [Chainlink Data Feeds](/docs/get-the-latest-price/#solidity). Configure the constructor using the following variables:

- Configure the `sequencerUptimeFeed` object with the [sequencer uptime feed proxy address](#available-networks) for your L2 network.
- Configure the `priceFeed` object with one of the [Data Feed proxy addresses](/docs/reference-contracts/) that are available for your network.

```solidity L2
{% include 'samples/PriceFeeds/PriceConsumerWithSequencerCheck.sol' %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerWithSequencerCheck.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>

The `sequencerUptimeFeed` object returns the following values:

- `answer`: A variable with a value of either `1` or `0`
  - 0: The sequencer is up
  - 1: The sequencer is down
- `startedAt`: This timestamp indicates when the sequencer changed status. This timestamp returns `0` if a round is invalid. When the sequencer comes back up after an outage, wait for the `GRACE_PERIOD_TIME` to pass before accepting answers from the price data feed. Subtract `startedAt` from `block.timestamp` and revert the request if the result is less than the `GRACE_PERIOD_TIME`.

If the sequencer is up and the `GRACE_PERIOD_TIME` has passed, the function retrieves the latest price from the data feed using the `priceFeed` object.
