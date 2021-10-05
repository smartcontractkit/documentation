---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "API Calls Tutorial"
permalink: "docs/advanced-tutorial/"
excerpt: "Calling APIs from Smart Contracts"
whatsnext: {"Make a GET Request":"/docs/make-a-http-get-request/", "Make an Existing Job Request":"/docs/existing-job-request/"}
metadata:
  image:
    0: "/files/04b8e56-cl.png"
---

<p>
  https://www.youtube.com/watch?v=ay4rXZhAefs
</p>

> 👍 Prerequisites
>
> This tutorial requires basic knowledge about Ethereum, smart contracts, and the Chainlink Request & Receive cycle. If you're unfamiliar with those concepts, follow the [The Basics](../beginners-tutorial/) or [Random Numbers](../intermediates-tutorial/) tutorials.

*By the end of the tutorial, you should know the following:*
- How to request data from a public API in a smart contract
- Understand what Core Adapters and External Adapters are and how Oracle Jobs use them
- Be able to find the Oracle Jobs and Adapters for your contract
- How to request data from an Oracle Job

# 1. Requesting API Data

## 1a. Request & Receive Recap

The request and receive cycle describes how a smart contract requests data from an oracle and receives the response in a separate transaction. If you need a refresher, check out the [Basic Request Model](../architecture-request-model/).

In the [Random Numbers tutorial](../intermediates-tutorial/), we request randomness from a VRF oracle, then await the response. The fulfilment function is already given to us from the `VRFConsumerBase` contract, so oracles already know where to send the response to. However, with API calls, our contract _defines_ which function it wants to receive the response to.

However, before we go into the implementation, let's first understand how Oracle jobs can get data on-chain.

## 1b. Initiators

