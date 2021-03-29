---
layout: nodes.liquid
title: "DataSportsGroup Chainlink (Testnet)"
slug: "data-sports-group-chainlink-testnet"
hidden: true
date: Last Modified
---
Chainlink has a dedicated connection to <a href="http://datasportsgroup.com/" target="_blank">Data Sports Group's API</a>. This Chainlink will retrieve the winner of a match for sporting events
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:getting-started)  contract using the network details below
- Fund it with LINK (1 LINK is required per-request)
  - <a href="https://ropsten.chain.link/" target="_blank">Ropsten faucet</a>
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
  - <a href="https://kovan.chain.link/" target="_blank">Kovan faucet</a>
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
JobID: 0c6e11b422734141bebc191bd53ef345

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: ae115a322f2c4dabb444138fce3a5242

#### Kovan
LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
JobID: f0e2e68f2c9f467492eedfc1302f2eeb
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/Chainlinked.sol\";\n\ncontract DSGChainlink {\n  bytes32 constant JOB_ID = bytes32(\"0c6e11b422734141bebc191bd53ef345\");\n  constructor() public {\n    setLinkToken(0x20fE562d797A42Dcb3399062AE9546cd06f63280);\n    setOracle(0xc99B3D447826532722E41bc36e644ba3479E4365);\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Ropsten"
    },
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/Chainlinked.sol\";\n\ncontract DSGChainlink {\n  bytes32 constant JOB_ID = bytes32(\"ae115a322f2c4dabb444138fce3a5242\");\n  constructor() public {\n    setLinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);\n    setOracle(0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e);\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Rinkeby"
    },
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/Chainlinked.sol\";\n\ncontract DSGChainlink {\n  bytes32 constant JOB_ID = bytes32(\"f0e2e68f2c9f467492eedfc1302f2eeb\");\n  constructor() public {\n    setLinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);\n    setOracle(0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e);\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Kovan"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
- [DataSportsGroup](doc:external-adapters)
- [Copy](doc:adapters#section-copy)
- [EthBytes32](doc:adapters#section-ethbytes32)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
### competition

**Required**

Which competition the match was played in.

#### Solidity example

```javascript
req.add("competition", "Premier League");
```

### season

**Required**

The season in the competition where the match was played.

#### Solidity example

```javascript
req.add("season", "2018/2019");
```

### date

**Required**

The date the match was played.

#### Solidity example

```javascript
req.add("date", "2018-08-10");
```

### team_home

**Required**

The home-team for the match.

#### Solidity example

```javascript
req.add("team_home", "Man United");
```

### team_away

**Required**

The away-team for the match.

#### Solidity example

```javascript
req.add("team_away", "Leicester City");
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.
[block:code]
{
  "codes": [
    {
      "code": "{\n  \"result\": \"home\",\n  \"points_home\": \"2\",\n  \"points_away\": \"1\"\n}",
      "language": "json",
      "name": "Returned data format"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "result");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
This example shows how to create the request for the Chainlink node:
[block:code]
{
  "codes": [
    {
      "code": "function requestWinner() public onlyOwner {\n  Chainlink.Request memory req = newRequest(JOB_ID, this, this.fulfill.selector);\n  req.add(\"competition\", \"Premier League\");\n  req.add(\"season\", \"2018/2019\");\n  req.add(\"date\", \"2018-08-10\");\n  req.add(\"team_home\", \"Man United\");\n  req.add(\"team_away\", \"Leicester City\");\n  req.add(\"copyPath\", \"result\");\n  chainlinkRequest(req, ORACLE_PAYMENT);\n}",
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
      "code": "bytes32 public data;\n\nfunction fulfill(bytes32 _requestId, bytes32 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  data = _data;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]