---
layout: ../../../../layouts/MainLayout.astro
section: anyApi
date: Last Modified
title: "Multi-Variable Responses"
permalink: "docs/any-api/get-request/examples/multi-variable-responses/"
whatsnext:
  {
    "Fetch data from an Array": "/any-api/get-request/examples/array-response/",
    "Large Responses": "/any-api/get-request/examples/large-responses/",
    "Make an Existing Job Request": "/any-api/get-request/examples/existing-job-request/",
    "API Reference": "/any-api/api-reference/",
    "Testnet Oracles": "/any-api/testnet-oracles/",
  }
setup: |
  import AnyApiCallout from "@features/any-api/common/AnyApiCallout.astro"
---

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](/any-api/introduction/) cycle and then receive multiple responses.
This is known as **multi-variable** or **multi-word** responses.

<AnyApiCallout callout="prerequisites" />

## Example

This example shows how to:

- Fetch several responses in one single call.

[Cryptocompare GET /data/price/ API](https://min-api.cryptocompare.com/documentation?key=Price&cat=SingleSymbolPriceEndpoint) returns the current price of any cryptocurrency in any other currency that you need. To check the response, you can directly paste the following URL in your browser `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC` or run this command in your terminal:

```bash
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

:::caution[ Note on Funding Contracts]

Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](/resources/acquire-link/) and [Fund your contract](/resources/fund-your-contract/)**.

:::

Assume that a user wants to obtain the ETH price quoted against three different currencies: _BTC_ , _USD_ and _EUR_. If they use only a single-word job, it would require three different requests. For a comparison, see the [Single Word Response](/any-api/get-request/examples/single-word-response/) example. To make these requests more efficient, use multi-word responses to do it all in a single request as shown in the following example:

::solidity-remix[samples/APIRequests/MultiWordConsumer.sol]

To use this contract:

1. [Open the contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/MultiWordConsumer.sol).

1. Compile and deploy the contract using the Injected Provider environment. The contract includes all the configuration variables for the _Sepolia_ testnet. Make sure your wallet is set to use _Sepolia_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Sepolia_ by calling the [`setChainlinkToken`](/any-api/api-reference/#setchainlinktoken) function.
   - The Oracle contract address for _Sepolia_ by calling the [`setChainlinkOracle`](/any-api/api-reference/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, you must call a job that is specifically configured to return _ETH_ price against _BTC_, _USD_ and _EUR_. You can find the job spec for the Chainlink node [here](/chainlink-nodes/job-specs/multi-word-job/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/resources/fund-your-contract/) page.

1. Call the `btc`, `usd` , and `eur` functions to confirm that the respective `btc`, `usd` , and `eur` state variables are equal to _zero_.

1. Run the `requestMultipleParameters` function. This builds the `Chainlink.Request` using the correct parameters:

   - The `req.add("urlBTC", "<cryptocompareETHBTCURL>")` request parameter provides the oracle node with the [url](https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC) where to fetch the _ETH-BTC_ price. Same logic for `req.add("urlEUR", "<cryptocompareETHEURURL>")` and `req.add("urlUSD", "<cryptocompareETHUSDURL>")`.
   - THe `req.add('pathBTC', 'BTC')` request parameter tells the oracle node where to fetch the _ETH-BTC_ price in the _json_ response. Same logic for `req.add('pathUSD', 'EUR')` and `req.add('pathEUR', 'USD')`.
     Because you provide the URLs and paths, the `MultiWordConsumer` in the example can call any public API as long as the URLs and paths are correct.

1. After few seconds, call the `btc`, `usd` , and `eur` functions. You should get a non-zero responses.
   The job spec for the Chainlink node in this example can be found [here](/chainlink-nodes/job-specs/multi-word-job/).

<AnyApiCallout callout="common" />
