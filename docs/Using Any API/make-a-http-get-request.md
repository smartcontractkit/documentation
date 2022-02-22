---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Make a GET Request"
permalink: "docs/make-a-http-get-request/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "Multi-Variable Responses":"/docs/multi-variable-responses/"}
metadata:
  title: "Make a GET Request"
  description: "Learn how to make a GET request to an API from a smart contract, using Chainlink."
  image:
    0: "/files/930cbb7-link.png"
---

## Overview

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle. External adapters are services which the core of the Chainlink node communicates via its API with a simple JSON specification. Refer to [External Adapters Introduction](../external-adapters/) for more information on external adapters and how to build them.

+ [Overview](#overview)
+ [API Consumer Example](#api-consumer-example)
+ [Choosing an Oracle and JobId](#choosing-an-oracle-and-jobid)
+ [Supported APIs](#supported-apis)
+ [Existing Job Requests](#existing-job-requests)

## API Consumer Example

Smart contracts should inherit from [`ChainlinkClient`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/ChainlinkClient.sol) to consume an API request. This contract exposes a struct called `Chainlink.Request`, which is used to build the API request. The request should include the following:

- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

>❗️ Note on Funding Contracts
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

The return value must fit within 32 bytes. If the value is bigger than that, make multiple requests.

If the LINK address for targeted blockchain is not [publicly available](../link-token-contracts/) yet, replace [setPublicChainlinkToken(/)](../chainlink-framework/#setpublicchainlinktoken) with [setChainlinkToken(_address)](../chainlink-framework/#setchainlinktoken) in the constructor, where `_address` is a corresponding LINK token contract. Below is an example `APIConsumer` contract:

```solidity Kovan
{% include samples/APIRequests/APIConsumer.sol %}
```
<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

Here is a breakdown of each component of the contract:

1. **Constructor**: This sets up the contract with the Oracle address, Job ID, and LINK fee that the oracle charges for the job.
2. **`requestVolumeData` function**: This builds and sends a request - which includes the fulfillment functions selector - to the oracle. Notice how it adds the get, path and times parameters.
3. **`fulfill` function**: This is where the result is sent upon the Oracle Job's completion.

## Choosing an Oracle and JobId

`oracle` refers to a specific Chainlink node that a contract makes an API call from. `jobId` refers to a specific job for that node to run. Each job is unique and returns different types of data.

For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Supported APIs

The `APIConsumer` in the example above is flexible enough to call any public API, so long as the URL in the "get" adapter parameter is correct, and the format of the response is known.

## Response Data

The *path* task parameter depends on where the target data exists in the response. It uses [JSONPath](https://jsonpath.com/) to determine the location of the data. For example, if the response from the API is `{"USD":243.33}`, the "path" parameter is short: `"USD"`.

If an API responds with a complex JSON object, the *path* parameter must specify where to retrieve the desired data using a dot delimited string for nested objects. For example, take the following response:

```json
{
   "Prices":{
        "USD":243.33
    }
}
```

This would require the following path: `"Prices.USD"`.

### Response Types

The code example above returns an unsigned integer from the oracle response, but multiple data types are available such as:

* **`uint256`** - Unsigned integers
* **`int256`** - Signed integers
* **`bool`** - True or False values
* **`bytes32`/`bytes`** - Strings and byte values

If you need to return a string, use `bytes32`. Here's [one method](https://gist.github.com/alexroan/a8caf258218f4065894ecd8926de39e7) of converting `bytes32` to `string`. Currently, any return value must fit within 32 bytes. If the value is bigger than that, make multiple requests.

The data type returned by a specific job depends on the [tasks](/docs/tasks/) that it supports. Make sure to choose an oracle job that supports the data type that your contract needs to consume.

## Existing Job Requests

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the [AP Election data](https://developer.ap.org/ap-elections-api/), see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
