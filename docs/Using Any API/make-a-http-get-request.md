---
layout: nodes.liquid
section: ethereumAnyAPI
date: Last Modified
title: "Make a GET Request"
permalink: "docs/make-a-http-get-request/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/", "Multi-Variable Responses":"/docs/multi-variable-responses/"}
metadata:
  title: "Make a GET Request"
  description: "Learn how to make a GET request to an API from a smart contract, using Chainlink."
  image:
    0: "/files/930cbb7-link.png"
---
This page explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle.

# API Consumer

To consume an API response, your contract should inherit from <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/ChainlinkClient.sol" target="_blank">`ChainlinkClient`</a>. This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the oracle address, the job id, the fee, adapter parameters, and the callback function signature.

Currently, any return value must fit within 32 bytes, if the value is bigger than that multiple requests will need to be made.

>❗️ Remember to fund your contract with LINK!
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
{% include samples/APIRequests/APIConsumer.sol %}
```

If the LINK address for targeted blockchain is not [publicly available](../link-token-contracts/) yet, replace [setPublicChainlinkToken(/)](../chainlink-framework/#setpublicchainlinktoken) with [setChainlinkToken(_address)](../chainlink-framework/#setchainlinktoken) in the constructor, where `_address` is a corresponding LINK token contract.

# Choosing an Oracle and JobId

The `oracle` keyword refers to a specific Chainlink node that a contract makes an API call from, and the `jobId` refers to a specific job for that node to run. Each job is unique and returns different types of data.

For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

# Supported APIs

The `APIConsumer` in the example above is flexible enough to call any public API, so long as the URL in the "get" adapter parameter is correct, and the format of the response is known.

## Response Data

The "path" adapter parameter depends on where the target data exists in the response. It uses <a href="https://jsonpath.com/" target="_blank">JSONPath</a> to determine the location of the data. For example, if the response from the API is `{"USD":243.33}`, the "path" parameter is short: `"USD"`.

If an API responds with a complex JSON object, the "path" parameter would need to specify where to retrieve the desired data, using a dot delimited string for nested objects. For example, take the following response:

```json
{
   "Prices":{
        "USD":243.33
    }
}
```

This would require the following path: `"Prices.USD"`.

## Response Types

The code example above returns an unsigned integer from the oracle response, but multiple data types are available such as:

* **`uint256`** - Unsigned integers
* **`int256`** - Signed integers
* **`bool`** - True or False values
* **`bytes32`** - Strings and byte values

If you need to return a string, use `bytes32`. <a href="https://gist.github.com/alexroan/a8caf258218f4065894ecd8926de39e7" target="_blank">Here's one method</a> of converting `bytes32` to `string`. Currently any return value must fit within 32 bytes, if the value is bigger than that multiple requests will need to be made.

The data type returned by a specific job depends on the [tasks](/docs/tasks/) that it supports. Make sure to choose an oracle job that supports the data type that your contract needs to consume.

# Choosing an Oracle Job without specifying the URL

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the <a href="https://www.coingecko.com/en/api#explore-api" target="_blank">CoinGecko API</a>, see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
