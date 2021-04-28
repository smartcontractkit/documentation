---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "CipherTrace DeFi Compli Oracle"
permalink: "docs/ciphertrace-defi-compli-oracle/"
whatsnext: {"Bookmaker Ratings Oracle":"/docs/bookmaker-ratings-oracle/"}
hidden: false
---
CipherTrace, the industry standard in cryptocurrency intelligence, introduces DeFi Compli, a compliance solution enabling DEXs and DeFi applications to abide by the Office of Foreign Assets Control (OFAC) sanction requirements. This oracle delivers CipherTrace's source-signed compliance data directly on-chain to your smart contract.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0xAcB07C9f9b0FEC39FD0F305FbA69A26b5772f81A`  
JobID: `5348c2c08d03431a8872078bee96c6de`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `22adbb38c8554f6ab36aedf42b17be18`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xf401c4DC6Ae678bB3b44adF1199e42Ea7066BAed`
JobID: `8f156beb0abb44a1ad0fec925ab38707`

#### Polygon (Matic) Mainnet
Payment Amount: 0.1 LINK
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x9B4FC5D90287A7EE39BAeB2950B696870A1c0669`
JobID: `6fb6404456574a999a88ed4aaea5a475`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract CipherTraceChainlink is ChainlinkClient {
  
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

contract CipherTraceChainlink is ChainlinkClient {
  
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

contract CipherTraceChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=b5dc74da23d7f76877c885b3fff1c99b" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/2569675e-97d5-491d-ae75-2f895ffd950e/data-sources" target="_blank">DeFi Compli</a>
* [Copy](../adapters/#copy)
* [EthBool](../adapters/#ethbool)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `network`
- The blockchain network of the address to check. Defaults to `ETH`.
#### Solidity Example
`req.add("network", "ETH");`
### `lookup_address`
- The address to check against CipherTrace's DeFi Compli service.
#### Solidity Example
`req.add("lookup_address", "0xAcB07C9f9b0FEC39FD0F305FbA69A26b5772f81A");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```javascript
function requestData
(
  address _oracle,
  bytes32 _jobId,
  string memory _network,
  string memory _address
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("network", _network);
  req.add("lookup_address", _address);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
bool public data;

function fulfill(bytes32 _requestId, bool _data)
  public
  recordChainlinkFulfillment(_requestId)
{
  data = _data;
}
```

# Documentation and Support
- <a href="https://ciphertrace.com/aml-for-cryptocurrencies" target="_blank">CipherTrace's industry standard Anti-Money Laundering Compliance Solutions</a>
- <a href="https://ciphertrace.com/contact" target="_blank">Contact CipherTrace</a>