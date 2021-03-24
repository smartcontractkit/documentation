---
title: "EasyOFAC Chainlink (Testnet)"
slug: "easyofac-chainlink-testnet"
hidden: true
createdAt: "2019-08-16T18:35:29.599Z"
updatedAt: "2019-11-01T17:40:58.188Z"
---
Chainlink has a dedicated connection to <a href="https://easyofac.com/site/docs" target="_blank">EasyOFAC's API</a>. This Chainlink is able to retrieve data for any free API endpoint from EasyOFAC's API.
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
Bytes32 JobID: 55fc1d9e98d54dbf9116b16e7f30154a
Uint256 JobID: a8dcd87ad620426ba248ca07162e9d0e
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract EasyOFACChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
Bytes32 Job:
- [EasyOFAC](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)

Uint256 Job:
- [EasyOFAC](doc:adapters#section-httpget)
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
req.add("extPath", "inspectCustomer");
```

### queryParams

_Optional depending on the endpoint._

The query parameters to append to the API's URL.

#### Solidity example

```javascript
req.add("queryParams", "id=57c9e9df6900a1000f859926");
```

### path

**Required**

The path of the response to parse.

#### Solidity example

```javascript
req.add("path", "customer_status");
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
The examples below show how to create a request for the Chainlink node. Using <a href="https://easyofac.com/site/docs" target="_blank">EasyOFAC's API documentation</a>, it's easy to see how to create requests for any supported endpoint.
[block:code]
{
  "codes": [
    {
      "code": "function getCustomerStatus(address _oracle, bytes32 _jobId, string _custId) public onlyOwner {\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"extPath\", \"inspectCustomer\");\n  req.add(\"queryParams\", \"id=57c9e9df6900a1000f859926\");\n  req.add(\"path\", \"customer_status\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getCustomerStatus"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "bytes32 public customerStatus;\n\nfunction fulfill(bytes32 _requestId, bytes32 _status)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  customerStatus = _status;\n}",
      "language": "javascript",
      "name": "fulfill"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Chainlink Job (Node Operator)"
}
[/block]
As a node operator, you can add the following jobs to your node and be able to provide this data without an external adapter. Replace `YOUR_API_KEY` with your EasyOFAC API key.
[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\"\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpGet\",\n      \"params\": {\n        \"get\": \"https://easyofac.com/api/?api_key=YOUR_API_KEY\"\n      }\n    },\n    {\n      \"type\": \"jsonParse\"\n    },\n    {\n      \"type\": \"ethbytes32\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "Bytes32 Job"
    },
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\"\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpGet\",\n      \"params\": {\n        \"get\": \"https://easyofac.com/api/?api_key=YOUR_API_KEY\"\n      }\n    },\n    {\n      \"type\": \"jsonParse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethuint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "json",
      "name": "Uint256 Job"
    }
  ]
}
[/block]