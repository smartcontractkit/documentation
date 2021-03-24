---
title: "Chainlink Alarm Clock (Testnet)"
slug: "chainlink-alarm-clock"
hidden: false
createdAt: "2020-11-09T17:12:38.919Z"
updatedAt: "2020-11-19T14:39:48.320Z"
---
You can use Chainlink to trigger a smart contract at a specified time. Using this Chainlink, you will create a request with a timestamp for the node to call back to your desired function. You can include additional logic in that function to perform additional computation.

# Steps For Using This Oracle

- Write and deploy your [Chainlinked](doc:example-walkthrough)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
- Call your [request method](#section-chainlink-examples) 

# Chainlink Network Details

You will need to use the following LINK token address, oracle address, and JobSpec ID in order to create the Chainlink request.

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: 4fff47c3982b4babba6a7dd694c9b204

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: a7ab70d561d34eb49e9b1612fd2e044b

# Create your Chainlinked contract

Import `Chainlinked.sol` into your contract so you can inherit the `Chainlinked` behavior.

```javascript
pragma solidity ^0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract ChainlinkAlarmClock is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

# Tasks

- [Sleep](doc:adapters#sleep)
- [EthBool](doc:adapters#ethbool)
- [EthTx](doc:adapters#ethtx)

# Request Parameters

### until

**Required**

The timestamp for which the Chainlink node will wait to respond.
[block:callout]
{
  "type": "warning",
  "body": "Solidity 0.7.0 deprecated the now keyword. For contracts ^0.7.0, you must use `block.timestamp`",
  "title": "`now` keyword"
}
[/block]
#### Solidity example

```javascript
req.addUint("until", now + 5 minutes);
```

# Chainlink Examples

This example shows how to create the request for the Chainlink node:

```javascript
function delayStart
(
  address _oracle,
  bytes32 _jobId
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.addUint("until", now + 5 minutes);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```

This example shows the callback method:

```javascript
function fulfill(bytes32 _requestId)
  public
  recordChainlinkFulfillment(_requestId)
{
  /* additional computation here */
}
```

<div class="row text-center center">
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://remix.ethereum.org/#gist=e71aab73726c5a2f99ee00c1a70cfef8&optimize=true&version=soljson-v0.6.12+commit.27d51765.js&evmVersion=null&runs=200" target="_blank" class="cl-button--ghost solidity-tracked">Deploy a sample using Remix ↗</a>
</div>
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://docs.chain.link/docs/example-walkthrough" target="_blank">What is Remix?</a>
</div>
</div>