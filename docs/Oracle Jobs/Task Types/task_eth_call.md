---
layout: nodes.liquid
date: Last Modified
title: "ETH Call Task"
permalink: "docs/jobs/task-types/eth-call/"
---

Makes a non-mutating contract call to the specified contract with the specified data payload.

**Parameters**

- `contract`: the address of the contract to call.
- `data`: the data to attach to the call (including the function selector).

**Outputs**

An ABI-encoded byte array containing the return value of the contract function.

**Example**

```dot
encode_call  [type="ethabiencode"
              abi="checkUpkeep(bytes data)"
              data="{ \\"data\\": $(upkeep_data) }"]

call          [type="ethcall"
               contract="0xa36085F69e2889c224210F603D836748e7dC0088"
               data="$(encode_call)"]

decode_result [type="ethabidecode"
               abi="bool upkeepNeeded, bytes performData"
               data="$(call)"]

encode_call -> call -> decode_result
```
