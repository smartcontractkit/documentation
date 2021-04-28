---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "TheRundown Oracle Node"
permalink: "docs/therundown-oracle-node/"
whatsnext: {"DNS Ownership Oracle":"/docs/dns-ownership-oracle/"}
hidden: false
metadata: 
  image: 
    0: "https://files.readme.io/bf220ba-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
TheRundown is the leading platform for real-time odds from the most popular sportsbooks, sports and markets.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x0ae3a0e0e3feb67ec83f423b3b653051aa9bf4d3`  
JobID: `8ea9bb3a6b3f41c1b8cc6a041895a660`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`  
JobID: `dbb65efc02d34cddb920eca1bec22ade`  

#### Polygon (Matic) Mainnet
Payment Amount: 0.03 LINK  
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}` 
Oracle Address: `0xcD5BdCc649f81B9E53671Eb0D17c2831AF04e1d1`  
JobID: `96cf91943c8f40b19c6eb401f49f36f9`  

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract TheRundownChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```
```javascript Solidity 5
pragma solidity ^0.5.0;

import "@chainlink/contracts/v0.5/ChainlinkClient.sol";

contract TheRundownChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```
```javascript Solidity 6
pragma solidity ^0.6.0;

import "@chainlink/contracts/v0.6/ChainlinkClient.sol";

contract TheRundownChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=eeb0e1b523ebc0ace072190f0e743c01" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/73674a2e-9085-4875-adc7-3c2930180b44/data-sources" target="_blank">TheRundown</a>
* [Copy](../adapters/#copy)
* [Multiply](../adapters/#multiply)
* [EthUint256](../adapters/#ethuint256)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `matchId`
Numerical identifier for a given match.
#### Solidity Example
`req.add("matchId", "5527455bb80a5e9884153786aeb5f2b2");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestScore` function

```javascript
function requestScore
(
  address _oracle,
  bytes32 _jobId,
  string memory _matchId
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req. add("matchId", _matchId);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
uint256 public score;

function fulfill(bytes32 _requestId, uint256 _score)
  public
  recordChainlinkFulfillment(_requestId)
{
  score = _score;
}
```

# Documentation and Support
- For support, reach out to <a href="https://therundown.io/contact" target="_blank">TheRundown</a>