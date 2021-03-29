---
layout: nodes.liquid
title: "Blocklytics Chainlink (Testnet)"
slug: "blocklytics-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://blocklytics.org/" target="_blank">Blocklytics</a>.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: 42d420ec60094406897476917a9ee820
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the ability to create Chainlink requests.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract BlocklyticsChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Example"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [BigQuery](doc:external-adapters)
- [EthInt256](doc:adapters#section-ethint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### addr

**Required when endpoint is address-attributes**

The address to retrieve aggregates for.

#### Solidity example

```javascript
req.add("addr", "0x8175c0FFA6891A2BD149a9c86e1E034cB39C5Cc1");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
This example shows how to create the request for the Chainlink node:
[block:code]
{
  "codes": [
    {
      "code": "function requestBounty(\n  address _oracle,\n  bytes32 _jobId,\n  string _addr\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfillBounty.selector);\n  req.add(\"addr\", _addr);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestBounty"
    }
  ]
}
[/block]
Here is an example of the fulfillGasPrice method:
[block:code]
{
  "codes": [
    {
      "code": "int256 public usage;\n\nfunction fulfillBounty(bytes32 _requestId, int256 _usage)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  usage = _usage;\n}",
      "language": "javascript",
      "name": "fulfillBounty"
    }
  ]
}
[/block]