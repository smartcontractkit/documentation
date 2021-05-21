---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "SmartZip Real Estate AVM Oracle"
permalink: "docs/smartzip-awm-oracle/"
---
SmartZip is the leader of predictive analytics in real estate. With SmartZip, developers can easily integrate the most comprehensive real estate database into their applications including property values, rental rates, likelihood of selling and much more.

SmartZip’s proprietary predictive analytics model aggregates data from 24 sources and contains over 1 billion data points on residential real estate, including up-to-date market valuations, rental incomes and other key data points. Initially, this oracle will return a given home's value calculated by SmartZip's patented Automated Valuation Model (AVM).

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}` 
Oracle Address: `0xCedA711FED764518654b53Dcf35356da87996B84`  
JobID: `94f9b202c7e04c988ce39674f825389d`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `4b799094ee034ec9b6f2c9f511840027`

#### Polygon (Matic) Mainnet
Payment Amount: 0.1 LINK
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xDB5DC05bD23880e3C2F4CB49000F2FDf54a1Ce4C`
JobID: `8f3f6c145cda49b8916a688fb876aecb`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract SmartZipChainlink is ChainlinkClient {
  
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

contract SmartZipChainlink is ChainlinkClient {
  
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

contract SmartZipChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=63c052d5b66cfd3cf546681b05800b75" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* [SmartZip](https://market.link/adapters/544b4a12-9484-448e-a7b7-986a810a0f51/data-sources)
* [Copy](../adapters/#copy)
* [Multiply](../adapters/#multiply)
* [EthUint256](../adapters/#ethuint256)
* [EthTx](../adapters/#ethtx)

# Request Parameters
### `propertyID`
- A SmartZip UUID associated with a given home
#### Solidity Example
`req.add("property_id", "100000125583");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```solidity
function requestData
(
  address _oracle,
  bytes32 _jobId,
  string memory _propertyId
) 
  public 
  onlyOwner 
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("property_id", _propertyId);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```solidity
uint256 public data;

function fulfill(bytes32 _requestId, uint256 _data)
  public
  recordChainlinkFulfillment(_requestId)
{
  data = _data;
}
```

### Outputs
- A `uint` representing the AVM in USD calculated by SmartZip.

# Documentation and Support
- SmartZip's [interactive API documentation](https://data-api.smartzip-services.com/)
- For support reach out to [info@smartzip.com](mailto:info@smartzip.com)