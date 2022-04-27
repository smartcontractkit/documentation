---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Single Word Response'
permalink: 'docs/single-word-response/'
whatsnext:
  {
    'Multi-Variable Responses': '/docs/multi-variable-responses/',
    'Fetch data from an Array': '/docs/api-array-response/',
    'Large Responses': '/docs/large-responses/',
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
  }
metadata:
  title: 'Single Word Response'
  description: 'Learn how to make a GET request to an API from a smart contract, using Chainlink.'
  image:
    0: '/files/930cbb7-link.png'
---

## Overview

This guide explains how to make an HTTP GET request to an external API from a smart contract using Chainlink's [Request & Receive Data](/docs/request-and-receive-data/) cycle and receive a single response.

{% include 'sections/any-api-common-table-contents.md' %}

## Example

This example shows how to:

- Fetch a single word response in a single call.

The [Cryptocompare GET /data/pricemultifull API](https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint) returns the current trading info (price, vol, open, high, low) of any list of cryptocurrencies in any other currency that you need. To check the response, you can directly paste the following URL in your browser `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD` or run this command in your terminal:

```curl
curl -X 'GET' \
  'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD' \
  -H 'accept: application/json'
```

The response should be similar to the following example:

```json
{
  "RAW": {
    "ETH": {
      "USD": {
        "TYPE": "5",
        "MARKET": "CCCAGG",
        "FROMSYMBOL": "ETH",
        "TOSYMBOL": "USD",
        "FLAGS": "2049",
        "PRICE": 2867.04,
        "LASTUPDATE": 1650896942,
        "MEDIAN": 2866.2,
        "LASTVOLUME": 0.16533939,
        "LASTVOLUMETO": 474.375243849,
        "LASTTRADEID": "1072154517",
        "VOLUMEDAY": 195241.78281014622,
        "VOLUMEDAYTO": 556240560.4621655,
        "VOLUME24HOUR": 236248.94641103,
        ...
}
```

To consume an API with multiple responses, your contract must import [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the following parameters:

- Link token address
- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

> ❗️ Note on Funding Contracts
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

Assume that a user wants to call the API above and retrieve only the 24h ETH trading volume from the response.

```solidity Kovan
{% include 'samples/APIRequests/APIConsumer.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol).

1. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables for the _Kovan_ testnet. Make sure your wallet is set to use _Kovan_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Kovan_ by calling the [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function.
   - The Oracle contract address for _Kovan_ by calling the [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, you must call a job that is configured to call a public API, parse a number from the response and remove any decimals from it. You can find the job spec for the Chainlink node [here](/docs/direct-request-get-uint256/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/docs/fund-your-contract/) page.

1. Call the `volume` function to confirm that the `volume` state variable is equal to _zero_.

1. Run the `requestVolumeData` function. This builds the `Chainlink.Request` using the correct parameters:

   - The `req.add("get", "<cryptocompareURL>")` request parameter provides the oracle node with the [url](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD) where to fetch the _ETH-USD_ trading info.
   - The `req.add('path', 'RAW,ETH,USD,VOLUME24HOUR')` request parameter tells the oracle node where to fetch the 24h ETH volume in the _json_ response. It uses a [JSONPath expression](https://jsonpath.com/) with comma(,) delimited string for nested objects. For example: `'RAW,ETH,USD,VOLUME24HOUR'`.
   - The `req.addInt('times', timesAmount)` request parameter provides the oracle node with the multiplier `timesAmount` by which the fetched volume is multiplied. Use this to remove any decimals from the volume.
     The `APIConsumer` in the example above is flexible enough to call any public API as long as the URL in _get_, _path_, and _timesAmounnt_ are correct.

1. After few seconds, call the `volume` function. You should get a non-zero response.

{% include 'sections/any-api-common.md' %}
