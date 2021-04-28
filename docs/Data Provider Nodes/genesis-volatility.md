---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Genesis Volatility Cryptocurrency Options Oracle"
whatsnext: {"dxFeed Price Oracle":"/docs/dxfeed-oracle/"}
permalink: "docs/genesis-volatility/"
hidden: false
---
Genesis Volatility is a leading provider of data analytics on the crypto derivatives market, covering the largest exchanges. This oracle will initially supply the 30 day constant maturity 30/20 delta skew for either BTC or ETH.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x2587B47e53a02789F986E9a7e837fE5879f1fe30`  
JobID: `da5f65bda578430f9ba520716d42e397`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`  
JobID: `5fd92f9bbc67465a80b8c4770dd89212`  

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xCAEd48E87a5c04D7dCD70C9efd3Ee2fA852a5874`  
JobID: `3d240b3bbd094aa8a8fbf979a8be1492`  

#### Polygon (Matic) Mainnet
Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x5C7E97565989804455C2AB0eCfE0A456f448682d`  
JobID: `b787c7fc8937433298302d4bf2cd7249`  

#### xDAI Mainnet
Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.XDAI_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x670714Ef34E469DBC90d82087E95db1B1E71F279`  
JobID: `5428e2d7e7d24b849878412c0aa9f821`  

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract REPLACE_MEChainlink is ChainlinkClient {
  
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

contract REPLACE_MEChainlink is ChainlinkClient {
  
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

contract REPLACE_MEChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=010fc1d45ff025525eb1e0122b8b6efc" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/e6dc161e-ba60-4b93-b2f0-c0e5b77763f2/data-sources?" target="_blank">GVol</a>
* [Copy](../adapters/#copy)
* [Multiply](../adapters/#multiply)
* [EthInt256](../adapters/#ethint256)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `symbol`
The symbol of the currency to query. Choose `ETH` or `BTC`.
#### Solidity Example
`req.add("symbol", "BTC");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestSkew` function

```javascript
function requestSkew
(
  address _oracle,
  bytes32 _jobId,
  string memory _symbol
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("symbol", _symbol);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
int256 public skew;

function fulfill(bytes32 _requestId, int256 _skew)
  public
  recordChainlinkFulfillment(_requestId)
{
  skew = _skew;
}
```

# Documentation and Support

- <a href="https://documenter.getpostman.com/view/8119234/TWDfDtPD#b5606f1e-0d09-4bc9-a07a-8347b5b9d9ae" target="_blank">Genesis Volatility 30/20 Delta Skew API Documentation</a>
- For additional support reach out to <a href="mailto:info@genesisvolatility.io" target="_blank">info@genesisvolatility.io</a>