---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "ETH Call Task"
permalink: "docs/jobs/task-types/eth-call/"
---

Makes a non-mutating contract call to the specified contract with the specified data payload.

**Parameters**

- `contract`: the address of the contract to call.
- `data`: the data to attach to the call (including the function selector).
- `gas`: the amount of gas to attach to the transaction.
- `from`: The from address with which the call should be made. Defaults to zero address.
- `gasPrice`: The gasPrice for the call. Defaults to zero.
- `gasTipCap`: The gasTipCap (EIP-1559) for the call. Defaults to zero.
- `gasFeeCap`: The gasFeeCap (EIP-1559) for the call. Defaults to zero.
- `gasUnlimited`: A boolean indicating if unlimited gas should be provided for the call. If set to true, do not pass the `gas` parameter.

**Outputs**

An ABI-encoded byte array containing the return value of the contract function.

**Example**

```jpv2
encode_call  [type="ethabiencode"
              abi="checkUpkeep(bytes data)"
              data="{ \\"data\\": $(upkeep_data) }"]

call          [type="ethcall"
               contract="0xa36085F69e2889c224210F603D836748e7dC0088"
               data="$(encode_call)"
               gas="1000"]

decode_result [type="ethabidecode"
               abi="bool upkeepNeeded, bytes performData"
               data="$(call)"]

encode_call -> call -> decode_result
```
