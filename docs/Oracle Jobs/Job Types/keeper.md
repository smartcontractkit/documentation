---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Keeper Jobs"
permalink: "docs/jobs/types/keeper/"
---

Keeper jobs occasionally poll a smart contract method that expresses whether something in the contract is ready for some on-chain action to be performed. When it's ready, the job executes that on-chain action. Examples:

- Liquidations
- Rebalancing portfolios
- Rebase token supply adjustments

**Spec format**

```jpv2
type            = "keeper"
schemaVersion   = 1
name            = "example keeper spec"
contractAddress = "0x9E40733cC9df84636505f4e6Db28DCa0dC5D1bba"
fromAddress     = "0xa8037A20989AFcBC51798de9762b351D63ff462e"
externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F04"
```

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `contractAddress`: the address of the contract to poll and update.
- `fromAddress`: the address from which to send updates.
