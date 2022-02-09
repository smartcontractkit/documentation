---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "ETH ABI Encode Task"
permalink: "docs/jobs/task-types/eth-abi-encode/"
---

Encodes a bytes payload according to ETH ABI encoding, typically in order to perform an [ETH Call](/docs/jobs/task-types/eth-call/) or an [ETH Tx](/docs/jobs/task-types/eth-tx/).

**Parameters**

- `abi`: a canonical ETH ABI argument string. Should be formatted exactly as in Solidity. Each argument must be named. If a method name is provided, the 4-byte method signature is prepended to the result. Examples:
    - `uint256 foo, bytes32 bar, address[] baz`
    - `fulfillRequest(bytes32 requestID, uint256 answer)`
- `data`: a map of the values to be encoded. The task will make a best effort at converting values to the appropriate types.

**Outputs**

A byte array.

**Example**

```jpv2
encode [type="ethabiencode"
        abi="fulfillRequest(bytes32 requestID, uint256 answer)"
        data="{\\"requestID\\": $(foo), \\"answer\\": $(bar)}"
        ]
```
