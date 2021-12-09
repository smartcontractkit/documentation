---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Finage Global Market Data Oracle"
permalink: "docs/finage-global-market-data-oracle/"
---

Finage is a leading real-time stock, forex, and cryptocurrency data provider. They offer market data for 60,000+ securities, and a broad selection of data such as financial statements, Ownership, News Sentiments, Earning Call Transcripts and Mergers and Acquisitions. This oracle will initially provide a given stock’s performance relative to its sector’s performance.

# Steps For Using This Oracle

- Write and deploy your contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}`
Oracle Address: `0xE98dFc0C36408b54326Fa11235D573574B1e8eC3`  
JobID: `3e478404a3ca4cf5abd2820efe7c1913`  

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `955810d193e144abb85ae2edea65344d`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xa80bEAEBf1955D8AA9B5f741388e5A43Ba309935`
JobID: `55d23024c541439ca28b456044d01304`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```solidity Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract FinageChainlink is ChainlinkClient {

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

contract FinageChainlink is ChainlinkClient {

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

contract FinageChainlink is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:

}
```

<div class="remix-callout">
    <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/DataProviders/Finage.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/profile/adapters/687be1a9-f5f8-44f1-a9d8-81bab4fb4247/data-source" target="_blank">Finage Relative Stock Performance</a>
* [Copy](../core-adapters/#copy)
* [Multiply](../core-adapters/#multiply)
* [EthInt256](../core-adapters/#ethint256)
* [EthTx](../core-adapters/#ethtx)

# Request Parameters
### `symbol`
- The symbol of the stock to query
#### Solidity Example
`req.add("symbol", "AAPL");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```solidity
function requestData
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

```solidity
int256 public data;

function fulfill(bytes32 _requestId, int256 _data)
  public
  recordChainlinkFulfillment(_requestId)
{
  data = _data;
}
```

# Documentation and Support
- The `Finage Relative Stock Performance` job depends on calls to the Finage <a href="https://finage.co.uk/docs/api/stock-market-aggregates-api" target="_blank">Stock Market Aggregates API</a> and the <a href="https://finage.co.uk/docs/api/stock-market-details-api" target="_blank">Stock Market Details API</a>
- For assistance, reach out to Finage using <a href="https://finage.co.uk/consultation" target="_blank">this form</a>
