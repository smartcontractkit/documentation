---
layout: nodes.liquid
title: "Santiment Chainlink (Testnet)"
slug: "santiment-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://docs.santiment.net/" target="_blank">Santiment's GraphQL API</a>. This Chainlink will pass any GraphQL query sent to it to the API, and return the response.
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
JobID: 84c57cea7247433f99e85d03e51f0fa5
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract BraveNewCoinChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Santiment</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## query

**Required** 

The GraphQL query to send to Santiment.

#### Solidity example

```javascript
req.add("query", "query{githubActivity(from:\"2019-01-09T16:25:37.749Z\",interval:\"1d\",slug:\"chainlink\",to:\"2019-01-23T16:25:37.749Z\"){activity,datetime}}");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "data.githubActivity.-1.activity");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below can be used to send any `_query` to Santiment's API and parse the results from `_path`.
[block:code]
{
  "codes": [
    {
      "code": "function getSantimentData(address _oracle, string _query, string _path)\n  public\n  onlyOwner\n  returns (bytes32 requestId) \n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"query\", _query);\n  req.add(\"copyPath\", _path);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Santiment Request"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "bytes32 public data;\n\nfunction fulfill(bytes32 _requestId, bytes32 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  data = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]