---
layout: nodes.liquid
section: smartContract
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
Using an *existing* Oracle Job makes your smart contract code more succinct. This page explains how to retrieve the current weather temperature (in Kelvin) for a defined city using an existing Oracle job.

# OpenWeather Consumer

In [Make a GET Request](../make-a-http-get-request/), the example contract code declared which URL to use, where to find the data in the response, and how to convert it so that it can be represented on-chain.

In this example, we're using a job found on the <a href="https://market.link/" target="_blank">Chainlink Market</a> that is pre-configured to perform these tasks. This means that our contract doesn't need to specify additional parameters for various adapters, it only needs the Oracle address and the Job ID. The remaining adapters are configured by the external adapter, in particular <a href="https://market.link/adapters/5ff8f621-102d-491d-b1c8-bbbe294e4620" target="_blank">weather_cl_ea</a>.

This example uses the <a href="https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1614168653&end=1614773453" target="_blank">Alpha Chain Kovan Oracle</a>, which runs the <a href="https://market.link/jobs/e10388e6-1a8a-4ff5-bad6-dd930049a65f?network=42" target="_blank">OpenWeather Data Job</a>.

>❗️ Remember to fund your contract with LINK!
>
> Making a job request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/OpenWeatherConsumer.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity
{% include samples/APIRequests/OpenWeatherConsumer.sol %}
```

For more information on finding existing jobs, see [Find Existing Jobs](../listing-services/).
