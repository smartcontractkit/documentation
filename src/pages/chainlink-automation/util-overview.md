---
layout: ../../layouts/MainLayout.astro
section: automation
date: Last Modified
title: "Chainlink Automation Example Contracts"
whatsnext: { "EthBalanceMonitor": "/chainlink-automation/utility-contracts/" }
---

These contracts are tools to help you quickly deploy Chainlink Automation for specific use-cases. This list will be updated as more contracts become available. For more resources on Keepers, including videos and tutorials, click [here](/getting-started/other-tutorials).

## Contracts

### `EthBalanceMonitor`

[`EthBalanceMonitor` documentation](/chainlink-automation/utility-contracts)

This utility contract reviews the balances of a list of addresses and automatically tops them up. This automates the monitoring of Upkeep for registered contracts. To use this contract, you must add an address to the balance monitor Upkeep and make sure the balance monitor upkeep is well funded. Review the [`EthBalanceMonitor` documentation](/chainlink-automation/utility-contracts) to get started.

### Vault Harvester

[Vault Harvester repository](https://github.com/hackbg/chainlink-keepers-templates/tree/main/vault-harvester#chainlink-keepers-template-vault-harvester)

This example teaches you how to automate the process of compounding arbitrary yield farm reward tokens back into an initially deposited asset. Using Chainlink Automation to automate this process makes it more trustless and decentralized.

### Batch NFT Reveal

[Batch NFT Reveal repository](https://github.com/hackbg/chainlink-keepers-templates/tree/main/batch-nft-reveal#chainlink-keepers-template-batch-nft-reveal)

This example teaches how to use [Chainlink VRF](/vrf/v2/introduction/) and Chainlink Automation together. Using Chainlink Automation with batch NFT reveals, you can automate and further decentralize your NFTs.

### Dynamic NFTs

[Dynamic NFTs repository](https://github.com/smartcontractkit/smart-contract-examples/tree/main/dynamic-nft#dynamic-nfts)

<YouTube id="https://www.youtube.com/watch?v=E7Rm1LUKhj4" />

This example teaches you how to create dynamic NFTs using Chainlink Automation.

### VRF Subscription Balance Monitor

[`VRFSubscriptionBalanceMonitor` Repository](https://github.com/smartcontractkit/chainlink/blob/vrf-subscription-balance-monitor/contracts/src/v0.8/dev/VRFSubscriptionBalanceMonitor.sol)

This contract automates the monitoring of your VRF subscription balance to ensure there is sufficient funding for requests.

### Counting dNFT

This repository contains an example that automates counting with a dynamic SVG. Refer to the repository for more instructions.

[Counting dNFT Repository](https://github.com/smartcontractkit/smart-contract-examples/tree/main/counting-svg)

### Batch reveal Demo app

Create batch-revealed NFT collections powered by Chainlink Automation and VRF [here](https://automation.chainlink-demo.app/).
