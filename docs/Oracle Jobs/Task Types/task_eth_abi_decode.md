---
layout: nodes.liquid
date: Last Modified
title: "ETH ABI Decode Task"
permalink: "docs/jobs/task-types/eth-abi-decode/"
---

Decodes a ETH ABI-encoded payload, typically the result of an [ETH Call task](/docs/jobs/task-types/eth-call/).

**Parameters**

- `abi`: a canonical ETH ABI argument string. Should be formatted exactly as in Solidity. Each argument must be named. Examples:
    - `uint256 foo, bytes32 bar, address[] baz`
    - `address a, uint80[3][] u, bytes b, bytes32 b32`
- `data`: the ABI-encoded payload to decode. Can be:
    - a byte array
    - a hex-encoded string beginning with `0x`

**Outputs**

A map containing the decoded values.

**Example**

```jpv2
decode [type="ethabidecode"
        abi="bytes32 requestID, uint256 price, address[] oracles"
        data="$(eth_call_result)"]
```

This task will return a map with the following schema:

```json
{
    "requestID": ..., // [32]byte value
    "price": ...,     // a number
    "oracles": [
        "0x859AAa51961284C94d970B47E82b8771942F1980",
        "0x51DE85B0cD5B3684865ECfEedfBAF12777cd0Ff8",
        ...
    ]
}
```
