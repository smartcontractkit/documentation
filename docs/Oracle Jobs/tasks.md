---
layout: nodes.liquid
date: Last Modified
title: "Tasks"
permalink: "docs/tasks/"
whatsnext: {"Introduction to External Adapters":"/docs/external-adapters/", "Jobs":"/docs/jobs/"}
---

## What is a Task?

NOTE: This page refers to tasks in the latest version of Chainlink jobs (otherwise known as TOML, or V2 jobs). For documentation on the legacy job format, see [V1 job specs](/docs/job-specifications).

A task is essentially the equivalent of the old [adapters](/docs/adapters) but more flexible. Tasks can be composed in arbitrary order into pipelines. Pipelines consist of one or more threads of execution where tasks are executed in a well defined order.

Chainlink has a number of built-in tasks which are listed below. You can also create your own [external adapters](/docs/external-adapters/) for tasks which are accessed through a `bridge`. See below for more details and examples.

## Shared attributes

All tasks share a few common attributes:

`index`: when a task has more than one input (or the pipeline overall needs to support more than one final output), and the ordering of the values matters, the index parameter can be used to specify that ordering.

```dot
data_1 [type="http" method="get" url="https://chain.link/eth_usd"       index=0]
data_2 [type="http" method="get" url="https://chain.link/eth_dominance" index=1]
multiword_abi_encode [type="eth_abi_encode" method="fulfill(uint256,uint256)"]

data_1 -> multiword_abi_encode
data_2 -> multiword_abi_encode
```

`timeout`: The maximum duration that the task is allowed to run before it is considered to be errored. Overrides the `maxTaskDuration` value in the job spec.

## Bridge

Bridge tasks make HTTP POST requests to pre-configured URLs. Bridges can be configured via the UI or the CLI, and are referred to by a simple user-specified name. This is the way that most jobs interact with External Adapters.

**Parameters**

- `name`: an arbitrary name given to the bridge by the node operator.
- `requestData` (optional): a statically-defined payload to be sent to the external adapter.
- `includeInputAtKey` (optional): the key under which to insert the inputs to the bridge task in the requestData.

**Inputs**

Count: 0 or 1.

- If provided, it is only used when `includeInputAtKey` is specified.

**Outputs**

A string containing the response body.

**Example**

```dot
my_bridge_task [type="bridge"
                name="some_bridge"
                requestData="{\\"foo\\": \\"bar\\"}"
                includeInputAtKey="result"]
```

If the prior task sends the value `123.45` into this bridge task, this task will submit the following payload to the bridge:

```json
{
    "foo": "bar",
    "result": "123.45"
}
```

## HTTP

HTTP tasks make HTTP requests.

**Parameters**

- `method`: the HTTP method that the request should use.
- `url`: the URL to make the HTTP request to.
- `requestData` (optional): a statically-defined payload to be sent to the external adapter.
- `allowUnrestrictedNetworkAccess` (optional): permits the task to access a URL at `localhost`, which could present a security risk. Note that Bridge tasks allow this by default.

**Inputs**

Count: 0.

**Outputs**

A string containing the response body.

```dot
my_http_task [type="http"
              method="put"
              url="http://chain.link"
              requestData="[1, 2, 3]"
              allowUnrestrictedNetworkAccess=true]
```

## JSON Parse

JSON Parse tasks parse a JSON payload and extract a value at a given keypath.

**Parameters**

- `path`: the keypath to extract.
- `lax` (optional): if false (or omitted), and the keypath doesn't exist, the task will error. If true, the task will return `nil` to the next task.

**Inputs**

Count: 1.

- The input JSON. Can be a `string` or a `[]byte`.

**Outputs**

The value at the provided keypath.

**Example**

```dot
my_json_task [type="jsonparse"
              path="data,price"]
```

Given the input `{"data": {"price": 123.45}}`, this task will return `123.45` (float64).

## Median

Accepts multiple numerical inputs and returns the median of them.

**Parameters**

- `allowedFaults` (optional): the maximum number of input tasks that can error without the Median task erroring. If not specified, this value defaults to `N - 1`, where `N` is the number of inputs.

**Inputs**

Count: more than 1, up to infinity.

Must be numbers or strings containing numbers.

**Outputs**

The median of these inputs.

**Example**

```dot
my_median_task [type="median"
                allowedFaults=3]
```

Given the inputs `2`, `5`, and `20`, the task will return `5`.

## Multiply

Multiplies the provided input with a static multiplier.

**Parameters**

- `times`: the value to multiply the input with.

**Inputs**

Count: 1.

Must be a number or a string containing a number.

**Outputs**

The result of the multiplication.

**Example**

```dot
my_multiply_task [type="multiply"
                  times=3]
```

Given the input `10`, the task will return `30`.

