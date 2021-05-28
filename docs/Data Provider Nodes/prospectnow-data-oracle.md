---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "ProspectNow Real Estate Data Oracle"
permalink: "docs/prospectnow-data-oracle/"
---
ProspectNow offers detailed information for every property on record in the United States, including over 100 million residential properties and 42 million commercial properties across all 50 states. We aggregate and clean real estate market data derived from a trusted network of public, private, and internal datasets. This oracle will initially provide the average price per square foot of residential real estate for the last quarter, given a specific ZIP Code.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0x65475b50b77FdfC64071473a6989AF7a1Cc87a72`  
JobID: `530e9f4998394bd1a38c1aefee821c85`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `0db4e3fca4c14b009c58106754b63e71`

#### Polygon (Matic) Mainnet
Payment Amount: 0.1 LINK
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x65475b50b77FdfC64071473a6989AF7a1Cc87a72`
JobID: `00ec4c8a31bb46c7a40e07ba11358996`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract ProspectNowChainlink is ChainlinkClient {
  
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

contract ProspectNowChainlink is ChainlinkClient {
  
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

contract ProspectNowChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=17b2fa2998866dc7933e89db15e59db8" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* [ProspectNow](https://market.link/adapters/9b0a46fc-9851-42a3-bc1b-07747bf4e31c)
* [JsonParse](../adapters/#jsonparse)
* [Multiply](../adapters/#multiply)
* [EthUint256](../adapters/#ethuint256)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `parameter`
- `propertyZip`: ZIP code to be used.
#### Solidity Example
`req.add("propertyZip", "80123");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```solidity
function requestData
(
  address _oracle,
  bytes32 _jobId,
  string memory _propertyZip
) 
  public 
  onlyOwner 
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("propertyZip", _propertyZip);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```solidity
uint public data;

function fulfill(bytes32 _requestId, uint _data)
  public
  recordChainlinkFulfillment(_requestId)
{
  data = _data;
}
```

### Outputs
- Returns a `uint` representing the average price per square foot of residential real estate in a given ZIP Code over the last quarter

# Documentation and Support
- Documentation for ProspectNow's [Territory Analyzer API](https://api-documentation-site.s3-us-west-2.amazonaws.com/index.html#req_4eaa0c6a57d848e287920138b837c5a1), which this oracle inherits behavior from
- Reach out to [ProspectNow](https://www.prospectnow.com/contact-us/) via this form