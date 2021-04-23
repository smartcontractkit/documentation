---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "LCX (Testnet)"
permalink: "docs/lcx-testnet/"
whatsnext: {"Kraken Rates Oracle Node":"/docs/kraken-rates-oracle-node"}
hidden: false
metadata: 
  image: 
    0: "https://files.readme.io/b76c02e-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
This Chainlink has a dedicated connection to <a href="https://www.lcx.com/Cryptocurrency-Reference-Price-Services/" target="_blank">LCX's Cryptocurrency Reference Prices</a> API. This service offers reliable daily reference prices of the U.S. dollar price and Euro price of one Bitcoin and one Ethereum. 

# Steps for using this oracle

- Write and deploy your [Chainlink](../example-walkthrough)  contract using the network details below
- Fund it with [LINK](../link-token-contracts) (1 LINK is required per-request)
- Call your [request method](#section-chainlink-examples) 

# Network Details

You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK Token address: {{variables.RINKEBY_LINK_TOKEN}}
Oracle address: {{variables.RINKEBY_CHAINLINK_ORACLE}} 
JobID: eb3b27aac93e4bf68406f164b86b049e

#### Kovan
LINK Token address: {{variables.KOVAN_LINK_TOKEN}}
Oracle address: {{variables.KOVAN_CHAINLINK_ORACLE}} 
JobID: 81c63592d97a4485b1d1339b3578e07f

# Create your contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";

contract LCXChainlink is ChainlinkClient {
  
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

import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";

contract LCXChainlink is ChainlinkClient {
  
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

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract LCXChainlink is ChainlinkClient {
  
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
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=c0aa62a734c36393da8ac81247d42509" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
  </div>
  <div class="col-xs-12 col-md-12">
    <a href="../deploy-your-first-contract" title="">What is Remix?</a>
  </div>
</div>

# Tasks

- [LCX](../external-adapters)
- [Multiply](../adapters#section-multiply)
- [EthUint256](../adapters#section-ethuint256)
- [EthTx](../adapters#section-ethtx)

# Request Parameters

### coin

**Required**

The symbol for the cryptocurrency. 

Must be ETH or BTC

#### Solidity example

```javascript
req.add("coin", "eth");
```

### market

**Required**

The market currency symbol.

Must be USD or EUR

#### Solidity example

```javascript
req.add("market", "usd");
```

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

```javascript
function requestPrice
(
  address _oracle,
  bytes32 _jobId,
  string _coin,
  string _market
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("coin", _coin);
  req.add("market", _market);
  req.addInt("times", 100);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```

Here is an example of the fulfill method:

```javascript
uint256 public currentPrice;

function fulfill(bytes32 _requestId, uint256 _price)
  public
  recordChainlinkFulfillment(_requestId)
{
  currentPrice = _price;
}
```