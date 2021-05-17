---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Tiingo EOD Stock Price Oracle"
permalink: "docs/tiingo-eod-stock-price-oracle/"
whatsnext: {"GeoDB Oracle Node":"/docs/geodb-oracle-node/"}
hidden: false
metadata: 
  image: 
    0: "/files/be9eb4e-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
Tiingo consists of a data research and analytics arm, a news aggregator, and a professional suite of APIs. With coverage of over 65,000 Equities and ETFs, the Tiingo End of Day Stock Price oracle gives you access to one of the most expansive data sets available for US & Chinese markets. Our stock price data is decentralized across at least 3 data sources on average for each price feed. This means if any one of them goes down, you keep going.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/)  contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Ethereum Mainnet
Payment amount: 3 LINK
LINK Token address:  `{{variables.MAINNET_LINK_TOKEN}}`
Oracle address: `0x4a1803f29fe5350e9a164d9865576af798e8eef8`
JobID: `d89c60f0b0c045a5a317b1b70215dd16`

####Ethereum Kovan Testnet
Payment amount: 1 LINK
LINK Token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `4fbb2eec517440ca94982726f12ac523`

Requests on Kovan will return mocked data for testing purposes. Teams looking to test with live data on Kovan should contact support@tiingo.com for access.

#### Binance Smart Chain Mainnet
Payment amount: 0.1 LINK
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle address: `0x3ee8dfe6094f642f1d19b7adf6b1a71c57453a8d `
JobID: `2a3a607ac0254695935be32e9390178d`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract TiingoChainlink is ChainlinkClient {
  
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

contract TiingoChainlink is ChainlinkClient {
  
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

contract TiingoChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=0cfa70c25bd5a386bf9ee2e8e9f386e0" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks

- [Tiingo](https://market.link/adapters/ce0a34cf-306e-4fa4-8d27-271028694cb2/data-sources?network=1)
- [Copy](/docs/adapters/#copy)
- [Multiply](/docs/adapters/#multiply)
- [EthUint256](/docs/adapters/#ethuint256)
- [EthTx](/docs/adapters/#ethtx)

# Request Parameters

### ticker

The stock ticker to query.

#### Solidity Example

```javascript
req.add("ticker", "MSTR");
```

### field

The value to be returned. Defaults to `close`. Available values:
- `date`
- `close`
- `high`
- `low`
- `open`
- `volume`
- `adjClose`
- `adjHigh`
- `adjLow`
- `adjOpen`
- `adjVolume`
- `divCash`
- `splitFactor`.

For a full list of supported tickers, refer to the <a href="https://api.tiingo.com/documentation/end-of-day" target="_blank">End-of-Day Prices and Meta Information documentation</a>

#### Solidity Example

```javascript
req.add("field", "close");
```

### times

The amount to multiply the result by (since Solidity does not handle decimals).

#### Solidity Example

```javascript
req.addInt("times", 100);
```

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

```javascript
function requestPrice
(
  address _oracle,
  bytes32 _jobId,
  string _field,
  string _ticker
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("field", _field);
  req.add("ticker", _ticker);
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

# Documentation and Support

- <a href="https://api.tiingo.com/documentation/end-of-day" target="_blank">EOD Stock Price Data API Documentation</a>
- <a href="mailto:support@tiingo.com" target="_blank">Support</a>