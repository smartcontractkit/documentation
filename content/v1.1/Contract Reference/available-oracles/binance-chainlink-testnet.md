---
title: "Binance Chainlink (Testnet)"
slug: "binance-chainlink-testnet"
hidden: true
createdAt: "2019-09-09T14:57:48.192Z"
updatedAt: "2020-03-03T16:09:42.399Z"
---
This Chainlink has a dedicated connection to <a href="https://github.com/binance-exchange/binance-official-api-docs">Binance's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
Bool JobID: f2b0f585c84a45d1993f8f3cb48ffb49
Bytes32 JobID: 1e322d70fce94991baa56e7151acddcf
Uint256 JobID: b8b8a31a3833434eba5bff70b203343d
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract BinanceChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract BinanceChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract BinanceChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
## Bool Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Binance</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbool" target="_blank">EthBool</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Bytes32 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Binance</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Binance</a>
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

The endpoint of the api to call. Supported values are:
- `ping`
- `time`
- `avgPrice`
  - `symbol`

#### Solidity example

```javascript
req.add("endpoint", "avgPrice");
```

## symbol

Used by the `avgPrice` endpoint. The symbol (pairing) to query.

#### Solidity example

```javascript
req.add("symbol", "BNBUSDT");
```

## copyPath

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "price");
```

The response payload will vary depending on the endpoint used. Refer to the <a href="https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md" target="_blank">REST API docs</a> for details.

## times

*Only valid for the Uint256 Job*

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
      "code": "function getServerStatus(address _oracle, bytes32 _jobId)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillStatus.selector);\n  req.add(\"endpoint\", \"ping\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getServerStatus"
    },
    {
      "code": "function getAvgPrice(address _oracle, bytes32 _jobId, string _symbol)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillPrice.selector);\n  req.add(\"endpoint\", \"avgPrice\");\n  req.add(\"symbol\", _symbol);\n  req.add(\"copyPath\", \"price\");\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getAvgPrice"
    }
  ]
}
[/block]
Here is an example of the fulfill methods:
[block:code]
{
  "codes": [
    {
      "code": "event ServerStatus(bool _status);\n\nfunction fulfillStatus(bytes32 _requestId, bool _status)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  emit ServerStatus(_status);\n}",
      "language": "javascript",
      "name": "fulfillStatus"
    },
    {
      "code": "event CurrentPrice(uint256 _price);\n\nfunction fulfillPrice(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  emit CurrentPrice(_price);\n}",
      "language": "javascript",
      "name": "fulfillPrice"
    }
  ]
}
[/block]