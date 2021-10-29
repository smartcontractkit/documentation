---
layout: nodes.liquid
date: Last Modified
title: "ETH ABI Decode Log Task"
permalink: "docs/jobs/task-types/eth-abi-decode-log/"
---

Decodes a log emitted by an ETH contract.

**Parameters**

- `abi`: a canonical ETH log event definition. Should be formatted exactly as in Solidity. Each argument must be named. Examples:
    - `NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt)`
    - `AuthorizedSendersChanged(address[] senders)`
- `data`: the ABI-encoded log data. Can be:
    - a byte array
    - a hex-encoded string beginning with `0x`
    - ... but generally should just be set to `$(jobRun.logData)` (see the [Direct Request page](/docs/jobs/types/direct-request/))
- `topics`: the ABI-encoded log topics (i.e., the `indexed` parameters)
    - an array of bytes32 values
    - an array of hex-encoded bytes32 values beginning with `0x`
    - ... but generally should just be set to `$(jobRun.logTopics)` (see the [Direct Request page](/docs/jobs/types/direct-request/))

**Outputs**

A map containing the decoded values.

**Example**

```jpv2
decode [type="ethabidecodelog"
        abi="NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt)"
        data="$(jobRun.logData)"
        topics="$(jobRun.logTopics)"]
```

This task will return a map with the following schema:

```json
{
    "roundId": ...,   // a number
    "startedBy": ..., // an address
    "startedAt": ..., // a number
}
```
