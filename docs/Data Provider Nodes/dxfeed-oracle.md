---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "dxFeed Price Oracle"
permalink: "docs/dxfeed-oracle/"
hidden: false
---
dxFeed, a subsidiary of <a href="https://devexperts.com" target="_blank">Devexperts</a>, is an industry leader in providing high-quality financial data, including real-time and historical market data services, reference data, corporate actions, "time machine" market replay and more. This oracle will initially provide real-time pricing data for a range of equities and cryptocurrencies.  

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../example-walkthrough) contract using the network details below
- Fund it with [LINK](../link-token-contracts)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0xECcB8F881cE2552EdA4115a162ffE2666B601c33`  
JobID: `beeca27f5c0942b0958b64c284b5117d`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `0391a670ba8e4a2f80750acfe65b0c89`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x97a585920a3D0E8922406c5E6D826F76F29ecCd4`
JobID: `c37e674b864a47ccb33096ca007d64e4`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract DxFeedChainlink is ChainlinkClient {
  
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

contract DxFeedChainlink is ChainlinkClient {
  
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

contract DxFeedChainlink is ChainlinkClient {
  
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
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=f4cf631362b18c98b73db158c414a9d5" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
  </div>
</div>

# Tasks
* <a href="https://market.link/adapters/5b85b098-6b1b-4613-aaaf-1d8d2d71a34f" target="_blank">dxFeed</a>
* [Copy](../adapters#copy)
* [Multiply](../adapters#multiply)
* [EthUint256](../adapters#ethuint256)
* [EthTx](../adapters#ethtx)

## Request Parameters
### `base`
- The asset or asset pair to request the price of.
#### Solidity Example
`req.add("base", "BTC/USDT:CXDXF");`

### Parameter Options

#### Equities

- `BAC` 
- `BRK/A`
- `C`
- `GS`
- `JPM`
- `MA`
- `MS`
- `PYPL`
- `V`
- `WFC`

#### Cryptocurrency Pairs
- `BSV/BTC:CXDXF`
- `ETC/BTC:CXDXF`
- `EOS/BTC:CXDXF`
- `BCH/USDT:CXDXF`
- `BSV/USDT:CXDXF`
- `BTC/USDT:CXDXF`
- `ETC/USDT:CXDXF`
- `LTC/USDT:CXDXF`
- `XRP/USDT:CXDXF`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestPrice` function

```javascript
function requestPrice
(
  address _oracle,
  bytes32 _jobId,
  string memory _base
) 
  public 
  onlyOwner 
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("base", _base);
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

# Documentation and Support
- <a href="https://www.dxfeed.com/api-documentation" target="_blank">dxFeed API Documentation</a>
- <a href="https://dxfeed-retail.zendesk.com/hc/en-us/requests/new" target="_blank">dxFeed Help Desk</a>