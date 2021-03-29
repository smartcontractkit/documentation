---
layout: nodes.liquid
title: "BEA Chainlink (Testnet)"
slug: "bea-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://apps.bea.gov/API/signup/index.cfm">U.S. Bureau of Economic Analysis' API</a>. This Chainlink will retrieve the average of the previous 3 months of the T20804 table.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://ropsten.chain.link/" target="_blank">Ropsten faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Ropsten
LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365
JobID: fb0707b32a9c4319802d33c9d866e157
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract BEAChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Ropsten"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">BEA</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
No request parameters are necessary to retrieve data. The BEA adapter will handle retrieving and averaging the data, and the job will multiply the result by 1000 to retain accuracy. For example, the result `109.491` will be written as `109491` as a `uint256` data type.
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below shows how to create a request.
[block:code]
{
  "codes": [
    {
      "code": "function getData(address _oracle, bytes32 _jobId)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Current Temperature"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public data;\n\nfunction fulfill(bytes32 _requestId, uint256 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  data = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]