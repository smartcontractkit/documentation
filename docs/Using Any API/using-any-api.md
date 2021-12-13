---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Using Any API"
permalink: "docs/using-any-api/"
excerpt: "Calling APIs from Smart Contracts"
whatsnext: {"Make a GET Request":"/docs/make-a-http-get-request/", "Make an Existing Job Request":"/docs/existing-job-request/"}
metadata:
  image:
    0: "/files/04b8e56-cl.png"
---

> 👍 Requirements
>
> This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Getting Started Guide](/getting-started/) before you start this guide.

<p>
  https://www.youtube.com/watch?v=ay4rXZhAefs
</p>

# Overview

In this tutorial, you will learn how to request data from a public API in a smart contract. This includes understanding what Core adapters and External adapters are and how Oracle Jobs use them. You will also learn how to find the Oracle Jobs and Adapters for your contract and how to request data from an Oracle Job.

**Table of Contents**

+ [Overview](#overview)
+ [1. How does the request and receive cycle work for API calls?](#1-how-does-the-request-and-receive-cycle-work-for-api-calls)
+ [2. What are initiators?](#2-what-are-initiators)
+ [3. What are Adapters?](#3-what-are-adapters)
+ [4. How can I use Adapters in my own contract?](#4-how-can-i-use-adapters-in-my-own-contract)
+ [5. How do I deploy to testnet?](#5-how-do-i-deploy-to-testnet)
+ [6. Further Reading](#6-further-reading)

# 1. How does the request and receive cycle work for API calls?

The request and receive cycle describes how a smart contract requests data from an oracle and receives the response in a separate transaction. If you need a refresher, check out the [Basic Request Model](../architecture-request-model/).

With API calls, the contract itself *defines* which function it wants to receive the response to.

Before creating any code, you should understand how Oracle jobs can get data on-chain.

# 2. What are initiators?

[**Initiators**](../initiators/) are what start, or initiate, a job inside an Oracle. In the case of a Request and Receive job, the [RunLog](/docs/initiators/#runlog) initiator monitors the blockchain for a request from a smart contract. Once it catches a request, it initiates the job. This runs the adapters (both core and external) that the job is configured to run and eventually returns the response to the requesting contract.

# 3. What are Adapters?

Each oracle job has a configured set of tasks it must complete when it is run. These tasks are defined by the [**Adapters**](../core-adapters/) they support. Adapters are split into two subcategories:

- **Core Adapters** - These are adapters that come built-in to each node. (examples: HttpGet, EthUint256, etc)
- **External Adapters** - These are custom adapters built by node operators and community members, which perform specific tasks like calling a particular endpoint with a specific set of parameters (like authentication secrets that shouldn't be publicly visible smart contracts).

## Core Adapters

If a job needs to make a GET request to an API, find a specific unsigned integer field in a JSON response, then submit that back to the requesting contract, it would need a job containing the following Core Adapters:
- [HttpGet](../core-adapters/#httpget) calls the API
- [JsonParse](../core-adapters/#jsonparse) parses the JSON and retrieve the desired data
- [EthUint256](../core-adapters/#ethuint256) converts the data to Ethereum compatible data type (uint256)
- [EthTx](../core-adapters/#ethtx) submits the transaction to the chain, completing the cycle.

Let's walk through a real example, where you will retrieve 24 volumes of the [ETH/USD pair](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD) from the cryptocompare API.

1. [HttpGet](../core-adapters/#httpget) calls the API and returns the body of an HTTP GET result for [ETH/USD pair](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD).  Example:
```json
{"RAW":
  {"ETH":
    {"USD":
      {
        ...,
        "VOLUMEDAYTO":953806939.7194247,
        "VOLUME24HOUR":703946.0675653099,
        "VOLUME24HOURTO":1265826345.488568
        ...,
      }
    }
  }
}
```

2. [JsonParse](../core-adapters/#jsonparse) walks a specified `path` (`"RAW.ETH.USD.VOLUME24HOUR"`) and returns the value found at that result. Example: `703946.0675653099`

3. [Multiply](../core-adapters/#multiply) parses the input into a float and multiplies it by the 10^18. Example: `703946067565309900000000`

4. [EthUint256](../core-adapters/#ethuint256) formats the input into an integer and then converts it into Solidity's `uint256` format. Example: `0xc618a1e4`

5. [EthTx](../core-adapters/#ethtx) takes the given input, places it into the data field of the transaction, signs a transaction, and broadcasts it to the network. Example: [transaction result](https://kovan.etherscan.io/tx/0xf36ec811db8bde1245b6aa16bc052d4fbab287b220cf194bb91ae452f1fad084)

**Note: Some core adapters accept parameters to be passed to them to inform them how to run.** Example: [JsonParse](../core-adapters/#jsonparse) accepts a `path` parameter which informs the adapter where to find the data in the JSON object.

Let's see what this looks like in a contract:

## Contract Example

```solidity
{% include samples/APIRequests/APIConsumer.sol %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" >Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

Here is a breakdown of each component of this contract:
1. Constructor: This sets up the contract with the Oracle address, Job ID, and LINK fee that the oracle charges for the job.
2. `requestVolumeData` functions: This builds and sends a request - which includes the fulfillment functions selector - to the oracle. Notice how it adds the `get`, `path` and `times` parameters. These are read by the Adapters in the job to perform the tasks correctly. `get` is used by [HttpGet](../core-adapters/#httpget), `path` is used by [JsonParse](../core-adapters/#jsonparse) and `times` is used by [Multiply](../core-adapters/#multiply).
3. `fulfill` function: This is where the result is sent upon the Oracle Job's completion.

**Note:** The calling contract should own enough LINK to pay the [specified fee](https://market.link/data-providers/d66c1ec8-2504-4696-ab22-6825044049f7/integrations) (by default 0.1 LINK). You can use [this tutorial](../fund-your-contract/) to fund your contract.

This is an example of a basic HTTP GET request. However, it requires defining the API URL directly in the smart contract. This can, in fact, be extracted and configured on the Job level inside the Oracle.

## External Adapters

Here are some examples of external adapters:

1. Real-world events: [Google Weather Data](https://market.link/adapters/654b3417-c381-4764-8cb7-4e8d552a9d95), [Associated Press](https://market.link/adapters/cee0cc56-43a2-40e1-9014-3905c2534caa)
2. Social media proofs: [MUBC Retweet Verifier](https://market.link/adapters/8fba59b1-f639-4d0a-9b01-7adff9b74442?network=1)
3. Cryptocurrency aggregators: [CoinAPI](https://market.link/adapters/f4d69a08-f3dd-46e7-b4b8-3d2fb620c033?network=1)

These external adapters, along with many others, can be found on [Chainlink Market](https://market.link/search/all?network=42).

If all the parameters are defined within the Oracle job, the only thing a smart contract needs to define to consume it is:

- JobId
- Oracle address
- LINK fee
- Fulfillment function

This will make your smart contract much more succinct. The `requestVolumeData` function from the code example [above](#contract-example) would look more like this:

```solidity
function requestVolumeData() public returns (bytes32 requestId) {
    Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

    // Extra parameters don't need to be defined here because they are already defined in the job

    return sendChainlinkRequestTo(oracle, request, fee);
}
```

# 4. How can I use Adapters in my own contract?

Create a smart contract that can get sports data using the [SportsDataIO](https://market.link/data-providers/d66c1ec8-2504-4696-ab22-6825044049f7/integrations) oracle job found on Chainlink Market, without having to specify the URL inside the contract.

To consume an API response, your contract should inherit from `ChainlinkClient`. This contract exposes a struct called `Chainlink.Request` that your contract should use to build the API request.

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract sportContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;
}
```

## Variables
The request should include the oracle address, the job id, the fee, adapter parameters, and the callback function signature. Create variables for these items using the correct data types.

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract sportContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address private oracle;
  bytes32 private jobId;
  uint256 private fee;
}
```

## Constructor
In the constructor, set up the contract with the Oracle address, Job ID, and LINK fee that the oracle charges for the job.

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract sportContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  // ...
  // { previously created variables }
  // ...

  constructor() {
    setPublicChainlinkToken();
    oracle = 0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd;
    jobId = "9abb342e5a1d41c6b72941a3064cf55f";
    fee = 0.1 * 10 ** 18; // (Varies by network and job)
  }
}
```

## `requestData` Function
The [SportsDataIO](https://market.link/data-providers/d66c1ec8-2504-4696-ab22-6825044049f7/integrations) job page specifies the request parameters to be *date* and *teamName*. To account for this, your `requestData` function should have both of these items as parameters. Please refer to the job page to understand the specific input format for these items.

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract sportContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  // ...
  // { previously created variables }
  // ...

  // ...
  // { constructor }
  // ...

  // Initial Request
  function requestData(string memory _date, string memory _team) public returns (bytes32 requestId)  {
      Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
      req.add("date", _date);
      req.add("teamName", _team);
      return sendChainlinkRequestTo(oracle, req, fee);
  }
}
```

## Callback Function

The last component of your contract should be the `fulfill` function. This is where the sports data is sent upon the Oracle Job's completion. The [SportsDataIO](https://market.link/data-providers/d66c1ec8-2504-4696-ab22-6825044049f7/integrations) job page specifies that the request returns a `bytes32` packed `string`. You should add a `data` variable to your contract to store this result.

**Note:** Currently, any return value must fit within 32 bytes. If the value is bigger than that, you must make multiple requests.

```solidity
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract sportContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  bytes32 public data;
  // ...
  // { previously created variables }
  // ...

  // ...
  // { constructor }
  // ...

  // ...
  // { requestData function }
  // ...


  // Callback Function
  function fulfill(bytes32 _requestId, bytes32 _data) public recordChainlinkFulfillment(_requestId) {
      data = _data;
  }
}
```

# 5. How do I deploy to testnet?

Your contract is complete and ready to be compiled and deployed. You can see a complete version of the contract in Remix:

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/sportContract.sol" target="_blank" >Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

If you don't know how to deploy a contract to the Kovan testnet from Remix, follow getting started guide for [Deploying Your First Smart Contract](/docs/deploy-your-first-contract/). To make a job request, you *must* have enough LINK to pay for it. Learn how to [acquire testnet LINK](/docs/acquire-link/) and [fund your contract](/docs/fund-your-contract/). Once these steps are completed, you should be able to get sports data.


# 6. Further Reading

To learn more about connecting smart contracts to external APIs, read our blog posts:

- [Connect a Smart Contract to the Twitter API](https://blog.chain.link/connect-smart-contract-to-twitter-api/)
- [Connect a Tesla Vehicle API to a Smart Contract](https://blog.chain.link/create-tesla-smart-contract-rental/)
- [OAuth and API Authentication in Smart Contracts](https://blog.chain.link/oauth-and-api-authentication-in-smart-contracts-2/)

To explore more applications of external API requests, check out our [other tutorials](/docs/other-tutorials/#api-requests).
