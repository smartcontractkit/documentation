---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Large Responses"
permalink: "docs/large-responses/"
whatsnext: {"Make an Existing Job Request":"/docs/existing-job-request/", "API Reference":"/docs/chainlink-framework/", "Contract Addresses":"/docs/decentralized-oracles-ethereum-mainnet/"}
---
This page explains how to make an HTTP GET request to an external API from a smart contract, using Chainlink's [Request & Receive Data](../request-and-receive-data/) cycle and then receive large responses.

# Large Response

To consume an API with a large responses, your contract should inherit from [ChainlinkClient](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ChainlinkClient.sol). This contract exposes a struct called `Chainlink.Request`, which your contract should use to build the API request. The request should include the oracle address, the job id, the fee, adapter parameters, and the callback function signature.

>❗️ Remember to fund your contract with LINK!
>
> Making a GET request will fail unless your deployed contract has enough LINK to pay for it. **Learn how to [Acquire testnet LINK](../acquire-link/) and [Fund your contract](../fund-your-contract/)**.
> 

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#optimize=false&evmVersion=null&gist=10ae2499f48f2932b38f34a96b124443&runs=200&version=soljson-v0.8.6+commit.11564f7e.js" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

```javascript Kovan
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/**
 * @notice DO NOT USE THIS CODE IN PRODUCTION. This is an example contract. 
 */
contract GenericBigWord is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  // variable bytes returned in a signle oracle response
  bytes public data;
  string public image_url;

  /**
   * @notice Initialize the link token and target oracle
   * @dev The oracle address must be an Operator contract for multiword response
   *
   *
   * Kovan Testnet details: 
   * Link Token: 0xa36085F69e2889c224210F603D836748e7dC0088
   * Oracle: 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8 (Chainlink DevRel)
   *
   */
  constructor(
  ) {
    setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
    setChainlinkOracle(0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8);
  }

  /**
   * @notice Request variable bytes from the oracle
   */
  function requestBytes(
  )
    public
  {
    bytes32 specId = "7a97ff8493ec406d90621b2531f9251a";
    uint256 payment = 100000000000000000;
    Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfillBytes.selector);
    req.add("get","https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json");
    req.add("path", "image");
    requestOracleData(req, payment);
  }

  event RequestFulfilled(
    bytes32 indexed requestId,
    bytes indexed data
  );

  /**
   * @notice Fulfillment function for variable bytes
   * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
   */
  function fulfillBytes(
    bytes32 requestId,
    bytes memory bytesData
  )
    public
    recordChainlinkFulfillment(requestId)
  {
    emit RequestFulfilled(requestId, bytesData);
    data = bytesData;
    image_url = string(data);
  }

}
```

> 📘 Job Spec
> The job spec for the Chainlink node in this example can be [found here](../example-job-spec-large/). 

If the LINK address for targeted blockchain is not [publicly available](../link-token-contracts/) yet, replace [setPublicChainlinkToken(/)](../chainlink-framework/#setpublicchainlinktoken) with [setChainlinkToken(_address)](../chainlink-framework/#setchainlinktoken) in the constructor, where `_address` is a corresponding LINK token contract.

# Choosing an Oracle and JobId

The `oracle` keyword refers to a specific Chainlink node that a contract makes an API call from, and the `specId` refers to a specific job for that node to run. Each job is unique and returns different types of data. 

For example, a job that returns a `bytes32` variable from an API would have a different `specId` than a job that retrieved the same data, but in the form of a `uint256` variable.

[market.link](https://market.link/) provides a searchable catalogue of Oracles, Jobs and their subsequent return types.

# Choosing an Oracle Job without specifying the URL

If your contract is calling a public API endpoint, an Oracle job may already exist for it. If so, it could mean you do not need to add the URL, or other adapter parameters into the request, since the job already configured to return the desired data. This makes your smart contract code more succinct. To see an example of a contract using an existing job which calls the [CoinGecko API](https://www.coingecko.com/en/api#explore-api), see [Make an Existing Job Request](../existing-job-request/).

For more information about the functions in `ChainlinkClient`, visit [ChainlinkClient API Reference](../chainlink-framework/).
