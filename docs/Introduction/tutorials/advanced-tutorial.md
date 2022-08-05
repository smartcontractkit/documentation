---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: 'API Calls: Using Any API'
permalink: 'docs/advanced-tutorial/'
excerpt: 'Calling APIs from Smart Contracts'
whatsnext:
  {
    'Make a GET Request': '/docs/make-a-http-get-request/',
    'Make an Existing Job Request': '/docs/existing-job-request/',
  }
metadata:
  image:
    0: '/files/04b8e56-cl.png'
---

> 📘 Requirements
>
> This guide requires basic knowledge about smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) and [Random Numbers](/docs/intermediates-tutorial/) guides before you begin.

<p>
  https://www.youtube.com/watch?v=ay4rXZhAefs
</p>

## Overview

In this guide, you will learn how to request data from a public API in a smart contract. This includes understanding what Tasks and External adapters are and how Oracle Jobs use them. You will also learn how to find the Oracle Jobs and Tasks for your contract and how to request data from an Oracle Job.

**Topics**

- [Overview](#overview)
- [1. How does the request and receive cycle work for API calls?](#1-how-does-the-request-and-receive-cycle-work-for-api-calls)
- [2. What are jobs?](#2-what-are-jobs)
- [3. What are Tasks?](#3-what-are-tasks)
  - [Tasks](#tasks)
  - [Contract Example](#contract-example)
  - [External Adapters](#external-adapters)
- [4. How can I use an Oracle Data Service?](#4-how-can-i-use-an-oracle-data-service)
- [5. Further Reading](#5-further-reading)

## 1. How does the request and receive cycle work for API calls?

The request and receive cycle describes how a smart contract requests data from an oracle and receives the response in a separate transaction. If you need a refresher, check out the [Basic Request Model](../architecture-request-model/).

For contracts that use [Chainlink VRF](/docs/chainlink-vrf/), you request randomness from a VRF oracle and then await the response. The fulfillment function is already given to us from the `VRFConsumerBase` contract, so oracles already know where to send the response to. However, with API calls, the contract itself _defines_ which function it wants to receive the response to.

Before creating any code, you should understand how Oracle jobs can get data on-chain.

## 2. What are jobs?

Chainlink nodes require [**Jobs**](/docs/jobs/) to do anything useful. In the case of a Request and Receive job, the [Direct Request](/docs/jobs/types/direct-request/) job monitors the blockchain for a request from a smart contract. Once it catches a request, it runs the tasks (both core and external adapters) that the job is configured to run and eventually returns the response to the requesting contract.

## 3. What are Tasks?

Each oracle job has a configured set of tasks it must complete when it is run. These tasks are split into two subcategories:

- [**Tasks**](/docs/tasks/) - These are tasks that come built-in to each node. (examples: http, ethabidecode, etc).
- [**External Adapters**](/docs/external-adapters/) - These are custom adapters built by node operators and community members, which perform specific tasks like calling a particular endpoint with a specific set of parameters (like authentication secrets that shouldn't be publicly visible).

### Tasks

If a job needs to make a GET request to an API, find a specific unsigned integer field in a JSON response, then submit that back to the requesting contract, it would need a job containing the following Tasks:

- [HTTP](/docs/jobs/task-types/http/) calls the API. the `method` must be set to _GET_.
- [JSON Parse](/docs/jobs/task-types/jsonparse/) parses the JSON and extracts a value at a given keypath.
- [Multiply](/docs/jobs/task-types/multiply/) multiplies the input by a multiplier. Used to remove the decimals.
- [ETH ABI Encode](/docs/jobs/task-types/eth-abi-encode/) converts the data to a bytes payload according to ETH ABI encoding.
- [ETH Tx](/docs/jobs/task-types/eth-tx/) submits the transaction to the chain, completing the cycle.

The job specs example can be found [here](/docs/direct-request-get-uint256/).
Let's walk through a real example, where you will retrieve 24 volumes of the [ETH/USD pair](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD) from the cryptocompare API.

1. [HTTP](/docs/jobs/task-types/http/) calls the API and returns the body of an HTTP GET result for [ETH/USD pair](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD). Example:

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

2. [JSON Parse](/docs/jobs/task-types/jsonparse/) walks a specified `path` (`"RAW,ETH,USD,VOLUME24HOUR"`) and returns the value found at that result. Example: `703946.0675653099`

3. [Multiply](/docs/jobs/task-types/multiply/) parses the input into a float and multiplies it by the 10^18. Example: `703946067565309900000000`

4. [ETH ABI Encode](/docs/jobs/task-types/eth-abi-encode/) formats the input into an integer and then converts it into Solidity's `uint256` format. Example: `0xc618a1e4`

5. [ETH Tx](/docs/jobs/task-types/eth-tx/) takes the given input, places it into the data field of the transaction, signs a transaction, and broadcasts it to the network. Example: [transaction result](https://rinkeby.etherscan.io/tx/0xec0e33cce33f6dda6c7339703415ab563f7b0e08a11b65ea06473d3d01547f4f)

**Note: Some tasks accept parameters to be passed to them to inform them how to run.** Example: [JSON Parse](/docs/jobs/task-types/jsonparse/) accepts a `path` parameter which informs the task where to find the data in the JSON object.

Let's see what this looks like in a contract:

### Contract Example

```solidity
{% include 'samples/APIRequests/APIConsumer.sol' %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" >Open in Remix</a>
  <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

Here is a breakdown of each component of this contract:

1. Constructor: This sets up the contract with the Oracle address, Job ID, and LINK fee that the oracle charges for the job.
2. `requestVolumeData` functions: This builds and sends a request - which includes the fulfillment functions selector - to the oracle. Notice how it adds the `get`, `path` and `times` parameters. These are read by the Tasks in the job to perform correctly. `get` is used by [HTTP](/docs/jobs/task-types/http/), `path` is used by [JSON Parse](/docs/jobs/task-types/jsonparse/) and `times` is used by [Multiply](/docs/jobs/task-types/multiply/).
3. `fulfill` function: This is where the result is sent upon the Oracle Job's completion.

**Note:** The calling contract should own enough LINK to pay the fee, which by default is 0.1 LINK. You can use [this tutorial](/docs/fund-your-contract/) to learn how to fund your contract.

This is an example of a basic HTTP GET request. However, it requires defining the API URL directly in the smart contract. This can, in fact, be extracted and configured on the Job level inside the Oracle node. You can follow the _APIConsumer_ tutorial [here](/docs/single-word-response/).

### External Adapters

Here are some examples nodes with external adapters:

- [Google Weather Data](https://docs.chain.link/docs/google-weather/)
- [Associated Press](https://market.link/nodes/The%20Associated%20Press/integrations)

If all the parameters are defined within the Oracle job, the only things a smart contract needs to define to consume are:

- JobId
- Oracle address
- LINK fee
- Fulfillment function

This will make your smart contract much more succinct. The `requestVolumeData` function from the code example [above](#contract-example) would look more like this:

```solidity
function requestVolumeData() public returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

    // Extra parameters don't need to be defined here because they are already defined in the job

    return sendChainlinkRequest(req, fee);
}
```

You can follow a full _Existing Job Tutorial_ [here](/docs/existing-job-request/).
More on External Adapters can be found [here](/docs/external-adapters/).

## 4. How can I use an Oracle Data Service?

Chainlink has facilitated the launch of several new oracle data services that allow dApps to access rich data from external data sources. For instance, you can create a smart contract that checks Google's DNS service to determine if a given domain is owned by a given blockchain address using oracle job without having to specify the URL inside the contract.
Join the [operator-requests discord channel](https://discord.gg/eGcxsdZzKR) to directly communicate with community node operators.
A full example on Kovan testnet can be found [here](/docs/dns-ownership-oracle/).

## 5. Further Reading

To learn more about connecting smart contracts to external APIs, read our blog posts:

- [Connect a Smart Contract to the Twitter API](https://blog.chain.link/connect-smart-contract-to-twitter-api/)
- [Connect a Tesla Vehicle API to a Smart Contract](https://blog.chain.link/create-tesla-smart-contract-rental/)
- [OAuth and API Authentication in Smart Contracts](https://blog.chain.link/oauth-and-api-authentication-in-smart-contracts-2/)

To explore more applications of external API requests, check out our [other tutorials](/docs/other-tutorials/#api-requests).
