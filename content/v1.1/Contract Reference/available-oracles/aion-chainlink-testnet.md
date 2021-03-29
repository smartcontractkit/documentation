---
layout: nodes.liquid
title: "AION Chainlink (Testnet)"
slug: "aion-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://mastery.aion.network" target="_blank">AION's Mastery Testnet</a>. This Chainlink's functionality is currently limited to retrieving information on the blockchain and cannot send transactions.
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
JobID: acfb29f394514c6db635676813436786
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/Chainlinked.sol\";\n\ncontract AIONChainlink {\n  bytes32 constant JOB_ID = bytes32(\"acfb29f394514c6db635676813436786\");\n  constructor() public {\n    setLinkToken(0x20fE562d797A42Dcb3399062AE9546cd06f63280);\n    setOracle(0xc99B3D447826532722E41bc36e644ba3479E4365);\n  }\n  // Additional functions here:\n  \n}",
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
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">AION</a>
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

The RPC method to invoke.

#### Solidity example

```javascript
req.add("method", "eth_getBalance");
```

## params

**Some methods may require params**

If required by the method, include params for the RPC call.

#### Solidity example

```javascript
string[] memory params = new string[](2);
params[0] = "0xa08fc457b39b03c30dc71bdb89a4d0409dd4fa42f6539a5c3ee4054af9b71f23";
params[1] = "latest";
req.addStringArray("params", params);
```

### copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "result");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below will get you the account balance for a given AION account.
[block:code]
{
  "codes": [
    {
      "code": "function getAionAccountBalance(string _account)\n  public\n  onlyOwner\n  returns (bytes32 requestId) \n{\n  Chainlink.Request memory req = newRequest(JOB_ID, this, this.fulfill.selector);\n  req.add(\"method\", \"eth_getBalance\");\n  string[] memory params = new string[](2);\n  params[0] = _account;\n  params[1] = \"latest\";\n  req.addStringArray(\"params\", params);\n  req.add(\"copyPath\", \"result\");\n  requestId = chainlinkRequest(req, 1 * LINK);\n}",
      "language": "javascript",
      "name": "Get Account Balance"
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