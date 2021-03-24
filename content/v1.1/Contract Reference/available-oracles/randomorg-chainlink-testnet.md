---
title: "Random.org Chainlink (Testnet)"
slug: "randomorg-chainlink-testnet"
hidden: true
createdAt: "2019-03-07T21:32:51.558Z"
updatedAt: "2019-11-01T17:43:57.955Z"
---
Chainlink has a dedicated connection to <a href="https://www.random.org/" target="_blank">Random.org's API</a>. This Chainlink will retrieve a single random number to return to your smart contract.
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
JobID: 243e52d19ebc4098bfc30d9d7117b91a

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: b00ed7210563488cbe5a3b7729c0ec72

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: e1ec38c3c1954095a3db716c4228031a
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract RandomOrgChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Random-Org](doc:external-adapters)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## min

An optional minimum number to generate.

#### Solidity example

```javascript
req.addUint("min", 100);
```

## max

An optional maximum number to generate.

#### Solidity example

```javascript
req.addUint("max", 1000);
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below can be used to send a Chainlink request for a random number.
[block:code]
{
  "codes": [
    {
      "code": "function getRandom\n(\n  address _oracle,\n  bytes32 _jobId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getRandom"
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