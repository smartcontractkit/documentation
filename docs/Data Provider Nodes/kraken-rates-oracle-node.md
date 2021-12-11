---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Kraken Rates Oracle Node"
permalink: "docs/kraken-rates-oracle-node/"
metadata:
  image:
    0: "/files/2713d5c-cl.png"
---
This Chainlink has a dedicated connection to <a href="https://blog.cfbenchmarks.com/rest-api/" target="_blank">Kraken's Prices</a> API.

# Steps for using this oracle

- Write and deploy your contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
Payment amount: 1 LINK
LINK Token address: `{{variables.RINKEBY_LINK_TOKEN}}`
Oracle address: `{{variables.RINKEBY_CHAINLINK_ORACLE}}`
JobID: `49ea116156cd44be997e7670a5dde80d`

#### Kovan
Payment amount: 1 LINK
LINK Token address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle address: `{{variables.KOVAN_CHAINLINK_ORACLE}}`
JobID: `8f4eeda1a8724077a0560ee84eb006b4`

#### Mainnet
Payment amount: 0.5 LINK
LINK Token address: `{{variables.MAINNET_LINK_TOKEN}}`
Oracle address: `{{variables.MAINNET_CHAINLINK_ORACLE}}`
JobID: contact `dataproviders@chain.link` for details

# Create your contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```solidity Solidity 4
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
```solidity Solidity 5
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
```solidity Solidity 6
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

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/DataProviders/Kraken.sol" target="_blank" >Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

# Tasks

- [Kraken](../external-adapters/)
- [Multiply](../core-adapters/#multiply)
- [EthUint256](../core-adapters/#ethuint256)
- [EthTx](../core-adapters/#ethtx)

# Request Parameters

### Arguments

Use the `index` parameter to request the desired index from Kraken.

#### Solidity example

To obtain KXBTUSD index, use the `DEFI_KXBTUSD` identifier.

```solidity
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

```solidity
req.addInt("times", 100);
```

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

```solidity
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

```solidity
uint256 public currentPrice;

function fulfill(bytes32 _requestId, uint256 _price)
  public
  recordChainlinkFulfillment(_requestId)
{
  currentPrice = _price;
}
```
