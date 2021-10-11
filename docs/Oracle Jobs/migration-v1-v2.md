---
layout: nodes.liquid
date: Last Modified
title: "Migrating to v2 Jobs"
permalink: "docs/jobs/migration-v1-v2/"
---

Chainlink nodes support two versions of jobs:

- v1 jobs in JSON format
- v2 jobs in TOML format

## Comparison between v1 and v2 jobs

v1 jobs were intended for extremely targeted use cases, so they opted for simplicity in the job spec over explicitness.

The v2 Job Specs support expanding functionality in Chainlink nodes and prefer explicitness, so they are are much more powerful and support advanced capabilities like running tasks in parallel. This change provides the following benefits to node operators:

- Support increased job complexity
- Better performance
- Easier scaling
- Ability to run more off-chain computing
- Reliability
- Easier support
- Improved security

### DAG dependencies and variables

v2 jobs require the author to specify dependencies using [DOT syntax](https://en.wikipedia.org/wiki/DOT_(graph_description_language)). If a task needs data produced by another task, this must be specified using DOT.

To facilitate explicitness, v2 jobs require the author to specify inputs to tasks using `$(variable)` syntax. For example, if an `http` task feeds data into a `jsonparse` task, it must be specified like the following example:

```toml
fetch [type=http method=GET url="http://chain.link/price_feeds/ethusd"]

// This task consumes the output of the 'fetch' task in its 'data' parameter
parse [type=jsonparse path="data,result" data="$(fetch)"]

// This is the specification of the dependency
fetch -> parse
```

Task names must be defined before their opening `[` bracket. In this example, the name of the task is `fetch`. The output of each task is stored in the variable corresponding to the name of the task. In some cases, tasks return complex values like maps or arrays. By using dot access syntax, you can access the elements of these values. For example:

```toml
// Assume that this task returns the following object:
//  { "ethusd": 123.45, "btcusd": 678.90 }
parse [type=jsonparse path="data" data="$(fetch)"]

// Now, we want to send the ETH/USD price to one bridge and the BTC/USD price to another:
submit_ethusd [type="bridge" name="ethusd" requestData=<{ "value": $(parse.ethusd) }>]
submit_btcusd [type="bridge" name="btcusd" requestData=<{ "value": $(parse.btcusd) }>]

parse -> submit_ethusd
parse -> submit_btcusd
```

### Quotes

Some tasks, like the `bridge` tasks above, require you to specify a JSON object. Because the keys of JSON objects must be enclosed in double quotes, you must use the alternative `<` angle bracket `>` quotes. Angle brackets also enable multi-line strings, which can be useful when a JSON object parameter is large:

```toml
submit_btcusd [type="bridge"
               name="btcusd"
               requestData=<{"value": $(foo), "price": $(bar), "timestamp": $(baz)}>
               ]
```


### Misc. notes

- Each job type provides a particular set of variables to its pipeline. See the documentation for each job type to understand which variables are provided.
- Each task type provides a certain kind of output variable to other tasks that consume it. See the documentation for each task type to understand their output types.

---

## Example Migrations

### Runlog with ETH ABI encoding

**v1 spec**

This spec relies on CBOR-encoded on-chain values for the `httpget` URL and `jsonparse` path.

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
- In v1, the job ID is randomly generated at creation time. In v2 jobs, the job ID can be manually specified or the Chainlink node will automatically generated it.
- In v2, the `ethbytes32` task and all of the other ABI encoding tasks are now encapsulated in the `ethabiencode` task with much more flexibility. See the [ETH ABI Encode task](/docs/jobs/task-types/eth-abi-encode/) page to learn more.

**Equivalent v2 spec:**

```toml
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
# Optional externalJobID: Automatically generated if unspecified
# externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47"
observationSource   = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type=cborparse data="$(decode_log.data)"]
    fetch        [type=http method=GET url="$(decode_cbor.url)"]
    parse        [type=jsonparse path="$(decode_cbor.path)" data="$(fetch)"]
    encode_data  [type=ethabiencode abi="(uint256 value)" data=<{ "value": $(parse) }>]
    encode_tx    [type=ethabiencode
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data=<{"requestId": $(decode_log.requestId), "payment": $(decode_log.payment), "callbackAddress": $(decode_log.callbackAddr), "callbackFunctionId": $(decode_log.callbackFunctionId), "expiration": $(decode_log.cancelExpiration), "data": $(encode_data)}>
                  ]
    submit_tx    [type=ethtx to="0x613a38AC1659769640aaE063C651F48E0250454C" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
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

**Equivalent v2 spec:**

```toml
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "0x613a38AC1659769640aaE063C651F48E0250454C"
# Optional externalJobID: Automatically generated if unspecified
# externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47"
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
                 data=<{"requestId": $(decode_log.requestId), "payment": $(decode_log.payment), "callbackAddress": $(decode_log.callbackAddr), "callbackFunctionId": $(decode_log.callbackFunctionId), "expiration": $(decode_log.cancelExpiration), "data": $(encode_data)}>
                 ]
    submit_tx [type=ethtx to="0x613a38AC1659769640aaE063C651F48E0250454C" data="$(encode_tx)"]

    decode_log -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx
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

**Equivalent v2 spec:**

```toml
type            = "cron"
schemaVersion   = 1
schedule        = "CRON_TZ=UTC * */20 * * * *"
# Optional externalJobID: Automatically generated if unspecified
# externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
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

**Equivalent v2 spec:**

```toml
type            = "webhook"
schemaVersion   = 1
# Optional externalJobID: Automatically generated if unspecified
# externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
    multiply       [type=multiply input="$(jobRun.requestBody)" times=100]
    send_to_bridge [type=bridge name="custombridge" requestData="$(multiply)"]

    multiply -> send_to_bridge
"""
```
