---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Chainlink Alarm Clock (Testnet)"
whatsnext: {"LCX (Testnet)":"/docs/lcx-testnet"}
permalink: "docs/chainlink-alarm-clock/"
hidden: false
metadata: 
  image: 
    0: "https://files.readme.io/807bfbc-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
You can use Chainlink to trigger a smart contract at a specified time. Using this Chainlink, you will create a request with a timestamp for the node to call back to your desired function. You can include additional logic in that function to perform additional computation.

# Steps For Using This Oracle

- Write and deploy your [Chainlinked](../example-walkthrough)  contract using the network details below
- Fund it with [LINK](../link-token-contracts) (0.1 LINK is required per-request)
- Call your [request method](#section-chainlink-examples) 

# Chainlink Network Details

You will need to use the following LINK token address, oracle address, and JobSpec ID in order to create the Chainlink request.


#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b
JobID:  982105d690504c5d9ce374d040c08654

# Create your Chainlinked contract

Import `ChainlinkClient.sol` into your contract so you can inherit the `ChainlinkClient` behavior.

```javascript
pragma solidity ^0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract ChainlinkAlarmClock is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="row cl-button-container">
  <div class="col-xs-12 col-md-12">
  <a href="https://remix.ethereum.org/#gist=e71aab73726c5a2f99ee00c1a70cfef8&optimize=true&version=soljson-v0.6.12+commit.27d51765.js&evmVersion=null&runs=200" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
  </div>
  <div class="col-xs-12 col-md-12">
    <a href="../deploy-your-first-contract" title="">What is Remix?</a>
  </div>
</div>

# Tasks

- [Sleep](../adapters#sleep)
- [EthBool](../adapters#ethbool)
- [EthTx](../adapters#ethtx)

# Request Parameters

### until

**Required**

The timestamp for which the Chainlink node will wait to respond.
[block:callout]
{
  "type": "warning",
  "body": "Solidity 0.7.0 deprecated the now keyword. For contracts ^0.7.0, you must use `block.timestamp`",
  "title": "`now` keyword"
}
[/block]
#### Solidity example

```javascript
req.addUint("until", now + 5 minutes);
```

# Chainlink Examples

This example shows how to create the request for the Chainlink node:

```javascript
function delayStart
(
  address _oracle,
  bytes32 _jobId
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.addUint("until", now + 5 minutes);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```

This example shows the callback method:

```javascript
function fulfill(bytes32 _requestId)
  public
  recordChainlinkFulfillment(_requestId)
{
  /* additional computation here */
}
```