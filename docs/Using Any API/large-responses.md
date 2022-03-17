---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Large Responses"
permalink: "docs/large-responses/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
---

## Overview

This page explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive large responses.

**Table of Contents**

+ [Large Response](#large-response)
+ [Choosing an Oracle and JobId](#choosing-an-oracle-and-jobid)
+ [Make an Existing Job Request](#make-an-existing-job-request)

## Large Response

To consume an API with a large responses, your contract should inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the following:

- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

>❗️ Note on Funding Contracts
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.
>

```solidity Kovan
{% include samples/APIRequests/GenericBigWord.sol %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/GenericBigWord.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

The job spec for the Chainlink node in this example can be [found here](../example-job-spec-large/).

If the LINK address for targeted blockchain is not [publicly available](../link-token-contracts/) yet, replace [setPublicChainlinkToken(/)](../chainlink-framework/#setpublicchainlinktoken) with [setChainlinkToken(_address)](../chainlink-framework/#setchainlinktoken) in the constructor, where `_address` is a corresponding LINK token contract.

## Choosing an Oracle and JobId

`oracle` refers to a specific Chainlink node that a contract makes an API call from, and `specId` refers to a specific job for that node to run. Each job is unique and returns different types of data.

For example, a job that returns a `bytes32` variable from an API would have a different `specId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the [CoinGecko API](https://www.coingecko.com/en/api#explore-api), see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
