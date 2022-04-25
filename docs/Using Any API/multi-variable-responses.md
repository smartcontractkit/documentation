---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Multi-Variable Responses'
permalink: 'docs/multi-variable-responses/'
whatsnext:
  {
    'Fetch data from an Array': '/docs/api-array-response/',
    'Large Responses': '/docs/large-responses/',
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
  }
---

## Overview

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](/docs/request-and-receive-data/) cycle and then receive multiple responses.
This is known as **multi-variable** or **multi-word** responses.

**Table of Contents**

- [MultiWord](#multiword)
- [Setting the LINK token address, Oracle, and JobId](#setting-the-link-token-address-oracle-and-jobid)
- [Make an Existing Job Request](#make-an-existing-job-request)

## MultiWord

This example shows how to:

- Fetch several responses in one single call.

[Cryptocompare GET /data/price/ API](https://min-api.cryptocompare.com/documentation?key=Price&cat=SingleSymbolPriceEndpoint) returns the current price of any cryptocurrency in any other currency that you need. To check the response, you can directly paste the following URL in your browser `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC` or run this command in your terminal:

```curl
curl -X 'GET' \
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC' \
  -H 'accept: application/json'
```

The response should be similar to the following:

```json
{
  "BTC": 0.07297
}
```

The request above shows how to get the price of _ETH_ against _BTC_. Now let say we want the price of _ETH_ against several currencies: _BTC_, _USD_, and _EUR_. Our contract will have to support receiving multiple responses.
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

Assume that a user wants to obtain the ETH price quoted against three different currencies: _BTC_ , _USD_ and _EUR_. If they use only a single-word job (cf. [Single Word Response](/docs/single-word-response/)), it would require three different requests. To make that more efficient, they can use multi-word responses to do it all in a single request as shown in the following example:

```solidity Kovan
{% include 'samples/APIRequests/MultiWordConsumer.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/MultiWordConsumer.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/MultiWordConsumer.sol).

1. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables for the _Kovan_ testnet. Make sure your wallet is set to use _Kovan_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Kovan_ by calling the [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function.
   - The Oracle contract address for _Kovan_ by calling the [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, you must call a job that is specifically configured to return _ETH_ price against _BTC_, _USD_ and _EUR_. You can find the job spec for the Chainlink node [here](/docs/direct-request-multi-word/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/docs/fund-your-contract/) page.

1. Call the `btc`, `usd` , and `eur` functions to confirm that the respective `btc`, `usd` , and `eur` state variables are equal to _zero_.

1. Run the `requestMultipleParameters` function. This builds the `Chainlink.Request` using the correct parameters:

   - The `req.add("urlBTC", "<cryptocompareETHBTCURL>")` request parameter provides the oracle node with the [url](https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC) where to fetch the _ETH-BTC_ price. Same logic for `req.add("urlEUR", "<cryptocompareETHEURURL>")` and `req.add("urlUSD", "<cryptocompareETHUSDURL>")`.
   - THe `req.add('pathBTC', 'BTC')` request parameter tells the oracle node where to fetch the _ETH-BTC_ price in the _json_ response. Same logic for `req.add('pathUSD', 'EUR')` and `req.add('pathEUR', 'USD')`.
     Note that because we are providing the urls and paths , The `MultiWordConsumer` in the example above is flexible enough to call any public API, so long as the URLs and paths are correct.

1. After few seconds, call the `btc`, `usd` , and `eur` functions. You should get a non-zero responses.
   The job spec for the Chainlink node in this example can be found [here](/docs/direct-request-multi-word/).

## Setting the LINK token address, Oracle, and JobId

The [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function sets the LINK token address for the [network](/docs/link-token-contracts/) you are deploying to. The [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function sets a specific Chainlink oracle that a contract makes an API call from. The `jobId` refers to a specific job for that node to run.

Each job is unique and returns different types of data. For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job might already exist for it. It could mean that you do not need to add the URL or other adapter parameters into the request because the job is already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job, see the [Make an Existing Job Request](../existing-job-request/) guide.

For more information about the functions in `ChainlinkClient`, visit the [ChainlinkClient API Reference](../chainlink-framework/).
