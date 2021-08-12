---
layout: nodes.liquid
date: Last Modified
title: "Direct Request Jobs"
permalink: "docs/jobs/types/direct-request/"
---

Executes a job upon receipt of an explicit request made by a user. The request is detected via a log emitted by an Oracle or Operator contract. This is similar to the legacy ethlog/runlog style of jobs.

**Spec format**

```jpv2
type                = "directrequest"
schemaVersion       = 1
name                = "example eth request event spec"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F02" # optional
observationSource   = """
    ds          [type=http method=GET url="http://example.com"]
    ds_parse    [type=jsonparse path="USD"]
    ds_multiply [type=multiply times=100]

    ds -> ds_parse -> ds_multiply
"""
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `contractAddress`: the Oracle or Operator contract to monitor for requests.

**Job type specific pipeline variables**

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.
- `$(jobRun.logBlockHash)`: the block hash in which the initiating log was received.
- `$(jobRun.logBlockNumber)`: the block number in which the initiating log was received.
- `$(jobRun.logTxHash)`: the transaction hash that generated the initiating log.
- `$(jobRun.logAddress)`: the address of the contract to which the initiating transaction was sent.
- `$(jobRun.logTopics)`: the log's topics (`indexed` fields).
- `$(jobRun.logData)`: the log's data (non-`indexed` fields).

**Example**

First, let's assume that a user makes a request to the oracle using the following contract:

```sol
contract MyClient is ChainlinkClient {
    function doRequest() public {
        Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfill.selector);
        req.add("fetchURL", "https://datafeed.xyz/eth");
        req.add("jsonPath", "data,result");
    }

    function fulfill(bytes32 requestID, uint256 answer) public {
        // ...
    }
}
```

A direct request job using the following pipeline could be used to fulfill this request:

```dot
// First, we parse the request log and the CBOR payload inside of it
decode_log  [type="ethabidecodelog"
             data="$(jobRun.logData)"
             topics="$(jobRun.logTopics)"
             abi="SomeContractEvent(bytes32 requestID, bytes cborPayload)"]

decode_cbor [type="cborparse"
             data="$(decode_log.cborPayload)"]

// Then, we use the decoded request parameters to make an HTTP fetch
fetch [type="http" url="$(decode_cbor.fetchURL)" method="get"]
parse [type="jsonparse" path="$(decode_cbor.jsonPath)" data="$(fetch)"]

// Finally, we send a response on-chain
encode_response [type=ethabiencode
                 abi="(bytes32 requestId, uint256 data)"
                 data=<{ "requestId": $(decode_log.requestId), "data": $(parse) }>]
                 
encode_tx       [type=ethabiencode
                 abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                 data=<{
                     "requestId": $(decode_log.requestId),
                     "payment": $(decode_log.payment),
                     "callbackAddress": $(decode_log.callbackAddr),
                     "callbackFunctionId": $(decode_log.callbackFunctionId),
                     "expiration": $(decode_log.cancelExpiration),
                     "data": $(encode_mwr)
                  }>]

submit_tx  [type=ethtx to="0x613a38AC1659769640aaE063C651F48E0250454C" data="$(encode_tx)"]
```
