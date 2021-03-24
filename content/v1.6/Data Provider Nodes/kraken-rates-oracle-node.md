---
title: "Kraken Rates Oracle Node"
slug: "kraken-rates-oracle-node"
hidden: false
metadata: 
  image: 
    0: "https://files.readme.io/2713d5c-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
createdAt: "2021-01-28T16:53:16.596Z"
updatedAt: "2021-03-19T11:10:55.003Z"
---
This Chainlink has a dedicated connection to <a href="https://blog.cfbenchmarks.com/rest-api/" target="_blank">Kraken's Prices</a> API. 

# Steps for using this oracle

- Write and deploy your [Chainlink](doc:example-walkthrough)  contract using the network details below
- Fund it with [LINK](doc:link-token-contracts)
- Call your [request method](#section-chainlink-examples) 

# Network Details

You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
Payment amount: 1 LINK
LINK Token address: `<<RINKEBY_LINK_TOKEN>>`
Oracle address: `<<RINKEBY_CHAINLINK_ORACLE>>` 
JobID: `49ea116156cd44be997e7670a5dde80d`

#### Kovan
Payment amount: 1 LINK
LINK Token address: `<<KOVAN_LINK_TOKEN>>`
Oracle address: `<<KOVAN_CHAINLINK_ORACLE>>` 
JobID: `8f4eeda1a8724077a0560ee84eb006b4`

#### Mainnet
Payment amount: 0.5 LINK
LINK Token address: `<<MAINNET_LINK_TOKEN>>`
Oracle address: `<<MAINNET_CHAINLINK_ORACLE>>` 
JobID: `9955fea1a754409fbe9d5e18c307e409`

# Create your contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract KrakenChainlink is ChainlinkClient {
  
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

contract KrakenChainlink is ChainlinkClient {
  
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

contract KrakenChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

# Tasks

- [Kraken](doc:external-adapters)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)

# Request Parameters

### Arguments

Use the `index` parameter to request the desired index from Kraken.

#### Solidity example

To obtain KXBTUSD index, use the `DEFI_KXBTUSD` identifier.

```javascript
req.add("index", "DEFI_KXBTUSD");
```

Index identifiers include:
 
- DEFI_KXBTUSD
- DEFI_KETHUSD
- DEFI_KBCHUSD
- DEFI_KXRPUSD
- DEFI_KLTCUSD
- DEFI_KLINKUSD
- DEFI_KEOSUSD
- DEFI_KXTZUSD
- DEFI_KXLMUSD
- DEFI_KPAXGUSD
- DEFI_KALGOUSD
- DEFI_KATOMUSD
- DEFI_KOMGUSD
- DEFI_KOXTUSD
- DEFI_KXBTEUR
- DEFI_KETHEUR

### times

The amount to multiply the result by (since Solidity does not handle decimals).


#### Solidity example

```javascript
req.addInt("times", 100);
```

# Chainlink Examples

<div class="row text-center center">
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=902e40cbf5d0a2f583ce2ceb0b9c7749" target="_blank" class="cl-button--ghost">Hard Coded Remix Example ↗</a>
</div>
</div>

The examples below show how to create a request for the Chainlink node.

```javascript
function requestPrice
(
  address _oracle,
  bytes32 _jobId,
  string _index
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("index", _index);
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

Below is a sample on the Kovan testnet. Note, the contract should have enough LINK to pay a specified fee. To fund the contract, use [this tutorial](doc:fund-your-contract).

<div class="row text-center center">
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=a619c568fc457f13877c2bbf066b510a" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
</div>
<div class="col-xs-12 col-md-6 col-md-offset-3">
<a href="https://docs.chain.link/docs/example-walkthrough" target="_blank">What is Remix?</a>
</div>
</div>