---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "WatchSignals Luxury Watch Price Oracle"
permalink: "docs/watchsignals/"
hidden: false
---
WatchSignals is the industry leader in market research on luxury watch prices. As a service provided by data-driven platform Zapevo, WatchSignals gathers luxury watch prices from trusted marketplaces, shows serial numbers and collector database information, presents certificates of authenticity, and provides long-term appraisal data. This oracle, given a reference number, returns the average price for a specific model of a luxury watch.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../example-walkthrough) contract using the network details below
- Fund it with [LINK](../link-token-contracts)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x60B2582FB902Dff0B99c7AC30ABC08AaEfEEB309 `  
JobID: `3d765e2892934cb9b5c734cc43da6620 `  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455 `  
JobID: `77102eb8faae4532b9534d30749f54dc `  

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x556e418c54679B6BdeB07419B355791b0784dF4C `  
JobID: `2bbfde60662c4f0f9ef6f46567ca7fbc `  

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract WatchsignalsChainlink is ChainlinkClient {
  
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

contract WatchsignalsChainlink is ChainlinkClient {
  
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

contract WatchsignalsChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="row cl-button-container">
  <div class="col-xs-12 col-md-12">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=9148bd05d20d9216ecc04966c87a3f61" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
  </div>
  <div class="col-xs-12 col-md-12">
    <a href="../deploy-your-first-contract" title="">What is Remix?</a>
  </div>
</div>

# Tasks
* <a href="https://market.link/adapters/7a33d9fc-5f33-4be0-8072-d5572fc52272?network=42" target="_blank">WatchSignals</a>
* [Copy](../adapters#copy)
* [Multiply](../adapters#multiply)
* [EthUint256](../adapters#ethuint256)
* [EthTx](../adapters#ethtx)

# Request Parameters
### `refNumber`
The reference number of the watch to request the average price of.
#### Solidity Example
`req.add("refNumber", "RM1101");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```javascript
function requestPrice
(
  address _oracle,
  bytes32 _jobId,
  string memory _refNumber
) 
  public 
  onlyOwner 
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("refNumber", _refNumber);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
uint256 public price;

function fulfill(bytes32 _requestId, uint256 _price)
  public
  recordChainlinkFulfillment(_requestId)
{
  price = _price;
}
```