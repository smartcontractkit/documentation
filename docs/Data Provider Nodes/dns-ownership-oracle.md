---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "DNS Ownership Oracle"
permalink: "docs/dns-ownership-oracle/"
---
This oracle checks Google’s DNS service to determine if a given domain is owned by a given blockchain address.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: 1 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}`
Oracle Address: `0x240BaE5A27233Fd3aC5440B5a598467725F7D1cd`  
JobID: `6ca2e68622bd421d98c648f056ee7c76`

#### Ethereum Kovan Testnet
Payment Amount: 0.1  LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`  
JobID: `791bd73c8a1349859f09b1cb87304f71`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x63B72AF260E8b40A7b89E238FeB53448A97b03D2`  
JobID: `fb06afd5a9df4e6cb156f6b797b63a24`  

#### Polygon (Matic) Mainnet
Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x63B72AF260E8b40A7b89E238FeB53448A97b03D2`  
JobID: `f3daed2990114e98906aaf21c4172da3`  

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```solidity Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract DnsOwnershipChainlink is ChainlinkClient {

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

contract DnsOwnershipChainlink is ChainlinkClient {

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

contract DnsOwnershipChainlink is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:

}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/DataProviders/DnsOwnership.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks
* <a href="https://market.link/adapters/9bfdd269-133c-44d4-9c67-b66cca770c0f" target="_blank">DNS Record Check</a>
* [Copy](../core-adapters/#copy)
* [EthBool](../core-adapters/#ethbool)
* [EthTx](../core-adapters/#ethtx)

# Request Parameters
### `type`
Always use `TXT`
#### Solidity Example
`req.add("type", "TXT");`
### `name`
The domain name to check ownership of.
#### Solidity Example
`req.add("name", "www5.infernos.io");`
### `record`
The Ethereum address to check a given domain against.
#### Solidity Example
`req.add("record", "0xf75519f611776c22275474151a04183665b7feDe");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestProof` function

```solidity
function requestProof
(
  address _oracle,
  bytes32 _jobId,
  string memory _txt,
  string memory _name,
  string memory _record
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
  req.add("type", _txt);
  req.add("name", _name);
  req.add("record", _record);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```solidity
bool public proof;

function fulfill(bytes32 _requestId, bool _proof)
  public
  recordChainlinkFulfillment(_requestId)
{
  proof = _proof;
}
```
