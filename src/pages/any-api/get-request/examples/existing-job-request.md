---
layout: ../../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Existing Job Request"
permalink: "docs/any-api/get-request/examples/existing-job-request/"
whatsnext:
  {
    "Find Existing Jobs": "/any-api/find-oracle/",
    "API Reference": "/any-api/api-reference/",
    "Testnet Oracles": "/any-api/testnet-oracles/",
    "Data Provider Nodes": "/any-api/data-providers/introduction/",
  }
metadata:
  title: "Make an Existing Job Request"
  description: "Learn how to utilize existing Chainlink external adapters to make calls to APIs from smart contracts."
  image:
    0: "/files/OpenGraph_V3.png"
setup: |
  import AnyApiCallout from "@features/any-api/common/AnyApiCallout.astro"
---

Using an _existing_ Oracle Job makes your smart contract code more succinct. This page explains how to retrieve the gas price from an existing Chainlink job that calls [etherscan gas tracker API](https://docs.etherscan.io/api-endpoints/gas-tracker#get-gas-oracle).

<AnyApiCallout callout="prerequisites" />

## Example

In [Single Word Response Example](/any-api/get-request/examples/single-word-response/), the example contract code declared which URL to use, where to find the data in the response, and how to convert it so that it can be represented on-chain.

This example uses an existing job that is pre-configured to make requests to get [the gas price](https://docs.etherscan.io/api-endpoints/gas-tracker#get-gas-oracle). Using specialized jobs makes your contracts succinct and more simple.

[Etherscan gas oracle](https://docs.etherscan.io/api-endpoints/gas-tracker#get-gas-oracle) returns the current Safe, Proposed and Fast gas prices. To check the response, you can directly paste the following URL in your browser `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken` or run this command in your terminal:

```bash
curl -X 'GET' \
  'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken' \
  -H 'accept: application/json'
```

The response should be similar to the following:

```json
{
  "status": "1",
  "result": {
    "LastBlock": "14653286",
    "SafeGasPrice": "33",
    "ProposeGasPrice": "33",
    "FastGasPrice": "35",
    "suggestBaseFee": "32.570418457",
    "gasUsedRatio": "0.366502543599508,0.15439818258491,0.9729006,0.4925609,0.999657066666667"
  }
}
```

For this example, we created a job that leverages the [EtherScan External Adapter](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/sources/etherscan) to fetch the _SafeGasPrice_ , _ProposeGasPrice_ and _FastGasPrice_. You can learn more about External Adapters [here](/chainlink-nodes/external-adapters/external-adapters/).
To consume an API, your contract must import [ChainlinkClient.sol](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct named `Chainlink.Request`, which your contract can use to build the API request. The request must include the following parameters:

- Link token address
- Oracle address
- Job id
- Request fee
- Task parameters
- Callback function signature

:::caution[ Note on Funding Contracts]

Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](/resources/acquire-link/) and [Fund your contract](/resources/fund-your-contract/)**.

:::

::solidity-remix[samples/APIRequests/GetGasPrice.sol]

To use this contract:

1. Open the [contract in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/GetGasPrice.sol).

1. Compile and deploy the contract using the Injected Provider environment. The contract includes all the configuration variables for the _Sepolia_ testnet. Make sure your wallet is set to use _Sepolia_. The _constructor_ sets the following parameters:

   - The Chainlink Token address for _Sepolia_ by calling the [`setChainlinkToken`](/any-api/api-reference/#setchainlinktoken) function.
   - The Oracle contract address for _Sepolia_ by calling the [`setChainlinkOracle`](/any-api/api-reference/#setchainlinkoracle) function.
   - The `jobId`: A specific job for the oracle node to run. In this case, the job is very specific to the use case as it returns the gas prices. You can find the job spec for the Chainlink node [here](/chainlink-nodes/job-specs/direct-request-existing-job/).

1. Fund your contract with 0.1 LINK. To learn how to send LINK to contracts, read the [Fund Your Contracts](/resources/fund-your-contract/) page.

1. Call the `gasPriceFast`, `gasPriceAverage` and `gasPriceSafe` functions to confirm that the `gasPriceFast`, `gasPriceAverage` and `gasPriceSafe` state variables are equal to zero.

1. Run the `requestGasPrice` function. This builds the `Chainlink.Request`. Note how succinct the request is.

1. After few seconds, call the `gasPriceFast`, `gasPriceAverage` and `gasPriceSafe` functions. You should get a non-zero responses.

<AnyApiCallout callout="common" />
