---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Large Responses'
permalink: 'docs/large-responses/'
whatsnext:
  {
    'Make an Existing Job Request': '/docs/existing-job-request/',
    'API Reference': '/docs/chainlink-framework/',
    'Contract Addresses': '/docs/decentralized-oracles-ethereum-mainnet/',
  }
---

## Overview

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive large responses.

**Table of Contents**

- [Large Response](#large-response)
- [Setting the LINK token address, Oracle, and JobId](#setting-the-link-token-address-oracle-and-jobid)
- [Make an Existing Job Request](#make-an-existing-job-request)

## Large Response

This example shows how to:

- Call an API and fetch the response that is an arbitrary-length raw byte data.

[IPFS](https://docs.ipfs.io/) is a decentralized file system for storing and accessing files, websites, applications, and data. For this example, we stored in IPFS a _json_ file that contains an arbitrary-length raw byte data. To check the response, you can directly paste the following URL in your browser `https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json` or run this command in your terminal:

```curl
curl -X 'GET' \
  'https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json' \
  -H 'accept: application/json'
```

The response should be similar to the following:

```json
{
  "image": "0x68747470733a2f2f697066732e696f2f697066732f516d5358416257356b716e3259777435444c336857354d736a654b4a4839724c654c6b51733362527579547871313f66696c656e616d653d73756e2d636861696e6c696e6b2e676966"
}
```

Fetch the value of _image_. To consume an API, your contract must inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct named `Chainlink.Request`, which your contract can use to build the API request. The request must include the following parameters:

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
{% include 'samples/APIRequests/GenericBigWord.sol' %}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/GenericBigWord.sol" target="_blank" >Open in Remix</a>
    <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/GenericBigWord.sol).

1. Compile and deploy the contract using the Injected Web3 environment. The contract includes all the configuration variables for the _Kovan_ testnet. Make sure your wallet is set to use _Kovan_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Kovan_ by calling the [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function.
   - The Oracle contract address for _Kovan_ by calling the [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, the _data_ is a _bytes_ data type, so you must call a job that calls an API and returns _bytes_. You can find the job spec for the Chainlink node in this example [here](/docs/direct-request-get-bytes/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/docs/fund-your-contract/) page.

1. Call the `data` and `image_url` functions to confirm that the `data` and `image_url` state variables are not set.

1. Run the `requestBytes` function. This builds the `Chainlink.Request` using the correct parameters:

   - The `req.add("get", "<url>")` request parameter provides the oracle node with the [url](https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json) where to fetch the response.
   - The `req.add('path', 'image')` request parameter tells the oracle node how to parse the response.

1. After few seconds, call the `data` and `image_url` functions. You should get non-empty responses.

## Setting the LINK token address, Oracle, and JobId

The [`setChainlinkToken`](/docs/chainlink-framework/#setchainlinktoken) function sets the LINK token address for the [network](/docs/link-token-contracts/) you are deploying to. The [`setChainlinkOracle`](/docs/chainlink-framework/#setchainlinkoracle) function sets a specific Chainlink oracle that a contract makes an API call from. The `jobId` refers to a specific job for that node to run.

Each job is unique and returns different types of data. For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

## Make an Existing Job Request

If your contract is calling a public API endpoint, an Oracle job might already exist for it. It could mean that you do not need to add the URL or other adapter parameters into the request because the job is already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job, see the [Make an Existing Job Request](../existing-job-request/) guide.

For more information about the functions in `ChainlinkClient`, visit the [ChainlinkClient API Reference](../chainlink-framework/).
