---
layout: nodes.liquid
title: "DeFi Score Chainlink (Testnet)"
slug: "defi-score-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://docs.defiscore.io/">DeFi Score's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
JobID: a449ecad63af4bd4ada7b03a3b11bc19
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract DeFiScoreChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">DeFiScore</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## platform

Queries by the provided platform. The list of supported platforms are available <a href="https://docs.defiscore.io/#list-by-platform" target="_blank">here</a>.

#### Solidity example

```javascript
req.add("platform", "aave");
```

## asset

Queries by the provided asset. The list of supported platforms are available <a href="https://docs.defiscore.io/#list-by-asset" target="_blank">here</a>.

#### Solidity example

```javascript
req.add("asset", "eth");
```

## endpoint

The endpoint of the api to call. Supported values are:
- `scores` (will default if unsupplied)


#### Solidity example

```javascript
req.add("endpoint", "scores");
```

## copyPath

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "data.0.centralizationIndex");
```

The response payload will vary depending on if an asset or platform was supplied.

## times

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
The example below shows how to create requests for the adapter.
[block:code]
{
  "codes": [
    {
      "code": "function getCentralizationIndex(\n  address _oracle,\n  bytes32 _jobId,\n  string _platform,\n  string _asset\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"platform\", _platform);\n  req.add(\"asset\", _asset);\n  req.add(\"copyPath\", \"data.0.centralizationIndex\");\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getCentralizationIndex"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "event CentralizationIndex(uint256 _index);\n\nfunction fulfill(bytes32 _requestId, uint256 _index)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  // Do things with the answer here\n  emit CentralizationIndex(_index);\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]