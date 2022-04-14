---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Keepers Utility Contracts'
whatsnext:
  {
    '`EthBalanceMonitor`': '/docs/chainlink-keepers/utility-contracts/',
  }
---

# Overview

Utility contracts are tools to help developers quickly deploy Keepers for specific use-cases. This list will be updated as more utility contracts become available. 

# Current utility contracts

## `EthBalanceMonitor`

This utility contract reviews the balances of a list of addresses and automatically tops them up. This automates the monitoring of Upkeep for registered contracts. To use this contract, you must add an address to the balance monitor Upkeep and make sure the balance monitor upkeep is well funded. Review the [`EthBalanceMonitor`](../utility-contracts) documentation to get started.