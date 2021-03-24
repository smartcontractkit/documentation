---
title: "Streamr Chainlink (Testnet)"
slug: "streamr-chainlink-testnet"
hidden: true
createdAt: "2019-03-26T19:19:42.453Z"
updatedAt: "2019-11-01T17:42:36.658Z"
---
Chainlink has a dedicated connection to <a href="https://www.streamr.com" target="_blank">Streamr's API</a>. This Chainlink will retrieve the latest entry for a given stream to your smart contract.
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
Bytes32 JobID: 1216278fa01449f99ad63bf1a813741f
Int256 JobID: d44b63ca23684b67aab07f1fce4753ec
Uint256 JobID: 8c8c6eaf33fc4635a4cf095c40a91d67
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract StreamrChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
Bytes32 JobID:
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Streamr</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>

EthInt256 JobID:
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Streamr</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethint256" target="_blank">EthInt256</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>

EthUint256 JobID:
- <a href="https://docs.chain.link/v1.0/docs/external-adapters" target="_blank">Streamr</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-multiply" target="_blank">Multiply</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/v1.0/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## stream

**Required**

The ID of the stream to retrieve the data.

#### Solidity example

```javascript
req.add("stream", "kXSC3EtJSw2qECh9EBSeag");
```

## partition

The partition of the stream.

*Defaults to 0 if unset*

#### Solidity example

```javascript
req.addInt("partition", 1);
```

## copyPath

**Required**

The path of the desired data field to return to the smart contract.

#### Solidity example

```javascript
req.add("copyPath", "renewables");
```
[block:api-header]
{
  "title": "Chainlink Examples"
}
[/block]
The example below can be used to send a Chainlink request for a given stream that returns a uint256 data type.
[block:code]
{
  "codes": [
    {
      "code": "function getData\n(\n  address _oracle,\n  bytes32 _jobId,\n  string _stream,\n  string _path\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);\n  req.add(\"stream\", _stream);\n  req.add(\"copyPath\", _path);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getData"
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