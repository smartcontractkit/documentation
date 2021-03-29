---
layout: nodes.liquid
title: "OKEx Chainlink (Testnet)"
slug: "okex-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://www.okex.com/" target="_blank">OKEx</a>.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:request-and-receive-data) contract using the network details below
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
LINK Token address: `0xa36085f69e2889c224210f603d836748e7dc0088`
Oracle address: `0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e` 
JobID: `525aa3a57e5845299985d116a4cd4549 `
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract OkexChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract OkexChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract OkexChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 6"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [OKEx](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [Multiply](doc:adapters#section-multiply)
- [Ethint256](doc:adapters#section-ethint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
This job does not take any parameters. The job is set to query the "accountValue" endpoint, which will give the USDT value of the spot and perpetual trading accounts.
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The examples below utilize the different endpoints available from this Chainlink:
[block:code]
{
  "codes": [
    {
      "code": "function createRequest\n(\n  address _oracle,\n  bytes32 _jobId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "createRequest"
    }
  ]
}
[/block]
Here is an example of the `fulfill` method:
[block:code]
{
  "codes": [
    {
      "code": "int256 public result;\n\nfunction fulfill(bytes32 _requestId, int256 _result)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  result = _result;\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]