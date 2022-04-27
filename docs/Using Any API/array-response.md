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

This guide explains how to make an HTTP GET request to an external API, that returns a _json_ array, from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive the needed data from the array.

{% include 'sections/any-api-common-table-contents.md' %}

## Example

This example shows how to:

- Call an API that returns a JSON array.
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

Fetch the _id_ of the first element. To consume an API, your contract must import [ChainlinkClient.sol](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct named `Chainlink.Request`, which your contract can use to build the API request. The request must include the following parameters:

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
   - The `jobId`: A specific job for the oracle node to run. In this case, the _id_ is a _string_ data type, so you must call a job that calls an API and returns a _string_. You can find the job spec for the Chainlink node [here](/docs/direct-request-get-string/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/docs/fund-your-contract/) page.

1. Call the `id` function to confirm that the `id` state variable is not set.

1. Run the `requestFirstId` function. This builds the `Chainlink.Request` using the correct parameters. The `req.add("path", "0,id")` request parameter tells the oracle node to fetch the id at index 0 of the array returned by the GET request. It uses [JSONPath expression](https://jsonpath.com/) with comma(,) delimited string for nested objects, for example: `'0,id'`.

1. After few seconds, call the `id` function. You should get a non-empty response: _bitcoin_

{% include 'sections/any-api-common.md' %}
