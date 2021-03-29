---
layout: nodes.liquid
title: "eth.events Chainlink (Testnet)"
slug: "ethevents-chainlink-testnet"
hidden: true
date: Last Modified
---
This Chainlink has a dedicated connection to <a href="https://docs.eth.events/en/latest/index.html">eth.event's API</a>. This Chainlink will allow requesters to create queries to the API, and return the response.
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
Bytes32 JobID: 1e4cf658207a4708b9c0d104c31b8f86
Uint256 JobID: 59411b9de93742c8b9236f52ae492558
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
      "code": "pragma solidity ^0.4.24;\n\nimport \"chainlink/contracts/ChainlinkClient.sol\";\n\ncontract EthEventsChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
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
## Bytes32 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">eth.events</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethbytes32" target="_blank">EthBytes32</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>

## Uint256 Job
- <a href="https://docs.chain.link/docs/external-adapters" target="_blank">eth.events</a>
- <a href="https://docs.chain.link/docs/adapters#section-copy" target="_blank">Copy</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethuint256" target="_blank">EthUint256</a>
- <a href="https://docs.chain.link/docs/adapters#section-ethtx" target="_blank">EthTx</a>
[block:api-header]
{
  "title": "Request Parameters"
}
[/block]
## query

**Required** 

The query for the adapter to use. Available options are:

- `transaction`: Get information on a specific transaction
- `blockhash`: Get information about a block by its block hash
- `block`: Get information about a block by its block number
- `log`: Get logs from a given transaction

#### Solidity example

```javascript
req.add("query", "transaction");
```

## id

**Required**

The unique identifier for the query. Can be a transaction hash, block number, or block hash.

#### Solidity example

```javascript
req.add("id", "0xdebb061255310e8c109379a2556fec666789c663225f20d16e8e1332f395b3c5");
```

The following URL is useful for the `blockchain` and `network` parameters:
<a href="https://docs.eth.events/en/latest/api/endpoints/index.html" target="_blank">https://docs.eth.events/en/latest/api/endpoints/index.html</a>. These parameters will allow you to select different supported blockchains and networks (like Ethereum Classic's Morden, or Ethereum's Ropsten networks).

## blockchain

The chain to use.

#### Solidity example

```javascript
req.add("blockchain", "ethereum");
```

## network

The network to use.

#### Solidity example

```javascript
req.add("network", "mainnet");
```

## copyPath

**Required**

The path of the desired data field to return to the smart contract.

