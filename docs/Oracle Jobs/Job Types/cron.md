---
layout: nodes.liquid
date: Last Modified
title: "Cron Jobs"
permalink: "docs/jobs/types/cron/"
---

Executes a job on a schedule. Does not rely on any kind of external trigger.
This means it's triggered based on some condition that the Chainlink node evaluates, and not triggered externally via a smart contract. Because of this, the node isn't paid in LINK tokens for processing the request like it does for API calls, because it's initiating a request itself as opposed to receiving a request (and payment) from on-chain.

**Spec format**

```jpv2
type            = "cron"
schemaVersion   = 1
schedule        = "CRON_TZ=UTC * */20 * * * *"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F01"
observationSource   = """
    fetch    [type="http" method=GET url="https://chain.link/ETH-USD"]
    parse    [type="jsonparse" path="data,price"]
    multiply [type="multiply" times=100]

    fetch -> parse -> multiply
"""
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `schedule`: the frequency with which the job is to be run. There are two ways to specify this:
    - Traditional UNIX cron format, but with 6 fields, not 5. The extra field allows for "seconds" granularity. **Note:** you _must_ specify the `CRON_TZ=...` parameter if you use this format.
    - `@` shorthand, e.g. `@every 1h`. This shorthand does not take account of the node's timezone, rather, it simply begins counting down the moment that the job is added to the node (or the node is rebooted). As such, no `CRON_TZ` parameter is needed.

For all supported schedules, please refer to the [cron library documentation](https://pkg.go.dev/github.com/robfig/cron?utm_source=godoc).

**Job type specific pipeline variables**

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.

If you want to send data on-chain to a smart contract once the job is completed, you need to manually define an ethtx task at the end of the cron job.

Here's example that sends the result back to a function called someFunction at the contract deployed at address 0xa36085F69e2889c224210F603D836748e7dC0088. The data can be in any format, as long as the abi of the function matches what's being encoded in the job. i.e. If the function expects a bytes param, you need to ensure your encoding a bytes param, if it expects a uint param, then you need to encode a uint param. In this example, a bytes parameter is used.

**Spec format**

```jpv2
type            = "cron"
schemaVersion   = 1
name = "GET > bytes32 (cron)"
schedule        = "CRON_TZ=UTC @every 1m"
observationSource   = """
    fetch    [type="http" method=GET url="https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"]
    parse    [type="jsonparse" path="USD"]
    multiply [type="multiply" times=100]
  encode_response [type="ethabiencode"
             abi="(uint256 data)"
             data="{\\"data\\": $(multiply) }"] 
   encode_tx [type="ethabiencode"
              abi="someFunction(bytes32 data)"
              data="{ \\"data\\": $(encode_response) }"]

   submit_tx  [type="ethtx"
               to="0xa36085F69e2889c224210F603D836748e7dC0088"
               data="$(encode_tx)"]

    fetch -> parse -> multiply -> encode_response -> encode_tx -> submit_tx
"""
```
And here's the consuming contract for the cron job above:

```solidity
// SPDX-Lincense-Identifier: MIT
pragma solidity ^0.8.7;

contract Cron {

    bytes32 public currentPrice; 

    function someFunction(bytes32 _price) public {
        currentPrice = _price;
    }
}
```