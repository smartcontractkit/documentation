---
layout: nodes.liquid
title: "TokenView Chainlink (Testnet)"
slug: "tokenview-chainlink-testnet"
hidden: false
date: Last Modified
---
Chainlink has a dedicated connection to TokenView.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlinked behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract TokenViewChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "TokenViewChainlink.sol"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
Uint256 Job:
- [TokenView](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)

[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### extPath

**Required**

Appends the path to select the endpoint of the API to call.

#### Solidity example

```javascript
req.add("extPath", "tx/eth/5500018/1/1");
```

### queryParams

_Optional depending on the endpoint._

The query parameters to append to the API's URL.

#### Solidity example

```javascript
req.add("queryParams", "status=all&size=1");
```

### path

**Required**

The path of the response to parse.

#### Solidity example

```javascript
req.add("path", "data.0.tokenTransfer.0.value");
```

### times

_Optional with `uint256` job._

The number to multiply the result by (since Solidity can't handle decimal places).

#### Solidity example

```javascript
req.addInt("times", 100);
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The examples below show how to create a request for the Chainlink node. 
[block:code]
{
  "codes": [
    {
      "code": "function requestTransferValue(address _oracle, bytes32 _jobId) public onlyOwner {\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfillTransferValue.selector);\n  req.add(\"extPath\", \"tx/eth/5500018/1/1\");\n  req.add(\"path\", \"data.0.tokenTransfer.0.value\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestTransferValue"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public tokenTransferValue;\n\nfunction fulfillTransferValue(bytes32 _requestId, uint256 _value)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  tokenTransferValue = _value;\n}",
      "language": "javascript",
      "name": "fulfillTransferValue"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Chainlink Job (Node Operator)"
}
[/block]
As a node operator, you can add the following jobs to your node and be able to provide this data without an external adapter. Replace `YOUR_API_KEY` with your TokenView API key.
[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\"\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\",\n      \"params\": {\n        \"get\": \"https://services.tokenview.com/vipapi?apikey=YOUR_API_KEY\"\n      }\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethuint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "Uint256 Job"
    }
  ]
}
[/block]