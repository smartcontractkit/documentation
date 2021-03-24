---
title: "Chainlink Alarm Clock (Testnet)"
slug: "chainlink-alarm-clock"
hidden: false
createdAt: "2018-11-07T02:25:04.159Z"
updatedAt: "2020-10-21T09:39:44.569Z"
---
You can use Chainlink to trigger a smart contract at a specified time. Using this Chainlink, you will create a request with a timestamp for the node to call back to your desired function. You can include additional logic in that function to perform additional computation.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and JobSpec ID in order to create the Chainlink request.

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: 4fff47c3982b4babba6a7dd694c9b204

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: a7ab70d561d34eb49e9b1612fd2e044b
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract ChainlinkAlarmClock is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [Sleep](doc:adapters#sleep)
- [EthBool](doc:adapters#ethbool)
- [EthTx](doc:adapters#ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### until

**Required**

The timestamp for which the Chainlink node will wait to respond.

#### Solidity example

```javascript
req.addUint("until", now + 5 minutes);
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
      "code": "function delayStart\n(\n  address _oracle,\n  bytes32 _jobId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.addUint(\"until\", now + 5 minutes);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request"
    }
  ]
}
[/block]
This example shows the callback method:
[block:code]
{
  "codes": [
    {
      "code": "function fulfill(bytes32 _requestId)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  /* additional computation here */\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]