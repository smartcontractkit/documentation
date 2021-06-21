---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Make a GET Request"
permalink: "docs/make-a-http-get-request/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
metadata: 
  title: "Make a GET Request"
  description: "Learn how to make a GET request to an API from a smart contract, using Chainlink."
  image: 
    0: "/files/930cbb7-link.png"
---
This page explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle.

# API Consumer

To consume an API response, your contract should inherit from <a href="https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol" target="_blank">`ChainlinkClient`</a>. This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the oracle address, the job id, the fee, adapter parameters, and the callback function signature.

Currently, any return value must fit within 32 bytes, if the value is bigger than that multiple requests will need to be made.

>❗️ Remember to fund your contract with LINK!
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=8a173a65099261582a652ba18b7d96c1" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```javascript Kovan
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract APIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;
  
    uint256 public volume;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Kovan
     * Oracle: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Job ID: 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;
        jobId = "29fa9aa13bf1468788b7cc4a500a45b8";
        fee = 0.1 * 10 ** 18; // (Varies by network and job)
    }
    
    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        request.add("path", "RAW.ETH.USD.VOLUME24HOUR");
        
        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
    }
 
    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}
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

```JSON
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

The data type returned by a specific job depends on the [adapters](../adapters/) that it supports. Make sure to choose an oracle job that supports the data type that your contract needs to consume. 

# Choosing an Oracle Job without specifying the URL

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the <a href="https://www.coingecko.com/en/api#explore-api" target="_blank">CoinGecko API</a>, see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).