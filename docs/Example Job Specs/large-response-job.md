---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'Large Response Example Job Spec'
permalink: "docs/example-job-spec-large/"
---

This is an example v1 job spec for returning large responses in 1 Chainlink API Call. 

```json
{
  "name": "large-word",
  "initiators": [
    {
      "id": 9,
      "jobSpecId": "7a97ff84-93ec-406d-9062-1b2531f9251a",
      "type": "runlog",
      "params": {
        "address": "0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8"
      }
    }
  ],
  "tasks": [
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "httpget"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "jsonparse"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "resultcollect"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "ethtx",
      "confirmations": 1,
      "params": {
        "abiEncoding": [
          "bytes32",
          "bytes"
        ]
      }
    }
  ]
}
```

This is an example v2 job spec for returning large responses in 1 Chainlink API Call. 


```jpv2
type = "directrequest"
schemaVersion = 1
name = "Get > Bytes"
maxTaskDuration = "0s"
contractAddress = "YOUR_ORACLE_CONTRACT_ADDRESS"
minIncomingConfirmations = 0
observationSource = """
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    fetch        [type="http" method=GET url="$(decode_cbor.get)"]
    parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]
    encode_large [type="ethabiencode"
                abi="(bytes32 requestId, bytes _data)"
                data="{\\"requestId\\": $(decode_log.requestId), \\"_data\\": $(parse)}"
                ]
    encode_tx  [type="ethabiencode"
                abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\":   $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_large)}"
                ]

    submit_tx    [type="ethtx" to="YOUR_ORACLE_CONTRACT_ADDRESS" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse  -> encode_large -> encode_tx -> submit_tx
"""

```