---
layout: nodes.liquid
date: Last Modified
title: "Migrating to v2 Jobs"
permalink: "docs/jobs/migration-v1-v2/"
---
There have been two types of jobs supported by Chainlink nodes prior to [version 1.0.0](https://github.com/smartcontractkit/chainlink/blob/develop/docs/CHANGELOG.md). There are [v1 jobs](/docs/job-specifications/) (also known as JSON jobs) and [v2 jobs](/docs/jobs/) (also known as TOML jobs). 

The original v1 jobs **are now deprecated**, and developers should migrate to v2 jobs as soon as possible. v2 jobs are much more powerful, supporting advanced capabilities like running tasks in parallel.

## Comparison between v1 and v2 jobs

v1 jobs were intended for extremely targeted use cases, and as such, they opted for simplicity in the job spec over explictness.

v2 jobs were designed with an awareness of the rapid expansion of functionality supported by the Chainlink node, as well as the ever-increasing complexity of jobs. As such, they prefer explicitness.

### DAG dependencies and variables

v2 jobs require the author to specify dependencies using [DOT syntax](https://en.wikipedia.org/wiki/DOT_(graph_description_language)). If a task needs data produced by another task, this must be explicitly specified using DOT.

Additionally, to facilitate explicitness, v2 jobs require the author to specify inputs to tasks using `$(variable)` syntax.

For example, if an `http` task should feed data into a `jsonparse` task, it should be specified as such:

```jpv2dot
fetch [type=http method=get url="http://chain.link/price_feeds/ethusd"]

# This task consumes the output of the 'fetch' task in its 'data' parameter
parse [type=jsonparse path="data,result" data="$(fetch)"]

# This is the specification of the dependency
fetch -> parse
```

The output of each task is stored in the variable corresponding to that task's name (the portion of each task definition before the opening `[` bracket). In some cases, tasks return complex values (i.e., maps or arrays).  Using dot access syntax, you can access the elements of these values. For example:

```jpv2dot
// Assume that this task returns the following object:
//   { "ethusd": 123.45, "btcusd": 678.90 }
parse [type=jsonparse path="data" data="$(fetch)"]

// Now, we want to send the ETH/USD price to one bridge and the BTC/USD price to another:
submit_ethusd [type="bridge" name="ethusd" requestData=<{ "value": $(parse.ethusd) }>]
submit_btcusd [type="bridge" name="btcusd" requestData=<{ "value": $(parse.btcusd) }>]

parse -> submit_ethusd
parse -> submit_btcusd
```

### Quotes

Some tasks, like the `bridge` tasks above, require you to specify a JSON object. Because the keys of JSON objects must be enclosed in double quotes, you must use the alternative `<` angle bracket `>` quotes. Angle brackets also enable multi-line strings, which can be useful when a JSON object parameter is large:

```jpv2dot
submit_btcusd [type="bridge"
               name="btcusd"
               requestData=<{
                   "value": $(foo),
                   "price": $(bar),
                   "timestamp": $(baz)
               }>]
```


### Misc. notes

- Each job type provides a particular set of variables to its pipeline.  See the documentation for each job type to understand which variables are provided.
- Each task type provides a certain kind of output variable to other tasks that consume it.  See the documentation for each task type to understand their output types.

---

## Example Migrations

### Runlog with ETH ABI encoding

**v1 spec**

This spec relies on CBOR encoded on-chain values for the `httpget` URL and `jsonparse` path.

```js
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

Notes:
- In v1, the job ID is randomly generated at creation time. In v2 it can either be automatically generated or manually specified. 
- The `ethbytes32` task (any all of the other ABI encoding tasks) is now encapsulated within the `ethabiencode` task with much more flexibility. Please see [the docs for this task](/docs/jobs/task-types/eth-abi-encode/).



**Equivalent v2 spec:**


```jpv2
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47" # OPTIONAL - if left unspecified, a random value will be automatically generated
observationSource   = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type=cborparse data="$(decode_log.data)"]
    fetch        [type=http method=get url="$(decode_cbor.url)"]
    parse        [type=jsonparse path="$(decode_cbor.path)"]
    encode_data  [type=ethabiencode abi="(uint256 value)" data=<{ "value": $(parse) }>]
    encode_tx    [type=ethabiencode
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data=<{
                      "requestId": $(decode_log.requestId),
                      "payment": $(decode_log.payment),
                      "callbackAddress": $(decode_log.callbackAddr),
                      "callbackFunctionId": $(decode_log.callbackFunctionId),
                      "expiration": $(decode_log.cancelExpiration),
                      "data": $(encode_data)
                  }>]
    submit       [type=ethtx to="$(jobSpec.contractAddress)" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit
"""
```

### Simple fetch (runlog)

**v1 spec:**

```js
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

**v2 spec:**

```jpv2
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47"
observationSource   = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    fetch       [type=http method=get url="https://bitstamp.net/api/ticker/"]
    parse       [type=jsonparse data="$(fetch)" path="last"]
    multiply    [type=multiply input="$(parse)" times=100]
    encode_data [type=ethabiencode abi="(uint256 value)" data=<{ "value": $(multiply) }>]
    encode_tx   [type=ethabiencode
                 abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                 data=<{
                     "requestId": $(decode_log.requestId),
                     "payment": $(decode_log.payment),
                     "callbackAddress": $(decode_log.callbackAddr),
                     "callbackFunctionId": $(decode_log.callbackFunctionId),
                     "expiration": $(decode_log.cancelExpiration),
                     "data": $(encode_data)
                 }>]
    send_tx     [type=ethtx to="$(jobSpec.contractAddress)" data="$(encode_tx)"]

    decode_log -> fetch -> parse -> multiply -> encode_data -> encode_tx -> send_tx
"""
```

### Cron

**v1 spec:**

```js
{
    "initiators": [
        { 
            "type": "cron",
            "params": { "schedule": "CRON_TZ=UTC * */20 * * * *" }
        }
    ],
    "tasks": [
        {
            "type": "HttpGet",
            "params": { "get": "https://example.com/api" }
        },
        {
            "type": "JsonParse",
            "params": { "path": [ "data", "price" ] }
        },
        {
            "type": "Multiply",
            "params": { "times": 100 }
        },
        {
            "type": "EthUint256"
        },
        {
            "type": "EthTx"
        }
    ]
}
```

**v2 spec:**

```jpv2
type            = "cron"
schemaVersion   = 1
schedule        = "CRON_TZ=UTC * */20 * * * *"
externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
    fetch       [type=http method=GET url="https://example.com/api"]
    parse       [type=jsonparse data="$(fetch)" path="data,price"]
    multiply    [type=multiply input="$(parse)" times=100]
    encode_tx   [type=ethabiencode
                 abi="submit(uint256 value)"
                 data=<{ "value": $(multiply) }>]
    submit_tx   [type=ethtx to="0x859AAa51961284C94d970B47E82b8771942F1980" data="$(encode_tx)"]

    fetch -> parse -> multiply -> encode_tx -> submit_tx
"""
```

### Web (-> Webhook)

**v1 spec:**

```js
{
    "initiators": [{"type": "web"}],
    "tasks": [
        {"type": "multiply", "params": {"times": 100}},
        {"type": "custombridge"}
    ]
}
```

**v2 spec:**

```jpv2
type            = "webhook"
schemaVersion   = 1
externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
    multiply       [type=multiply input="$(jobRun.requestBody)" times=100]
    send_to_bridge [type=bridge name="custombridge" requestData="$(multiply)"]

    multiply -> send_to_bridge
"""
```
