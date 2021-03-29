---
layout: nodes.liquid
title: "Coinbase Chainlink (Testnet)"
slug: "coinbase-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://www.coinbase.com/" target="_blank">Coinbase's</a> Oracle API.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
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
JobID: 5c8466965b8a4a84b7bea4ddd50be714
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract CoinbaseChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract CoinbaseChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract CoinbaseChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Coinbase](doc:external-adapters)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### coin

**Required**

The symbol for the cryptocurrency. 

Examples: btc, eth, ltc.

#### Solidity example

```javascript
req.add("coin", "eth");
```

### times

**Required**

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
The examples below utilize the different endpoints available from this Chainlink:
[block:code]
{
  "codes": [
    {
      "code": "function requestPrice\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _coin\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"coin\", _coin);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestPrice"
    }
  ]
}
[/block]
Here is an example of the `fulfill` method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public currentPrice;\n\nfunction fulfill(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  currentPrice = _price;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Available Currencies"
}
[/block]
For a full list of available currencies, please check Coinbase API's reference: https://developers.coinbase.com/api/v2#currencies