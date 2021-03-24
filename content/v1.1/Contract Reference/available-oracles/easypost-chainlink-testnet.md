---
title: "EasyPost Chainlink (Testnet)"
slug: "easypost-chainlink-testnet"
hidden: false
createdAt: "2018-09-27T14:54:20.014Z"
updatedAt: "2020-10-21T09:40:48.013Z"
---
This Chainlink has a dedicated connection to EasyPost's API. Providing access to EasyPost's Test and Production APIs so that you can develop on both endpoints.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
- Call your [request method](#section-chainlink-example) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK Token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
Test API JobID: c39dbc4321eb45a29e65df7087598fb2
Production API JobID: 51f8a4158b2b402ab3256c1b9242dcf3
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract EasyPostChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [EasyPost](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### code

**Required**

The tracking number or code which is used by the carrier. Test codes are available <a href="https://www.easypost.com/docs/api#test-tracking-codes" target="_blank">here</a>.

#### Solidity example

```javascript
req.add("code", "EZ1000000001");
```

### car

**Required**

The provided carrier symbol. A full list of strings are available <a href="https://www.easypost.com/docs/api#carrier-tracking-strings" target="_blank">here</a>.

Examples: DHLExpress, FedEx, UPS, USPS.

#### Solidity example

```javascript
req.add("car", "USPS");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "status");
```
[block:api-header]
{
  "title": "Chainlink Example"
}
[/block]
This example will give you the most recent status for a given code from USPS.
[block:code]
{
  "codes": [
    {
      "code": "function requestStatus\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _code\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"car\", \"USPS\");\n  req.add(\"code\", _code);\n  req.add(\"copyPath\", \"status\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
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