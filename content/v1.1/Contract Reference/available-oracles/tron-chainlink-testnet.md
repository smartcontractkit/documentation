---
title: "Tron Chainlink (Testnet)"
slug: "tron-chainlink-testnet"
hidden: true
createdAt: "2019-02-27T19:58:59.079Z"
updatedAt: "2019-11-01T17:43:08.839Z"
---
This Chainlink has a dedicated connection to <a href="https://www.trongrid.io/" target="_blank">TronGrid</a> to access the Tron blockchain. This Chainlink's functionality is currently limited to retrieving information on the blockchain and cannot send transactions.
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
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request. Two Job IDs are available for off-chain parsing of data: one for `bytes32` and one for `uint256`. 

## Ropsten
LINK Token address: 0x20fE562d797A42Dcb3399062AE9546cd06f63280
Oracle address: 0xc99B3D447826532722E41bc36e644ba3479E4365

### Tron Testnet:
Bytes32 JobID: 9791ff64b13f455f9f0723e82e1b9998
Uint256 JobID: aab0a6d91bae4708a17c23c9faf58786

*Special job combining Random.org + Tron testnet:*
1cecdab3e6c4497b817b083a11468b45
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/Chainlinked.sol\";\n\ncontract TronChainlink {\n  bytes32 constant BYTES32_JOB_ID = bytes32(\"9791ff64b13f455f9f0723e82e1b9998\");\n  bytes32 constant UINT256_JOB_ID = bytes32(\"aab0a6d91bae4708a17c23c9faf58786\");\n  bytes32 constant RANDOM_JOB_ID = bytes32(\"1cecdab3e6c4497b817b083a11468b45\");\n  constructor() public {\n    setLinkToken(0x20fE562d797A42Dcb3399062AE9546cd06f63280);\n    setOracle(0xc99B3D447826532722E41bc36e644ba3479E4365);\n  }\n  // Additional functions here:\n  \n}",
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
## Bytes32 Job
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Tron</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Tron</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Tron + Random.org Job
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Random-Org</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Tron</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## action

**Required** 

The RPC method to invoke.

Supported actions are:
- getAccount
- getBalance
- getTransaction
- getConfirmedTransaction
- getTransactionInfo
- getBandwidth
- getTokenById
- triggerSmartContract
[block:callout]
{
  "type": "warning",
  "body": "The `triggerSmartContract` function is currently only supported on the Shasta test network."
}
[/block]
#### Solidity example

```javascript
req.add("action", "getBalance");
```

## trxAddress

**The following actions require a Tron address**
- getAccount
- getBalance
- getBandwidth
- triggerSmartContract

If required by the action, include an address for the RPC call.

#### Solidity example

```javascript
req.add("trxAddress", "TSRjaCNH2Ndz5mKRq8XETZt19McKdnubfb");
```

## transactionID

**The following actions require a transactionID**
- getTransaction
- getConfirmedTransaction
- getTransactionInfo

If required by the action, include a transactionID for the RPC call.

#### Solidity example

```javascript
req.add("transactionID", "6ad4fd46b58c7b3fa5c3b9e6bfab220c599f69387b7c1b6ff3e854f1c99cec67");
```

## tokenID

**The following actions require a tokenID**
- getTokenByID

If required by the action, include a tokenID for the RPC call.

#### Solidity example

```javascript
req.add("tokenID", "1000645");
```

## triggerInput

**The following actions require a triggerInput**
- triggerSmartContract

If required by the action, include an input for the RPC call.

#### Solidity example

```javascript
req.addUint("triggerInput", 12345);
```

## funcSel

**The following actions require a funcSel**
- triggerSmartContract

If required by the action, include the function selector for the RPC call.

#### Solidity example

```javascript
req.add("funcSel", "setUint256(uint256)");
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
The examples below show how to use this Chainlink.
[block:code]
{
  "codes": [
    {
      "code": "function getTronAccountBalance(string _account)\n  public\n  onlyOwner\n  returns (bytes32 requestId) \n{\n  Chainlink.Request memory req = newRequest(UINT256_JOB_ID, this, this.fulfill.selector);\n  req.add(\"action\", \"getBalance\");\n  req.add(\"trxAddress\", _account);\n  req.add(\"copyPath\", \"balance\");\n  requestId = chainlinkRequest(req, 1 * LINK);\n}",
      "language": "javascript",
      "name": "Get Account Balance"
    },
    {
      "code": "function sendUint256ToTronContract(\n  string _contract,\n  string _funcSel,\n  uint256 _value\n)\n  public\n  onlyOwner\n  returns (bytes32 requestId) \n{\n  Chainlink.Request memory req = newRequest(BYTES32_JOB_ID, this, this.fulfill.selector);\n  req.add(\"action\", \"triggerSmartContract\");\n  req.add(\"trxAddress\", _contract);\n  req.add(\"funcSel\", _funcSel);\n  req.addUint(\"triggerInput\", _value);\n  req.add(\"copyPath\", \"transaction.txID\");\n  requestId = chainlinkRequest(req, 1 * LINK);\n}",
      "language": "javascript",
      "name": "Send Uint256"
    },
    {
      "code": "function sendRandNumToTronContract(\n  string _contract,\n  string _funcSel\n)\n  public\n  onlyOwner\n  returns (bytes32 requestId) \n{\n  Chainlink.Request memory req = newRequest(RANDOM_JOB_ID, this, this.fulfill.selector);\n  req.add(\"action\", \"triggerSmartContract\");\n  req.add(\"trxAddress\", _contract);\n  req.add(\"funcSel\", _funcSel);\n  requestId = chainlinkRequest(req, 1 * LINK);\n}",
      "language": "javascript",
      "name": "Random Number"
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
      "name": "Fulfill Uint256"
    },
    {
      "code": "bytes32 public data;\n\nfunction fulfill(bytes32 _requestId, bytes32 _data)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  data = _data;\n}",
      "language": "javascript",
      "name": "Fulfill Bytes32"
    }
  ]
}
[/block]