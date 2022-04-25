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

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](/docs/request-and-receive-data/) cycle and then receive one single response.

**Table of Contents**

- [Single Word Example](#single-word-example)
- [Response Types](#response-types)
- [Setting the LINK token address, Oracle, and JobId](#setting-the-link-token-address-oracle-and-jobid)
- [Make an Existing Job Request](#make-an-existing-job-request)

## Single Word Example

This example shows how to:

- Fetch a single word response in one single call.

[Cryptocompare GET /data/pricemultifull API](https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint) returns all the current trading info (price, vol, open, high, low ..Etc) of any list of cryptocurrencies in any other currency that you need. To check the response, you can directly paste the following URL in your browser `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD` or run this command in your terminal:

```curl
curl -X 'GET' \
  'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD' \
  -H 'accept: application/json'
```

The response should be similar to the following:

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

To consume an API with multiple responses, your contract should inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the following parameters:

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
   - The `req.add('path', 'RAW,ETH,USD,VOLUME24HOUR')` request parameter tells the oracle node where to fetch the 24h ETH volume in the _json_ response. It uses [JSONPath expression](https://jsonpath.com/) with comma(,) delimited string for nested objects, for example: `'RAW,ETH,USD,VOLUME24HOUR'`.
   - The `req.addInt('times', timesAmount)` request parameter provides the oracle node with the multiplier `timesAmount` by which the fetched volume is to be multiplied , purpose being to remove any decimals from it.
     Note that The `APIConsumer` in the example above is flexible enough to call any public API, so long as the URL in the _get_ , the _path_ and the _timesAmounnt_ are correct.

1. After few seconds, call the `volume` function. You should get a non-zero response.

### Response Types

The code example above returns an unsigned integer from the oracle response, but multiple data types are available such as:

- **`uint256`** - Unsigned integers
- **`int256`** - Signed integers
- **`bool`** - True or False values
- **`string`** - String
- **`bytes32`** - Strings and byte values. If you need to return a string, use `bytes32`. Here's [one method](https://gist.github.com/alexroan/a8caf258218f4065894ecd8926de39e7) of converting `bytes32` to `string`. Currently, any return value must fit within 32 bytes. If the value is bigger than that, make multiple requests.
- **`bytes`** - Arbitrary-length raw byte data

Make sure to choose an oracle job that supports the data type that your contract needs to consume.

## Setting the LINK token address, Oracle, and JobId

The [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function sets the LINK token address for the [network](/docs/link-token-contracts/) you are deploying to. The [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function sets a specific Chainlink oracle that a contract makes an API call from. The `jobId` refers to a specific job for that node to run.

Each job is unique and returns different types of data. For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job might already exist for it. It could mean that you do not need to add the URL or other adapter parameters into the request because the job is already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job, see the [Make an Existing Job Request](../existing-job-request/) guide.

For more information about the functions in `ChainlinkClient`, visit the [ChainlinkClient API Reference](../chainlink-framework/).
