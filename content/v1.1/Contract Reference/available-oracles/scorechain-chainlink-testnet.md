---
layout: nodes.liquid
title: "Scorechain Chainlink (Testnet)"
slug: "scorechain-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://www.scorechain.com/" target="_blank">Scorechain's</a> API. 
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (0.1 LINK is required per-request)
  - <a href="https://ropsten.chain.link/" target="_blank">Ropsten faucet</a>
- Call your [request method](#section-chainlink-example) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Ropsten
LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365
JobID:
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract ScorechainChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Scorechain](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### endpoint

**Required **

One of:
- `get-status`
- `get-trx`
- `get-scoring`

#### Solidity example

```javascript
req.add("endpoint", "get-scoring");
```

### hash

**Required for get-trx**

Hash of the desired transaction

#### Solidity example

```javascript
req.add("hash", "0xe6ac01f1fb349ed6276de2979fe71cb3a8ed6f0b44cd17626d1094b837d27e4f");
```

### address

**Required for get-scoring**

Address to be scored

#### Solidity example

```javascript
req.add("address", "0xffe90463df116c008431da4f93f4a60a12594f50");
```

### direction

**Required for get-scoring**

Direction of the scoring
One of {incoming,outgoing}

#### Solidity example

```javascript
req.add("direction", "incoming");
```

### depth

Depth of the analysis [1-10] (default: 3)

#### Solidity example

```javascript
req.add("transfer_id", "15c6bcce-46f7-e811-8112-e8dd3bececa8");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "result.hash");
```
[block:api-header]
{
  "title": "Chainlink Example"
}
[/block]
This example will get the block hash for a transaction.
[block:code]
{
  "codes": [
    {
      "code": "function getTransactionBlockHash\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _hash\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"get-trx\");\n  req.add(\"hash\", _hash);\n  req.add(\"copyPath\", \"result.block.hash\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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
      "code": "bytes32 public blockHash;\n\nfunction fulfill(bytes32 _requestId, bytes32 _blockHash)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  blockHash = _blockHash;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]