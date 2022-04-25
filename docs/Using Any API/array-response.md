---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Array Response'
permalink: 'docs/api-array-response/'
whatsnext:
  {
    'Large Responses': '/docs/large-responses/',
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
  }
---

## Overview

This page explains how to make an HTTP GET request to an external API, that returns a _json_ array, from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive the needed data from the array.

**Table of Contents**

- [Array Example](#array-example)
- [Setting the LINK token address, Oracle, and JobId](#setting-the-link-token-address-oracle-and-jobid)
- [Make an Existing Job Request](#make-an-existing-job-request)

## Array Example

This example shows how to:

- Call an API which returns a JSON array.
- Fetch a specific information from the response.

[Coingecko _GET /coins/markets/_ API](https://www.coingecko.com/en/api/documentation) returns a list of coins and their market data such as price, market cap, and volume. To check the response, you can directly paste the following URL in your browser `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false` or run this command in your terminal:

```curl
curl -X 'GET' \
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false' \
  -H 'accept: application/json'
```

The response should be similar to the following:

```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    "current_price": 42097,
    "market_cap": 802478449872,
    ...
  },
  {
    ...
  }
]
```

Fetch the _id_ of the first element. To consume an API, your contract must inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct named `Chainlink.Request`, which your contract can use to build the API request. The request must include the following parameters:

- Link token address
- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

> ❗️ Note on Funding Contracts
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

```solidity Kovan
{% include 'samples/APIRequests/FetchFromArray.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/FetchFromArray.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/FetchFromArray.sol).

1. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables for the _Kovan_ testnet. Make sure your wallet is set to use _Kovan_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Kovan_ by calling the [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function.
   - The Oracle contract address for _Kovan_ by calling the [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, the _id_ is a _string_ data type, so you must call a job which calls an API and returns a _string_. You can find the job spec for the Chainlink node in this example [here](/docs/direct-request-get-string/).

1. Fund your contract with 0.1 LINK as shown [here](/docs/fund-your-contract/).

1. Call `id` function to confirm `id` is empty.

1. Run `requestFirstId` function. This builds the `Chainlink.Request` using the right parameters. Note the syntax that will be used by the oracle node to parse the _path_: `req.add("path", "0,id")` ("Fetch the id at index 0 of the array").

1. After few seconds, call `id` function. You should get a non-empty response: _bitcoin_ at the time of writing.

## Setting the LINK token address, Oracle, and JobId

The [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function sets the LINK token address for the [network](/docs/link-token-contracts/) you are deploying to. The [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function sets a specific Chainlink oracle that a contract makes an API call from. The `jobId` refers to a specific job for that node to run.

Each job is unique and returns different types of data. For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job might already exist for it. It could mean that you do not need to add the URL or other adapter parameters into the request because the job is already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job, see the [Make an Existing Job Request](../existing-job-request/) guide.

For more information about the functions in `ChainlinkClient`, visit the [ChainlinkClient API Reference](../chainlink-framework/).
