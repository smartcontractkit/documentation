---
layout: nodes.liquid
date: Last Modified
title: "Initiators"
permalink: "docs/initiators/"
whatsnext: {"Introduction to External Initiators":"/docs/external-initiators-introduction/", "Node Operator Email List":"https://link.us18.list-manage.com/subscribe?u=8969e6baa6d67e10213eff25b&id=e70d98a987/"}
hidden: false
---
[block:api-header]
{
  "title": "Cron"
}
[/block]
The `Cron` initiator is a simple way to schedule recurring job runs, using <a href="https://en.wikipedia.org/wiki/Cron#Overview" target="_blank">standard cron syntax</a>.

### Cron Parameters

`Cron` takes one parameter, `schedule` which is a cron like schedule string. The `Cron`‘s  `schedule` is follows  <a href="https://en.wikipedia.org/wiki/Cron#Overview" target="_blank">standard cron syntax</a> but prepends an timezone to be specified with `CRON_TZ`, with an optional field for seconds. For example: `CRON_TZ=UTC */10 * * * *` would run every 10 minutes with the timezone set to UTC. `CRON_TZ=UTC */30 * * * * *`  would run every 30 seconds.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"cron\",\n        \"params\": {\n            \"schedule\": \"CRON_TZ=UTC */10 * * *\"\n        }\n    }\n]",
      "language": "json",
      "name": "cron"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "EthLog"
}
[/block]
The `EthLog` initiator creates an Ethereum log filter, and when any log comes in it is passed on as the input to the a new job run.

### EthLog Parameters

`EthLog` takes the same parameters as an <a href="https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB" target="_blank">Ethereum log filter</a>.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"ethlog\",\n        \"address\": \"0xCAFE000000000000000000000000000000000001\"\n    }\n]",
      "language": "json",
      "name": "ethlog"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "External"
}
[/block]
The external initiator works like the [web](../initiators/#web) initiator, but is given its own credentials along with a name and URL.

You can create an external initiator by running the `chainlink initiators create NAME URL` command. This will give you an access key and secret pair, which will be used for incoming requests to invoke a job with this external initiator, and an outgoing token and secret pair which optionally can be used to help the Chainlink node authenticate with external services. Any incoming requests must provide the access key and secret in order to invoke the job run.

### External Parameters

`external` requires a `name` to be set to handle authentication in order to invoke the job run.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"external\",\n        \"params\": {\n            \"name\": \"myexternalservice\"\n        }\n    }\n]",
      "language": "json",
      "name": "external"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "FluxMonitor"
}
[/block]
The `fluxmonitor` initiator performs 3 functions:

1. Aggregating off-chain sources into one median
2. Using that aggregated result to determine if an on-chain update needs to be made (as defined by a threshold)
3. Updates on-chain values based on a heartbeat

The `fluxmonitor` is the current  initiator used by the [Chainlink Price Feeds](https://feeds.chain.link/)

### FluxMonitor Parameters

- `address`: The smart contract address to push updates to.
- `feeds`: A list of `bridges`, also known as external adapters. 
- `requestData`: The data to send in the call to the bridge/external adapter.
- `threshold`: Threshold percentage to trigger an update on. 
- `absoluteThreshold`: To trigger a new on-chain report, the absolute difference in the feed value must change by at least this value. If 0, make no change.
- `precision`: Number of decimals
- `pollTimer`: Takes a `period` object with how often to poll the off-chain resources. 
- `idleTimer`: The main heartbeat. If no change to the off-chain resource, trigger an update every `idleTimer` interval. 

### Example
[block:code]
{
  "codes": [
    {
      "code": "{\n      \"type\": \"fluxmonitor\",\n      \"params\": {\n        \"address\": \"0x7777a77dea5ee3c093e21d77660b5579c21f770b\",\n        \"requestData\": {\n          \"data\": {\n            \"from\": \"DAI\",\n            \"to\": \"ETH\"\n          }\n        },\n        \"feeds\": [\n          {\n            \"bridge\": \"cryptocompare_cl_ea\"\n          },\n          {\n            \"bridge\": \"amberdata_cl_ea\"\n          },\n          {\n            \"bridge\": \"coinapi_cl_ea\"\n          }\n        ],\n        \"threshold\": 1,\n        \"absoluteThreshold\": 0,\n        \"precision\": 18,\n        \"pollTimer\": {\n          \"period\": \"1m0s\"\n        },\n        \"idleTimer\": {\n          \"duration\": \"24h0m0s\"\n        }\n      }\n    }",
      "language": "json"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "RunAt"
}
[/block]
The `RunAt` initiator triggers a one off job run at the time specified.

### RunAt Parameters

`RunAt` takes one parameter, `time`. `time` accepts a ISO8601 string or a Unix timestamp.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"runat\",\n        \"params\": {\n            \"time\": \"2019-09-20T12:20:00.000Z\"\n        }\n    }\n]",
      "language": "json",
      "name": "runat"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "RunLog"
}
[/block]
The `RunLog` initiator is the easiest initiator to use when integrating Chainlink with on-chain contracts. It works similarly to EthLog, but adds some helpful glue in to stitch together the off-chain job with the on-chain contracts.

When a `RunLog` job is created, Chainlink begins watching the blockchain for any log events that include that job’s ID. If any of the events that come back match the log event signature of the Chainlink oracle contract, then the Chainlink node parses the data out of that log and passes it into a new log run.

A new run created by a `RunLog` is automatically given the parameters needed for an `EthTx` task to report the run back to the contract that originally created the event log.

### RunLog Parameters

`RunLog` initiators take an optional `address` parameter and `requesters` parameter. The `address` parameter is a single Ethereum address and the `requesters` parameter is an array of Ethereum addresses.  By adding the `address` parameter, you make the event filter of the RunLog initiator more restrictive, only listening for events from that address, instead of any address. By adding the `requesters` parameter, you only allow requests to come from an address within the array.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"runlog\",\n        \"params\": {\n            \"address\": \"0xCAFE000000000000000000000000000000000001\",\n            \"requesters\": [\n                \"0xCAFE000000000000000000000000000000000002\",\n                \"0xCAFE000000000000000000000000000000000003\"\n            ]\n        }\n    }\n]",
      "language": "json",
      "name": "runlog"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Web"
}
[/block]
The `Web` initiator enables jobs to be triggered via web requests, specifically `POST`s to `/v2/specs/:jobID/runs`. Requests coming in to create new job runs must be authenticated by cookie.

NOTE: For convenience, there is a "Run" button in the operator web UI for the job which will trigger a job run.

### Web Parameters

`Web` currently takes no parameters.

### Example
[block:code]
{
  "codes": [
    {
      "code": "\"initiators\": [\n    {\n        \"type\": \"web\"\n    }\n]",
      "language": "json",
      "name": "web"
    }
  ]
}
[/block]