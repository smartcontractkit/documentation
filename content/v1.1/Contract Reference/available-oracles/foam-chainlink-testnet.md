---
title: "FOAM Chainlink (Testnet)"
slug: "foam-chainlink-testnet"
hidden: true
createdAt: "2019-09-02T19:50:48.207Z"
updatedAt: "2019-11-01T17:40:48.402Z"
---
This Chainlink has a dedicated connection to Google's BigQuery API for FOAM.
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
Oracle address: 0x577654acfF93D68D4ef552F2fE88d81029cd65CF
JobID: 97620a271ebe4c3c88b616dd50a783b3
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract FOAMChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [FOAM](doc:external-adapters)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### userAddr

**Required**

The address of the user to query.

#### Solidity example

```javascript
req.add("userAddr", "0x23a49a9930f5b562c6b1096c3e6b5bec133e8b2e");
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
      "code": "function requestUserBounty(address _oracle, bytes32 _jobId, string _addr)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"userAddr\", _addr);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestUserBounty"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public bounty;\n\nfunction fulfill(bytes32 _requestId, uint256 _bounty)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  bounty = _bounty;\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]