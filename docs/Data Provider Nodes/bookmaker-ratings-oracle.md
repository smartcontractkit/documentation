---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Bookmaker Ratings Oracle"
permalink: "docs/bookmaker-ratings-oracle/"
hidden: false
---
Bookmaker Ratings is the premier betting media in Russia and Eastern Europe. Their expansive set of APIs providers users with access to proprietary and aggregated sports odds and sports results data.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../example-walkthrough) contract using the network details below
- Fund it with [LINK](../link-token-contracts)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x0A39479Cc18b1c03D27D1e4A783C63754b75213d`  
JobID: `c40d034d30fe461981cb745eaab08070`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xc2EA1866804c84f5642a97b7FA38B45Ea8A69F6D`
JobID: `1ceaa2fb40e040f6a19507ceaed23fd1`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract BookmakerRatingsChainlink is ChainlinkClient {
  
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

contract BookmakerRatingsChainlink is ChainlinkClient {
  
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

contract BookmakerRatingsChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=52cb4628921603e788d494d482ae9e72" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/c00ebe50-6ab3-46d8-8509-c153c3d87562/data-sources" target="_blank">Bookmaker Ratings</a>
* [Copy](../adapters#copy)
* [EthBytes32](../adapters#ethbytes32)
* [EthTx](../adapters#ethtx)

# Request Parameters
### `gameIds`
The game ID to query.
#### Solidity Example
`req.add("gameIds", "1589487");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestOdds` function

```javascript
function requestOdds
(
  address _oracle,
  bytes32 _jobId,
  string memory _gameIds
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("gameIds", _gameIds);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
bytes32 public odds;

function fulfill(bytes32 _requestId, bytes32 _odds)
  public
  recordChainlinkFulfillment(_requestId)
{
  odds = _odds;
}
```

# Documentation and Support
- Email: <a href="mailto:info@metaratings.ru" target="_blank">info@metaratings.ru</a>