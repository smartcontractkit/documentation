---
layout: ../../../../layouts/MainLayout.astro
section: anyApi
date: Last Modified
title: "Large Responses"
permalink: "docs/any-api/get-request/examples/large-responses/"
whatsnext:
  {
    "Make an Existing Job Request": "/any-api/get-request/examples/existing-job-request/",
    "API Reference": "/any-api/api-reference/",
    "Testnet Oracles": "/any-api/testnet-oracles/",
    "Data Provider Nodes": "/any-api/data-providers/introduction/",
  }
setup: |
  import AnyApiCallout from "@features/any-api/common/AnyApiCallout.astro"
---

This guide explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](/any-api/introduction/) cycle and then receive large responses.

<AnyApiCallout callout="prerequisites" />

## Example

This example shows how to:

- Call an API and fetch the response that is an arbitrary-length raw byte data.

[IPFS](https://docs.ipfs.io/) is a decentralized file system for storing and accessing files, websites, applications, and data. For this example, we stored in IPFS a _JSON_ file that contains arbitrary-length raw byte data. To check the response, directly paste the following URL in your browser: `https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json` Alternatively, run the following command in your terminal:

```bash
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

Fetch the value of _image_. To consume an API, your contract must import [ChainlinkClient.sol](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct named `Chainlink.Request`, which your contract can use to build the API request. The request must include the following parameters:

- Link token address
- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

:::caution[ Note on Funding Contracts]

Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](/resources/acquire-link/) and [Fund your contract](/resources/fund-your-contract/)**.

:::

::solidity-remix[samples/APIRequests/GenericBigWord.sol]

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/GenericBigWord.sol).

1. Compile and deploy the contract using the Injected Provider environment. The contract includes all the configuration variables for the _Sepolia_ testnet. Make sure your wallet is set to use _Sepolia_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Sepolia_ by calling the [`setChainlinkToken`](/any-api/api-reference/#setchainlinktoken) function.
   - The Oracle contract address for _Sepolia_ by calling the [`setChainlinkOracle`](/any-api/api-reference/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, the _data_ is a _bytes_ data type, so you must call a job that calls an API and returns _bytes_. We will be using a generic **_GET>bytes_** job that can be found [here](/any-api/testnet-oracles/#jobs).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/resources/fund-your-contract/) page.

1. Call the `data` and `image_url` functions to confirm that the `data` and `image_url` state variables are not set.

1. Run the `requestBytes` function. This builds the `Chainlink.Request` using the correct parameters:

   - The `req.add("get", "<url>")` request parameter provides the oracle node with the [url](https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json) where to fetch the response.
   - The `req.add('path', 'image')` request parameter tells the oracle node how to parse the response.

1. After few seconds, call the `data` and `image_url` functions. You should get non-empty responses.

<AnyApiCallout callout="common" />
