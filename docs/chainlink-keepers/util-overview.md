---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Example Keepers Contracts'
whatsnext: { 'EthBalanceMonitor': '/docs/chainlink-keepers/utility-contracts/' }
---

These contracts are tools to help you quickly deploy Keepers for specific use-cases. This list will be updated as more contracts become available.

## Contracts

### `EthBalanceMonitor`

[`EthBalanceMonitor` documentation](/docs/chainlink-keepers/utility-contracts)

This utility contract reviews the balances of a list of addresses and automatically tops them up. This automates the monitoring of Upkeep for registered contracts. To use this contract, you must add an address to the balance monitor Upkeep and make sure the balance monitor upkeep is well funded. Review the [`EthBalanceMonitor` documentation](../utility-contracts) to get started.

### Vault Harvester

[Vault Harvester repository](https://github.com/hackbg/chainlink-keepers-templates/tree/main/vault-harvester#chainlink-keepers-template-vault-harvester)

This example teaches you how to automate the process of compounding arbitrary yield farm reward tokens back into an initially deposited asset. Using Keepers to automate this process makes it more trustless and decentralized.

### Batch NFT Reveal

[Batch NFT Reveal repository](https://github.com/hackbg/chainlink-keepers-templates/tree/main/batch-nft-reveal#chainlink-keepers-template-batch-nft-reveal)

This example teaches how to use [Chainlink VRF](/docs/vrf/v2/introduction/) and Chainlink Keepers together. Using Keepers with batch NFT reveals, you can automate and further decentralize your NFTs.

### Dynamic NFTs

[Dynamic NFTs repository](https://github.com/smartcontractkit/smart-contract-examples/tree/main/dynamic-nft#dynamic-nfts)

<p>
https://www.youtube.com/watch?v=E7Rm1LUKhj4
<p>

This example teaches you how to create dynamic NFTs using Keepers.
