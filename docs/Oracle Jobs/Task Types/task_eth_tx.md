---
layout: nodes.liquid
date: Last Modified
title: "ETH Tx Task"
permalink: "docs/jobs/task-types/eth-tx/"
---

Makes a mutating transaction to the specified contract with the specified data payload. The transaction is guaranteed to succeed eventually.

**Parameters**

- `from`: the address of the externally-owned from which to send the transaction.
- `to`: the address of the contract to make a transaction to.
- `data`: the data to attach to the call (including the function selector). Most likely, this will be the output of an `ethabiencode` task.
- `gasLimit`: the amount of gas to attach to the transaction.
- `txMeta`: a map of metadata that is saved into the database for debugging.

**Outputs**

The hash of the transaction attempt that eventually succeeds (after potentially going through a gas bumping process to ensure confirmation).

**Example**

```jpv2
encode_tx    [type="ethabiencode"
              abi="performUpkeep(bytes performData)"
              data="{ \\"data\\": $(upkeep_data) }"]

submit_tx    [type="ethtx"
               to="0xa36085F69e2889c224210F603D836748e7dC0088"
               data="$(encode_tx)"]

encode_tx -> submit_tx
```
