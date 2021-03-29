---
layout: nodes.liquid
title: "CurrencyLayer Chainlink (Testnet)"
slug: "currencylayer-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://currencylayer.com/documentation">CurrencyLayer's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
JobID: cb79c8f182434929a71fded0fddf71cc
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract CurrencyLayerChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">CurrencyLayer</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## endpoint

**Required** 

The endpoint for the adapter to use. Available options are:

- `historical`: Get exchange rate data for a historical date.
- `live`: Get live exchange rate data.

#### Solidity example

```javascript
req.add("endpoint", "historical");
```

## date

**Required for historical endpoint**

The date to retrieve rate data.

#### Solidity example

```javascript
req.add("date", "2019-07-23");
```

## source

The source currency to display rates in. Will default to "USD" if unspecified.

#### Solidity example

```javascript
req.add("source", "EUR");
```

## copyPath

The path of the desired data field to return to the smart contract.

Below are examples of the payload from the historical and live endpoints:
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"success\": true,\n    \"terms\": \"https://currencylayer.com/terms\",\n    \"privacy\": \"https://currencylayer.com/privacy\",\n    \"historical\": true,\n    \"date\": \"2005-02-01\",\n    \"timestamp\": 1107302399,\n    \"source\": \"USD\",\n    \"quotes\": {\n        \"USDAED\": 3.67266,\n        \"USDALL\": 96.848753,\n        \"USDAMD\": 475.798297,\n        \"USDANG\": 1.790403,\n        \"USDARS\": 2.918969,\n        \"USDAUD\": 1.293878,\n        [...]\n    }\n}",
      "language": "json",
      "name": "historical"
    },
    {
      "code": "{\n    \"success\": true,\n    \"terms\": \"https://currencylayer.com/terms\",\n    \"privacy\": \"https://currencylayer.com/privacy\",\n    \"timestamp\": 1430068515,\n    \"source\": \"USD\",\n    \"quotes\": {\n        \"USDAUD\": 1.278384,\n        \"USDCHF\": 0.953975,\n        \"USDEUR\": 0.919677,\n        \"USDGBP\": 0.658443,\n        \"USDPLN\": 3.713873\n    }\n}",
      "language": "json",
      "name": "live"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "quotes.USDAUD");
```

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
The examples below show how to create requests for the quotes and convert endpoints.
[block:code]
{
  "codes": [
    {
      "code": "function getHistoricQuote(address _oracle, bytes32 _jobId, string _date, string _pair)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"historic\");\n  req.add(\"date\", _date);\n  req.add(\"copyPath\", string(abi.encodePacked(\"quotes.\", _pair)));\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "quotes"
    },
    {
      "code": "function getLiveQuote(address _oracle, bytes32 _jobId, string _pair)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"live\");\n  req.add(\"copyPath\", string(abi.encodePacked(\"quotes.\", _pair)));\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "live"
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