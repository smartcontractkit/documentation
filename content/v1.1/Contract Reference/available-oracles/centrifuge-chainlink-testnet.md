---
title: "Centrifuge Chainlink (Testnet)"
slug: "centrifuge-chainlink-testnet"
hidden: true
createdAt: "2020-05-25T05:23:21.186Z"
updatedAt: "2020-05-28T15:34:35.518Z"
---
This Chainlink has a dedicated connection to <a href="https://centrifuge.io/" target="_blank">Centrifuge</a>.
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
LINK Token address: <<KOVAN_LINK_TOKEN>>
Oracle address: <<KOVAN_CHAINLINK_ORACLE>> 
JobID: 2a9c6b27a0dd48529b9d44dd8c48eb73
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract CentrifugeChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract CentrifugeChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract CentrifugeChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Centrifuge](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
method, or endpoint: The method to query (one of "read" and "update")
documentID: The document ID to query
attribute: The attribute to fetch or update (required when method is "update")
value: The value to set the attribute value to (when method is "update")

### `method` or `endpoint`

The method to query (one of "read" and "update")

#### Solidity example

```javascript
req.add("method", "update");
```
### `documentID`

The document ID to query

#### Solidity example

```javascript
req.add("documentID", "abc123");
```
### `attribute`

*required when method is "update"*

The attribute to fetch or update

#### Solidity example

```javascript
req.add("attribute", "string");
```
### `value`

*required when method is "update"*

The value to set the attribute value to

#### Solidity example

```javascript
req.add("value", "myvalue");
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
      "code": "function createRequest\n(\n  address _oracle,\n  bytes32 _jobId,\n  string memory _documentID,\n  string memory _value\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"method\", \"update\");\n  req.add(\"documentID\", _documentID);\n  req.add(\"attribute\", \"string\");\n  req.add(\"value\", _value);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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