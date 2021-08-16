---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Multi-Variable Responses"
permalink: "docs/multi-variable-responses/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/", "Large Responses": "/docs/large-responses/"}
---
This page explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive multiple responses.

This is known as **multi-variable** or **multi-word** responses. 

> ⚠️ NOTE
> 
> This feature is available as of Chainlink `0.10.10` but can only be customized with different URLs and responses on the node operator side. In `0.10.11` generic jobs will be available for solidity as well. Please see [Make an API Call](../make-a-http-get-request/) for more information on making API calls. 

# MultiWord

To consume an API with multiple responses, your contract should inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the oracle address, the job id, the fee, adapter parameters, and the callback function signature.

>❗️ Remember to fund your contract with LINK!
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.
> 

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#optimize=false&evmVersion=null&gist=dcf554e03223427aa4c7aef099d98429&runs=200&version=soljson-v0.8.6+commit.11564f7e.js" target="_blank" class="cl-button--ghost solidity-tracked">Deploy a Multi-Word Contract Example in Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```solidity Kovan
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/**
 * @notice DO NOT USE THIS CODE IN PRODUCTION. 
 * This is an example contract to show to use the multi-variable respnoses. 
 */
contract MultiWord is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  // variable bytes returned in a signle oracle response
  bytes public data;

  // multiple params returned in a single oracle response
  uint256 public usd;
  uint256 public eur;
  uint256 public jpy;

  /**
   * @notice Initialize the link token and target oracle
   * @dev The oracle address must be an Operator contract for multiword response
   */
  constructor(
    address link,
    address oracle
  ) {
    setChainlinkToken(link);
    setChainlinkOracle(oracle);
  }


  /**
   * @notice Request mutiple parameters from the oracle in a single transaction
   * @param specId bytes32 representation of the jobId in the Oracle
   * @param payment uint256 cost of request in LINK (JUELS)
   */
  function requestMultipleParameters(
    bytes32 specId,
    uint256 payment
  )
    public
  {
    Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfillMultipleParameters.selector);
    req.addUint("times", 10000);
    requestOracleData(req, payment);
  }

  event RequestMultipleFulfilled(
    bytes32 indexed requestId,
    uint256 indexed usd,
    uint256 indexed eur,
    uint256 jpy
  );

  /**
   * @notice Fulfillment function for multiple parameters in a single request
   * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
   */
  function fulfillMultipleParameters(
    bytes32 requestId,
    uint256 usdResponse,
    uint256 eurResponse,
    uint256 jpyResponse
  )
    public
    recordChainlinkFulfillment(requestId)
  {
    emit RequestMultipleFulfilled(requestId, usdResponse, eurResponse, jpyResponse);
    usd = usdResponse;
    eur = eurResponse;
    jpy = jpyResponse;
  }
}
```

> 📘 Note
> 
> The job spec for the Chainlink node in this example can be [found here](../example-job-spec-multi-word/). 

If the LINK address for targeted blockchain is not [publicly available](../link-token-contracts/) yet, replace [setPublicChainlinkToken(/)](../chainlink-framework/#setpublicchainlinktoken) with [setChainlinkToken(_address)](../chainlink-framework/#setchainlinktoken) in the constructor, where `_address` is a corresponding LINK token contract.

# Choosing an Oracle and JobId

The `oracle` keyword refers to a specific Chainlink node that a contract makes an API call from, and the `specId` refers to a specific job for that node to run. Each job is unique and returns different types of data. 

For example, a job that returns a `bytes32` variable from an API would have a different `specId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

# Choosing an Oracle Job without specifying the URL

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the [CoinGecko API]("https://www.coingecko.com/en/api#explore-api"), see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