Below are examples of the payload from different queries:
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"took\": 18,\n\t\"timed_out\": false,\n\t\"_shards\": {\n\t\t\"total\": 40,\n\t\t\"successful\": 40,\n\t\t\"skipped\": 0,\n\t\t\"failed\": 0\n\t},\n\t\"hits\": {\n\t\t\"total\": 1,\n\t\t\"max_score\": 0,\n\t\t\"hits\": [\n\t\t\t{\n\t\t\t\t\"_index\": \"0006-ethereum-ethereum-mainnet-tx\",\n\t\t\t\t\"_type\": \"tx\",\n\t\t\t\t\"_id\": \"0xdebb061255310e8c109379a2556fec666789c663225f20d16e8e1332f395b3c5\",\n\t\t\t\t\"_score\": 0,\n\t\t\t\t\"_source\": {\n\t\t\t\t\t\"blockHash\": \"0x3b36d41b5478cdd30b133205de0adb72d21092dabfc87f2a9d835b5a53ec0f7e\",\n\t\t\t\t\t\"blockNumber\": {\n\t\t\t\t\t\t\"raw\": \"8317172\",\n\t\t\t\t\t\t\"num\": 8317172\n\t\t\t\t\t},\n\t\t\t\t\t\"cumulativeGasUsed\": {\n\t\t\t\t\t\t\"raw\": \"6658336\",\n\t\t\t\t\t\t\"num\": 6658336\n\t\t\t\t\t},\n\t\t\t\t\t\"from\": \"0xA587fE3482B0d167970dc1e00D0CFff3258fbF16\",\n\t\t\t\t\t\"gas\": {\n\t\t\t\t\t\t\"raw\": \"52048\",\n\t\t\t\t\t\t\"num\": 52048\n\t\t\t\t\t},\n\t\t\t\t\t\"gasPrice\": {\n\t\t\t\t\t\t\"raw\": \"1000000000\",\n\t\t\t\t\t\t\"num\": 1000000000\n\t\t\t\t\t},\n\t\t\t\t\t\"gasUsed\": {\n\t\t\t\t\t\t\"raw\": \"52048\",\n\t\t\t\t\t\t\"num\": 52048\n\t\t\t\t\t},\n\t\t\t\t\t\"hash\": \"0xdebb061255310e8c109379a2556fec666789c663225f20d16e8e1332f395b3c5\",\n\t\t\t\t\t\"input\": \"0xa9059cbb000000000000000000000000833ffad0f7891f3fbcd98ac1b62f94d48815095400000000000000000000000000000000000000000000001b1ae4d6e2ef500000\",\n\t\t\t\t\t\"logsBloom\": \"0x00000000000000000000000000000004000000000000000000000000000000000000000000000100000000000000000000000000000000000000020000000000000000000000000200000008000000000000000001000000000000000000000000002000000000000000000000000000000002000000000000000010000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000400000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\",\n\t\t\t\t\t\"nonce\": {\n\t\t\t\t\t\t\"raw\": \"4020\",\n\t\t\t\t\t\t\"num\": 4020\n\t\t\t\t\t},\n\t\t\t\t\t\"r\": \"0xda0ded98a2e951d84d2cd5f61ba84b9eb7e99846a70215cf250c0519075bc9ac\",\n\t\t\t\t\t\"s\": \"0x1cf284db330016a0a74433bdf2146ea2597fc783a0a46aaf20a59aff7bc7e948\",\n\t\t\t\t\t\"status\": true,\n\t\t\t\t\t\"timestamp\": 1565364196,\n\t\t\t\t\t\"to\": \"0x432555E5c898F83fC5F00dF631BD9c2801FeA289\",\n\t\t\t\t\t\"publicKey\": \"0x99d5e9e3dfe0a4c02788f2e4e5b5836e6eb687b154eb6c75c5a563e745ffcaf9679866587eb0cb5d4634b1d7a5bcf67b18da52eec157e88b3bd6a59ac6b73d5f\",\n\t\t\t\t\t\"transactionIndex\": {\n\t\t\t\t\t\t\"raw\": \"44\",\n\t\t\t\t\t\t\"num\": 44\n\t\t\t\t\t},\n\t\t\t\t\t\"standardV\": \"0x1\",\n\t\t\t\t\t\"v\": \"0x26\",\n\t\t\t\t\t\"value\": {\n\t\t\t\t\t\t\"raw\": \"0\",\n\t\t\t\t\t\t\"padded\": \"0x0000000000000000000000000000000000000000000000000000000000000000\",\n\t\t\t\t\t\t\"eth\": 0,\n\t\t\t\t\t\t\"num\": 0\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t]\n\t}\n}",
      "language": "json",
      "name": "transaction"
    },
    {
      "code": "{\n\t\"_index\": \"0006-ethereum-ethereum-mainnet-block\",\n\t\"_type\": \"block\",\n\t\"_id\": \"0x3b36d41b5478cdd30b133205de0adb72d21092dabfc87f2a9d835b5a53ec0f7e\",\n\t\"_version\": 2,\n\t\"found\": true,\n\t\"_source\": {\n\t\t\"author\": \"0x04668ec2f57cc15c381b461b9fedab5d451c8f7f\",\n\t\t\"difficulty\": {\n\t\t\t\"raw\": \"2293123916068124\",\n\t\t\t\"padded\": \"0x000000000000000000000000000000000000000000000000000825958471751c\"\n\t\t},\n\t\t\"extraData\": \"0x7a68697a68755f303037\",\n\t\t\"gasLimit\": {\n\t\t\t\"raw\": \"8000014\",\n\t\t\t\"num\": 8000014\n\t\t},\n\t\t\"gasUsed\": {\n\t\t\t\"raw\": \"6658336\",\n\t\t\t\"num\": 6658336\n\t\t},\n\t\t\"hash\": \"0x3b36d41b5478cdd30b133205de0adb72d21092dabfc87f2a9d835b5a53ec0f7e\",\n\t\t\"logsBloom\": \"0x0000101090402008000002201000008480c04010800000000a00c0081088090800001000000001001008000000020109008010058442001100c10240980000000001000000900522b084020ec0004010000000001100000004214040004430004120260204004020000000000004c01910c0122020800c0000000210110000a11002100100041008820004031041601201000814180002000100100401100018001000142000010008400080000081080040440000000020020044005800000000000042040000008400000004000011200001018020000020502000120210020040020000000000400044822028008400084008001002000060200088004400\",\n\t\t\"miner\": \"0x04668Ec2f57cC15c381b461B9fEDaB5D451c8F7F\",\n\t\t\"mixHash\": \"0x5052289e85ae7843e72eda82ad0043b61655605a8df2ca519382fea2b038668d\",\n\t\t\"nonce\": \"0x24ef6138097bcad7\",\n\t\t\"number\": {\n\t\t\t\"raw\": \"8317172\",\n\t\t\t\"num\": 8317172\n\t\t},\n\t\t\"parentHash\": \"0xd47b96033730af5ae408a32649b35fa30c674b0d51e7a7988f4661186c01e38c\",\n\t\t\"receiptsRoot\": \"0x261a35aa3f1368ee673a55c14d8a5abab48977c756744306fd002e1f14e8a7a5\",\n\t\t\"sha3Uncles\": \"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347\",\n\t\t\"size\": {\n\t\t\t\"raw\": \"10165\",\n\t\t\t\"num\": 10165\n\t\t},\n\t\t\"stateRoot\": \"0x1664e6d64ed4ec19a90724f76d1f61bcdd6e1bc160d80334fe3dabe0733db5ff\",\n\t\t\"timestamp\": 1565364196,\n\t\t\"totalDifficulty\": {\n\t\t\t\"raw\": \"11387155478183675094986\",\n\t\t\t\"padded\": \"0x0000000000000000000000000000000000000000000002694c8707ac3152e7ca\"\n\t\t},\n\t\t\"transactionsRoot\": \"0xe0d831e4929102719599ac2ef487285f0f62ee6c0c24c9840d08427575ab3ad9\",\n\t\t\"uncles\": [],\n\t\t\"sealFields\": [\n\t\t\t\"0xa05052289e85ae7843e72eda82ad0043b61655605a8df2ca519382fea2b038668d\",\n\t\t\t\"0x8824ef6138097bcad7\"\n\t\t]\n\t}\n}",
      "language": "json",
      "name": "blockhash"
    },
    {
      "code": "{\n\t\"took\": 3,\n\t\"timed_out\": false,\n\t\"_shards\": {\n\t\t\"total\": 40,\n\t\t\"successful\": 40,\n\t\t\"skipped\": 0,\n\t\t\"failed\": 0\n\t},\n\t\"hits\": {\n\t\t\"total\": 1,\n\t\t\"max_score\": 0,\n\t\t\"hits\": [\n\t\t\t{\n\t\t\t\t\"_index\": \"0006-ethereum-ethereum-mainnet-block\",\n\t\t\t\t\"_type\": \"block\",\n\t\t\t\t\"_id\": \"0x3b36d41b5478cdd30b133205de0adb72d21092dabfc87f2a9d835b5a53ec0f7e\",\n\t\t\t\t\"_score\": 0,\n\t\t\t\t\"_source\": {\n\t\t\t\t\t\"number\": {\n\t\t\t\t\t\t\"num\": 8317172\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t]\n\t}\n}",
      "language": "json",
      "name": "block"
    },
    {
      "code": "{\n\t\"took\": 34,\n\t\"timed_out\": false,\n\t\"_shards\": {\n\t\t\"total\": 40,\n\t\t\"successful\": 40,\n\t\t\"skipped\": 0,\n\t\t\"failed\": 0\n\t},\n\t\"hits\": {\n\t\t\"total\": 1,\n\t\t\"max_score\": 0,\n\t\t\"hits\": [\n\t\t\t{\n\t\t\t\t\"_index\": \"0004-ethereum-ethereum-mainnet-log\",\n\t\t\t\t\"_type\": \"log\",\n\t\t\t\t\"_id\": \"0xcbba10a57869a52bbab51452a9d322afac3511eb2f4ee961c2d147242e2655e0\",\n\t\t\t\t\"_score\": 0,\n\t\t\t\t\"_source\": {\n\t\t\t\t\t\"address\": \"0x432555E5c898F83fC5F00dF631BD9c2801FeA289\",\n\t\t\t\t\t\"blockHash\": \"0x3b36d41b5478cdd30b133205de0adb72d21092dabfc87f2a9d835b5a53ec0f7e\",\n\t\t\t\t\t\"blockNumber\": {\n\t\t\t\t\t\t\"raw\": \"8317172\",\n\t\t\t\t\t\t\"num\": 8317172\n\t\t\t\t\t},\n\t\t\t\t\t\"data\": \"0x00000000000000000000000000000000000000000000001b1ae4d6e2ef500000\",\n\t\t\t\t\t\"logIndex\": {\n\t\t\t\t\t\t\"raw\": \"33\",\n\t\t\t\t\t\t\"num\": 33\n\t\t\t\t\t},\n\t\t\t\t\t\"removed\": false,\n\t\t\t\t\t\"type\": \"mined\",\n\t\t\t\t\t\"id\": \"log_16a5dabd\",\n\t\t\t\t\t\"timestamp\": 1565364196,\n\t\t\t\t\t\"topics\": [\n\t\t\t\t\t\t\"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef\",\n\t\t\t\t\t\t\"0x000000000000000000000000a587fe3482b0d167970dc1e00d0cfff3258fbf16\",\n\t\t\t\t\t\t\"0x000000000000000000000000833ffad0f7891f3fbcd98ac1b62f94d488150954\"\n\t\t\t\t\t],\n\t\t\t\t\t\"transactionHash\": \"0xdebb061255310e8c109379a2556fec666789c663225f20d16e8e1332f395b3c5\",\n\t\t\t\t\t\"transactionIndex\": {\n\t\t\t\t\t\t\"raw\": \"44\",\n\t\t\t\t\t\t\"num\": 44\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t]\n\t}\n}",
      "language": "json",
      "name": "log"
    }
  ]
}
[/block]
#### Solidity example

```javascript
req.add("copyPath", "hits.hits.0.blocknumber.num");
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
      "code": "function getConfirmations(address _oracle, bytes32 _jobId, string _txid)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.checkTxConfirmations.selector);\n  req.add(\"query\", \"transaction\");\n  req.add(\"id\", _txid);\n  req.add(\"copyPath\", \"hits.hits.0._source.blockNumber.num\");\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "getConfirmations"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 constant public REQUIRED_CONFIRMATIONS = 30;\n\nfunction checkTxConfirmations(bytes32 _requestId, uint256 _blockNum)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  if (_blockNum < block.number - REQUIRED_CONFIRMATIONS) {\n    // do something\n  }\n}",
      "language": "javascript",
      "name": "checkTxConfirmations"
    }
  ]
}
[/block]