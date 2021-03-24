---
title: "Matic Documentation"
slug: "matic-documentation"
hidden: true
createdAt: "2020-08-18T13:01:34.750Z"
updatedAt: "2020-08-19T13:25:11.133Z"
---
Chainlink enables your contracts to access to *any* external data source, through a decentralized oracle network. Whether your contract requires sports results, the latest weather, or any other publicly available data, Chainlink provides the tools required for your contract to consume it.

# Request and Receive Cycle

Chainlink's Request and Receive cycle enables your smart contracts to make a request to any external API and consume the response. To implement it, your contract needs to define two functions: 

1. One to request the data
2. Another to receive the response.

To request data, your contract builds a request object which it provides to an oracle. Once the oracle has reached out to the API and parsed the response, it will attempt to send the data back to your contract using the callback function defined in your smart contract.

# Code Example

To interact with external APIs, your smart contract should inherit from <a href="https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol" target="_blank">`ChainlinkClient`</a>, which is a contract designed to make processing requests easy. It exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. 

The request should define the oracle address, the job id, the fee, adapter parameters, and the callback function signature. In this example, the request is built in the `requestEthereumPrice` function.

`fulfill` is defined as the callback function.

```javascript
pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {
  
    uint256 public ethereumPrice;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Matic Mumbai Testnet
     * Oracle: 0x1cf7D49BE7e0c6AC30dEd720623490B64F572E17
     * Job ID: d8fcf41ee8984d3b8b0eae7b74eca7dd
     * LINK address: 0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB
     * Fee: 1 LINK
     */
    constructor() public {
        setChainlinkToken(0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB);
        oracle = 0x1cf7D49BE7e0c6AC30dEd720623490B64F572E17;
        jobId = "d8fcf41ee8984d3b8b0eae7b74eca7dd";
        fee = 10 ** 18; // 1 LINK
    }
    
    /**
     * Create a Chainlink request to retrieve API response, find the target price
     * data, then multiply by 100 (to remove decimal places from price).
     */
    function requestEthereumPrice() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"USD":243.33}
        request.add("path", "USD");
        
        // Multiply the result by 100 to remove decimals
        request.addInt("times", 100);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        ethereumPrice = _price;
    }
}
```

# Addresses

There is currently only one operational Chainlink oracle on the Matic Mumbai Testnet.

Oracle: <a href="https://mumbai-explorer.matic.today/address/0x1cf7D49BE7e0c6AC30dEd720623490B64F572E17/transactions" target="_blank">`0x1cf7D49BE7e0c6AC30dEd720623490B64F572E17`</a>
LINK: <a href="https://mumbai-explorer.matic.today/address/0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB/transactions" target="_blank">`0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB`</a>

To obtain LINK on Mumbai Testnet, contact us on our <a href="https://discord.com/invite/UFC4VYh" target="_blank">Discord</a>.

# Which APIs are Supported?

Chainlink's Request and Receive cycle is flexible enough to call any public API, so long as the request parameters are correct and the response format is known. For example, if the response object from a URL we want to fetch from is formatted like this: `{"USD":243.33}`, the path is simple: `"USD"`.

If an API responds with a complex JSON object, the "path" parameter would need to specify where to retrieve the desired data, using a dot delimited string for nested objects. For example, take the following response:

```JSON
{
   "Prices":{
        "USD":243.33
    }
}
```

This would require the following path: `"Prices.USD"`.

# What Are Job IDs For?

You may have noticed that example uses a `jobId` parameter when building the request. Jobs are comprised of a sequence of instructions that an oracle is configured to run. In the [code example](#code-example) above, the contract makes a request to the oracle with the job ID: `d8fcf41ee8984d3b8b0eae7b74eca7dd`. This particular job is configured to do the following:

* Make a GET request 
* Parse the JSON response
* Multiply the value by *x*
* Convert the value to `uint` 
* Submit to the chain

This is why our contract adds in the URL, the path of where to find the desired data in the JSON response, and the times amount to the request; using the `request.add` statements. These instructions are facilitated by what's known as Adapters, in the oracle.

**Every request to an oracle must include a specific job ID.**

Here is the list of jobs that the Matic oracle is configured to run.

| Name |  Return Type  | ID | Adapters |
|-----|--------|------|-------|
| HTTP GET | `uint256` | `d8fcf41ee8984d3b8b0eae7b74eca7dd` |  `httpget`<br>`jsonparse`<br>`multiply`<br>`ethuint256`<br>`ethtx`  |
| HTTP GET | `int256` | `508bac12319e4a488ac46e194997db1f ` |  `httpget`<br>`jsonparse`<br>`multiply`<br>`ethint256`<br>`ethtx`  |
| HTTP GET | `bool` | `31779f840111490299551ba34646db47 ` |  `httpget`<br>`jsonparse`<br>`ethbool`<br>`ethtx`  |
| HTTP GET | `bytes32` | `4f880ce628544e1a8d26a26044c91c20 ` | `httpget`<br>`jsonparse`<br>`ethbytes32`<br>`ethtx`  |
| HTTP POST | `bytes32` | `d50dacc32d514a2eae0d6981235a25df ` | `httppost`<br>`jsonparse`<br>`ethbytes32`<br>`ethtx`  |