[Initiators](../initiators/) are what kick off a job inside an Oracle. In the case of a Request and Receive job, the [RunLog](/docs/initiators/#runlog) initiator watches the blockchain for when a smart contract makes a request. Once it catches a request, it initiates the job. This runs the adapters (both core and external) that the job is configured to run, eventually returning the response to the contract that made the request.

## 1c. Core Adapters

Each oracle job has a configured set of tasks it needs to carry out when it is run. These tasks are defined by what [Adapters](../core-adapters/) they support. For example: if a job needs to make a GET request to an API, find a specific unsigned integer field in a JSON response, then submit that back to the requesting contract, it would need a job with the following Core Adapters:
- [HttpGet](../core-adapters/#httpget) - Call the API
- [JsonParse](../core-adapters/#jsonparse) - Parse the JSON and retrieve the desired data
- [EthUint256](../core-adapters/#ethuint256) - Convert the data to Ethereum compatible data type (uint256)
- [EthTx](../core-adapters/#ethtx)  - Submit the transaction to the chain, completing the cycle.

Let's walk through a real example, where we retrieve 24 volume of the <a href="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD" target="_blank">ETH/USD pair</a> from the cryptocompare API.

### Core Adapters Example

1. [HttpGet](../core-adapters/#httpget) - Calls the API and returns the body of an HTTP GET result for [ETH/USD pair](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD).  Example:
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

2. [JsonParse](../core-adapters/#jsonparse) - walks a specified `path` (`"RAW.ETH.USD.VOLUME24HOUR"`) and returns the value found at that result. Example: `703946.0675653099`

3. [Multiply](../core-adapters/#multiply) - parses the input into a float and multiplies it by the 10^18. Example: `703946067565309900000000`

4. [EthUint256](../core-adapters/#ethuint256) - formats the input into an integer and then converts it into Solidity's `uint256` format. Example: `0xc618a1e4`

5. [EthTx](../core-adapters/#ethtx) - takes the given input, places it into the data field of the transaction, signs a transaction, and broadcasts it to the network. Example: [transaction result](https://kovan.etherscan.io/tx/0xf36ec811db8bde1245b6aa16bc052d4fbab287b220cf194bb91ae452f1fad084)

**Important: Some core adapters accept parameters to be passed to them to inform them how to run.** For example: [JsonParse](../core-adapters/#jsonparse) accepts a `path` parameter which informs the adapter where to find the data in the JSON object.

Let's see what this looks like in a contract.

### Contract Example

```solidity
{% include samples/APIRequests/APIConsumer.sol %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

Let's walk through what's happening here:
1. Constructor - Setup the contract with the Oracle address, Job ID, and LINK fee that the oracle charges for the job
2. `requestVolumeData` - This builds and sends a request, which includes the fulfilment functions selector, to the oracle. Notice how it adds the `get`, `path` and `times` parameters. These are read by the Adapters in the job to perform the tasks correctly. `get` is used by [HttpGet](../core-adapters/#httpget), `path` is used by [JsonParse](../core-adapters/#jsonparse) and `times` is used by [Multiply](../core-adapters/#multiply).
3. `fulfill` - Where the result is sent once the Oracle job is complete

> 📘 Important
>
> The calling contract should own enough LINK to pay the specified fee (by default 0.1 LINK). You can use [this tutorial](../fund-your-contract/) to fund your contract.

This was an example of a basic HTTP GET request. However, it requires defining the API URL directly in the smart contract. This can, in fact, be extracted and configured on the Job level inside the Oracle.

## 1d. External Adapters

We split Adapters into two subcategories:

- Core Adapters - These are what we described earlier and come built-in to each node. (examples: HttpGet, EthUint256, etc)
- External Adapters - These are custom adapters built by node operators and community members, which perform specific tasks like calling a particular endpoint with a specific set of parameters (like authentication secrets that shouldn't be publicly visible smart contracts).

Here are some examples of external adapters:

1. Markets data: <a href="https://market.link/adapters/c3a722dd-fb6c-413f-923c-e53d2df26620?network=1" target="_blank">AlphaChain</a>
2. Real-world events: <a href="https://market.link/adapters/e7874f1a-2c35-4624-9a7a-644ce9d89ea4?network=1" target="_blank">SportsData</a>, <a href="https://market.link/adapters/f423d46b-1bfb-4cad-9038-7934eef353eb?network=1" target="_blank">COVID Tracker</a>
3. Social media proofs: <a href="https://market.link/adapters/8fba59b1-f639-4d0a-9b01-7adff9b74442?network=1" target="_blank">MUBC Retweet Verifier</a>
4. Cryptocurrency aggregators:  <a href="https://market.link/adapters/e43efb14-55b5-4adc-a807-f6f1c035f415?network=1" target="_blank">Coingecko</a>, <a href="https://market.link/adapters/f4d69a08-f3dd-46e7-b4b8-3d2fb620c033?network=1" target="_blank">CoinAPI</a>

All of these can be found on [Chainlink Market](https://market.link/search/all?network=42).

If all the parameters are defined within the Oracle job, the only thing a smart contract needs to define to consume it is:
- JobId
- Oracle address
- LINK fee
- Fulfillment function

This makes for a much more succinct smart contract, where the `requestVolumeData` function from the [code example above](#contract-example) would look more like this:

```solidity
function requestVolumeData() public returns (bytes32 requestId) {
    Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

    // Extra parameters don't need to be defined here because they are already defined in the job

    return sendChainlinkRequestTo(oracle, request, fee);
}
```

# 2. Exercise: Construct your own Contract

Now that we know how core adapters and external adapters are used to construct jobs and how smart contracts can use jobs to make requests let's put that to use!

Head to [Make an Existing Job Request](../existing-job-request/) to see how a smart contract can get any city's temperature using an existing oracle job found on Chainlink Market, without having to specify the URL inside the contract.

Then, using your knowledge of external adapters, find a different adapter on the market, and create another contract that consumes that data. Let us know the cool things you come up with in our <a href="https://discord.gg/2YHSAey" target="_blank">discord</a>!

# 3. Further Reading

- <a href="https://blog.chain.link/connect-smart-contract-to-twitter-api/" target="_blank">Blog: Connect a Smart Contract to the Twitter API</a>
- <a href="https://blog.chain.link/create-tesla-smart-contract-rental/" target="_blank">Blog: Connect a Tesla Vehicle API to a Smart Contract</a>
- <a href="https://blog.chain.link/oauth-and-api-authentication-in-smart-contracts-2/" target="_blank">Blog: OAuth and API Authentication in Smart Contracts</a>
