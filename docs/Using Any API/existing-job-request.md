---
layout: nodes.liquid
title: "Make an Existing Job Request"
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
[block:callout]
{
  "type": "success",
  "body": "This March, you have the chance to help build the next generation of smart contracts.\n\nThe Chainlink Spring Hackathon has a prize pot of over $80k+ and is sponsored by some of the most prominent crypto projects.\n\nMarch 15th - April 11th\n<a href=\"https://chain.link/hackathon?utm_source=chainlink&utm_medium=developer-docs&utm_campaign=hackathon\" target=\"_blank\"><b>Register Here.</b></a>",
  "title": "Join the Spring 2021 Chainlink Hackathon"
}
[/block]
Using an *existing* Oracle Job makes your smart contract code more succinct. This page explains how to retrieve the current weather temperature (in Kelvin) for a defined city using an existing Oracle job.

# OpenWeather Consumer

In [Make a GET Request](doc:make-a-http-get-request), the example contract code declared which URL to use, where to find the data in the response, and how to convert it so that it can be represented on-chain.

In this example, we're using a job found on the <a href="https://market.link/" target="_blank">Chainlink Market</a> that is pre-configured to perform these tasks. This means that our contract doesn't need to specify additional parameters for various adapters, it only needs the Oracle address and the Job ID. The remaining adapters are configured by the external adapter, in particular <a href="https://market.link/adapters/5ff8f621-102d-491d-b1c8-bbbe294e4620" target="_blank">weather_cl_ea</a>.

This example uses the <a href="https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1614168653&end=1614773453" target="_blank">Alpha Chain Kovan Oracle</a>, which runs the <a href="https://market.link/jobs/e10388e6-1a8a-4ff5-bad6-dd930049a65f?network=42" target="_blank">OpenWeather Data Job</a>.

Note, the calling contract should own enough LINK to pay the specified fee (by default 0.1 LINK). You can use [this tutorial](doc:fund-your-contract) to fund your contract.

<div class="row text-center center">
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=e5f752fa134b49ef481da74ec1a453a6" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
</div>
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://docs.chain.link/docs/example-walkthrough" target="_blank">What is Remix?</a>
</div>
</div>

```javascript
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract OpenWeatherConsumer is ChainlinkClient {
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    uint256 public result;
    
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           Alpha Chain - Kovan
     *      Listing URL:    https://market.link/nodes/ef076e87-49f4-486b-9878-c4806781c7a0?start=1614168653&end=1614773453
     *      Address:        0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b
     * Job: 
     *      Name:           OpenWeather Data
     *      Listing URL:    https://market.link/jobs/e10388e6-1a8a-4ff5-bad6-dd930049a65f
     *      ID:             235f8b1eeb364efc83c26d0bef2d0c01
     *      Fee:            0.1 LINK
     */
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "235f8b1eeb364efc83c26d0bef2d0c01";
        fee = 0.1 * 10 ** 18;
    }
    
    /**
     * Initial request
     */
    function requestEthereumPrice(string memory _city) public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillEthereumPrice.selector);
        req.add("city", _city);
        sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Callback function
     */
    function fulfillEthereumPrice(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        result = _result;
    }
}
```

For more information on finding existing jobs, see [Find Existing Jobs](doc:listing-services).