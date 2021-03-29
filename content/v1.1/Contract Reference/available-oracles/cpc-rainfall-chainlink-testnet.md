---
layout: nodes.liquid
title: "CPC Rainfall Chainlink (Testnet)"
slug: "cpc-rainfall-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="" target="_blank">CPC Rainfall</a> API.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:request-and-receive-data) contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK Token address: <<RINKEBY_LINK_TOKEN>> 
Oracle address: <<RINKEBY_CHAINLINK_ORACLE>> 
JobID (`bytes32`): e332b6a25fb54b44a4efbe85b3eb8080
JobID (`uint256`): fa2aa367dc8746239484e6ca0ba48818
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract CPCRainfallChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract CPCRainfallChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract CPCRainfallChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [CPCRainfall](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "outcome_dollars");
```

### times

**Required for the `uint256` job**

The number to multiply the result by (since Solidity cannot handle decimals).

#### Solidity example

```javascript
req.addInt("times", 100);
```
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
      "code": "function createRequest\n(\n  address _oracle,\n  bytes32 _jobId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add('contract_id', 'xRvzgt6EKvneQfNy6');\n  req.add('weather_type', 'low_rainfall');\n  req.addUint('start_date', 1560211199);\n  req.addUint('end_date', 1563753599);\n  req.add('notional_amount', '4.5');\n  req.addUint('exit', 70);\n  req.add('coordinates', '38.50, 280.50');\n  req.add('edge_length', '0.25');\n  req.addUint('threshold_factor', 112);\n  req.add('copyPath', 'outcome_dollars');\n  // Necessary for the uint256 job\n  req.addInt('times', 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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
      "code": "bytes32 public result;\n\nfunction fulfill(bytes32 _requestId, bytes32 _result)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  result = _result;\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]