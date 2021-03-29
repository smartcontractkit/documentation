---
layout: nodes.liquid
title: "LCX Chainlink (Testnet)"
slug: "lcx-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://www.lcx.com/Cryptocurrency-Reference-Price-Services/" target="_blank">LCX's Cryptocurrency Reference Prices</a> API. This service offers reliable daily reference prices of the U.S. dollar price and Euro price of one Bitcoin and one Ethereum. 
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

#### Rinkeby
LINK Token address: <<RINKEBY_LINK_TOKEN>>
Oracle address: <<RINKEBY_CHAINLINK_ORACLE>> 
Bool JobID: eb3b27aac93e4bf68406f164b86b049e

#### Kovan
LINK Token address: <<KOVAN_LINK_TOKEN>>
Oracle address: <<KOVAN_CHAINLINK_ORACLE>> 
Bool JobID: 81c63592d97a4485b1d1339b3578e07f
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract LCXChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract LCXChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract LCXChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [LCX](doc:external-adapters)
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

Must be ETH or BTC

#### Solidity example

```javascript
req.add("coin", "eth");
```

### market

**Required**

The market currency symbol.

Must be USD or EUR

#### Solidity example

```javascript
req.add("market", "usd");
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
      "code": "function requestPrice\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _coin,\n  string _market\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"coin\", _coin);\n  req.add(\"market\", _market);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestPrice"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public currentPrice;\n\nfunction fulfill(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  currentPrice = _price;\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]