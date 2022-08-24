---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "ETH Tx Task"
permalink: "docs/jobs/task-types/eth-tx/"
---

Makes a mutating transaction to the specified contract with the specified data payload. The transaction is guaranteed to succeed eventually.

**Parameters**

- `from`: one or more addresses of the externally-owned account from which to send the transaction. If left blank, it will select a random address on every send for the given chain ID.
- `to`: the address of the contract to make a transaction to.
- `data`: the data to attach to the call (including the function selector). Most likely, this will be the output of an `ethabiencode` task.
- `gasLimit`: the amount of gas to attach to the transaction.
- `txMeta`: a map of metadata that is saved into the database for debugging.
- `minConfirmations`: minimum number of confirmations required before this task will continue. Set to zero to continue immediately. Note that this does not affect transaction inclusion. All transactions will always be included in the chain up to the configured finality depth.
- `evmChainID`: set this optional parameter to transmit on the given chain. You must have the chain configured with RPC nodes for this to work. If left blank, it will use the default chain.

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
