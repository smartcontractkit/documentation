---
layout: nodes.liquid
title: "CoinMarketCap Chainlink (Testnet)"
slug: "coinmarketcap"
hidden: false
date: Last Modified
---
This Chainlink supports the <a href="https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyQuotesLatest" target="_blank">latest market quotes</a> endpoint for any coin and market supported by CoinMarketCap. The <a href="https://pro.coinmarketcap.com/api/v1#" target="_blank">CoinMarketCap Professional API</a> is a suite of high-performance RESTful JSON endpoints that are specifically designed to meet the mission-critical demands of application developers, data scientists, and enterprise business platforms.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, chainlink address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: 0e9e244b9c374cd1a5c714caf25b0be5

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: cbb45ecb040340389e49b77704184e5a
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `Chainlinked.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract CoinMarketCapChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Constructor"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [CoinMarketCap](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### sym or cid

**Required**

The digital currency symbol or ID of the requested cryptocurrency. This parameter may take multiple symbols by comma separating them.

#### Solidity example

```javascript
req.add("sym", "ETH");
```

or

```javascript
req.add("cid", "1027");
```

### convert

**Required**

The market to convert the cryptocurrency's value.

#### Solidity example

```javascript
req.add("convert", "USD");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

Returned data example:
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"status\": {\n        \"timestamp\": \"2018-08-21T12:36:04.996Z\",\n        \"error_code\": 0,\n        \"error_message\": null,\n        \"elapsed\": 5,\n        \"credit_count\": 1\n    },\n    \"data\": {\n        \"ETH\": {\n            \"id\": 1027,\n            \"name\": \"Ethereum\",\n            \"symbol\": \"ETH\",\n            \"slug\": \"ethereum\",\n            \"circulating_supply\": 101462385.6865,\n            \"total_supply\": 101462385.6865,\n            \"max_supply\": null,\n            \"date_added\": \"2015-08-07T00:00:00.000Z\",\n            \"num_market_pairs\": 3907,\n            \"cmc_rank\": 2,\n            \"last_updated\": \"2018-08-21T12:34:43.000Z\",\n            \"quote\": {\n                \"USD\": {\n                    \"price\": 282.593191456,\n                    \"volume_24h\": 1256139513.14843,\n                    \"percent_change_1h\": -0.468603,\n                    \"percent_change_24h\": -3.04842,\n                    \"percent_change_7d\": 7.26957,\n                    \"market_cap\": 28672579383.887608,\n                    \"last_updated\": \"2018-08-21T12:34:43.000Z\"\n                }\n            }\n        }\n    }\n}",
      "language": "json",
      "name": "Response"
    }
  ]
}
[/block]
#### Solidity example

```javascript
string[] memory path = new string[](5);
path[0] = "data";
path[1] = "ETH";
path[2] = "quote";
path[3] = "USD";
path[4] = "price";
req.addStringArray("copyPath", path);
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
This example will give you the most recent price for the given coin on the given market.
[block:code]
{
  "codes": [
    {
      "code": "function requestCoinMarketCapPrice\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _coin,\n  string _market\n) \n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"sym\", _coin);\n  req.add(\"convert\", _market);\n  string[] memory path = new string[](5);\n  path[0] = \"data\";\n  path[1] = _coin;\n  path[2] = \"quote\";\n  path[3] = _market;\n  path[4] = \"price\";\n  req.addStringArray(\"copyPath\", path);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request"
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
The latest coin list is available from CoinMarketCap's <a href="https://api.coinmarketcap.com/v2/listings/" target="_blank">listings API endpoint</a>.