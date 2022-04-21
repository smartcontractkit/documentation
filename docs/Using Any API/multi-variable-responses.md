---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Multi-Variable Responses'
permalink: 'docs/multi-variable-responses/'
whatsnext:
  {
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
    'Large Responses': '/docs/large-responses/',
  }
---

## Overview

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](/docs/request-and-receive-data/) cycle and then receive multiple responses.
This is known as **multi-variable** or **multi-word** responses.

**Table of Contents**

- [MultiWord](#multiword)
- [Choosing Link token address, Oracle and JobId](#choosing-link-token-address-oracle-and-jobid)
- [Make an Existing Job Request](#make-an-existing-job-request)

## MultiWord

To consume an API with multiple responses, your contract should inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the following:

- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

> ❗️ Note on Funding Contracts
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

Assume that a user wants to obtain the ETH price quoted against three different currencies: _BTC_ , _USD_ and _EUR_. If they use only a single-word job, it would require three different requests. To make that more efficient, they can use multi-word responses to do it all in a single request as shown in the following example:

```solidity Kovan
{% include 'samples/APIRequests/MultiWordConsumer.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/MultiWordConsumer.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

Note that this example contract is hardcoded to work on _Kovan_ testnet. The job spec for the Chainlink node in this example can be found [here](/docs/example-job-spec-multi-word/).

## Choosing Link token address, Oracle and JobId

[`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function allows to set the Link token address on the [network](/docs/link-token-contracts/) you are deploying to. [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function allows to set a specific Chainlink node that a contract makes an API call from, and `jobId` refers to a specific job for that node to run. Each job is unique and returns different types of data.

For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the [CoinGecko API]("https://www.coingecko.com/en/api#explore-api"), see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
