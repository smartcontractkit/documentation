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
schemaVersion   = 3
evmChainID      = 1
name            = "example keeper spec"
contractAddress = "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B"
fromAddress     = "0xa8037A20989AFcBC51798de9762b351D63ff462e"
observationSource = """
encode_check_upkeep_tx   [type="ethabiencode"
                          abi="checkUpkeep(uint256 id, address from)"
                          data="{\\"id\\":$(jobSpec.upkeepID),\\"from\\":$(jobSpec.fromAddress)}"]
check_upkeep_tx          [type="ethcall"
                          failEarly=true
                          extractRevertReason=true
                          evmChainID="$(jobSpec.evmChainID)"
                          contract="$(jobSpec.contractAddress)"
                          gas="$(jobSpec.checkUpkeepGasLimit)"
                          gasPrice="$(jobSpec.gasPrice)"
                          gasTipCap="$(jobSpec.gasTipCap)"
                          gasFeeCap="$(jobSpec.gasFeeCap)"
                          data="$(encode_check_upkeep_tx)"]
decode_check_upkeep_tx   [type="ethabidecode"
                          abi="bytes memory performData, uint256 maxLinkPayment, uint256 gasLimit, uint256 adjustedGasWei, uint256 linkEth"]
encode_perform_upkeep_tx [type="ethabiencode"
                          abi="performUpkeep(uint256 id, bytes calldata performData)"
                          data="{\\"id\\": $(jobSpec.upkeepID),\\"performData\\":$(decode_check_upkeep_tx.performData)}"]
perform_upkeep_tx        [type="ethtx"
                          minConfirmations=0
                          to="$(jobSpec.contractAddress)"
                          from="[$(jobSpec.fromAddress)]"
                          evmChainID="$(jobSpec.evmChainID)"
                          data="$(encode_perform_upkeep_tx)"
                          gasLimit="$(jobSpec.performUpkeepGasLimit)"
                          txMeta="{\\"jobID\\":$(jobSpec.jobID),\\"upkeepID\\":$(jobSpec.upkeepID)}"]

encode_check_upkeep_tx -> check_upkeep_tx -> decode_check_upkeep_tx -> encode_perform_upkeep_tx -> perform_upkeep_tx
"""
```

**Shared fields**

See [shared fields](/docs/jobs/#shared-fields).

**Unique fields**

- `evmChainID`: The numeric chain ID of the chain on which Keepers Registry is deployed
- `contractAddress`: The address of the Keepers Registry contract to poll and update
- `fromAddress`: The Oracle node address from which to send updates
- `externalJobID`: This is an optional field. When omitted it will be generated
