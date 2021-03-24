---
title: "Dwolla Chainlink (Testnet)"
slug: "dwolla-chainlink-testnet"
hidden: true
createdAt: "2019-11-01T18:52:17.256Z"
updatedAt: "2019-11-11T21:51:50.862Z"
---
This Chainlink has a dedicated connection to <a href="https://www.dwolla.com/" target="_blank">Dwolla's</a> API. This Chainlink allows requesters to send payments between sources or get the status of a payment.
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
JobID: ed2c06bfec8449f6911edd94bf5ef72d
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract DwollaChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Dwolla](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### method

**Required **

One of {sendTransfer,getTransfer}

#### Solidity example

```javascript
req.add("method", "sendTransfer");
```

### amount

**Required for sendTransfer**

Amount to send (in USD)

#### Solidity example

```javascript
req.add("amount", "10");
```

### source

**Required for sendTransfer**

ID of the source for the transfer

#### Solidity example

```javascript
req.add("source", "62e88a41-f5d0-4a79-90b3-188cf11a3966");
```

### destination

**Required for sendTransfer**

ID of the destination for the transfer

#### Solidity example

```javascript
req.add("destination", "d295106b-ca20-41ad-9774-286e34fd3c2d");
```

### transfer_id

**Required for getTransfer**

Transfer ID to look up

#### Solidity example

```javascript
req.add("transfer_id", "15c6bcce-46f7-e811-8112-e8dd3bececa8");
```
[block:api-header]
{
  "title": "Chainlink Example"
}
[/block]
This example will initiate a transfer between the source and destination.
[block:code]
{
  "codes": [
    {
      "code": "function sendTransfer\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _source,\n  string _destination\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"method\", \"sendTransfer\");\n  req.add(\"amount\", \"10\");\n  req.add(\"source\", _source);\n  req.add(\"destination\", _destination);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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
      "code": "bytes32 public transferId;\n\nfunction fulfill(bytes32 _requestId, bytes32 _transferId)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  transferId = _transferId;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]

This example will get the status of a transfer.
[block:code]
{
  "codes": [
    {
      "code": "function getTransferStatus\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _transferId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"method\", \"getTransfer\");\n  req.add(\"transfer_id\", _transferId);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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
      "code": "bytes32 public status;\n\nfunction fulfill(bytes32 _requestId, bytes32 _status)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  status = _status;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]