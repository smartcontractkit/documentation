---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "FlightAware Chainlink (Testnet)"
permalink: "docs/flightaware-chainlink-testnet/"
---
This Chainlink has a dedicated connection to [FlightAware](https://uk.flightaware.com/).

# Steps for using this oracle

- Write and deploy your [Chainlink](../request-and-receive-data/) contract using the network details below
- Fund it with [LINK](../link-token-contracts/)
- Call your [request method](./#chainlink-examples)

# Chainlink Network Details

You will need to use the following LINK token address, oracle address, and Job IDs to create the request.

#### Kovan
LINK Token address: `0xa36085f69e2889c224210f603d836748e7dc0088`
Oracle address: `0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e`
JobID: `a644d4e30977459d9a596bef89c09e71 `
Sleep JobID: `f0003b2c52024e7fa931d6ee9a947c87`

# Create your Chainlink contract

Import `ChainlinkClient.sol` into your contract so you can inherit the Chainlink behavior.

```solidity Solidity 6
pragma solidity ^0.6.0;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
contract FlightAwareChainlink is ChainlinkClient {

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
import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";
contract FlightAwareChainlink is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:

}
```
```solidity Solidity 4
pragma solidity ^0.4.24;
import "@chainlink/contracts/src/v0.4/ChainlinkClient.sol";
contract FlightAwareChainlink is ChainlinkClient {

  uint256 oraclePayment;

  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:

}
```

# Tasks

- [FlightAware](../external-adapters/)
- [Copy](../core-adapters/#copy)
- [Ethuint256](../core-adapters/#ethuint256)
- [EthTx](../core-adapters/#ethtx)

# Request Parameters

### `endpoint`

The endpoint to query (optional, defaults to `FlightInfoEx`)

#### Solidity example

```solidity
req.add("endpoint", "FlightInfoEx");
```

### `flight`

The flight identification/number (required)

#### Solidity example

```solidity
req.add("flight", "NAX105");
```

### `departure`

The unix timestamp of the departure (required)

#### Solidity example

```solidity
req.addUint("departure", 1594378824);
```

### `until`

Required for the Sleep job

#### Solidity example

```solidity
req.addUint("until", now + 1 hours);
```

# Chainlink Examples

The examples below use the different endpoints available from this Chainlink:

```solidity
function createRequest
(
  address _oracle,
  bytes32 _jobId,
  string memory _flight,
  uint256 _departure,
)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  req.add("flight", _flight);
  req.addUint("departure", _departure);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}
```

Here is an example of the `fulfill` method:

```solidity
uint256 public result;
function fulfill(bytes32 _requestId, uint256 _result)
  public
  recordChainlinkFulfillment(_requestId)
{
  result = _result;
}
```
