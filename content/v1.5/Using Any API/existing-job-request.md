---
layout: nodes.liquid
title: "Make an Existing Job Request"
slug: "existing-job-request"
hidden: false
metadata: 
  title: "Make an Existing Job Request"
  description: "Learn how to utilize existing Chainlink external adapters to make calls to APIs from smart contracts."
  image: 
    0: "https://files.readme.io/cb2c0ec-670379d-OpenGraph_V3.png"
    1: "670379d-OpenGraph_V3.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
date: Last Modified
---
Using an *existing* Oracle Job makes your smart contract code more succinct. This page explains how to make an HTTP GET request to the <a href="https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd" target="_blank">ETH-USD Price endpoint</a> in the <a href="https://www.coingecko.com/en/api#explore-api" target="_blank">CoinGecko API</a>, to retrieve the price of ETH, using an existing Oracle job.

# Coin Gecko Consumer

In [Make a GET Request](doc:make-a-http-get-request), the example contract code declared which URL to hit, where to find the data in the response, and how to convert it so that it can be represented on-chain. 

In this example, an Oracle Job was found on <a href="https://market.link/" target="_blank">Chainlink Market</a> that is pre-configured to perform these tasks. This means that our contract needn't specify them itself, it only needs the Oracle address and the Job ID.

This example uses the <a href="https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1601380594&end=1601985394" target="_blank">Alpha Chain Kovan oracle</a>, which runs the <a href="https://market.link/jobs/78868caf-4a75-4dbf-a4cf-52538a283409" target="_blank">ETH-USD CoinGecko Job</a>.

The contract should own enough LINK to pay the specified fee. The beginner walkthrough explains how to [fund your contract](doc:fund-your-contract).

<div class="row text-center center">
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=94b5de0732702de00a3238d3d6e738e6" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
</div>
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://docs.chain.link/docs/example-walkthrough" target="_blank">What is Remix?</a>
</div>
</div>

```javascript Kovan
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract CoinGeckoConsumer is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    uint256 public ethereumPrice;
    
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           AlphaChain Kovan
     *      Listing URL:    https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1601380594&end=1601985394
     *      Address:        0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b
     * Job: 
     *      Name:           ETH-USD CoinGecko
     *      Listing URL:    https://market.link/jobs/78868caf-4a75-4dbf-a4cf-52538a283409
     *      ID:             9cc0c77e8e6e4f348ef5ba03c636f1f7
     *      Fee:            0.1 LINK
     */
    constructor() public {
    	setPublicChainlinkToken();
    	oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b; // oracle address
    	jobId = "9cc0c77e8e6e4f348ef5ba03c636f1f7"; //job id
    	fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    /**
     * Make initial request
     */
    function requestEthereumPrice() public {
    	Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillEthereumPrice.selector);
    	sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Callback function
     */
    function fulfillEthereumPrice(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId) {
    	ethereumPrice = _price;
    }
}
```

For more information on finding existing jobs, see [Find Existing Jobs](doc:listing-services).