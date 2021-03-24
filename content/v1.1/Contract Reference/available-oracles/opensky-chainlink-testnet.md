---
title: "OpenSky Network Chainlink (Testnet)"
slug: "opensky-chainlink-testnet"
hidden: true
createdAt: "2018-10-04T13:19:46.824Z"
updatedAt: "2019-11-01T17:44:16.083Z"
---
This Chainlink has a dedicated connection to <a href="https://opensky-network.org/" target="_blank">OpenSky Network's API</a>. The OpenSky Network is a community-based receiver network which continuously collects air traffic surveillance data. Unlike other networks, OpenSky keeps the collected raw data forever and makes it accessible to researchers. With over ten trillion ADS-B and Mode S messages collected from more than 1000 sensors around the world, the OpenSky Network exhibits the largest air traffic surveillance dataset of its kind.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://ropsten.chain.link/" target="_blank">Ropsten faucet</a>
- Call your [request method](#section-chainlink-examples) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Ropsten
LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365
JobID: b9133103bce04386a39a4d5692d8d526
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `Chainlinked.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract OpenSkyChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- [OpenSky](doc:external-adapters)
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

The endpoint to use from OpenSky Network's API. Currently supported values are:

- states
- flights
- tracks

#### Solidity example

```javascript
req.add("endpoint", "states");
```

### action

**Required**

Currently supported values are:

- all
- aircraft
- arrival
- departure

#### Solidity example

```javascript
req.add("action", "all");
```

### time

The time in seconds since epoch (Unix time stamp to retrieve states for. Current time will be used if omitted.

#### Solidity example

```javascript
req.addInt("time", now - 1 hours);
```

### airport

ICAO identifier for the airport (usually upper case).

#### Solidity example

```javascript
req.add("airport", "EDDF");
```

### icao24

Unique ICAO 24-bit address of the transponder in hex string representation. All letters need to be lower case.

#### Solidity example

```javascript
req.add("icao24", "3c675a");
```

### serials

Retrieve only states of a subset of your receivers. You can pass this argument several time to filter state of more than one of your receivers. In this case, the API returns all states of aircraft that are visible to at least one of the given receivers.

#### Solidity example

```javascript
req.add("serials", "123456");
```

### begin

Start of time interval to retrieve flights for as Unix time (seconds since epoch).

#### Solidity example

```javascript
req.addInt("begin", now - 1 days);
```

### end

End of time interval to retrieve flights for as Unix time (seconds since epoch).

#### Solidity example

```javascript
req.addInt("end", now);
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract. Examples of returned data format for their given endpoint and action are below:
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"time\": 1458564121,\n\t\"states\": [\n\t\t[\n\t\t\t\"3c6444\", // icao24\n\t\t\t\"DLH9LF  \", // callsign\n\t\t\t\"Germany\", // origin_country\n\t\t\t1458564120, // time_position\n\t\t\t1458564120, // last_contact\n\t\t\t6.1546, // longitude\n\t\t\t50.1964, // latitude\n\t\t\t9639.3, // baro_altitude\n\t\t\tfalse, // on_ground\n\t\t\t232.88, // velocity\n\t\t\t98.26, // true_track\n\t\t\t4.55, // vertical_rate\n\t\t\tnull, // sensors\n\t\t\t9547.86, // geo_altitude\n\t\t\t\"1000\", // squawk\n\t\t\tfalse, // spi\n\t\t\t0 // position_source\n\t\t],\n    /* ... */\n\t]\n}",
      "language": "json",
      "name": "endpoint=states, action=all"
    },
    {
      "code": "[\n\t{\n\t\t\"icao24\": \"800547\",\n\t\t\"firstSeen\": 1517227477,\n\t\t\"estDepartureAirport\": \"VGTJ\",\n\t\t\"lastSeen\": 1517228618,\n\t\t\"estArrivalAirport\": null,\n\t\t\"callsign\": \"JAI273  \",\n\t\t\"estDepartureAirportHorizDistance\": 6958,\n\t\t\"estDepartureAirportVertDistance\": 655,\n\t\t\"estArrivalAirportHorizDistance\": null,\n\t\t\"estArrivalAirportVertDistance\": null,\n\t\t\"departureAirportCandidatesCount\": 1,\n\t\t\"arrivalAirportCandidatesCount\": 0\n\t},\n\t/* ... */\n]",
      "language": "json",
      "name": "endpoint=flights, action=all"
    },
    {
      "code": "[\n\t{\n\t\t\"icao24\": \"3c675a\",\n\t\t\"firstSeen\": 1517258040,\n\t\t\"estDepartureAirport\": \"EDDF\",\n\t\t\"lastSeen\": 1517263900,\n\t\t\"estArrivalAirport\": \"ESSA\",\n\t\t\"callsign\": \"DLH2VC  \",\n\t\t\"estDepartureAirportHorizDistance\": 1462,\n\t\t\"estDepartureAirportVertDistance\": 49,\n\t\t\"estArrivalAirportHorizDistance\": 7194,\n\t\t\"estArrivalAirportVertDistance\": 423,\n\t\t\"departureAirportCandidatesCount\": 1,\n\t\t\"arrivalAirportCandidatesCount\": 3\n\t},\n\t/* ... */\n]",
      "language": "json",
      "name": "endpoint=flights, action=aircraft"
    },
    {
      "code": "[\n\t{\n\t\t\"icao24\": \"0101be\",\n\t\t\"firstSeen\": 1517220729,\n\t\t\"estDepartureAirport\": null,\n\t\t\"lastSeen\": 1517230737,\n\t\t\"estArrivalAirport\": \"EDDF\",\n\t\t\"callsign\": \"MSR785  \",\n\t\t\"estDepartureAirportHorizDistance\": null,\n\t\t\"estDepartureAirportVertDistance\": null,\n\t\t\"estArrivalAirportHorizDistance\": 1593,\n\t\t\"estArrivalAirportVertDistance\": 95,\n\t\t\"departureAirportCandidatesCount\": 0,\n\t\t\"arrivalAirportCandidatesCount\": 2\n\t},\n\t/* ... */\n]",
      "language": "json",
      "name": "endpoint=flights, action=arrival"
    },
    {
      "code": "[\n\t{\n\t\t\"icao24\": \"3c4ad0\",\n\t\t\"firstSeen\": 1517230790,\n\t\t\"estDepartureAirport\": \"EDDF\",\n\t\t\"lastSeen\": 1517238306,\n\t\t\"estArrivalAirport\": null,\n\t\t\"callsign\": \"DLH630  \",\n\t\t\"estDepartureAirportHorizDistance\": 4319,\n\t\t\"estDepartureAirportVertDistance\": 65,\n\t\t\"estArrivalAirportHorizDistance\": null,\n\t\t\"estArrivalAirportVertDistance\": null,\n\t\t\"departureAirportCandidatesCount\": 1,\n\t\t\"arrivalAirportCandidatesCount\": 0\n\t},\n\t/* ... */\n]",
      "language": "json",
      "name": "endpoint=flights, action=departure"
    },
    {
      "code": "{\n\t\"icao24\": \"3c4b26\",\n\t\"callsign\": \"DLH440  \",\n\t\"startTime\": 1548234765,\n\t\"endTime\": 1548238909,\n\t\"path\": [\n\t\t[\n\t\t\t1548234765, // time\n\t\t\t50.0339, // latitude\n\t\t\t8.54, // longitude\n\t\t\t0, // baro_altitude\n\t\t\t69, // true_track\n\t\t\tfalse // on_ground\n\t\t],\n\t\t/* ... */\n\t]\n}",
      "language": "json",
      "name": "endpoint=tracks, action=all"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "states.0.8");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below will give you the current status of a flight, if it is on the ground or not.
[block:code]
{
  "codes": [
    {
      "code": "function flightOnGround\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _icao24\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"endpoint\", \"states\");\n  req.add(\"action\", \"all\");\n  req.add(\"airport\", _icao24);\n  req.add(\"copyPath\", \"states.0.8\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Get Departure"
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