---
title: "Amberdata Chainlink (Testnet)"
slug: "amberdata-chainlink-testnet"
hidden: false
createdAt: "2019-05-09T20:43:42.775Z"
updatedAt: "2020-10-21T09:38:11.851Z"
---
Chainlink has a dedicated connection to <a href="https://amberdata.io/" target="_blank">Amberdata's API</a>. This Chainlink is able to retrieve data for any free API endpoint from Amberdata's <a href="https://docs.amberdata.io/reference" target="_blank">Market Data and Blockchain Data</a>.

A complete example project of a contract using this Chainlink is available <a href="https://github.com/amberdata/amberdata-example-chainlink" target="_blank">here</a>!
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
Bytes32 JobID: be55468973f94ea98e5bfc7a0e56f564
Int256 JobID: b792227af9854f809e86f7075f59a281
Uint256 JobID: 31bde5db37db4c0f86aa11e52366dc43
Raw Bytes Job ID: 18e81484db084f8e8ec77e8859802949

#### Kovan
LINK Token address: <<KOVAN_LINK_TOKEN>>
Oracle address: <<KOVAN_CHAINLINK_ORACLE>> 
Bool JobID: 81c63592d97a4485b1d1339b3578e07f
Bytes32 JobID: dc6f14c1179a47ffa3977bcf766ce309
Int256 JobID: c915dfec8ad6487289ea98dc3f22c1cb
Uint256 JobID: 956db887488348b59b72dc8caa551385
Raw Bytes Job ID: 004b6663bb314419ab4ba1fd80b5de99
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract AmberdataChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract AmberdataChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract AmberdataChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
Bool Job:
- [Amberdata](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [EthBool](doc:adapters#section-ethbool)
- [EthTx](doc:adapters#section-ethtx)

Bytes32 Job:
- [Amberdata](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)

Int256 Job:
- [Amberdata](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [Multiply](doc:adapters#section-multiply)
- [EthInt256](doc:adapters#section-etuint256)
- [EthTx](doc:adapters#section-ethtx)

Uint256 Job:
- [Amberdata](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)

Raw Bytes Job:
- [Amberdata](doc:adapters#section-httpget)
- [JsonParse](doc:adapters#section-jsonparse)
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
req.add("extPath", "transactions/gas/predictions");
```

### queryParams

_Optional depending on the endpoint._

The query parameters to append to the API's URL.

#### Solidity example

```javascript
req.add("queryParams", "status=all&size=1");
```

### path

**Required**

The path of the response to parse.

#### Solidity example

```javascript
req.add("path", "payload.average.gasPrice");
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
The examples below show how to create a request for the Chainlink node. Using <a href="https://docs.amberdata.io/reference/reference" target="_blank">Amberdata's API documentation</a>, it's easy to see how to create requests for any supported endpoint.
[block:code]
{
  "codes": [
    {
      "code": "function requestGasPrice(address _oracle, bytes32 _jobId) public onlyOwner {\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGasPrice.selector);\n  req.add(\"extPath\", \"transactions/gas/predictions\");\n  req.add(\"path\", \"payload.average.gasPrice\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "requestGasPrice"
    },
    {
      "code": "function requestTokenPrice(address _oracle, bytes32 _jobId, string _tokenAddress) public onlyOwner {\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillTokenPrice.selector);\n  req.add(\"extPath\", concat(\"market/tokens/prices/\", _tokenAddress, \"/latest\"));\n  req.add(\"path\", \"payload.0.priceUSD\");\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}\n\nfunction concat(string a, string b, string c) private pure returns (string) {\n  return string(abi.encodePacked(a, b, c));\n}",
      "language": "javascript",
      "name": "requestTokenPrice"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public currentGasPrice;\n\nfunction fulfillGasPrice(bytes32 _requestId, uint256 _gasPrice)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  currentGasPrice = _gasPrice;\n}",
      "language": "javascript",
      "name": "fulfillGasPrice"
    },
    {
      "code": "uint256 public currentTokenPrice;\n\nfunction fulfillTokenPrice(bytes32 _requestId, uint256 _price)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  currentTokenPrice = _price;\n}",
      "language": "javascript",
      "name": "fulfillTokenPrice"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Chainlink Job (Node Operator)"
}
[/block]
As a node operator, you can add the following jobs to your node and be able to provide this data without an external adapter. Replace `YOUR_API_KEY` with your Amberdata API key.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v1/\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethbool\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Bool Job"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v1/\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethbytes32\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Bytes32 Job"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v1/\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Int256 Job"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v1/\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethuint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Uint256 Job"
    },
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"runlog\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://web3api.io/api/v1/\",\n\t\t\t\t\"headers\": {\n\t\t\t\t\t\"x-api-key\": [\n\t\t\t\t\t\t\"YOUR_API_KEY\"\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t]\n}",
      "language": "json",
      "name": "Raw Bytes Job"
    }
  ]
}
[/block]