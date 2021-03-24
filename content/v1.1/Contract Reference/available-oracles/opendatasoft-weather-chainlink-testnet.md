---
title: "OpenDataSoft Weather Chainlink (Testnet)"
slug: "opendatasoft-weather-chainlink-testnet"
hidden: true
createdAt: "2019-07-12T15:12:43.815Z"
updatedAt: "2019-11-01T17:42:23.608Z"
---
This Chainlink has a dedicated connection to <a href="https://public.opendatasoft.com/explore/dataset/donnees-synop-essentielles-omm/api/">OpenDataSoft's SYNOP Weather API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
JobID: ab41d8c080654f468bd632f5f8e9b0ea
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract OpenDataSoftChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Santiment</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## method

**Required** 

The method for the adapter to use. Available options are:

- `getCurrentTemp`: To retrieve the current temperature
- `query`: To create a query for any returned records

#### Solidity example

```javascript
req.add("method", "getCurrentTemp");
```

### refine_place

**Required**

The name of the facet for the data. This can be found on the left-hand side of <a href="https://public.opendatasoft.com/explore/dataset/donnees-synop-essentielles-omm/api/?sort=date" target="_blank">this page</a> under **Nom**.

#### Solidity example

```javascript
req.add("refine_place", "NICE");
```

### copyPath

The path of the desired data field to return to the smart contract. This is only needed when `method` is `query`

Returned payload from `query` method:

```json
[
	{
		"datasetid": "donnees-synop-essentielles-omm",
		"recordid": "3bb3230df3f7abb9b569a85a47d2900b475539a6",
		"fields": {
			"ssfrai": 0,
			"ch": "60",
			"ctype1": "7",
			"cm": "61",
			"numer_sta": "07240",
			"perssfrai": -60,
			"tx12c": 7.200000000000045,
			"pres": 98690,
			"w2": "1",
			"vv": 5000,
			"rr3": 0.4,
			"cl": "35",
			"per": -10,
			"tend": -30,
			"tn12c": 6.400000000000034,
			"temps_present": "État du ciel inchangé dans l’ensemble",
			"rafper": 3.1,
			"tn12": 279.55,
			"td": 279.05,
			"nnuage1": 2,
			"tc": 6.5,
			"w1": "1",
			"nnuage2": 7,
			"pmer": 100030,
			"nom": "TOURS",
			"tx12": 280.35,
			"type_de_tendance_barometrique": "En baisse, puis en hausse, la pression atmosphérique est la même ou plus basse que trois heures auparavant",
			"dd": 70,
			"phenspe3": 3100,
			"phenspe2": 1103,
			"phenspe1": 710,
			"ww": "2",
			"cod_tend": "5",
			"ff": 2.1,
			"date": "2010-12-21T18:00:00+00:00",
			"hnuage2": 1200,
			"hnuage1": 90,
			"coordonnees": [
				47.4445,
				0.727333
			],
			"rr1": 0,
			"rr12": 4,
			"n": 100,
			"u": 96,
			"t": 279.65,
			"hbas": 150,
			"nbas": "7",
			"temps_passe_1": "Nuages couvrant plus de la moitié du ciel pendant une partie de la période considérée et couvrant la moitié du ciel, ou moins, pendant l’autre partie",
			"ctype2": "6"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [
				0.727333,
				47.4445
			]
		},
		"record_timestamp": "2018-10-03T13:47:00+00:00"
	}
]
```

#### Solidity example

```javascript
req.add("copyPath", "0.fields.t");
```

### times

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
The example below shows how to create a request to retrieve the current temperature of a specified location.
[block:code]
{
  "codes": [
    {
      "code": "function getCurrentTemperature(address _oracle, bytes32 _jobId, string _place)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"method\", \"getCurrentTemp\");\n  req.add(\"refine_place\", _place);\n  req.addInt(\"times\", 100);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Current Temperature"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public data;\n\nfunction fulfill(bytes32 _requestId, uint256 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  data = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]