---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Off-Chain Reporting"
permalink: "docs/off-chain-reporting/"
metadata: 
  image: 
    0: "/files/fb73165-cl.png"
---
Off-Chain Reporting (OCR) is the next Oracle network upgrade replacing the [`FluxAggregator` model](../architecture-decentralized-model/). It represents a significant step towards increasing the decentralization and scalability of Chainlink networks.

See the <a href="https://uploads-ssl.webflow.com/5f6b7190899f41fb70882d08/603651a1101106649eef6a53_chainlink-ocr-protocol-paper-02-24-20.pdf" target="_blank">OCR protocol paper</a> for a technical deep dive.

# Change Summary

In the [`FluxAggregator` model](../architecture-decentralized-model/), every node must submit their price value individually, and once all responses are received on-chain, the contract aggregates them to confirm the price.

This solution has been highly effective and reliable since its release. However, there are some drawbacks. Since every single node must submit a transaction per round, each pays gas to do so, with aggregation occurring on-chain once all nodes have submitted. 

With our Off-Chain Reporting aggregators, all nodes communicate using a peer to peer network. During the communication process, a lightweight consensus algorithm is run, in which every single node reports its price observation and signs it. A single, aggregate transaction is then transmitted, saving a significant amount of gas. 

The report contained in the aggregate transaction is signed by a quorum of oracles and contains all oracles' observations. By validating the report on-chain and checking the quorum's signatures on-chain, we preserve the trustlessness properties that many have come to expect from Chainlink oracle networks.

# What is Off-Chain Reporting (OCR)?

> 📘A simple analogy
> 
> Imagine ordering 10 items from an online store. Each item is packaged separately and posted separately, meaning postage and packaging costs must be applied to each one, and the carrier has to transport 10 different boxes. This is how FluxAggregator works.
> 
> OCR, on the other hand, packages all of these items into a single box and posts that. This saves postage and packaging fees and all effort the carrier associates with transporting 9 fewer boxes.

The OCR protocol allows nodes to aggregate their observations into a single report off-chain using a secure P2P network. A single node then submits a transaction with the aggregated report to the chain. Each report consists of many nodes' observations and has to be signed by a quorum of nodes. These signatures are verified on-chain.

Since only one transaction is submitted per round, the following benefits are achieved:

- Overall network congestion from Chainlink oracle networks is reduced dramatically
- Individual node operators spend far less on gas costs
- Node networks are more scalable because data feeds can accommodate more nodes
- Data feeds can be updated in a more timely manner since each round needn't wait for multiple transactions to be confirmed before a price is confirmed on-chain.

This update is the third generation of Chainlink client that nodes support: the first being RunLog, the second being Flux Monitor, and the third being OCR. This increased redundancy means that Nodes have multiple battle-hardened failover protocols.

# How does it work?

Protocol execution mostly happens off-chain over a peer to peer network between Chainlink nodes. The nodes regularly elect a new leader node who drives the rest of the protocol. 

The leader regularly requests followers to provide freshly signed observations and aggregates them into a report. It then sends this report back to the followers and asks them to verify the report's validity. If a quorum of followers approves the report by sending a signed copy back to the leader, the leader assembles a final report with the quorum's signatures and broadcasts it to all followers. 

The nodes then attempt to transmit the final report to the smart contract according to a randomized schedule. Finally, the smart contract verifies that a quorum of nodes signed the report and exposes the median value to consumers.

All nodes watch the blockchain for the final report to remove any single point of failure during transmission. If the designated node fails to get their transmission confirmed within a determined period, a round-robin protocol kicks in, such that other nodes also transmit the final report until one of them is confirmed. 

# How does this affect Data Feeds?

> 🚧Subgraph users
>
> Those using subgraph, make sure to either update the aggregator you're listening to once they go live, or preferably, move to [ENS](../ens/) to make sure you're always using the correct address.

For smart contracts that currently consume data feeds, there will be no interruptions. Service will not be affected, and the functions described in the  [Data Feeds API Reference](../price-feeds-api-reference/) will continue to work.

The upgrade will happen automatically so long as your contracts are requesting data from the proxy addresses from August 2020 and listed both on our [Contract Addresses](../reference-contracts/) page and [ENS](../ens/).