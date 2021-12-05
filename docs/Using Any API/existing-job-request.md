---
layout: nodes.liquid
section: ethereumAnyAPI
date: Last Modified
title: "Make an Existing Job Request"
permalink: "docs/existing-job-request/"
whatsnext: {"Find Existing Jobs":"/docs/listing-services/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
metadata:
  title: "Make an Existing Job Request"
  description: "Learn how to utilize existing Chainlink external adapters to make calls to APIs from smart contracts."
  image:
    0: "/files/OpenGraph_V3.png"
---
Using an *existing* Oracle Job makes your smart contract code more succinct. This page explains how to retrieve the winners of various elections based on the date, state, and race ID.

# AP Election Data Consumer

In [Make a GET Request](../make-a-http-get-request/), the example contract code declared which URL to use, where to find the data in the response, and how to convert it so that it can be represented on-chain.

This example uses an existing job that is pre-configured to make requests to get [AP Election data](https://developer.ap.org/ap-elections-api/). 

You can find the job spec for this example on [GitHub](https://github.com/smartcontractkit/documentation/tree/main/_includes/samples/APIRequests/ap-election-job.toml).


>❗️ Remember to fund your contract with LINK!
>
> Making a job request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APElection.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity
{% include samples/APIRequests/APElection.sol %}
```

For more information on finding existing jobs, see [Find Existing Jobs](../listing-services/).
