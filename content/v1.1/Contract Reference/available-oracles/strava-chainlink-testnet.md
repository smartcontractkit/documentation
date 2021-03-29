---
layout: nodes.liquid
title: "Strava Chainlink (Testnet)"
slug: "strava-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://developers.strava.com/docs/reference/">Strava's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project)  contract using the network details below
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
Bool JobID: 07b3e98739da4cb49fe7f52a6decc61f
Bytes32 JobID: eedcef9f7f014ffc84ec0be6b9378781
Uint256 JobID: 1a5576e0520e4f26974106c7bd095660
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the ability to create Chainlink requests.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract StravaChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Ropsten"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
## Bool Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Strava</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbool" target="_blank">EthBool</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Bytes32 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Strava</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">Strava</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## before

**Required** 

Activity created before UNIX time.

#### Solidity example

```javascript
req.addUint("before", now);
```

## after

**Required** 

Activity created after UNIX time.

#### Solidity example

```javascript
req.addUint("after", now - 1 days);
```

## access_token

**Required**

The OAuth access token for the user.

#### Solidity example

```javascript
req.add("access_token", _accessToken);
```

## copyPath

**Required** 

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "0.elapsed_time");
```

Below is an example of the response payload.
[block:code]
{
  "codes": [
    {
      "code": "[ {\n  \"resource_state\" : 2,\n  \"athlete\" : {\n    \"id\" : 134815,\n    \"resource_state\" : 1\n  },\n  \"name\" : \"Happy Friday\",\n  \"distance\" : 24931.4,\n  \"moving_time\" : 4500,\n  \"elapsed_time\" : 4500,\n  \"total_elevation_gain\" : 0,\n  \"type\" : \"Ride\",\n  \"workout_type\" : null,\n  \"id\" : 154504250376823,\n  \"external_id\" : \"garmin_push_12345678987654321\",\n  \"upload_id\" : 987654321234567891234,\n  \"start_date\" : \"2018-05-02T12:15:09Z\",\n  \"start_date_local\" : \"2018-05-02T05:15:09Z\",\n  \"timezone\" : \"(GMT-08:00) America/Los_Angeles\",\n  \"utc_offset\" : -25200,\n  \"start_latlng\" : null,\n  \"end_latlng\" : null,\n  \"location_city\" : null,\n  \"location_state\" : null,\n  \"location_country\" : \"United States\",\n  \"start_latitude\" : null,\n  \"start_longitude\" : null,\n  \"achievement_count\" : 0,\n  \"kudos_count\" : 3,\n  \"comment_count\" : 1,\n  \"athlete_count\" : 1,\n  \"photo_count\" : 0,\n  \"map\" : {\n    \"id\" : \"a12345678987654321\",\n    \"summary_polyline\" : null,\n    \"resource_state\" : 2\n  },\n  \"trainer\" : true,\n  \"commute\" : false,\n  \"manual\" : false,\n  \"private\" : false,\n  \"flagged\" : false,\n  \"gear_id\" : \"b12345678987654321\",\n  \"from_accepted_tag\" : false,\n  \"average_speed\" : 5.54,\n  \"max_speed\" : 11,\n  \"average_cadence\" : 67.1,\n  \"average_watts\" : 175.3,\n  \"weighted_average_watts\" : 210,\n  \"kilojoules\" : 788.7,\n  \"device_watts\" : true,\n  \"has_heartrate\" : true,\n  \"average_heartrate\" : 140.3,\n  \"max_heartrate\" : 178,\n  \"max_watts\" : 406,\n  \"pr_count\" : 0,\n  \"total_photo_count\" : 1,\n  \"has_kudoed\" : false,\n  \"suffer_score\" : 82\n}, {\n  \"resource_state\" : 2,\n  \"athlete\" : {\n    \"id\" : 167560,\n    \"resource_state\" : 1\n  },\n  \"name\" : \"Bondcliff\",\n  \"distance\" : 23676.5,\n  \"moving_time\" : 5400,\n  \"elapsed_time\" : 5400,\n  \"total_elevation_gain\" : 0,\n  \"type\" : \"Ride\",\n  \"workout_type\" : null,\n  \"id\" : 1234567809,\n  \"external_id\" : \"garmin_push_12345678987654321\",\n  \"upload_id\" : 1234567819,\n  \"start_date\" : \"2018-04-30T12:35:51Z\",\n  \"start_date_local\" : \"2018-04-30T05:35:51Z\",\n  \"timezone\" : \"(GMT-08:00) America/Los_Angeles\",\n  \"utc_offset\" : -25200,\n  \"start_latlng\" : null,\n  \"end_latlng\" : null,\n  \"location_city\" : null,\n  \"location_state\" : null,\n  \"location_country\" : \"United States\",\n  \"start_latitude\" : null,\n  \"start_longitude\" : null,\n  \"achievement_count\" : 0,\n  \"kudos_count\" : 4,\n  \"comment_count\" : 0,\n  \"athlete_count\" : 1,\n  \"photo_count\" : 0,\n  \"map\" : {\n    \"id\" : \"a12345689\",\n    \"summary_polyline\" : null,\n    \"resource_state\" : 2\n  },\n  \"trainer\" : true,\n  \"commute\" : false,\n  \"manual\" : false,\n  \"private\" : false,\n  \"flagged\" : false,\n  \"gear_id\" : \"b12345678912343\",\n  \"from_accepted_tag\" : false,\n  \"average_speed\" : 4.385,\n  \"max_speed\" : 8.8,\n  \"average_cadence\" : 69.8,\n  \"average_watts\" : 200,\n  \"weighted_average_watts\" : 214,\n  \"kilojoules\" : 1080,\n  \"device_watts\" : true,\n  \"has_heartrate\" : true,\n  \"average_heartrate\" : 152.4,\n  \"max_heartrate\" : 183,\n  \"max_watts\" : 403,\n  \"pr_count\" : 0,\n  \"total_photo_count\" : 1,\n  \"has_kudoed\" : false,\n  \"suffer_score\" : 162\n} ]",
      "language": "json",
      "name": "Response"
    }
  ]
}
[/block]
## times

*Only valid for the Uint256 Job*

The number to multiply the result by (since Solidity can't handle decimal places).

#### Solidity example

```javascript
req.addInt("times", 100);
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The examples below show how to create requests for the quotes and convert endpoints.
[block:code]
{
  "codes": [
    {
      "code": "function getActivities(address _oracle, bytes32 _jobId, string _accessToken)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"access_token\", _accessToken);\n  req.addUint(\"before\", now);\n  req.addUint(\"after\", now - 1 days);\n  req.add(\"copyPath\", \"0.elapsed_time\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getActivities"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public elapsedTime;\n\nfunction fulfill(bytes32 _requestId, uint256 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  elapsedTime = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]