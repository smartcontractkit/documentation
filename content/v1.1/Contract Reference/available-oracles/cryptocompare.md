---
title: "CryptoCompare Chainlink (Testnet)"
slug: "cryptocompare"
hidden: false
createdAt: "2018-09-07T18:50:55.890Z"
updatedAt: "2020-10-21T09:40:13.563Z"
---
CryptoCompare provides a <a href="https://min-api.cryptocompare.com/" target="_blank">free API</a> for getting cryptocurrency live pricing data, OHLC historical data, volume data or tick data from multiple exchanges. You can also get free aggregated news and block explorer data (supply, hashrate, latest block number etc).
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project) contract using the network details below
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
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: ec579afb1fe740b186248ba7ba990d37


#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: 7f350c947b0d4d758aadd5acb41d2474
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract CryptoCompareChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [CryptoCompare](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### endpoint

**Required**

The endpoint of the <a href="https://min-api.cryptocompare.com/" target="_blank">CryptoCompare API</a> to use.

Accepted inputs:
- `price`
- `dayAvg`
- `generateAvg`

#### Solidity example

```javascript
req.add("endpoint", "price");
```

### fsym

**Required**

The symbol of the cryptocurrency.

#### Solidity example

```javascript
req.add("fsym", "ETH");
```

### tsyms

**Required**

The symbols (comma-separated) of the market to convert the price to.

#### Solidity example

```javascript
req.add("tsyms", "USD,EUR,JPY");
```

### exchange or e

The exchange to use for the generate custom average endpoint.

#### Solidity example

```javascript
req.add("exchange", "Kraken");
```

Or

```javascript
req.add("e", "Bitfinex");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

Returned data example:

```json
{"USD":285.66}
```

#### Solidity example

```javascript
req.add("copyPath", "USD");
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
The examples below show how to create requests for different endpoints supported by this Chainlink.
[block:code]
{
  "codes": [
    {
      "code": "function requestCryptoComparePrice\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _coin,\n  string _market\n) \n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"price\");\n  req.add(\"fsym\", _coin);\n  req.add(\"tsyms\", _market);\n  req.add(\"copyPath\", _market);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request Price"
    },
    {
      "code": "function requestCryptoCompareAverage\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _coin,\n  string _market\n) \n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"dayAvg\");\n  req.add(\"fsym\", _coin);\n  req.add(\"tsym\", _market);\n  req.add(\"copyPath\", _market);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request Average"
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
The latest coin list is available from CryptoCompare's <a href="https://min-api.cryptocompare.com/data/all/coinlist" target="_blank">coinlist API endpoint</a>.