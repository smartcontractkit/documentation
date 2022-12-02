---
layout: nodes.liquid
section: legacy
date: Last Modified
title: "Job Specifications [v1]"
permalink: "docs/job-specifications/"
whatsnext: {"Core Adapters":"/docs/core-adapters/", "Initiators":"/docs/initiators/"}
---

# REMOVED

> ❗️ v1 Jobs are removed
> The v1 job spec or JSON spec removed for Chainlink nodes running version 1.0.0 and later. If you are still running this type of job, migrate them to v2 specs.
>
> See the [v2 jobs migration page](/docs/jobs/migration-v1-v2) to learn how to migrate to v2 jobs.

## What is a job?

Job specifications, or specs, contain the sequential tasks that the node must perform to produce a final result. Chainlink jobs are divided into 2 segments.

- [Initiators](/docs/initiators/)
- [Adapters](/docs/core-adapters/) (also known as tasks)

A job must contain at least one of each.

**Initiators** define *when* a job will run.
**Adapters** define *how* a job will run.

Specs are defined using standard JSON so that they are human-readable and can be easily parsed by the Chainlink node.

Here is an example of a spec:

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

This example shows the two main components of a spec: initiators and tasks. [Initiators](../glossary/#initiator) determine how the spec will start. [Tasks](../glossary/#task-spec) are the individual steps that the Chainlink node follows to process data in order to produce a result.

In the example above, we see that the only initiator is a RunLog. This means that the spec can only be started when a specific event log is emitted from a specified address. The specified address will be the address of the oracle contract on Ropsten, which manages requests from contracts and responses from Chainlink nodes.

The five tasks (referred to as [core adapters](../core-adapters/)) in the example above follow a common pattern for requesting data from the Chainlink network, and returning a single result. Each task takes three fields: `type`, `confirmations`, and `params`. The `type` is the adapter or [bridge](../glossary/#bridge) name and is required. `confirmations` is optional, and will default to 0.  `params` is also optional, and will default to an empty object if not specified. See the [core adapters](../core-adapters/) page for a complete list of `params` for each adapter.

1. The **HTTPGet** adapter uses the value in the `get` field to perform a standard HTTP GET request at the value specified. The body of that result is passed on to the next task, JSONParse.
2. The **JSONParse** adapter takes a dot-delimited string or an array of strings, and will walk the given path to store the value at the end. In this case, there is only one field to save, "last". JSONParse will then pass the value stored in the "last" field to the Multiply adapter.
3. The **Multiply** adapter will, as its name describes, multiply the given value by the value of the `times` field, in this case, 100.
4. The multiplied value will be passed to the **EthUint256** adapter, which will format it specifically for the `uint256` data type on Ethereum. Notice there are no parameters supplied to the EthUint256 adapter, as it does not accept any.
5. Finally, that formatted value is written to the blockchain with the **EthTx** adapter. The parameters for the EthTx adapter are given by the oracle contract when the run is initiated through the RunLog initiator.

Note: If specifying multiple adapters of the same type, the parameters can be specified in the job spec itself if the key values need to be different. The requester can also use run parameters for these requests, but shared keys will be the same for any adapter that uses them.

Additional parameters may be specified on the job as well. These include:
- **startAt**: The beginning date at which the job can be executed, specified in ISO 8601 standard. Jobs can not be ran before this date. Defaults to null if unspecified.
- **endAt**: The ending date at which the job can be executed, specified in ISO 8601 standard. Jobs can not be ran after this date. Defaults to null if unspecified.
- **minPayment**: The payment amount for this job, specified in LINK to the 18th decimal. If supplied, this will override the global `MIN_CONTRACT_PAYMENT` configuration set on the node, regardless if the value is lower or higher.
