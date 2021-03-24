---
title: "Genesis Volatility"
slug: "genesis-volatility"
hidden: true
createdAt: "2021-03-05T14:41:18.698Z"
updatedAt: "2021-03-09T11:34:51.320Z"
---
tbd

# Steps For Using This Oracle

- Write and deploy your [Chainlink](https://docs.chain.link/docs/example-walkthrough) contract using the network details below
- Fund it with [LINK](doc:link-token-contracts)
- Call your [request method](#section-chainlink-examples)

# Network Details

#### Ethereum Mainnet
Payment Amount: REPLACE_ME LINK  
LINK Token Address: `<<MAINNET_LINK_TOKEN>>` 
Oracle Address: `REPLACE_ME`  
JobID: `REPLACE_ME`  

#### Ethereum Kovan Testnet
Payment Amount: REPLACE_ME  LINK  
LINK Token Address: `<<KOVAN_LINK_TOKEN>>`
Oracle Address: `REPLACE_ME`  
JobID: `REPLACE_ME`  

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

# Tasks
* <a href="https://market.link/adapters/replace_me" target="_blank">REPLACE_ME</a>
* [Copy](doc:adapters#copy)
* [Multiply](doc:adapters#multiply)
* [EthUint256](doc:adapters#ethuint256)
* [EthTx](doc:adapters#ethtx)

# Request Parameters
### `replaceMe`
REPLACE_ME ...
#### Solidity Example
`req.add("replaceMe", "REPLACE_ME");`

# Chainlink Examples

The examples below show how to create a request for the Chainlink node.

### `requestData` function

```javascript
function requestData
(
  address _oracle,
  bytes32 _jobId,
  string _replaceMe
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("replaceMe", _replaceMe);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```
### `fulfill` function

```javascript
uint256 public replaceMe;

function fulfill(bytes32 _requestId, uint256 _replaceMe)
  public
  recordChainlinkFulfillment(_requestId)
{
  replaceMe = _replaceMe;
}
```

# Documentation and Support
- For support, reach out to [REPLACE_ME](https://replaceme.com)