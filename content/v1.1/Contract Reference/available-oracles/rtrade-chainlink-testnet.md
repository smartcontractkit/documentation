---
title: "RTrade Chainlink (Testnet)"
slug: "rtrade-chainlink-testnet"
hidden: true
createdAt: "2019-01-23T19:51:36.660Z"
updatedAt: "2019-11-01T17:43:48.731Z"
---
This Chainlink has a dedicated connection to <a href="https://documenter.getpostman.com/view/4295780/RWEcQM6W" target="_blank">RTrade's Temporal API</a>. This Chainlink's functionality is currently limited to retrieving information about the public IPFS network.
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
JobID: 946667733e944ce7a203a241aedb8b8d
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract TemporalChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [RTrade](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## action

**Required** 

Current supported actions:
- `stat`
Used to retrieve the object statistics for a content hash
- `dag`
Retrieves the associated IPLD object for a given cid

#### Solidity example

```javascript
req.add("action", "stat");
```

## hash

**Required** 

The IPFS hash.

#### Solidity example

```javascript
req.add("hash", "QmZpTc2UXsDeiD4Fb6j1kHqMeBngrN6V4myWR28i1YfuYA");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract. Examples of returned data format for their given actions are below:
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"code\": 200,\n\t\"response\": {\n\t\t\"Hash\": \"QmZpTc2UXsDeiD4Fb6j1kHqMeBngrN6V4myWR28i1YfuYA\",\n\t\t\"BlockSize\": 498,\n\t\t\"CumulativeSize\": 13673755,\n\t\t\"DataSize\": 2,\n\t\t\"LinksSize\": 496,\n\t\t\"NumLinks\": 10\n\t}\n}",
      "language": "json",
      "name": "stat"
    },
    {
      "code": "{\n\t\"code\": 200,\n\t\"response\": {\n\t\t\"data\": \"CAE=\",\n\t\t\"links\": [\n\t\t\t{\n\t\t\t\t\"Cid\": {\n\t\t\t\t\t\"/\": \"QmSMMHB9QVEC37ie7G2FcekKLn5wFySie9XoMwEWkDwJBS\"\n\t\t\t\t},\n\t\t\t\t\"Name\": \"404.html\",\n\t\t\t\t\"Size\": 4561\n\t\t\t},\n\t\t\t/* ... */\n\t\t]\n\t}\n}",
      "language": "json",
      "name": "dag"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "response.CumulativeSize");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below will get you the cumulative size of a given IPFS hash.
[block:code]
{
  "codes": [
    {
      "code": "function getIpfsSize\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _hash\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"action\", \"stat\");\n  req.add(\"hash\", _hash);\n  req.add(\"copyPath\", \"response.CumulativeSize\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Get Cumulative Size"
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