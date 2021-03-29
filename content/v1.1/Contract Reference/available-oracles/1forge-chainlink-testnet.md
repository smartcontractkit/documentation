---
layout: nodes.liquid
title: "1Forge Chainlink (Testnet)"
slug: "1forge-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://1forge.com/forex-data-api/api-documentation">1Forge's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
Bytes32 JobID: de3fefde4ab045989fcc2aab4b7e0c58
Int256 JobID: d5722dc0f381448aabc9a4c38abe81c2
Uint256 JobID: c1dc0868029542a4964711916b4ce65b
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract OneForgeChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
## Bytes32 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">1Forge</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Int256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">1Forge</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethint256" target="_blank">EthInt256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">1Forge</a>
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

- `quotes`: Get quotes for specific currency pair(s)
- `convert`: Convert from one currency to another

#### Solidity example

```javascript
req.add("endpoint", "quotes");
```

## pairs

**Required for quotes endpoint**

The currency pair for the quotes endpoint

#### Solidity example

```javascript
req.add("pairs", "EURUSD");
```

## from

**Required for convert endpoint**

The currency to convert from

#### Solidity example

```javascript
req.add("from", "USD");
```

## to

**Required for convert endpoint**

The currency to convert to

#### Solidity example

```javascript
req.add("to", "EUR");
```

## quantity

**Required for convert endpoint**

The quantity to convert

#### Solidity example

```javascript
req.addInt("quantity", 100);
```

## copyPath

The path of the desired data field to return to the smart contract.

Below are examples of the payload from the quotes and convert endpoints:
[block:code]
{
  "codes": [
    {
      "code": "[\n\t{\n\t\t\"symbol\": \"EURUSD\",\n\t\t\"bid\": 1.12083,\n\t\t\"ask\": 1.12083,\n\t\t\"price\": 1.12083,\n\t\t\"timestamp\": 1563828812\n\t}\n]",
      "language": "json",
      "name": "quotes"
    },
    {
      "code": "{\n\t\"value\": 89.2196,\n\t\"text\": \"100 USD is worth 89.2196 EUR\",\n\t\"timestamp\": 1563828812\n}",
      "language": "json",
      "name": "convert"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "0.price");
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
      "code": "function getQuote(address _oracle, bytes32 _jobId, string _pairs)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"quotes\");\n  req.add(\"pairs\", _pairs);\n  req.add(\"copyPath\", \"0.price\");\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "quotes"
    },
    {
      "code": "function getConversion\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _from,\n  string _to,\n  int256 _quantity\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"convert\");\n  req.add(\"from\", _from);\n  req.add(\"to\", _to);\n  req.addInt(\"quantity\", _quantity);\n  req.add(\"copyPath\", \"value\");\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "convert"
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