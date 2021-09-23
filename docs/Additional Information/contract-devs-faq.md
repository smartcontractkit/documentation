---
layout: nodes.liquid
date: Last Modified
title: "Contract Developers FAQ"
permalink: "docs/contract-developers-faq/"
metadata: 
  title: "Contract Developer FAQ"
  description: "Find answers to common questions about developing on Chainlink."
---

## General FAQ

### A new integration was announced, but I do not see the documentation for it. What’s going on?

There are two types of announcements in the Chainlink ecosystem:

1. Working Announcements ([Example](https://medium.com/acalanetwork/acala-integrating-chainlink-oracle-pallet-for-price-feeds-upon-upcoming-polkadot-launch-917b7c9dfecd)). These announce that the work is underway but the integration it’s not ready to be used yet. You will not find documentation related to such announcements.

2. Integration Live Announcements ([Example](https://blog.chain.link/chainlink-keepers-is-now-live-on-mainnet/)). These announce that an integration is live and ready to be used. If the integration represents a new feature or new chain support, you’ll be able to find the details in our docs.

Often these announcements will be posted by our integration partners.

### What is the LINK token used for?

The LINK token is required at the protocol level. It’s mainly used to compensate node operators for performing requests and having to spend gas (ETH etc) to write transactions back on-chain. 

Typical ERC20 tokens don't allow for the transfer and execution of a smart contract in a single transaction, [ERC677](https://github.com/ethereum/EIPs/issues/677) does, with transferAndCall. When a request is made, the payload of that request is sent along with the token transfer (payment for the node operators), so that the node operators know exactly how much they're being paid for that request and can respond immediately, knowing they'll be paid for their work.

The LINK token also separates the security of the Chainlink network from market volatility of some other asset, unrelated to the network. If it were ETH, then the security of the network could be reduced if ETH's market volatility didn't work in the network’s favor. That also wouldn't work out very well in multi-chain environments where the node operator would need different prices for the same amount of work on every supported chain. If it were some stable coin, then the security of the network would be based on the viability of that project. Further, we would lose the transferAndCall ability, which would add more complexity to our smart contracts, and more complexity usually means more expensive transactions.

### What wallet do I use to store LINK?

Any wallet that handles ERC20 tokens should work fine. The ERC677 token standard that the LINK token implements still retains all functionality of ERC20 tokens.

### How do I request data from Chainlink?

There are several types of data you can request from the Chainlink network: data feeds for price and other sources of data, provably-fair and verifiable random numbers, external data from APIs, services, etc.

Each data type can be retrieved with the help of the corresponding Chainlink features: [Data Feeds](/docs/get-the-latest-price/), [VRF](/docs/get-a-random-number/), [API Requests](/docs/make-a-http-get-request/). Additionally, you may want to try one of the starter kits provided by our team: [Truffle Starter Kit](https://github.com/smartcontractkit/truffle-starter-kit), [Hardhat Starter Kit](https://github.com/smartcontractkit/hardhat-starter-kit), [Brownie Mix](https://github.com/smartcontractkit/chainlink-mix).  

### Can Chainlink be used to connect to &lt;some blockchain>/API?

Yes, the Chainlink node can connect to most APIs out-of-the-box. Some APIs require authentication by providing request headers for the operator’s API key, which the Chainlink node supports. Additionally, you can use [external adapters](/docs/contract-creators/) that allow for connectivity to any external API or resource.

### How do I select Chainlink nodes for my requests?

You can use the [Chainlink Market](https://market.link/search/nodes) to select nodes that match your reputation, latency, and response time criterias for requests. To make the actual request, fulfill the [sendChainlinkRequestTo](/docs/chainlink-framework/#sendchainlinkrequestto) method by using the corresponding node’s oracle contract address and Job ID.

### How do I request a value that is greater than 32 bytes?

You can use [Large Responses](/docs/large-responses/) to request data of this size.

### How can I get multiple values with a single request?

You can get multiple values by using the [Multi-Variable Responses](/docs/multi-variable-responses/) feature.

## Price Feeds FAQ

### Why don’t the rounds update chronologically?

They do, in the best-case scenario. However, a round can time out if it doesn’t reach consensus, so that would technically be a timed out round, which carries over the answer from the previous round. Though roundIds can seemingly jump significantly when the phaseId is updated, because of how that combination of phaseId+roundId is calculated by the proxy.

### What does a phase indicate?

A phase indicates the underlying aggregator implementation has been updated. Phases are only relevant for the EACAggregatorProxys. You can think of a roundId on the proxies as a large number containing data for two numbers (phaseId + roundId). The roundId is pulled from the aggregator’s implementation and combined (by bit shifting) with the latest phaseId of the proxy.

### What is the difference between the price feed properties updatedAt and answeredInRound?

updatedAt is the timestamp of an answered round while answeredInRound is the round it was updated in.

### How can I check if the answer to a round is being carried over from a previous round?

You can check answeredInRound against the current roundId. If answeredInRound is less than the roundId, the answer is being carried over. If answeredInRound is equal to roundId, then the answer is fresh.

### Can the price feed read revert?

A read can revert if the caller is requesting details of a round that was invalid (perhaps, not being answered yet), which basically is just relevant to a roundId which is greater than a uint32 or 0. It hasn’t happened yet, however you can prevent this from happening if you add a check on the roundId.

### Why is the latestAnswer reported at 8 decimals for some contracts, but for other contracts it is reported with 18 decimals?

For cryptocurrency quotes, 18 decimals are typically used because they require more precision. For FX quotes, 8 decimals are used because that is the precision data sources typically report them at.
