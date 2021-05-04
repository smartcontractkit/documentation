---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "GeoDB Oracle Node"
permalink: "docs/geodb-oracle-node/"
whatsnext: {"TheRundown Oracle Node":"/docs/therundown-oracle-node/"}
hidden: false
metadata: 
  image: 
    0: "https://files.readme.io/070eb54-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
GeoDB is a decentralized Big Data ecosystem that compensates data providers who share data and makes data affordable and trusted for data consumers. It uses blockchain technology to collect user data without compromising identities, distribute rewards to data providers, and validate and manage the ecosystem using a decentralized governance model. This oracle, given a location, radius around it, and time duration, returns the number of <a href="https://docs.geodb.com/geocash-1/geocash" target="_blank">GeoCash</a> Users in that area during that time.

# Steps For Using This Oracle

- Write and deploy your [Chainlink](../intermediates-tutorial/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Network Details

#### Ethereum Mainnet

Payment Amount: 3 LINK
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}`
Oracle Address: `0xdCDD8Cb3d4E7332C404772dBFE83C583D17fe821`
JobID: `8a2b5fe5465349229f22f732a3e098cb`

#### Ethereum Kovan Testnet

Payment Amount: 0.1 LINK
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0x56dd6586DB0D08c6Ce7B2f2805af28616E082455`
JobID: `ef0e16c96ce04795b261725db827ba32`

#### Binance Smart Chain Mainnet
Payment Amount: 0.1 LINK
LINK Token Address: `{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0xa31ffd6ad080985284cf2fc19ed4df61e8ba22d9`
JobID: `f88bd47507b245babccefc9f81ee1b72`

# Create Your Contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```javascript Solidity 4
pragma solidity ^0.4.24;

import "@chainlink/contracts/v0.4/ChainlinkClient.sol";

contract GeoDBChainlink is ChainlinkClient {
  
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

contract GeoDBChainlink is ChainlinkClient {
  
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

contract GeoDBChainlink is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=a0325e320876120063445b0cfc241c7a" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# Tasks

* <a href="https://market.link/adapters/beb55d62-8771-4953-ba1d-704af03c12ee/data-sources?network=1" target="_blank">GeoDB</a>
* [Copy](/docs/adapters/#copy)
* [Multiply](/docs/adapters/#multiply)
* [EthUint256](/docs/adapters/#ethuint256)
* [EthTx](/docs/adapters/#ethtx)

# Request Parameters

### lat
Latitude coordinate.

#### Solidity Example
`req.add("lat", "45.7905");`

### lng
Longitude coordinate.

#### Solidity Example
`req.add("lng", "11.9202");`

### radius
Radius around the coordinates in meters.

#### Solidity Example
`req.add("radius", "500000");`

### start
Start time, format: "yyyy-mm-dd hh:mm:ss".

#### Solidity Example
`req.add("start", "2021-01-01 20:00:00");`

### end
End time, format: "yyyy-mm-dd hh:mm:ss".

#### Solidity Example
`req.add("end", "2021-02-21 20:30:00");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

```javascript
function requestUsers
(
  address _oracle,
  bytes32 _jobId,
  string _lat,
  string _lng,
  string _radius,
  string _start,
  string _end
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("lat", _lat);
  req.add("lng", _lng);
  req.add("radius", _radius);
  req.add("start", _start);
  req.add("end", _end);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```

Here is an example of the fulfill method:

```javascript
uint256 public users;

function fulfill(bytes32 _requestId, uint256 _users)
  public
  recordChainlinkFulfillment(_requestId)
{
  users = _users;
}
```

# Documentation and Support

For support, reach out to GeoDB via <a href="https://discord.com/invite/KWudZCCUcm" target="_blank">Discord</a> or <a href="https://t.me/GeoDBgroup" target="_blank">Telegram</a>