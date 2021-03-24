---
title: "BigQuery Chainlink (Testnet)"
slug: "big-query-chainlink-testnet"
hidden: false
createdAt: "2019-05-16T12:40:40.595Z"
updatedAt: "2020-10-21T09:38:34.682Z"
---
This Chainlink has a dedicated connection to Google's BigQuery API for retrieving the Ethereum gas price.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
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
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: 14d31bb7c28546e3af7d3cef604b3a2c
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract BigQueryChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract BigQueryChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract BigQueryChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [BigQuery](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [Multiply](doc:adapters#section-multiply)
- [EthInt256](doc:adapters#section-ethint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### action

**Required**

The action to perform, available values:
- `date` (default)
- `block`


#### Solidity example

```javascript
req.add("action", "date");
```

### block

**Required when action is block**

The Ethereum main net block to retrieve information about.

#### Solidity example

```javascript
req.addUint("block", 7000000);
```

### date

**Required when action is date**

The date to aggregate the gas price.

#### Solidity example

```javascript
req.add("date", "2019-05-15");
```

### endpoint

Options:
- `gas-price` (default)
- `eth-price`
- `address-attributes`

The endpoint to reach out to.

#### Solidity example

```javascript
req.add("endpoint", "eth-price");
```

### addr

**Required when endpoint is address-attributes**

The address to retrieve aggregates for.

#### Solidity example

```javascript
req.add("addr", "0x87002564F1C7b8F51e96CA7D545e43402BF0b4Ab");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "gasPrice");
```

### times

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
This example shows how to create the request for the Chainlink node:
[block:code]
{
  "codes": [
    {
      "code": "function requestGasPriceByBlock(address _oracle, bytes32 _jobId, uint256 _block)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGasPrice.selector);\n  req.add(\"action\", \"block\");\n  req.addUint(\"block\", _block);\n  req.add(\"copyPath\", \"gasPrice\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestGasPriceByBlock"
    },
    {
      "code": "function requestGasPriceByDate(address _oracle, bytes32 _jobId, string _date)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGasPrice.selector);\n  req.add(\"action\", \"date\");\n  req.add(\"date\", _date);\n  req.add(\"copyPath\", \"gasPrice\");\n  req.addInt(\"times\", 1000);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestGasPriceByDate"
    },
    {
      "code": "function requestEthPriceByDate(address _oracle, bytes32 _jobId, string _date)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillEthPrice.selector);\n  req.add(\"endpoint\", \"eth-price\");\n  req.add(\"action\", \"date\");\n  req.add(\"date\", _date);\n  req.add(\"copyPath\", \"high\");\n  req.addInt(\"times\", 1000);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestEthPriceByDate"
    },
    {
      "code": "function requestAddressAttributes\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _date,\n  string _path,\n  string _addr\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillAddressAttributes.selector);\n  req.add(\"endpoint\", \"address-attributes\");\n  req.add(\"date\", _date);\n  req.add(\"copyPath\", _path);\n  req.add(\"addr\", _addr);\n  req.addInt(\"times\", 1000);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestAddressAttributes"
    }
  ]
}
[/block]
Here is an example of the fulfillGasPrice method:
[block:code]
{
  "codes": [
    {
      "code": "int256 public gasPrice;\n\nfunction fulfillGasPrice(bytes32 _requestId, int256 _gasPrice)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  gasPrice = _gasPrice;\n}",
      "language": "javascript",
      "name": "fulfillGasPrice"
    },
    {
      "code": "int256 public ethPrice;\n\nfunction fulfillEthPrice(bytes32 _requestId, int256 _ethPrice)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  ethPrice = _ethPrice;\n}",
      "language": "javascript",
      "name": "fulfillEthPrice"
    },
    {
      "code": "int256 public usage;\n\nfunction fulfillAddressAttributes(bytes32 _requestId, int256 _usage)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  usage = _usage;\n}",
      "language": "javascript",
      "name": "fulfillAddressAttributes"
    }
  ]
}
[/block]