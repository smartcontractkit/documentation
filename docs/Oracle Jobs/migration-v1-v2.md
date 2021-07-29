---
layout: nodes.liquid
date: Last Modified
title: "Jobs"
permalink: "docs/jobs/"
whatsnext: {"Tasks":"/docs/tasks/"}
---

## Comparison between V1 and V2 jobs

V1 jobs implicitly allowed on-chain values to be passed directly into adapters. This can result in a simple looking job that hides the complexity of what is really happening.

Hidden complexity can lead to bugs, surprising behaviour and security vulnerabilities. For this reason, the decision was made to favor explicitness in V2.

## Example Migrations

### EthBytes32 (GET) - on-chain encoded params

#### V1 spec:

This spec relies on CBOR encoded on-chain values for the httpget URL and jsonparse path.

```json
{ 
  "name": "Get > Bytes32",
  "initiators": [
    {
      "type": "runlog",
      "params": {
        "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
      }
    }
  ],
  "tasks": [
    {
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "ethbytes32"
    },
    {
      "type": "ethtx"
    }
  ]
}
```

Note that in V1, the job ID is randomly generated at creation time. In V2 it can either be automatically generated, or manually specified. 

#### V2 spec:


```toml
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47" # OPTIONAL - if left unspecified, a random value will be automatically generated
observationSource   = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"];
    decode_cbor  [type=cborparse data="$(decode_log.data)"];
    fetch [type=http method=get url="$(decode_cbor.url)"];
    parse [type=jsonparse path="$(decode_cbor.path)"];
    encode_data [type=ethabiencode abi="(uint256 value)" data="{\"value\": $(parse)}"];
    encode_tx [type=ethabiencode
            abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
            data="{\"requestId\": $(decode_log.requestId), \"payment\": $(decode_log.payment), \"callbackAddress\": $(decode_log.callbackAddr), \"callbackFunctionId\": $(decode_log.callbackFunctionId), \"expiration\": $(decode_log.cancelExpiration), \"data\": $(encode_data)}"
    submit [type=ethtx to="$(jobSpec.contractAddress)" data="$(encode_tx)"];
    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit;
"""
```

### Simple fetch (runlog)

#### V1 spec

```json
{
  "initiators": [
    {
      "type": "RunLog",
      "params": { "address": "0x51DE85B0cD5B3684865ECfEedfBAF12777cd0Ff8" }
    }
  ],
  "tasks": [
    {
      "type": "HTTPGet",
      "confirmations": 0,
      "params": { "get": "https://bitstamp.net/api/ticker/" }
    },
    {
      "type": "JSONParse",
      "params": { "path": [ "last" ] }
    },
    {
      "type": "Multiply",
      "params": { "times": 100 }
    },
    { "type": "EthUint256" },
    { "type": "EthTx" }
  ],
  "startAt": "2020-02-09T15:13:03Z",
  "endAt": null,
  "minPayment": "1000000000000000000"
}
```

#### V2 spec

```toml
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47" # OPTIONAL - if left unspecified, a random value will be automatically generated
observationSource   = """
    ds       [type=http method=get url="https://bitstamp.net/api/ticker/"];
    parse    [type=jsonparse path="last"];
    multiply [type=multiply times=100];
    encode_data [type=ethabiencode abi="(uint256 value)" data="{\"value\": $(multiply)}"];
    encode_tx [type=ethabiencode
            abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
            data="{\"requestId\": $(decode_log.requestId), \"payment\": $(decode_log.payment), \"callbackAddress\": $(decode_log.callbackAddr), \"callbackFunctionId\": $(decode_log.callbackFunctionId), \"expiration\": $(decode_log.cancelExpiration), \"data\": $(encode_data)}"
    submit [type=ethtx to="$(jobSpec.contractAddress)" data="$(encode_tx)"];

    ds -> parse -> multiply -> encode_data -> encode_tx -> submit;
"""
```
