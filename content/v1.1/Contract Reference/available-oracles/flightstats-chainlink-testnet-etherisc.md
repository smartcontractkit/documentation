---
layout: nodes.liquid
title: "Flightstats Chainlink (Testnet) (Etherisc)"
slug: "flightstats-chainlink-testnet-etherisc"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to Flightstats' API. This Chainlink allows requesters to get the ratings and status of different flights.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
- Fund it with LINK (0.1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
- Call your [request method](#section-chainlink-example) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK Token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: d5a6d1b6dc30467790b92ff3299b8e99
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract FlightstatsChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Constructor"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [Flightstats](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### endpoint

**Required**

One of:

* ratings
* status
* e-ratings
* e-status

See [endpoints](#section-endpoints) for more information.

#### Solidity example

```javascript
req.add("endpoint", "ratings");
```

### carrier

**Required**

The airline operating the flight
Examples: HA.

#### Solidity example

```javascript
req.add("carrier", "HA");
```

### flightNumber

**Required**

The flight number.

#### Solidity example

```javascript
req.add("flightNumber", "25");
```

### yearMonthDay

**Required (for status/e-status)**

The year, month and day for flight arrival or departure.
Status uses arrival, e-status uses departure.

#### Solidity example

```javascript
req.add("year", "2019/11/21");
```

### year

**Required (for status/e-status)**

The year for flight arrival or departure.
Status uses arrival, e-status uses departure.

#### Solidity example

```javascript
req.add("year", "2018");
```

### month

**Required (for status/e-status)**

The month for flight arrival or departure.
Status uses arrival, e-status uses departure.

#### Solidity example

```javascript
req.add("month", "09");
```

### day

**Required (for status/e-status)**

The day for flight arrival or departure.
Status uses arrival, e-status uses departure.

#### Solidity example

```javascript
req.add("day", "21");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "ratings.cancelled");
```
[block:api-header]
{
  "title": "Endpoints"
}
[/block]
### ratings

Returns Flight Ratings object. For more information, see Flightstats' docs: https://developer.flightstats.com/api-docs/ratings/v1/ratingsresponse

### e-ratings

A comma delimited list of:

* `observations`
* `late15`
* `late30`
* `late45`
* `cancelled`
* `diverted`

...from the Flight Ratings object.

### status

Returns Flight Status Response object. For more information, see Flightstats' docs: https://developer.flightstats.com/api-docs/flightstatus/v2/flightstatusresponse

### e-status

A comma delimited list of:

* `status`
* `arrivalGateDelayMinutes` (if supplied)
* `actualGateArrival` ("true" if supplied, "false" otherwise)

...from the Flight Status Response object.
[block:api-header]
{
  "title": "Chainlink Example"
}
[/block]
This example will give you the cancellation status for a flight number and carrier.
[block:code]
{
  "codes": [
    {
      "code": "function requestStatus\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _flightNum,\n  string _carrier\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"ratings\");\n  req.add(\"carrier\", _carrier);\n  req.add(\"flightNumber\", _flightNum);\n  req.add(\"copyPath\", \"ratings.cancelled\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "bytes32 public status;\n\nfunction fulfill(bytes32 _requestId, bytes32 _status)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  status = _status;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]