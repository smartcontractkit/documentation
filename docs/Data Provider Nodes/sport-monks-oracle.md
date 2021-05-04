---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "SportMonks Sports Data Oracle"
permalink: "docs/sport-monks-oracle/"
---

SportMonks is a provider of reliable sport data feeds, powered by a fast, highly available, and easy to implement API. They currently provide live data on three sports: soccer, F1, and cricket. They offer a variety of data such as live scores, player statistics, team stats, seasons stats, bookmakers and markets, (live) odds, predictions and coverage across more than 1,200 leagues. This oracle will initially provide Match Results and Toss Results for the 2021 Indian Premier League Cricket season.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1.0 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0xaec4ebb0abc0e3977b778cdefea0b90fab6836b2`  
JobID: `5862903735414799b8e86001391f1444`

#### Ethereum Kovan Testnet
Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`  
JobID: `f6409e245f2a46e1a65200ff1e1fd134`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x5391a6663ced4394b73e1a849065ffd8f5419646`  
JobID: `6a2714341af64485a3751e1ea98fa866`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```solidity Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract SportMonksChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```
```solidity Solidity 5
pragma solidity ^0.5.0;

import "@chainlink/contracts/v0.5/ChainlinkClient.sol";

contract SportMonksChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```
```solidity Solidity 6
pragma solidity ^0.6.0;

import "@chainlink/contracts/v0.6/ChainlinkClient.sol";

contract SportMonksChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=583e4458d593a19786e71fafa6794c41" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/09c77b99-bdf2-41f2-8241-7e85cc8b307a/data-sources" target="_blank">SportMonks</a>
* [Copy](../adapters/#copy)
* [EthBytes32](../adapters/#ethbytes32)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `endpoint`
- The desired result, choose `match-results` or `toss-results`, defaults to `match-results`
### `round`
-  The round to query. Use `1st Match`, `2nd Match`, `3rd Match`, etc.
### `season_id`
- The id of the season to query. Defaults to `708`, the identifier for the 2021 Indian Premier League Cricket season.

#### Solidity Example
`req.add("endpoint", "toss-results");`
`req.add("round", "4th Match");`
`red.add("season_id, "708");`

#### Outputs
Returns a `string`: `home` or `away` encoded as `bytes32`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```solidity
function requestData
(
  address _oracle,
  bytes32 _jobId,
  string memory _endpoint,
  string memory _round,
  string memory _seasonId
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("endpoint", _endpoint);
  req.add("round", _round);
  req.add("season_id", _seasonId);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```solidity
bytes32 public data;

function fulfill(bytes32 _requestId, bytes32 _data)
  public
  recordChainlinkFulfillment(_requestId)
{
  data = _data;
}
```

# Documentation and Support

- This job inherits behavior from the <a href="https://cricket-postman.sportmonks.com/#f2147669-38a9-47e3-ae3e-753bda6c1f93" target="_blank">GET All Fixtures` API</a>
- For support reach out to <a href="mailto:support@sportmonks.com" target="_blank">support@sportmonks.com</a>