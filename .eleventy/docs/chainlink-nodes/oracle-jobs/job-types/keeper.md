---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Keeper Jobs"
permalink: "docs/jobs/types/keeper/"
---

Keeper jobs occasionally poll a smart contract method that expresses whether something in the contract is ready for some on-chain action to be performed. When it's ready, the job executes that on-chain action.

Examples:

- Liquidations
- Rebalancing portfolios
- Rebase token supply adjustments
- Auto-compounding
- Limit orders

**Spec format**

```jpv2
type            = "keeper"
schemaVersion   = 1
evmChainID      = 1
name            = "example keeper spec"
contractAddress = "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B"
fromAddress     = "0xa8037A20989AFcBC51798de9762b351D63ff462e"
```

**Shared fields**

See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `evmChainID`: The numeric chain ID of the chain on which Chainlink Automation Registry is deployed
- `contractAddress`: The address of the Chainlink Automation Registry contract to poll and update
- `fromAddress`: The Oracle node address from which to send updates
- `externalJobID`: This is an optional field. When omitted it will be generated
